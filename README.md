# Japan Trip Itinerary

A single-page site for planning our Japan trip (Nov 5 – Nov 25), organized day by day with hourly activities, an embedded Google Maps route per day, a reservations checklist, and general trip tips.

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
- `GENERAL_TIPS` — cards shown on the "Tips" page.
- `ITINERARY` — an array of day objects:

```js
{
  day: 2,
  date: "2026-11-06",
  city: "Kyoto",
  title: "Temples & bamboo grove",
  summary: "A full day exploring eastern Kyoto...",
  tips: ["Wear comfortable shoes — lots of walking/stairs."],
  activities: [
    {
      time: "09:00",
      name: "Fushimi Inari Shrine",
      location: "Fushimi Inari Taisha, Kyoto",
      category: "sightseeing",   // transport | food | sightseeing | activity | shopping | lodging | nightlife | nature
      reservation: false,
      duration: "2 hr",
      tip: "Go early (before 9am) to beat the tour buses.",
      link: "https://inari.jp/en/"
    }
  ]
}
```

Notes:

- Activities don't need to be pre-sorted — the page sorts them by `time` automatically.
- `location` should be as specific as possible (e.g. `"Senso-ji Temple, Asakusa"` rather than just `"Tokyo"`) — it's what places the pin on that day's map.
- Set `reservation: true` on anything that needs booking ahead of time (restaurants, teamLab, Ghibli Museum, sumo tickets, etc.) — it'll show a badge on the activity and appear on the **Reservations** page as a checklist item.
- Leave `city: "TBD"` and an empty `activities` array for days you haven't planned yet — they show up as "Not planned yet" on the overview.

Just send over your itinerary and it'll get turned into entries like the one above.

## How the map works

Each day's map is rendered with **Leaflet + OpenStreetMap** — free, no API key, and no Google sign-in/consent redirect to fail inside an iframe (which is what causes an unauthenticated Google Maps embed to sometimes show blank). Numbered pins mark that day's activities in time order, connected by a route line; click a pin for details. The "Route overview" map on the Overview page connects one pin per city to show the overall trip route.

To place a pin, an activity needs `lat`/`lng` coordinates (see the field docs at the top of `itinerary.js`) — find them by searching the place on [openstreetmap.org](https://www.openstreetmap.org) and right-clicking it, or by right-clicking the spot on Google Maps and copying the coordinates shown at the top of the menu. An activity without coordinates still shows in the timeline, just without a pin.

## Project structure

```
index.html                 Page shell / layout for all four views
assets/css/style.css       All styling (responsive, light/dark, print-friendly)
assets/js/app.js           Rendering logic (no framework, no build step)
assets/data/itinerary.js   ← Edit this file to update the itinerary
```
