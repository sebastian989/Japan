# Japan Trip Itinerary

A single-page site for planning our Japan trip (Nov 5 – Nov 25), organized day by day with hourly activities, a route map per day, a reservations checklist, and general trip tips. Bilingual: English/Spanish, switchable from the header.

No build tools, no dependencies, no API keys — plain HTML/CSS/JS that runs straight from GitHub Pages.

## Viewing it locally

The page loads its data as JSON over `fetch()`, which browsers block from a `file://` URL — so you need a local server, not just double-clicking `index.html`:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing to GitHub Pages

1. Push this branch, then merge it into your default branch (or point Pages at this branch directly).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Pick the branch (e.g. `main`) and folder `/ (root)`, then **Save**.
5. GitHub will give you a URL like `https://<username>.github.io/<repo>/` within a minute or two.

## Updating the itinerary

Content lives in JSON files under `assets/data/` — **one file per day**, so you can open just the day you're editing instead of scrolling one giant file:

```
assets/data/trip.json           Trip title, date range, UI text, categories, general tips
assets/data/days/day-01.json    Day 1
assets/data/days/day-02.json    Day 2
...
assets/data/days/day-21.json    Day 21 (last day — count comes from trip.json's date range)
```

The app derives how many day files to load from `trip.json`'s `startDate`/`endDate` (inclusive), so if you extend the trip, update those two dates *and* add the matching `day-NN.json` files — numbered to match, zero-padded (`day-07.json`, not `day-7.json`).

### `trip.json`

```json
{
  "trip": { "title": {...}, "subtitle": {...}, "startDate": "2026-11-05", "endDate": "2026-11-25", "heroTip": {...} },
  "uiStrings": { ...fixed UI text: nav labels, headings, badges, empty states... },
  "categories": { "sightseeing": { "icon": "⛩️", "label": { "en": "Sightseeing", "es": "Turismo" } }, ... },
  "generalTips": [ { "title": {...}, "body": {...} }, ... ]
}
```

You'll rarely need to touch `uiStrings` or `categories` — `generalTips` (the "Tips" page) and `trip` are the ones worth editing.

### `days/day-NN.json`

```json
{
  "day": 2,
  "date": "2026-11-06",
  "city": { "en": "Kyoto", "es": "Kioto" },
  "title": { "en": "Temples & bamboo grove", "es": "Templos y bosque de bambú" },
  "summary": { "en": "A full day exploring eastern Kyoto...", "es": "Un día completo explorando el este de Kioto..." },
  "tips": [
    { "en": "Wear comfortable shoes — lots of walking/stairs.", "es": "Usen calzado cómodo — se camina mucho." }
  ],
  "activities": [
    {
      "time": "09:00",
      "name": { "en": "Fushimi Inari Shrine", "es": "Santuario Fushimi Inari" },
      "location": { "en": "Fushimi Inari Taisha, Kyoto", "es": "Fushimi Inari Taisha, Kioto" },
      "lat": 34.9671,
      "lng": 135.7727,
      "category": "sightseeing",
      "reservation": false,
      "duration": { "en": "2 hr", "es": "2 h" },
      "tip": { "en": "Go early (before 9am) to beat the tour buses.", "es": "Vayan temprano (antes de las 9am) para adelantarse a los buses turísticos." },
      "link": "https://inari.jp/en/"
    }
  ]
}
```

`category` is one of: `transport | food | sightseeing | activity | shopping | lodging | nightlife | nature`.

Notes:

- The site is bilingual — any text a visitor sees should be `{ "en": "...", "es": "..." }` rather than a plain string. Fields that are never shown as translated prose (`day`, `date`, `lat`, `lng`, `category`, `reservation`, `link`) stay plain values.
- Activities don't need to be pre-sorted — the page sorts them by `time` automatically.
- `location` should be as specific as possible (e.g. `"Senso-ji Temple, Asakusa"` rather than just `"Tokyo"`) — it's shown under the activity and, if it has `lat`/`lng`, is what places the pin on that day's map.
- Set `"reservation": true` on anything that needs booking ahead of time (restaurants, teamLab, Ghibli Museum, sumo tickets, etc.) — it'll show a badge on the activity and appear on the **Reservations** page as a checklist item.
- Leave `"city": { "en": "TBD", "es": "TBD" }` and an empty `"activities"` array for days you haven't planned yet — they show up as "Not planned yet" on the overview.
- JSON has no comments, so if you want the field docs handy while editing, keep this README open — there's no docstring inside the files themselves.

Just send over your itinerary and it'll get turned into files like the ones above.

## How the map works

Each day's map is rendered with **Leaflet + CARTO's light basemap** — free, no API key, and no Google sign-in/consent redirect to fail inside an iframe (which is what causes an unauthenticated Google Maps embed to sometimes show blank). The map always uses CARTO's *light* tiles regardless of the visitor's OS theme (deliberately — a dark map read as broken rather than "in dark mode"), and place labels render in Latin script everywhere (including Japan) instead of the local script, unlike plain OSM tiles.

Numbered pins mark that day's activities in time order, connected by a route line; each activity in the timeline shows the same number next to its 📍 location so you can match a card to its pin. Click a pin for details. The "Route overview" map on the Overview page connects one pin per city to show the overall trip route.

Pins are never grouped/combined — each activity always keeps its own pin at its real coordinate. When two or more pins would render close enough to visually overlap (this recalculates on every zoom/pan, since it depends on the current view — e.g. a day with a long inter-city transfer, like Hakone's Tokyo departure ~80km from the rest of that day, forces the map to zoom out far enough that otherwise-separate local stops get squeezed together, and some activities are genuinely at the exact same coordinate, like a hotel used for both check-in and dinner), the overlapping ones are nudged a few screen pixels apart in a small spiral so every pin stays individually visible and clickable. The nudge is purely cosmetic — it only shifts where the icon renders, not the coordinate its popup and the route line use.

To place a pin, an activity needs `lat`/`lng` coordinates — find them by searching the place on [openstreetmap.org](https://www.openstreetmap.org) and right-clicking it, or by right-clicking the spot on Google Maps and copying the coordinates shown at the top of the menu. An activity without coordinates still shows in the timeline, just without a pin.

## Language switching

The EN/ES toggle in the header re-renders the whole page from `trip.json`'s `uiStrings` and the `{en, es}` fields in each day file — no page reload, no separate URLs. The choice is remembered (`localStorage`) and defaults to Spanish if the visitor's browser is set to a Spanish locale, English otherwise.

## Project structure

```
index.html                       Page shell / layout for all four views
assets/css/style.css             All styling (responsive, light/dark, print-friendly)
assets/js/app.js                 Fetches the JSON below and renders everything (no framework, no build step)
assets/data/trip.json            Trip meta, UI text, categories, general tips
assets/data/days/day-NN.json     ← Edit these to update the itinerary, one file per day
```
