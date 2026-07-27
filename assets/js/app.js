/**
 * Renders the itinerary loaded from assets/data/trip.json and
 * assets/data/days/day-NN.json. No build step, no dependencies — plain
 * DOM APIs only.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "trip-itinerary:booked-v1";
  const LANG_KEY = "trip-itinerary:lang";

  // Populated by loadData() before init() runs.
  let TRIP, UI_STRINGS, CATEGORIES, GENERAL_TIPS, ITINERARY;
  let dataReady = false;

  const els = {
    views: document.querySelectorAll(".view"),
    navButtons: document.querySelectorAll(".top-nav button"),
    langButtons: document.querySelectorAll(".lang-toggle button"),
    tripTitle: document.getElementById("tripTitle"),
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
  let currentLang = getInitialLang();

  // ---------- i18n ----------

  function getInitialLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "es") return saved;
    return navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  }

  /** Resolves a { en, es } object (or plain string) to the current language. */
  function t(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[currentLang] || field.en || "";
  }

  function setLanguage(lang) {
    if (lang !== "en" && lang !== "es") return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    els.langButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    applyStaticStrings();
    renderOverview();
    renderDay();
    renderReservations();
    renderTips();
  }

  function applyStaticStrings() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (UI_STRINGS[key]) el.textContent = t(UI_STRINGS[key]);
    });
  }

  els.langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (dataReady) setLanguage(btn.dataset.lang);
    });
  });

  // ---------- Helpers ----------

  function formatDate(dateStr, opts) {
    const d = new Date(dateStr + "T00:00:00");
    const locale = currentLang === "es" ? "es-ES" : "en-US";
    return d.toLocaleDateString(locale, opts || { weekday: "short", month: "short", day: "numeric" });
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
    return `${day.day}-${activity.time}-${t(activity.name)}`;
  }

  function hasCoords(a) {
    return typeof a.lat === "number" && typeof a.lng === "number";
  }

  function googleMapsUrl(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  // CARTO's light basemap renders place names in Latin script (name:en)
  // rather than each country's local script, unlike the standard OSM tile
  // set — used deliberately (always light, regardless of OS theme) so the
  // map stays legible and consistent.
  const TILE_LAYER_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  function buildPinIcon(number, offsetX, offsetY) {
    return L.divIcon({
      className: "",
      html: `<div class="trip-pin"><span>${number}</span></div>`,
      iconSize: [26, 26],
      // Shifting iconAnchor/popupAnchor moves where the icon renders on
      // screen without touching the marker's actual lat/lng — the pin
      // stays visually "at" its true coordinate except for a small nudge
      // to keep it from sitting exactly on top of another pin.
      iconAnchor: [13 - offsetX, 26 - offsetY],
      popupAnchor: [offsetX, -24 + offsetY],
    });
  }

  function pixelFanOffset(indexInGroup) {
    if (indexInGroup === 0) return { x: 0, y: 0 };
    const angle = (indexInGroup * 137.5 * Math.PI) / 180; // golden-angle spiral
    const radius = 14 + indexInGroup * 9;
    return { x: Math.round(radius * Math.cos(angle)), y: Math.round(radius * Math.sin(angle)) };
  }

  /**
   * Nudges pins that currently render within OVERLAP_PX of each other, so
   * none sit exactly on top of another and become unclickable — without
   * clustering/grouping them into a single combined marker, and without
   * changing the true coordinate each pin's popup/route line uses. Whether
   * two pins overlap depends on the current zoom, so this is re-run on
   * every zoom/pan instead of computed once.
   */
  function deoverlapMarkers(map, entries) {
    const OVERLAP_PX = 24;
    const points = entries.map((e) => map.latLngToContainerPoint([e.lat, e.lng]));

    const parent = entries.map((_, i) => i);
    function find(i) {
      while (parent[i] !== i) {
        parent[i] = parent[parent[i]];
        i = parent[i];
      }
      return i;
    }
    function union(i, j) {
      const ri = find(i);
      const rj = find(j);
      if (ri !== rj) parent[ri] = rj;
    }
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < OVERLAP_PX) union(i, j);
      }
    }

    const groups = new Map();
    entries.forEach((_, i) => {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(i);
    });

    groups.forEach((memberIdxs) => {
      memberIdxs.forEach((idx, pos) => {
        const offset = pixelFanOffset(pos);
        entries[idx].marker.setIcon(buildPinIcon(entries[idx].number, offset.x, offset.y));
      });
    });
  }

  /**
   * Renders a Leaflet + OpenStreetMap/CARTO map into `container`, with a
   * numbered pin per stop (in order) connected by a route line. No API key
   * and no sign-in/consent redirect, unlike an unauthenticated Google Maps
   * embed. Each stop needs { lat, lng, number, popupHtml }.
   */
  function renderLeafletMap(container, stops) {
    const map = L.map(container, { scrollWheelZoom: false });
    L.tileLayer(TILE_LAYER_URL, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    }).addTo(map);

    const latLngs = stops.map((s) => [s.lat, s.lng]);

    const markerEntries = stops.map((s) => {
      const marker = L.marker([s.lat, s.lng], { icon: buildPinIcon(s.number, 0, 0) });
      // autoPan:false — panning the map on every pin click would also
      // trigger deoverlapMarkers mid-animation, shifting other pins under
      // the user's cursor; a 320px-tall map doesn't need to auto-recenter
      // for a small popup anyway.
      marker.bindPopup(s.popupHtml, { autoPan: false });
      marker.addTo(map);
      return { marker, lat: s.lat, lng: s.lng, number: s.number };
    });

    if (latLngs.length > 1) {
      L.polyline(latLngs, { color: "#b3423d", weight: 3, opacity: 0.7, dashArray: "6 8" }).addTo(map);
    }
    // Stored so the map can be re-fitted once its tab becomes visible — a
    // map created (or fitBounds'd) while `display:none` measures a 0×0
    // container and zooms to maxZoom, which invalidateSize() alone can't fix.
    map.__fitLatLngs = latLngs;
    map.__markerEntries = markerEntries;
    refitMap(map);
    if (markerEntries.length > 1) {
      deoverlapMarkers(map, markerEntries);
      map.on("zoomend moveend", () => deoverlapMarkers(map, markerEntries));
    }
    return map;
  }

  function refitMap(map) {
    const latLngs = map.__fitLatLngs;
    if (!latLngs || !latLngs.length) return;
    if (latLngs.length > 1) {
      // animate: false avoids a pan animation that can outlive the map if
      // it's torn down again immediately (e.g. clicking through days fast).
      map.fitBounds(latLngs, { padding: [28, 28], animate: false });
    } else {
      map.setView(latLngs[0], 15, { animate: false });
    }
  }

  function categoryBadge(category) {
    const meta = CATEGORIES[category] || { label: { en: category, es: category }, icon: "\u{1F4CD}" };
    return `<span class="badge badge--category">${meta.icon} ${t(meta.label)}</span>`;
  }

  function reservationBadge(activity) {
    if (!activity.reservation) {
      return `<span class="badge badge--ok">${t(UI_STRINGS.walkIn)}</span>`;
    }
    return `<span class="badge badge--reservation">${t(UI_STRINGS.bookingNeeded)}</span>`;
  }

  function dayHasReservations(day) {
    return (day.activities || []).some((a) => a.reservation);
  }

  function dayIsFilled(day) {
    return t(day.city) && t(day.city) !== "TBD" && (day.activities || []).length > 0;
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
      if (name === "day" && dayMapInstance) {
        dayMapInstance.invalidateSize();
        refitMap(dayMapInstance);
        if (dayMapInstance.__markerEntries) deoverlapMarkers(dayMapInstance, dayMapInstance.__markerEntries);
      }
      if (name === "overview" && overviewMapInstance) {
        overviewMapInstance.invalidateSize();
        refitMap(overviewMapInstance);
        if (overviewMapInstance.__markerEntries) deoverlapMarkers(overviewMapInstance, overviewMapInstance.__markerEntries);
      }
    });
  }

  els.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (dataReady) setActiveView(btn.dataset.viewTarget);
    });
  });

  // ---------- Overview ----------

  function renderOverview() {
    els.tripTitle.textContent = t(TRIP.title);
    els.overviewHeroText.textContent = t(TRIP.heroTip);

    const totalDays = ITINERARY.length;
    const totalActivities = ITINERARY.reduce((sum, d) => sum + (d.activities || []).length, 0);
    const totalReservations = ITINERARY.reduce(
      (sum, d) => sum + (d.activities || []).filter((a) => a.reservation).length,
      0
    );
    const cities = [...new Set(ITINERARY.map((d) => t(d.city)).filter((c) => c && c !== "TBD"))];

    els.overviewStats.innerHTML = `
      <div class="stat-card"><strong>${totalDays}</strong><span>${t(UI_STRINGS.statDays)}</span></div>
      <div class="stat-card"><strong>${cities.length}</strong><span>${t(UI_STRINGS.statCities)}</span></div>
      <div class="stat-card"><strong>${totalActivities}</strong><span>${t(UI_STRINGS.statActivities)}</span></div>
      <div class="stat-card"><strong>${totalReservations}</strong><span>${t(UI_STRINGS.statReservations)}</span></div>
    `;

    els.dayGrid.innerHTML = ITINERARY.map((day, idx) => {
      const badges = [];
      if (dayHasReservations(day)) badges.push(`<span class="badge badge--reservation">${t(UI_STRINGS.bookingBadgeShort)}</span>`);
      if (!dayIsFilled(day)) badges.push(`<span class="badge badge--category">${t(UI_STRINGS.notPlannedYet)}</span>`);
      return `
        <button class="day-card" data-day-index="${idx}">
          <div class="day-card__num">${t(UI_STRINGS.day)} ${day.day}</div>
          <div class="day-card__date">${formatDate(day.date)}</div>
          <div class="day-card__city">${escapeHtml(t(day.city) || "TBD")}</div>
          <div class="day-card__title">${escapeHtml(t(day.title) || "")}</div>
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
      const cityKey = t(day.city);
      if (!cityKey || cityKey === "TBD" || seenCities.has(cityKey)) return;
      const anchor = sortedActivities(day).find(hasCoords);
      if (!anchor) return;
      seenCities.add(cityKey);
      cityStops.push({
        lat: anchor.lat,
        lng: anchor.lng,
        number: cityStops.length + 1,
        popupHtml: `<div class="map-popup__time">${t(UI_STRINGS.day)} ${day.day}</div><div class="map-popup__name">${escapeHtml(cityKey)}</div><a class="map-popup__gmaps" href="${escapeAttr(googleMapsUrl(anchor.lat, anchor.lng))}" target="_blank" rel="noopener">🗺️ ${t(UI_STRINGS.openInGoogleMaps)}</a>`,
      });
    });

    if (overviewMapInstance) {
      overviewMapInstance.stop();
      overviewMapInstance.remove();
      overviewMapInstance = null;
    }
    if (cityStops.length) {
      els.overviewMap.innerHTML = `<div class="map-frame-wrap"><div class="leaflet-map-el" id="overviewMapEl"></div></div>`;
      overviewMapInstance = renderLeafletMap(document.getElementById("overviewMapEl"), cityStops);
    } else {
      els.overviewMap.innerHTML = `<div class="map-frame-wrap"><div class="map-frame-empty">${t(UI_STRINGS.mapEmptyOverview)}</div></div>`;
    }
  }

  // ---------- Day view ----------

  function renderDaySidebar() {
    els.daySidebar.innerHTML = ITINERARY.map((day, idx) => `
      <button class="day-sidebar__item ${idx === currentDayIndex ? "is-active" : ""}" data-day-index="${idx}">
        <span class="day-sidebar__num">${day.day}</span>
        <span class="day-sidebar__text">
          <span class="d">${formatDate(day.date)}</span><br>
          <span class="c">${escapeHtml(t(day.city) || "TBD")}</span>
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
    // Numbered by position in the full day timeline (not just the geocoded
    // subset) so a pin's number always matches that same activity card below.
    const stops = [];
    acts.forEach((a, idx) => {
      if (!hasCoords(a)) return;
      stops.push({
        lat: a.lat,
        lng: a.lng,
        number: idx + 1,
        popupHtml: `<div class="map-popup__time">${escapeHtml(a.time)}</div><div class="map-popup__name">${escapeHtml(t(a.name))}</div><div class="map-popup__location">${escapeHtml(t(a.location) || "")}</div><a class="map-popup__gmaps" href="${escapeAttr(googleMapsUrl(a.lat, a.lng))}" target="_blank" rel="noopener">🗺️ ${t(UI_STRINGS.openInGoogleMaps)}</a>`,
      });
    });

    const tipsHtml = (day.tips || []).length
      ? `<ul class="day-tips">${day.tips.map((tip) => `<li>${escapeHtml(t(tip))}</li>`).join("")}</ul>`
      : "";

    const mapHtml = stops.length
      ? `<div class="map-frame-wrap"><div class="leaflet-map-el" id="dayMap"></div></div>`
      : `<div class="map-frame-wrap"><div class="map-frame-empty">${t(UI_STRINGS.mapEmptyDay)}</div></div>`;

    const dayFileName = `day-${String(day.day).padStart(2, "0")}.json`;
    const timelineHtml = acts.length
      ? `<ul class="timeline">${acts.map((a, idx) => activityHtml(day, a, hasCoords(a) ? idx + 1 : null)).join("")}</ul>`
      : `<div class="empty-day">${escapeHtml(t(UI_STRINGS.emptyDayPrefix))} <code>assets/data/days/${dayFileName}</code>.</div>`;

    els.dayContent.innerHTML = `
      <div class="day-header">
        <div>
          <h2>${t(UI_STRINGS.day)} ${day.day} — ${escapeHtml(t(day.city) || "TBD")}</h2>
          <div class="day-meta">${formatDate(day.date, { weekday: "long", month: "long", day: "numeric" })}${day.title ? " · " + escapeHtml(t(day.title)) : ""}</div>
        </div>
        <div class="day-nav-buttons">
          <button class="btn" id="prevDayBtn" ${currentDayIndex === 0 ? "disabled" : ""}>${t(UI_STRINGS.previous)}</button>
          <button class="btn" id="nextDayBtn" ${currentDayIndex === ITINERARY.length - 1 ? "disabled" : ""}>${t(UI_STRINGS.next)}</button>
        </div>
      </div>
      ${day.summary ? `<div class="day-summary">${escapeHtml(t(day.summary))}${tipsHtml}</div>` : tipsHtml}
      ${mapHtml}
      ${timelineHtml}
    `;

    if (dayMapInstance) {
      dayMapInstance.stop();
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

  function activityHtml(day, a, number) {
    const linkHtml = a.link
      ? ` · <a href="${escapeAttr(a.link)}" target="_blank" rel="noopener">${t(UI_STRINGS.moreInfo)}</a>`
      : "";
    const durationHtml = a.duration ? ` · ${escapeHtml(t(a.duration))}` : "";
    const gmapsHtml = hasCoords(a)
      ? ` · <a href="${escapeAttr(googleMapsUrl(a.lat, a.lng))}" target="_blank" rel="noopener">🗺️ ${t(UI_STRINGS.openInGoogleMaps)}</a>`
      : "";
    const pinChip = number
      ? `<span class="pin-chip" title="${t(UI_STRINGS.mapPinTitle)} ${number} ${t(UI_STRINGS.onMapAbove)}">${number}</span> `
      : "";
    return `
      <li class="timeline-item">
        <div class="timeline-item__time">${escapeHtml(a.time)}<span class="timeline-item__dot"></span></div>
        <div class="activity-card">
          <div class="activity-card__head">
            <div>
              <div class="activity-card__title">${escapeHtml(t(a.name))}</div>
              <div class="activity-card__location">${pinChip}\u{1F4CD} ${escapeHtml(t(a.location) || t(UI_STRINGS.locationPlaceholder))}${durationHtml}${linkHtml}${gmapsHtml}</div>
            </div>
            <div class="activity-card__meta">
              ${categoryBadge(a.category)}
              ${reservationBadge(a)}
            </div>
          </div>
          ${a.tip ? `<div class="activity-card__tip"><strong>${t(UI_STRINGS.tipLabel)}</strong> ${escapeHtml(t(a.tip))}</div>` : ""}
          ${
            a.reservationLink
              ? `<a class="btn btn--reservation" href="${escapeAttr(a.reservationLink)}" target="_blank" rel="noopener">🔗 ${t(UI_STRINGS.reservationLink)}</a>`
              : ""
          }
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

    if (!items.length) {
      els.reservationsCount.textContent = t(UI_STRINGS.noReservationsNeeded);
      els.reservationsList.innerHTML = `<div class="empty-day">${t(UI_STRINGS.nothingToBook)}</div>`;
      return;
    }

    // An activity can arrive pre-marked as booked (activity.booked, set once
    // it's actually confirmed) in addition to the per-browser checkbox.
    const isBooked = (day, activity) => activity.booked === true || booked.has(reservationId(day, activity));
    const bookedCount = items.filter((i) => isBooked(i.day, i.activity)).length;
    els.reservationsCount.textContent =
      currentLang === "es"
        ? `${items.length} elemento${items.length === 1 ? "" : "s"} por reservar — ${bookedCount} ya reservado${bookedCount === 1 ? "" : "s"}`
        : `${items.length} item${items.length === 1 ? "" : "s"} need booking — ${bookedCount} marked as booked`;

    els.reservationsList.innerHTML = items.map(({ day, activity }) => {
      const id = reservationId(day, activity);
      const bookedNow = isBooked(day, activity);
      return `
        <div class="reservation-row ${bookedNow ? "is-done" : ""}" data-id="${escapeAttr(id)}">
          <input type="checkbox" ${bookedNow ? "checked" : ""} aria-label="Mark as booked">
          <div class="reservation-row__date">${t(UI_STRINGS.day)} ${day.day} · ${formatDate(day.date)}</div>
          <div>
            <div class="reservation-row__name">${escapeHtml(t(activity.name))}</div>
            <div class="reservation-row__location">${escapeHtml(t(activity.location) || "")} · ${escapeHtml(activity.time)}</div>
          </div>
          <div class="reservation-row__meta">
            ${categoryBadge(activity.category)}
            ${activity.reservationLink ? `<a href="${escapeAttr(activity.reservationLink)}" target="_blank" rel="noopener">${t(UI_STRINGS.reservationLink)}</a>` : ""}
          </div>
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
      (tip) => `<div class="tip-card"><h4>${escapeHtml(t(tip.title))}</h4><p>${escapeHtml(t(tip.body))}</p></div>`
    ).join("");

    els.legend.innerHTML = Object.values(CATEGORIES)
      .map((c) => `<span class="badge badge--category">${c.icon} ${t(c.label)}</span>`)
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
    dataReady = true;
    document.documentElement.lang = currentLang;
    els.langButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === currentLang));
    applyStaticStrings();
    renderOverview();
    renderDay();
    renderReservations();
    renderTips();
    setActiveView(initFromHash());
  }

  function fetchJson(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
      return res.json();
    });
  }

  /** Number of calendar days between two "YYYY-MM-DD" strings, inclusive. */
  function daysInclusive(startDate, endDate) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    return Math.round((end - start) / msPerDay) + 1;
  }

  /**
   * Loads assets/data/trip.json (trip meta, UI strings, categories, general
   * tips) plus one assets/data/days/day-NN.json per day of the trip, and
   * assigns them to the module-level data variables `init()` renders from.
   */
  function loadData() {
    return fetchJson("assets/data/trip.json").then((meta) => {
      TRIP = meta.trip;
      UI_STRINGS = meta.uiStrings;
      CATEGORIES = meta.categories;
      GENERAL_TIPS = meta.generalTips;

      const totalDays = daysInclusive(TRIP.startDate, TRIP.endDate);
      const dayFiles = [];
      for (let i = 1; i <= totalDays; i++) {
        dayFiles.push(`assets/data/days/day-${String(i).padStart(2, "0")}.json`);
      }
      return Promise.all(dayFiles.map(fetchJson));
    }).then((days) => {
      ITINERARY = days;
    });
  }

  function showLoadError(err) {
    console.error("Failed to load itinerary data:", err);
    document.querySelector(".layout").innerHTML = `
      <div class="empty-day" style="margin-top:40px">
        Could not load the itinerary data (${escapeHtml(err.message)}).<br>
        If you opened this file directly from disk, run a local server instead
        (see the README) — loading the JSON files requires <code>http://</code>,
        not <code>file://</code>. This works automatically on GitHub Pages.
      </div>
    `;
  }

  function boot() {
    loadData().then(init).catch(showLoadError);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
