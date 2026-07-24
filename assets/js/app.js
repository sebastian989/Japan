/**
 * Renders the itinerary defined in assets/data/itinerary.js.
 * No build step, no dependencies — plain DOM APIs only.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "trip-itinerary:booked-v1";

  const els = {
    views: document.querySelectorAll(".view"),
    navButtons: document.querySelectorAll(".top-nav button"),
    tripDates: document.getElementById("tripDates"),
    overviewStats: document.getElementById("overviewStats"),
    overviewHeroText: document.getElementById("overviewHeroText"),
    dayGrid: document.getElementById("dayGrid"),
    overviewMap: document.getElementById("overviewMap"),
    daySidebar: document.getElementById("daySidebar"),
    dayContent: document.getElementById("dayContent"),
    reservationsList: document.getElementById("reservationsList"),
    reservationsCount: document.getElementById("reservationsCount"),
    tipsGrid: document.getElementById("tipsGrid"),
    legend: document.getElementById("legend"),
  };

  let currentDayIndex = 0;
  let dayMapInstance = null;
  let overviewMapInstance = null;

  // ---------- Helpers ----------

  function formatDate(dateStr, opts) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, opts || { weekday: "short", month: "short", day: "numeric" });
  }

  function sortedActivities(day) {
    return [...(day.activities || [])].sort((a, b) => a.time.localeCompare(b.time));
  }

  function getBookedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
    } catch (e) {
      return new Set();
    }
  }

  function saveBookedSet(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }

  function reservationId(day, activity) {
    return `${day.day}-${activity.time}-${activity.name}`;
  }

  function hasCoords(a) {
    return typeof a.lat === "number" && typeof a.lng === "number";
  }

  /**
   * Renders a Leaflet + OpenStreetMap map into `container`, with a numbered
   * pin per stop (in order) connected by a route line. No API key and no
   * sign-in/consent redirect, unlike an unauthenticated Google Maps embed.
   */
  function renderLeafletMap(container, stops) {
    const map = L.map(container, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);

    const latLngs = stops.map((s) => [s.lat, s.lng]);
    stops.forEach((s, i) => {
      L.marker([s.lat, s.lng], {
        icon: L.divIcon({
          className: "",
          html: `<div class="trip-pin"><span>${i + 1}</span></div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -24],
        }),
      })
        .addTo(map)
        .bindPopup(s.popupHtml);
    });

    if (latLngs.length > 1) {
      L.polyline(latLngs, { color: "#b3423d", weight: 3, opacity: 0.7, dashArray: "6 8" }).addTo(map);
      map.fitBounds(latLngs, { padding: [28, 28] });
    } else {
      map.setView(latLngs[0], 14);
    }
    return map;
  }

  function categoryBadge(category) {
    const meta = CATEGORIES[category] || { label: category, icon: "\u{1F4CD}" };
    return `<span class="badge badge--category">${meta.icon} ${meta.label}</span>`;
  }

  function reservationBadge(activity) {
    if (!activity.reservation) {
      return `<span class="badge badge--ok">✓ Walk-in / no booking</span>`;
    }
    return `<span class="badge badge--reservation">⚠ Booking needed</span>`;
  }

  function dayHasReservations(day) {
    return (day.activities || []).some((a) => a.reservation);
  }

  function dayIsFilled(day) {
    return day.city && day.city !== "TBD" && (day.activities || []).length > 0;
  }

  // ---------- Top-level navigation ----------

  function setActiveView(name) {
    els.views.forEach((v) => v.classList.toggle("is-active", v.dataset.view === name));
    els.navButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.viewTarget === name));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (name === "day") location.hash = `day-${ITINERARY[currentDayIndex].day}`;
    else location.hash = name;
    // Leaflet needs a visible, correctly-sized container — if a map was
    // created while its tab was hidden, nudge it once the tab is shown.
    requestAnimationFrame(() => {
      if (name === "day" && dayMapInstance) dayMapInstance.invalidateSize();
      if (name === "overview" && overviewMapInstance) overviewMapInstance.invalidateSize();
    });
  }

  els.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveView(btn.dataset.viewTarget));
  });

  // ---------- Overview ----------

  function renderOverview() {
    const start = formatDate(TRIP.startDate, { month: "long", day: "numeric" });
    const end = formatDate(TRIP.endDate, { month: "long", day: "numeric", year: "numeric" });
    els.tripDates.textContent = `${start} – ${end}`;
    els.overviewHeroText.textContent = TRIP.heroTip;

    const totalDays = ITINERARY.length;
    const totalActivities = ITINERARY.reduce((sum, d) => sum + (d.activities || []).length, 0);
    const totalReservations = ITINERARY.reduce(
      (sum, d) => sum + (d.activities || []).filter((a) => a.reservation).length,
      0
    );
    const cities = [...new Set(ITINERARY.map((d) => d.city).filter((c) => c && c !== "TBD"))];

    els.overviewStats.innerHTML = `
      <div class="stat-card"><strong>${totalDays}</strong><span>Days</span></div>
      <div class="stat-card"><strong>${cities.length}</strong><span>Cities/Towns</span></div>
      <div class="stat-card"><strong>${totalActivities}</strong><span>Planned activities</span></div>
      <div class="stat-card"><strong>${totalReservations}</strong><span>Need reservations</span></div>
    `;

    els.dayGrid.innerHTML = ITINERARY.map((day, idx) => {
      const badges = [];
      if (dayHasReservations(day)) badges.push(`<span class="badge badge--reservation">⚠ Booking</span>`);
      if (!dayIsFilled(day)) badges.push(`<span class="badge badge--category">Not planned yet</span>`);
      return `
        <button class="day-card" data-day-index="${idx}">
          <div class="day-card__num">Day ${day.day}</div>
          <div class="day-card__date">${formatDate(day.date)}</div>
          <div class="day-card__city">${escapeHtml(day.city || "TBD")}</div>
          <div class="day-card__title">${escapeHtml(day.title || "")}</div>
          <div class="day-card__badges">${badges.join("")}</div>
        </button>
      `;
    }).join("");

    els.dayGrid.querySelectorAll(".day-card").forEach((card) => {
      card.addEventListener("click", () => {
        currentDayIndex = Number(card.dataset.dayIndex);
        renderDay();
        setActiveView("day");
      });
    });

    // Overview map: one stop per city, using that day's first geocoded activity
    const cityStops = [];
    const seenCities = new Set();
    ITINERARY.forEach((day) => {
      if (!day.city || day.city === "TBD" || seenCities.has(day.city)) return;
      const anchor = sortedActivities(day).find(hasCoords);
      if (!anchor) return;
      seenCities.add(day.city);
      cityStops.push({
        lat: anchor.lat,
        lng: anchor.lng,
        popupHtml: `<div class="map-popup__time">Day ${day.day}</div><div class="map-popup__name">${escapeHtml(day.city)}</div>`,
      });
    });

    if (overviewMapInstance) {
      overviewMapInstance.remove();
      overviewMapInstance = null;
    }
    if (cityStops.length) {
      els.overviewMap.innerHTML = `<div class="map-frame-wrap"><div class="leaflet-map-el" id="overviewMapEl"></div></div>`;
      overviewMapInstance = renderLeafletMap(document.getElementById("overviewMapEl"), cityStops);
    } else {
      els.overviewMap.innerHTML = `<div class="map-frame-wrap"><div class="map-frame-empty">Add coordinates to your activities to see the route here.</div></div>`;
    }
  }

  // ---------- Day view ----------

  function renderDaySidebar() {
    els.daySidebar.innerHTML = ITINERARY.map((day, idx) => `
      <button class="day-sidebar__item ${idx === currentDayIndex ? "is-active" : ""}" data-day-index="${idx}">
        <span class="day-sidebar__num">${day.day}</span>
        <span class="day-sidebar__text">
          <span class="d">${formatDate(day.date)}</span><br>
          <span class="c">${escapeHtml(day.city || "TBD")}</span>
        </span>
      </button>
    `).join("");

    els.daySidebar.querySelectorAll(".day-sidebar__item").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentDayIndex = Number(btn.dataset.dayIndex);
        renderDay();
      });
    });
  }

  function renderDayContent() {
    const day = ITINERARY[currentDayIndex];
    const acts = sortedActivities(day);
    const stops = acts.filter(hasCoords).map((a) => ({
      lat: a.lat,
      lng: a.lng,
      popupHtml: `<div class="map-popup__time">${escapeHtml(a.time)}</div><div class="map-popup__name">${escapeHtml(a.name)}</div><div class="map-popup__location">${escapeHtml(a.location || "")}</div>`,
    }));

    const tipsHtml = (day.tips || []).length
      ? `<ul class="day-tips">${day.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`
      : "";

    const mapHtml = stops.length
      ? `<div class="map-frame-wrap"><div class="leaflet-map-el" id="dayMap"></div></div>`
      : `<div class="map-frame-wrap"><div class="map-frame-empty">Add coordinates to an activity to see it on the map here.</div></div>`;

    const timelineHtml = acts.length
      ? `<ul class="timeline">${acts.map((a) => activityHtml(day, a)).join("")}</ul>`
      : `<div class="empty-day">No activities planned for this day yet. Add them to <code>assets/data/itinerary.js</code>.</div>`;

    els.dayContent.innerHTML = `
      <div class="day-header">
        <div>
          <h2>Day ${day.day} — ${escapeHtml(day.city || "TBD")}</h2>
          <div class="day-meta">${formatDate(day.date, { weekday: "long", month: "long", day: "numeric" })}${day.title ? " · " + escapeHtml(day.title) : ""}</div>
        </div>
        <div class="day-nav-buttons">
          <button class="btn" id="prevDayBtn" ${currentDayIndex === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn" id="nextDayBtn" ${currentDayIndex === ITINERARY.length - 1 ? "disabled" : ""}>Next →</button>
        </div>
      </div>
      ${day.summary ? `<div class="day-summary">${escapeHtml(day.summary)}${tipsHtml}</div>` : tipsHtml}
      ${mapHtml}
      ${timelineHtml}
    `;

    if (dayMapInstance) {
      dayMapInstance.remove();
      dayMapInstance = null;
    }
    if (stops.length) {
      dayMapInstance = renderLeafletMap(document.getElementById("dayMap"), stops);
    }

    document.getElementById("prevDayBtn").addEventListener("click", () => {
      if (currentDayIndex > 0) {
        currentDayIndex -= 1;
        renderDay();
      }
    });
    document.getElementById("nextDayBtn").addEventListener("click", () => {
      if (currentDayIndex < ITINERARY.length - 1) {
        currentDayIndex += 1;
        renderDay();
      }
    });
  }

  function activityHtml(day, a) {
    const linkHtml = a.link
      ? ` · <a href="${escapeAttr(a.link)}" target="_blank" rel="noopener">More info</a>`
      : "";
    const durationHtml = a.duration ? ` · ${escapeHtml(a.duration)}` : "";
    return `
      <li class="timeline-item">
        <div class="timeline-item__time">${escapeHtml(a.time)}<span class="timeline-item__dot"></span></div>
        <div class="activity-card">
          <div class="activity-card__head">
            <div>
              <div class="activity-card__title">${escapeHtml(a.name)}</div>
              <div class="activity-card__location">\u{1F4CD} ${escapeHtml(a.location || "Location TBD")}${durationHtml}${linkHtml}</div>
            </div>
            <div class="activity-card__meta">
              ${categoryBadge(a.category)}
              ${reservationBadge(a)}
            </div>
          </div>
          ${a.tip ? `<div class="activity-card__tip"><strong>Tip:</strong> ${escapeHtml(a.tip)}</div>` : ""}
        </div>
      </li>
    `;
  }

  function renderDay() {
    renderDaySidebar();
    renderDayContent();
    if (document.querySelector('[data-view="day"]').classList.contains("is-active")) {
      location.hash = `day-${ITINERARY[currentDayIndex].day}`;
    }
  }

  // ---------- Reservations ----------

  function renderReservations() {
    const booked = getBookedSet();
    const items = [];
    ITINERARY.forEach((day) => {
      sortedActivities(day).forEach((a) => {
        if (a.reservation) items.push({ day, activity: a });
      });
    });

    els.reservationsCount.textContent = items.length
      ? `${items.length} item${items.length === 1 ? "" : "s"} need booking — ${items.filter((i) => booked.has(reservationId(i.day, i.activity))).length} marked as booked`
      : "No activities currently require a reservation.";

    if (!items.length) {
      els.reservationsList.innerHTML = `<div class="empty-day">Nothing to book yet.</div>`;
      return;
    }

    els.reservationsList.innerHTML = items.map(({ day, activity }) => {
      const id = reservationId(day, activity);
      const isBooked = booked.has(id);
      return `
        <div class="reservation-row ${isBooked ? "is-done" : ""}" data-id="${escapeAttr(id)}">
          <input type="checkbox" ${isBooked ? "checked" : ""} aria-label="Mark as booked">
          <div class="reservation-row__date">Day ${day.day} · ${formatDate(day.date)}</div>
          <div>
            <div class="reservation-row__name">${escapeHtml(activity.name)}</div>
            <div class="reservation-row__location">${escapeHtml(activity.location || "")} · ${escapeHtml(activity.time)}</div>
          </div>
          <div>${categoryBadge(activity.category)}</div>
        </div>
      `;
    }).join("");

    els.reservationsList.querySelectorAll(".reservation-row").forEach((row) => {
      const checkbox = row.querySelector("input");
      checkbox.addEventListener("change", () => {
        const set = getBookedSet();
        const id = row.dataset.id;
        if (checkbox.checked) set.add(id);
        else set.delete(id);
        saveBookedSet(set);
        renderReservations();
      });
    });
  }

  // ---------- Tips ----------

  function renderTips() {
    els.tipsGrid.innerHTML = GENERAL_TIPS.map(
      (t) => `<div class="tip-card"><h4>${escapeHtml(t.title)}</h4><p>${escapeHtml(t.body)}</p></div>`
    ).join("");

    els.legend.innerHTML = Object.values(CATEGORIES)
      .map((c) => `<span class="badge badge--category">${c.icon} ${c.label}</span>`)
      .join("");
  }

  // ---------- Utils ----------

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // ---------- Init ----------

  function initFromHash() {
    const hash = location.hash.replace("#", "");
    if (hash.startsWith("day-")) {
      const dayNum = Number(hash.replace("day-", ""));
      const idx = ITINERARY.findIndex((d) => d.day === dayNum);
      currentDayIndex = idx >= 0 ? idx : 0;
      return "day";
    }
    if (["overview", "day", "reservations", "tips"].includes(hash)) return hash;
    return "overview";
  }

  function init() {
    renderOverview();
    renderDay();
    renderReservations();
    renderTips();
    setActiveView(initFromHash());
  }

  document.addEventListener("DOMContentLoaded", init);
})();
