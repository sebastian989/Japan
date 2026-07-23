/**
 * Trip itinerary data.
 *
 * This is the ONLY file you need to edit to update the itinerary.
 * Add/edit days and activities below, then refresh the page.
 *
 * Activity fields:
 *   time         "HH:MM" (24h) — used for sorting and display
 *   name         Short title of the activity
 *   location     Place name/address used to place it on the map
 *                (be specific, e.g. "Senso-ji Temple, Asakusa" — the more
 *                specific, the more accurate the map pin will be)
 *   category     one of: transport | food | sightseeing | activity |
 *                shopping | lodging | nightlife | nature
 *   reservation  true | false — shows a "Booking needed" badge
 *   tip          Optional recommendation/note shown under the activity
 *   duration     Optional human-readable duration, e.g. "1.5 hr"
 *   link         Optional URL (official site, booking page, etc.)
 */

const TRIP = {
  title: "Japan Trip",
  subtitle: "Our itinerary, day by day",
  startDate: "2026-11-05",
  endDate: "2026-11-24",
  travelers: ["You", "Your friend"],
  heroTip:
    "This page is a living document — add real itinerary details to assets/data/itinerary.js and they'll show up here automatically.",
};

// Quick reference used on the Tips page and for badges. Feel free to expand.
const CATEGORIES = {
  transport: { label: "Transport", icon: "\u{1F686}" }, // 🚆
  food: { label: "Food & Drink", icon: "\u{1F35C}" }, // 🍜
  sightseeing: { label: "Sightseeing", icon: "⛩️" }, // ⛩️
  activity: { label: "Activity", icon: "\u{1F3AF}" }, // 🎯
  shopping: { label: "Shopping", icon: "\u{1F6CD}️" }, // 🛍️
  lodging: { label: "Lodging", icon: "\u{1F3E8}" }, // 🏨
  nightlife: { label: "Nightlife", icon: "\u{1F3EE}" }, // 🏮
  nature: { label: "Nature", icon: "\u{1F338}" }, // 🌸
};

// General, trip-wide recommendations (shown on the "Tips" page).
const GENERAL_TIPS = [
  {
    title: "Get a Suica/Pasmo/Welcome Suica IC card",
    body:
      "Lets you tap in/out of nearly all trains, subways and buses, plus pay at convenience stores and vending machines. Buy at the airport or add it to Apple/Google Wallet before you land.",
  },
  {
    title: "Consider a Japan Rail Pass only if you're covering long distances",
    body:
      "Since the price increase, the JR Pass is usually only worth it if you're doing multiple Shinkansen trips between distant cities. For a mostly regional/city trip, pay-as-you-go IC card or regional passes are often cheaper.",
  },
  {
    title: "Book popular restaurants and experiences in advance",
    body:
      "Ramen shops and izakayas are mostly walk-in, but tasting menus, teamLab, sumo, robot restaurant-style shows, and anything with 'reservation recommended' online should be booked 1-4 weeks ahead — some (like Ghibli Museum) sell out a month+ ahead.",
  },
  {
    title: "Carry cash",
    body:
      "Japan is more card-friendly than it used to be, but small shops, shrines, and rural areas may be cash-only. Withdraw yen from 7-Eleven ATMs — they reliably accept foreign cards.",
  },
  {
    title: "Pack for the weather",
    body:
      "Early-to-mid November is autumn: mild days (~14-19°C / 57-66°F) and cool nights (~5-10°C / 41-50°F). Layers, a light jacket, and a compact umbrella cover most of the trip.",
  },
  {
    title: "Luggage forwarding (takkyubin)",
    body:
      "If you're moving between cities, use a same-day/next-day luggage forwarding service (e.g. Yamato/Kuroneko) to send big suitcases ahead to your next hotel and travel light on trains.",
  },
];

/**
 * Each day: { day, date, city, title, summary, tips: [string], activities: [...] }
 * `activities` will be sorted by `time` automatically — you don't need to
 * pre-sort them.
 */
const ITINERARY = [
  {
    day: 1,
    date: "2026-11-05",
    city: "Tokyo",
    title: "Arrival in Tokyo",
    summary:
      "Landing day — keep it light. Settle into the hotel, get a SIM/IC card sorted, and ease into the city with a walk around the neighborhood and a low-key dinner.",
    tips: [
      "If you land in the afternoon/evening, don't over-plan day 1 — jet lag hits hard after a long flight.",
      "Buy your IC card (Suica/Pasmo) and a pocket wifi or SIM at the airport before heading into the city.",
    ],
    activities: [
      {
        time: "14:30",
        name: "Land at Narita/Haneda Airport",
        location: "Narita International Airport",
        category: "transport",
        reservation: false,
        tip: "Clear immigration, grab your IC card + SIM/pocket wifi here before heading to the train.",
      },
      {
        time: "16:30",
        name: "Train transfer to hotel",
        location: "Tokyo Station",
        category: "transport",
        reservation: false,
        duration: "1-1.5 hr",
        tip: "Narita Express (N'EX) or Keisei Skyliner are the easiest airport-to-city options.",
      },
      {
        time: "18:30",
        name: "Check in to hotel",
        location: "Shinjuku, Tokyo",
        category: "lodging",
        reservation: true,
        tip: "EXAMPLE — replace with your actual hotel name and confirmation number once booked.",
      },
      {
        time: "20:00",
        name: "Casual dinner near the hotel",
        location: "Omoide Yokocho, Shinjuku",
        category: "food",
        reservation: false,
        tip: "Tiny yakitori alleys near Shinjuku Station's west exit — great, low-key first-night dinner within walking distance of most Shinjuku hotels.",
      },
    ],
  },

  // --- Days 2-19: placeholders, ready for your real plans -------------
  // Replace `city`, `title`, `summary` and `activities` for each day below
  // once you share the itinerary. Leave the `day`/`date` fields as-is.
  { day: 2, date: "2026-11-06", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 3, date: "2026-11-07", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 4, date: "2026-11-08", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 5, date: "2026-11-09", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 6, date: "2026-11-10", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 7, date: "2026-11-11", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 8, date: "2026-11-12", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 9, date: "2026-11-13", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 10, date: "2026-11-14", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 11, date: "2026-11-15", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 12, date: "2026-11-16", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 13, date: "2026-11-17", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 14, date: "2026-11-18", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 15, date: "2026-11-19", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 16, date: "2026-11-20", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 17, date: "2026-11-21", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 18, date: "2026-11-22", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },
  { day: 19, date: "2026-11-23", city: "TBD", title: "Add plans for this day", summary: "", tips: [], activities: [] },

  {
    day: 20,
    date: "2026-11-24",
    city: "Tokyo",
    title: "Departure",
    summary: "Last day — pack, grab any final souvenirs, and head to the airport with buffer time.",
    tips: ["Ship bulky souvenirs home ahead of time if you're low on luggage space (post office or takkyubin)."],
    activities: [
      {
        time: "10:00",
        name: "Check out of hotel",
        location: "Shinjuku, Tokyo",
        category: "lodging",
        reservation: false,
        tip: "Most hotels allow luggage storage after checkout if your flight is later in the day.",
      },
      {
        time: "13:00",
        name: "Head to the airport",
        location: "Narita International Airport",
        category: "transport",
        reservation: false,
        duration: "1-1.5 hr",
        tip: "Aim to be at the airport 3 hr before an international flight.",
      },
    ],
  },
];
