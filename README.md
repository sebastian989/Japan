# Japan Trip Itinerary

A single-page site for planning our Japan trip (Nov 5 – Nov 25), organized day by day with hourly activities, a route map per day, a reservations checklist, and general trip tips. Bilingual: English/Spanish, switchable from the header.

No build tools, no dependencies, no API keys — plain HTML/CSS/JS that runs straight from GitHub Pages.

## Viewing it locally

Just open `index.html` in a browser, or serve it locally (needed for some browsers' local-file restrictions):

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

Everything content-related lives in **one file**: [`assets/data/itinerary.js`](assets/data/itinerary.js).

- `TRIP` — title, subtitle, date range, hero text.
- `UI_STRINGS` — fixed UI chrome (nav labels, headings, badges, empty states).
- `CATEGORIES` — icon + label per activity category.
- `GENERAL_TIPS` — cards shown on the "Tips" page.
- `ITINERARY` — an array of day objects:

```js
{
  day: 2,
  date: "2026-11-06",
  city: { en: "Kyoto", es: "Kioto" },
  title: { en: "Temples & bamboo grove", es: "Templos y bosque de bambú" },
  summary: { en: "A full day exploring eastern Kyoto...", es: "Un día completo explorando el este de Kioto..." },
  tips: [{ en: "Wear comfortable shoes — lots of walking/stairs.", es: "Usen calzado cómodo — se camina mucho." }],
  activities: [
    {
      time: "09:00",
      name: { en: "Fushimi Inari Shrine", es: "Santuario Fushimi Inari" },
      location: { en: "Fushimi Inari Taisha, Kyoto", es: "Fushimi Inari Taisha, Kioto" },
      lat: 34.9671,
      lng: 135.7727,
      category: "sightseeing",   // transport | food | sightseeing | activity | shopping | lodging | nightlife | nature
      reservation: false,
      duration: { en: "2 hr", es: "2 h" },
      tip: { en: "Go early (before 9am) to beat the tour buses.", es: "Vayan temprano (antes de las 9am) para adelantarse a los buses turísticos." },
      link: "https://inari.jp/en/"
    }
  ]
}
```

Notes:

- The site is bilingual — any text a visitor sees should be `{ en, es }` rather than a plain string. Fields that are never shown as translated prose (`day`, `date`, `lat`, `lng`, `category`, `reservation`, `link`) stay plain values.
- Activities don't need to be pre-sorted — the page sorts them by `time` automatically.
- `location` should be as specific as possible (e.g. `"Senso-ji Temple, Asakusa"` rather than just `"Tokyo"`) — it's shown under the activity and, if it has `lat`/`lng`, is what places the pin on that day's map.
- Set `reservation: true` on anything that needs booking ahead of time (restaurants, teamLab, Ghibli Museum, sumo tickets, etc.) — it'll show a badge on the activity and appear on the **Reservations** page as a checklist item.
- Leave `city: { en: "TBD", es: "TBD" }` and an empty `activities` array for days you haven't planned yet — they show up as "Not planned yet" on the overview.

Just send over your itinerary and it'll get turned into entries like the one above.

## How the map works

Each day's map is rendered with **Leaflet + CARTO/OpenStreetMap tiles** — free, no API key, and no Google sign-in/consent redirect to fail inside an iframe (which is what causes an unauthenticated Google Maps embed to sometimes show blank). Place labels use CARTO's basemaps rather than plain OSM tiles specifically because they render in Latin script everywhere (including Japan) instead of the local script. Numbered pins mark that day's activities in time order, connected by a route line; each activity in the timeline shows the same number next to its 📍 location so you can match a card to its pin. Click a pin for details. The "Route overview" map on the Overview page connects one pin per city to show the overall trip route.

To place a pin, an activity needs `lat`/`lng` coordinates (see the field docs at the top of `itinerary.js`) — find them by searching the place on [openstreetmap.org](https://www.openstreetmap.org) and right-clicking it, or by right-clicking the spot on Google Maps and copying the coordinates shown at the top of the menu. An activity without coordinates still shows in the timeline, just without a pin.

## Language switching

The EN/ES toggle in the header re-renders the whole page from `UI_STRINGS` and the `{en, es}` fields in `itinerary.js` — no page reload, no separate URLs. The choice is remembered (`localStorage`) and defaults to Spanish if the visitor's browser is set to a Spanish locale, English otherwise.

## Project structure

```
index.html                 Page shell / layout for all four views
assets/css/style.css       All styling (responsive, light/dark, print-friendly)
assets/js/app.js           Rendering logic (no framework, no build step)
assets/data/itinerary.js   ← Edit this file to update the itinerary
```
