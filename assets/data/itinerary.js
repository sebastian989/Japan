/**
 * Trip itinerary data.
 *
 * This is the ONLY file you need to edit to update the itinerary.
 * Add/edit days and activities below, then refresh the page.
 *
 * The site is bilingual (English/Spanish). Any text a visitor sees should
 * be written as { en: "...", es: "..." } instead of a plain string, e.g.:
 *   name: { en: "Check in to hotel", es: "Registro en el hotel" }
 * Fields that are never shown as translated prose — day, date, lat, lng,
 * category, reservation, link — stay plain values.
 *
 * Activity fields:
 *   time         "HH:MM" (24h) — used for sorting and display
 *   name         { en, es } — short title of the activity
 *   location     { en, es } — place name shown under the activity title
 *   lat, lng     Coordinates used to place the pin on the map. To find
 *                them: search the place on openstreetmap.org, right-click
 *                the spot and choose "Show address", or right-click a spot
 *                on Google Maps and click the lat/lng shown at the top of
 *                the menu to copy it. Leave both out if you don't have them
 *                yet — that activity just won't get a pin.
 *   category     one of: transport | food | sightseeing | activity |
 *                shopping | lodging | nightlife | nature
 *   reservation  true | false — shows a "Booking needed" badge
 *   tip          { en, es } — optional recommendation shown under the activity
 *   duration     { en, es } — optional human-readable duration, e.g. "1.5 hr"
 *   link         Optional URL (official site, booking page, etc.)
 *
 * Times marked as estimates come from a source itinerary that only
 * specified "morning" / "afternoon" blocks, not exact hours — adjust freely
 * once you lock in specific reservations or train times.
 *
 * Maps are rendered with Leaflet + OpenStreetMap/CARTO tiles (see
 * assets/js/app.js) — no API key, no Google sign-in/consent redirects.
 */

const TRIP = {
  title: { en: "Japan Trip", es: "Viaje a Japón" },
  subtitle: { en: "Our itinerary, day by day", es: "Nuestro itinerario, día a día" },
  startDate: "2026-11-05",
  endDate: "2026-11-25",
  heroTip: {
    en: "Tokyo → Hakone → Takayama → Shirakawa-go → Kanazawa → Kyoto → Nara → Osaka → Hiroshima → Miyajima → Tokyo. Edit assets/data/itinerary.js to keep refining it.",
    es: "Tokio → Hakone → Takayama → Shirakawa-go → Kanazawa → Kioto → Nara → Osaka → Hiroshima → Miyajima → Tokio. Edita assets/data/itinerary.js para seguir ajustándolo.",
  },
};

// UI chrome strings (buttons, headings, empty states — not trip content).
const UI_STRINGS = {
  navOverview: { en: "Overview", es: "Resumen" },
  navDay: { en: "Day by day", es: "Día a día" },
  navReservations: { en: "Reservations", es: "Reservas" },
  navTips: { en: "Tips", es: "Consejos" },
  heroHeading: { en: "Trip overview", es: "Resumen del viaje" },
  statDays: { en: "Days", es: "Días" },
  statCities: { en: "Cities/Towns", es: "Ciudades/Pueblos" },
  statActivities: { en: "Planned activities", es: "Actividades planeadas" },
  statReservations: { en: "Need reservations", es: "Necesitan reserva" },
  allDaysHeading: { en: "All days", es: "Todos los días" },
  routeOverviewHeading: { en: "Route overview", es: "Resumen de la ruta" },
  notPlannedYet: { en: "Not planned yet", es: "Aún sin planear" },
  addPlansForDay: { en: "Add plans for this day", es: "Agrega planes para este día" },
  bookingBadgeShort: { en: "⚠ Booking", es: "⚠ Reserva" },
  bookingNeeded: { en: "⚠ Booking needed", es: "⚠ Requiere reserva" },
  walkIn: { en: "✓ Walk-in / no booking", es: "✓ Sin reserva" },
  previous: { en: "← Previous", es: "← Anterior" },
  next: { en: "Next →", es: "Siguiente →" },
  emptyDayPrefix: {
    en: "No activities planned for this day yet. Add them to",
    es: "Aún no hay actividades planeadas para este día. Agrégalas en",
  },
  mapEmptyDay: {
    en: "Add coordinates to an activity to see it on the map here.",
    es: "Agrega coordenadas a una actividad para verla aquí en el mapa.",
  },
  mapEmptyOverview: {
    en: "Add coordinates to your activities to see the route here.",
    es: "Agrega coordenadas a tus actividades para ver la ruta aquí.",
  },
  reservationsHeading: { en: "Reservations & bookings checklist", es: "Lista de reservas" },
  nothingToBook: { en: "Nothing to book yet.", es: "Todavía no hay nada que reservar." },
  noReservationsNeeded: {
    en: "No activities currently require a reservation.",
    es: "Ninguna actividad requiere reserva por ahora.",
  },
  tipsHeading: { en: "General trip tips", es: "Consejos generales del viaje" },
  categoriesHeading: { en: "Activity categories", es: "Categorías de actividades" },
  footer: {
    en: "Built for our trip · edit assets/data/itinerary.js to update the plan",
    es: "Hecho para nuestro viaje · edita assets/data/itinerary.js para actualizar el plan",
  },
  tipLabel: { en: "Tip:", es: "Consejo:" },
  moreInfo: { en: "More info", es: "Más información" },
  day: { en: "Day", es: "Día" },
  locationPlaceholder: { en: "Location TBD", es: "Ubicación por definir" },
  mapPinTitle: { en: "Pin", es: "Punto" },
  onMapAbove: { en: "on the map above", es: "en el mapa de arriba" },
};

// Quick reference used on the Tips page and for badges. Feel free to expand.
const CATEGORIES = {
  transport: { icon: "\u{1F686}", label: { en: "Transport", es: "Transporte" } },
  food: { icon: "\u{1F35C}", label: { en: "Food & Drink", es: "Comida y bebida" } },
  sightseeing: { icon: "⛩️", label: { en: "Sightseeing", es: "Turismo" } },
  activity: { icon: "\u{1F3AF}", label: { en: "Activity", es: "Actividad" } },
  shopping: { icon: "\u{1F6CD}️", label: { en: "Shopping", es: "Compras" } },
  lodging: { icon: "\u{1F3E8}", label: { en: "Lodging", es: "Alojamiento" } },
  nightlife: { icon: "\u{1F3EE}", label: { en: "Nightlife", es: "Vida nocturna" } },
  nature: { icon: "\u{1F338}", label: { en: "Nature", es: "Naturaleza" } },
};

// General, trip-wide recommendations (shown on the "Tips" page).
const GENERAL_TIPS = [
  {
    title: { en: "Get a Suica/Pasmo/Welcome Suica IC card", es: "Consigan una tarjeta IC Suica/Pasmo/Welcome Suica" },
    body: {
      en: "Lets you tap in/out of nearly all trains, subways and buses, plus pay at convenience stores and vending machines. Buy at the airport or add it to Apple/Google Wallet before you land.",
      es: "Permite pagar con solo tocar en casi todos los trenes, metros y autobuses, además de en tiendas de conveniencia y máquinas expendedoras. Cómprenla en el aeropuerto o agréguenla a Apple/Google Wallet antes de aterrizar.",
    },
  },
  {
    title: { en: "Weigh the Japan Rail Pass against a regional pass", es: "Comparen el Japan Rail Pass con un pase regional" },
    body: {
      en: "This trip covers Tokyo, Hakone, Takayama, Kanazawa, Kyoto, Osaka and Hiroshima — a lot of long-distance Shinkansen legs, so a JR Pass (or the JR West/Takayama-Hokuriku regional pass covering Nagoya–Takayama–Kanazawa–Kyoto–Osaka) may well pay for itself. Compare the exact route cost before buying.",
      es: "Este viaje pasa por Tokio, Hakone, Takayama, Kanazawa, Kioto, Osaka e Hiroshima — muchos tramos largos en Shinkansen, así que un JR Pass (o el pase regional JR West/Takayama-Hokuriku que cubre Nagoya–Takayama–Kanazawa–Kioto–Osaka) puede valer la pena. Comparen el costo exacto de la ruta antes de comprar.",
    },
  },
  {
    title: { en: "Book the big-ticket items well ahead", es: "Reserven con anticipación las actividades más demandadas" },
    body: {
      en: "Shibuya Sky, teamLab Planets, Universal Studios Japan (especially Super Nintendo World timed entry), and the Nohi highway bus to Shirakawa-go all sell out — book these as soon as dates are fixed, ideally 2-4 weeks ahead.",
      es: "Shibuya Sky, teamLab Planets, Universal Studios Japan (sobre todo el acceso programado a Super Nintendo World) y el autobús Nohi a Shirakawa-go se agotan — resérvenlos apenas tengan las fechas fijas, idealmente con 2-4 semanas de anticipación.",
    },
  },
  {
    title: { en: "Use Takkyubin to forward your luggage", es: "Usen Takkyubin para enviar su equipaje por adelantado" },
    body: {
      en: "You'll change hotels often (Tokyo → Hakone → Takayama → Kanazawa → Kyoto → Osaka → Hiroshima → Tokyo). Send bulky suitcases ahead via Takkyubin (e.g. from Tokyo to Takayama or Kyoto) and travel the trickier legs — especially the Hakone ropeway/boat day — with just a light bag.",
      es: "Cambiarán de hotel seguido (Tokio → Hakone → Takayama → Kanazawa → Kioto → Osaka → Hiroshima → Tokio). Envíen las maletas grandes por adelantado con Takkyubin (por ejemplo, de Tokio a Takayama o Kioto) y viajen los tramos más complicados — sobre todo el día del teleférico/barco en Hakone — solo con una mochila ligera.",
    },
  },
  {
    title: { en: "Carry cash", es: "Lleven efectivo" },
    body: {
      en: "Japan is more card-friendly than it used to be, but small shops, shrines, ryokan, and rural areas (Shirakawa-go, Takayama's markets) may be cash-only. Withdraw yen from 7-Eleven ATMs — they reliably accept foreign cards.",
      es: "Japón acepta tarjeta más que antes, pero tiendas pequeñas, santuarios, ryokan y zonas rurales (Shirakawa-go, los mercados de Takayama) pueden ser solo en efectivo. Saquen yenes en los cajeros de 7-Eleven — aceptan tarjetas extranjeras de forma confiable.",
    },
  },
  {
    title: { en: "Pack for the weather", es: "Empaquen para el clima" },
    body: {
      en: "Nov 5-25 is deep autumn: mild days in Tokyo/Osaka/Hiroshima (~14-19°C / 57-66°F) but noticeably colder mornings and nights in Hakone, Takayama and Kanazawa (~2-8°C / 36-46°F). Layers, a warm jacket for the mountain stops, and a compact umbrella.",
      es: "Del 5 al 25 de noviembre es pleno otoño: días templados en Tokio/Osaka/Hiroshima (~14-19°C) pero mañanas y noches notablemente más frías en Hakone, Takayama y Kanazawa (~2-8°C). Lleven capas, una chaqueta abrigada para las paradas de montaña y un paraguas compacto.",
    },
  },
  {
    title: { en: "Early starts pay off at the popular sights", es: "Madrugar vale la pena en los lugares más populares" },
    body: {
      en: "Fushimi Inari (before 7:30 AM) and Arashiyama Bamboo Grove are dramatically quieter first thing in the morning — build in an early alarm on those specific days rather than everywhere.",
      es: "Fushimi Inari (antes de las 7:30 AM) y el Bosque de Bambú de Arashiyama están muchísimo más tranquilos a primera hora de la mañana — programen una alarma temprana solo esos días específicos, no todos los días del viaje.",
    },
  },
];

/**
 * Each day: { day, date, city, title, summary, tips: [{en,es}], activities: [...] }
 * `activities` will be sorted by `time` automatically — you don't need to
 * pre-sort them.
 */
const ITINERARY = [
  {
    day: 1,
    date: "2026-11-05",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Arrival", es: "Llegada" },
    summary: {
      en: "Landing day — clear immigration, get to the hotel in Asakusa/Ueno, and ease into the trip with a relaxed evening walk.",
      es: "Día de llegada — pasen migración, vayan al hotel en Asakusa/Ueno, y arranquen el viaje con una caminata relajada por la noche.",
    },
    tips: [
      {
        en: "Pick up your JR Pass (if applicable) and a pocket wifi/SIM at the airport before heading into the city.",
        es: "Recojan su JR Pass (si aplica) y un pocket wifi/SIM en el aeropuerto antes de ir a la ciudad.",
      },
    ],
    activities: [
      {
        time: "13:00",
        name: { en: "Arrival & transfer to hotel", es: "Llegada y traslado al hotel" },
        location: { en: "Narita/Haneda Airport, Tokyo", es: "Aeropuerto de Narita/Haneda, Tokio" },
        lat: 35.7647,
        lng: 140.3864,
        category: "transport",
        reservation: false,
        tip: {
          en: "Take the Narita Express (N'EX) or Keisei Skyliner into the city, then local metro to the hotel.",
          es: "Tomen el Narita Express (N'EX) o el Keisei Skyliner hacia la ciudad, y luego el metro local hasta el hotel.",
        },
      },
      {
        time: "17:00",
        name: { en: "Check in — hotel in Asakusa/Ueno", es: "Registro — hotel en Asakusa/Ueno" },
        location: { en: "Asakusa, Tokyo", es: "Asakusa, Tokio" },
        lat: 35.7148,
        lng: 139.7967,
        category: "lodging",
        reservation: true,
        tip: {
          en: "EXAMPLE — replace with your actual hotel name and confirmation number once booked.",
          es: "EJEMPLO — reemplacen con el nombre real del hotel y el número de confirmación una vez reservado.",
        },
      },
      {
        time: "19:00",
        name: { en: "Evening walk: Asakusa & Senso-ji by night", es: "Caminata nocturna: Asakusa y Senso-ji" },
        location: { en: "Senso-ji Temple, Asakusa", es: "Templo Senso-ji, Asakusa" },
        lat: 35.7148,
        lng: 139.7967,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Senso-ji and the Nakamise shopping street are beautifully lit and far less crowded at night. Cap it off with a look at Tokyo Skytree from outside.",
          es: "Senso-ji y la calle comercial Nakamise se ven preciosas iluminadas de noche y hay mucha menos gente. Cierren la noche viendo el Tokyo Skytree desde afuera.",
        },
      },
    ],
  },
  {
    day: 2,
    date: "2026-11-06",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Ueno & Yanaka", es: "Ueno y Yanaka" },
    summary: {
      en: "A gentle adjustment day in neighborhoods that sit close together, so there's not much transit involved.",
      es: "Un día tranquilo de adaptación en barrios cercanos entre sí, así que hay poco traslado de por medio.",
    },
    tips: [
      {
        en: "Good day to recover from jet lag — Ueno and Yanaka are an easy walk/short metro ride apart.",
        es: "Buen día para recuperarse del jet lag — Ueno y Yanaka están a poca distancia caminando o en metro.",
      },
    ],
    activities: [
      {
        time: "09:30",
        name: { en: "Ueno Park & Ameyoko Market", es: "Parque Ueno y mercado Ameyoko" },
        location: { en: "Ueno Park, Tokyo", es: "Parque Ueno, Tokio" },
        lat: 35.7156,
        lng: 139.7745,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Ameyoko is a lively old market street just south of Ueno Station — good for street food and browsing.",
          es: "Ameyoko es una animada calle de mercado justo al sur de la estación de Ueno — ideal para comida callejera y curiosear.",
        },
      },
      {
        time: "14:00",
        name: { en: "Yanaka Ginza (old town neighborhood)", es: "Yanaka Ginza (barrio antiguo)" },
        location: { en: "Yanaka Ginza, Tokyo", es: "Yanaka Ginza, Tokio" },
        lat: 35.728,
        lng: 139.767,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "One of the few Tokyo neighborhoods that survived WWII largely intact — an old-fashioned shopping street, cats, and traditional shops. Reachable on foot or by local metro (Ginza/Yamanote line).",
          es: "Uno de los pocos barrios de Tokio que sobrevivió casi intacto la Segunda Guerra Mundial — una calle comercial de estilo antiguo, gatos y tiendas tradicionales. Se llega caminando o en metro local (línea Ginza/Yamanote).",
        },
      },
    ],
  },
  {
    day: 3,
    date: "2026-11-07",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Harajuku & Shibuya", es: "Harajuku y Shibuya" },
    summary: {
      en: "Youth culture and one of Tokyo's best sunset views.",
      es: "Cultura juvenil y una de las mejores vistas de atardecer de Tokio.",
    },
    tips: [],
    activities: [
      {
        time: "09:30",
        name: { en: "Meiji Jingu Shrine & Harajuku (Takeshita Street)", es: "Santuario Meiji Jingu y Harajuku (calle Takeshita)" },
        location: { en: "Meiji Jingu Shrine, Harajuku", es: "Santuario Meiji Jingu, Harajuku" },
        lat: 35.6764,
        lng: 139.6993,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Take the JR Yamanote line (Ueno → Harajuku → Shibuya) to link today's stops.",
          es: "Tomen la línea JR Yamanote (Ueno → Harajuku → Shibuya) para conectar las paradas de hoy.",
        },
      },
      {
        time: "15:00",
        name: {
          en: "Shibuya Crossing, Hachiko statue & Shibuya Sky at sunset",
          es: "Cruce de Shibuya, estatua de Hachiko y Shibuya Sky al atardecer",
        },
        location: { en: "Shibuya Sky, Shibuya", es: "Shibuya Sky, Shibuya" },
        lat: 35.658,
        lng: 139.7016,
        category: "sightseeing",
        reservation: true,
        tip: {
          en: "Book Shibuya Sky several weeks in advance — sunset time slots are the first to sell out.",
          es: "Reserven Shibuya Sky con varias semanas de anticipación — los horarios de atardecer son los primeros en agotarse.",
        },
      },
    ],
  },
  {
    day: 4,
    date: "2026-11-08",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Ikebukuro & Akihabara", es: "Ikebukuro y Akihabara" },
    summary: { en: "A pop-culture and electronics day.", es: "Un día de cultura pop y electrónica." },
    tips: [
      {
        en: "The best day on the trip for anime/video game shopping.",
        es: "El mejor día del viaje para comprar anime y videojuegos.",
      },
    ],
    activities: [
      {
        time: "09:30",
        name: { en: "Ikebukuro: Sunshine City & Pokémon Center", es: "Ikebukuro: Sunshine City y Pokémon Center" },
        location: { en: "Sunshine City, Ikebukuro", es: "Sunshine City, Ikebukuro" },
        lat: 35.7295,
        lng: 139.7196,
        category: "shopping",
        reservation: false,
        tip: {
          en: "The JR Yamanote line connects Ikebukuro and Akihabara.",
          es: "La línea JR Yamanote conecta Ikebukuro y Akihabara.",
        },
      },
      {
        time: "14:00",
        name: { en: "Akihabara: Mandarake & electronics stores", es: "Akihabara: Mandarake y tiendas de electrónica" },
        location: { en: "Akihabara, Tokyo", es: "Akihabara, Tokio" },
        lat: 35.7022,
        lng: 139.7745,
        category: "shopping",
        reservation: false,
        tip: {
          en: "Mandarake is a multi-floor treasure hunt for manga, figures and retro games.",
          es: "Mandarake es una búsqueda del tesoro de varios pisos con manga, figuras y videojuegos retro.",
        },
      },
    ],
  },
  {
    day: 5,
    date: "2026-11-09",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Nikko day trip", es: "Excursión a Nikko" },
    summary: {
      en: "A full-day excursion out to the shrines of Nikko.",
      es: "Una excursión de día completo a los santuarios de Nikko.",
    },
    tips: [
      {
        en: "Leave early to make the most of the day — Nikko is roughly 2 hours from Tokyo.",
        es: "Salgan temprano para aprovechar el día — Nikko está a unas 2 horas de Tokio.",
      },
    ],
    activities: [
      {
        time: "07:00",
        name: { en: "Day trip to Nikko: Toshogu Shrine", es: "Excursión a Nikko: Santuario Toshogu" },
        location: { en: "Toshogu Shrine, Nikko", es: "Santuario Toshogu, Nikko" },
        lat: 36.7581,
        lng: 139.5994,
        category: "sightseeing",
        reservation: false,
        duration: { en: "Full day", es: "Día completo" },
        tip: {
          en: "Take the Tobu train from Asakusa, or JR Shinkansen plus a local line. Toshogu is Japan's most lavishly decorated shrine complex.",
          es: "Tomen el tren Tobu desde Asakusa, o el Shinkansen JR más una línea local. Toshogu es el complejo de santuarios más ricamente decorado de Japón.",
        },
      },
      {
        time: "13:00",
        name: { en: "Shinkyo Bridge", es: "Puente Shinkyo" },
        location: { en: "Shinkyo Bridge, Nikko", es: "Puente Shinkyo, Nikko" },
        lat: 36.7503,
        lng: 139.5995,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "The bright red sacred bridge at the entrance to Nikko's shrine district — a quick, scenic stop.",
          es: "El puente sagrado rojo brillante a la entrada del distrito de santuarios de Nikko — una parada rápida y muy fotogénica.",
        },
      },
    ],
  },
  {
    day: 6,
    date: "2026-11-10",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Tokyo Bay: teamLab & Odaiba", es: "Bahía de Tokio: teamLab y Odaiba" },
    summary: {
      en: "Digital art and the waterfront, last full day based in Tokyo.",
      es: "Arte digital y el paseo marítimo, último día completo con base en Tokio.",
    },
    tips: [],
    activities: [
      {
        time: "09:30",
        name: { en: "teamLab Planets", es: "teamLab Planets" },
        location: { en: "teamLab Planets, Tokyo", es: "teamLab Planets, Tokio" },
        lat: 35.6465,
        lng: 139.7943,
        category: "activity",
        reservation: true,
        tip: {
          en: "Book ahead — timed-entry tickets sell out, especially on weekends. You'll walk through water, so shorts/roll-up trousers help.",
          es: "Reserven con anticipación — los boletos de horario programado se agotan, sobre todo los fines de semana. Caminarán por agua, así que conviene llevar shorts o pantalones que se puedan enrollar.",
        },
      },
      {
        time: "14:00",
        name: { en: "Gundam Statue & Odaiba", es: "Estatua de Gundam y Odaiba" },
        location: { en: "Odaiba, Tokyo", es: "Odaiba, Tokio" },
        lat: 35.6197,
        lng: 139.7756,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Take the metro plus the Yurikamome monorail out to Odaiba — the elevated monorail ride itself has great bay views.",
          es: "Tomen el metro más el monorriel Yurikamome hasta Odaiba — el trayecto elevado en monorriel ya tiene de por sí muy buenas vistas de la bahía.",
        },
      },
    ],
  },
  {
    day: 7,
    date: "2026-11-11",
    city: { en: "Hakone", es: "Hakone" },
    title: { en: "Hakone Round Course", es: "Hakone Round Course" },
    summary: {
      en: "The classic Hakone Round Course: climb from Hakone-Yumoto up to the volcano, then come back down via the lake — no backtracking on any leg.",
      es: "El clásico Hakone Round Course: suben desde Hakone-Yumoto hacia el volcán y bajan por el lago, sin retroceder en ningún tramo.",
    },
    tips: [
      {
        en: "Traveling as a group with luggage? Leave big suitcases at the ryokan (if check-in allows) or in station lockers at Hakone-Yumoto so no one has to carry them all day.",
        es: "¿Viajan en grupo con maletas? Dejen las maletas grandes en el ryokan (si el check-in lo permite) o en lockers de la estación de Hakone-Yumoto para no cargarlas todo el día.",
      },
      {
        en: "Kaiseki dinners at ryokan are usually served at a set time — confirm yours at check-in.",
        es: "Las cenas kaiseki en los ryokan suelen servirse a una hora fija — confirmen la suya al hacer el check-in.",
      },
    ],
    activities: [
      {
        time: "07:00",
        name: { en: "Depart Tokyo for Hakone-Yumoto", es: "Salida de Tokio hacia Hakone-Yumoto" },
        location: { en: "Shinjuku Station, Tokyo", es: "Estación de Shinjuku, Tokio" },
        lat: 35.6896,
        lng: 139.7006,
        category: "transport",
        reservation: false,
        duration: { en: "~1 hr 25 min", es: "~1 h 25 min" },
        tip: {
          en: "The Odakyu Romancecar is the direct, comfortable option straight to Hakone-Yumoto.",
          es: "El Odakyu Romancecar es la opción directa y cómoda hasta Hakone-Yumoto.",
        },
      },
      {
        time: "08:30",
        name: { en: "Arrive in Hakone-Yumoto", es: "Llegada a Hakone-Yumoto" },
        location: { en: "Hakone-Yumoto Station, Hakone", es: "Estación de Hakone-Yumoto, Hakone" },
        lat: 35.2323,
        lng: 139.1069,
        category: "transport",
        reservation: false,
        tip: {
          en: "Drop big luggage at the ryokan (if early check-in/luggage storage is allowed) or in station lockers — with a group and suitcases, this is key to not hauling everything all day.",
          es: "Dejen el equipaje grande en el ryokan (si permiten guardar maletas antes del check-in) o en los lockers de la estación — con varias personas y maletas, esto es clave para no cargar todo el día.",
        },
      },
      {
        time: "09:00",
        name: {
          en: "Hakone Tozan Railway to Chokoku-no-mori: Hakone Open-Air Museum",
          es: "Hakone Tozan Railway hasta Chokoku-no-mori: Hakone Open-Air Museum",
        },
        location: { en: "Hakone Open-Air Museum, Chokoku-no-mori", es: "Hakone Open-Air Museum, Chokoku-no-mori" },
        lat: 35.2464,
        lng: 139.0629,
        category: "sightseeing",
        reservation: false,
        duration: { en: "~1.5 hr", es: "~1.5 h" },
        tip: {
          en: "Open-air sculpture park plus an indoor Picasso gallery — a relaxed, scenic way to start the day.",
          es: "Parque de esculturas al aire libre más una sala Picasso techada — una forma relajada y muy fotogénica de arrancar el día.",
        },
      },
      {
        time: "11:00",
        name: { en: "Continue by train to Gora (last stop)", es: "Retoman el tren hasta Gora (última parada)" },
        location: { en: "Gora Station, Hakone", es: "Estación de Gora, Hakone" },
        lat: 35.2477,
        lng: 139.0491,
        category: "transport",
        reservation: false,
        tip: { en: "Same Hakone Tozan Railway line, just ride it to the end.", es: "Es la misma línea Hakone Tozan Railway, solo síganla hasta el final." },
      },
      {
        time: "11:30",
        name: { en: "Lunch in Gora", es: "Almuerzo en Gora" },
        location: { en: "Gora, Hakone", es: "Gora, Hakone" },
        lat: 35.2477,
        lng: 139.0491,
        category: "food",
        reservation: false,
        tip: {
          en: "Plenty of good restaurant options right around the station.",
          es: "Hay buena oferta de restaurantes justo cerca de la estación.",
        },
      },
      {
        time: "12:30",
        name: { en: "Gora → Sounzan cable car", es: "Funicular Gora → Sounzan" },
        location: { en: "Sounzan Station, Hakone", es: "Estación de Sounzan, Hakone" },
        lat: 35.2419,
        lng: 139.0295,
        category: "transport",
        reservation: false,
        tip: { en: "The Hakone Tozan Cable Car — a short, steep funicular ride.", es: "El Hakone Tozan Cable Car — un funicular corto y empinado." },
      },
      {
        time: "13:00",
        name: { en: "Sounzan → Owakudani ropeway: volcanic valley", es: "Ropeway Sounzan → Owakudani: valle volcánico" },
        location: { en: "Owakudani, Hakone", es: "Owakudani, Hakone" },
        lat: 35.2426,
        lng: 139.0219,
        category: "nature",
        reservation: false,
        duration: { en: "~1 hr", es: "~1 h" },
        tip: {
          en: "Active volcanic valley — try a kuro-tamago (black egg), boiled in the sulphuric hot springs (legend says it adds seven years to your life). Views of Mt. Fuji on a clear day.",
          es: "Valle volcánico activo — prueben un kuro-tamago (huevo negro), cocido en las aguas termales sulfurosas (dicen que suma siete años de vida). Vistas al Fuji si el día está despejado.",
        },
      },
      {
        time: "14:00",
        name: { en: "Owakudani → Togendai ropeway", es: "Ropeway Owakudani → Togendai" },
        location: { en: "Togendai, Lake Ashi", es: "Togendai, Lago Ashi" },
        lat: 35.2078,
        lng: 139.0138,
        category: "transport",
        reservation: false,
        tip: {
          en: "Arrives right at the north shore of Lake Ashi.",
          es: "Llega justo a la orilla norte del Lago Ashi.",
        },
      },
      {
        time: "14:30",
        name: { en: "\"Pirate ship\" cruise across Lake Ashi", es: "Crucero \"pirata\" por el Lago Ashi" },
        location: { en: "Moto-Hakone Port, Lake Ashi", es: "Puerto de Moto-Hakone, Lago Ashi" },
        lat: 35.1998,
        lng: 139.0281,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Sails from Togendai to Hakone-machi or Moto-Hakone.",
          es: "Navega de Togendai hacia Hakone-machi o Moto-Hakone.",
        },
      },
      {
        time: "15:15",
        name: { en: "Hakone Shrine's lakeside torii gate", es: "Torii de Hakone Shrine sobre el lago" },
        location: { en: "Hakone Shrine, Moto-Hakone", es: "Santuario de Hakone, Moto-Hakone" },
        lat: 35.2016,
        lng: 139.0247,
        category: "sightseeing",
        reservation: false,
        tip: { en: "A must-stop photo spot — the torii appears to float right on the lake.", es: "Parada fotográfica imprescindible — el torii parece flotar justo sobre el lago." },
      },
      {
        time: "16:00",
        name: { en: "Bus back toward Gora/Hakone-Yumoto", es: "Bus de regreso hacia Gora/Hakone-Yumoto" },
        location: { en: "Hakone", es: "Hakone" },
        lat: 35.2323,
        lng: 139.1069,
        category: "transport",
        reservation: false,
        tip: { en: "Which bus you take depends on where your ryokan is.", es: "El bus que tomen depende de dónde esté su ryokan." },
      },
      {
        time: "17:00",
        name: { en: "Check in — ryokan with onsen", es: "Check-in en el ryokan con onsen" },
        location: { en: "Hakone", es: "Hakone" },
        lat: 35.2323,
        lng: 139.1069,
        category: "lodging",
        reservation: true,
        tip: {
          en: "EXAMPLE — replace with your actual ryokan name and booking details. Leave time for the onsen before dinner.",
          es: "EJEMPLO — reemplacen con el nombre real del ryokan y los datos de la reserva. Dejen tiempo para el onsen antes de la cena.",
        },
      },
      {
        time: "19:00",
        name: { en: "Kaiseki dinner at the ryokan", es: "Cena kaiseki en el ryokan" },
        location: { en: "Hakone", es: "Hakone" },
        lat: 35.2323,
        lng: 139.1069,
        category: "food",
        reservation: false,
        tip: {
          en: "Usually included in the ryokan stay — just confirm the seating time at check-in.",
          es: "Normalmente está incluida en la estancia del ryokan — solo confirmen el horario al hacer el check-in.",
        },
      },
    ],
  },
  {
    day: 8,
    date: "2026-11-12",
    city: { en: "Takayama", es: "Takayama" },
    title: { en: "Travel day: on to Takayama", es: "Día de viaje: hacia Takayama" },
    summary: {
      en: "Transfer from Hakone to Takayama, then a first wander through the old town.",
      es: "Traslado de Hakone a Takayama, y una primera vuelta por el casco antiguo.",
    },
    tips: [
      {
        en: "Depends on the exact train, but you'll head back from Hakone-Yumoto to Odawara first to catch the Shinkansen. If the Takayama-bound train is early, ask the ryokan for a quick breakfast and check out before 8 AM.",
        es: "Depende del horario exacto del tren, pero primero vuelven de Hakone-Yumoto a Odawara para tomar el Shinkansen. Si el tren a Takayama es temprano, pidan un desayuno rápido en el ryokan y salgan antes de las 8 AM.",
      },
    ],
    activities: [
      {
        time: "08:00",
        name: { en: "Hakone-Yumoto → Odawara", es: "Hakone-Yumoto → Odawara" },
        location: { en: "Odawara Station, Hakone", es: "Estación de Odawara, Hakone" },
        lat: 35.2564,
        lng: 139.1538,
        category: "transport",
        reservation: false,
        tip: {
          en: "Short hop on the Hakone Tozan Line/Odakyu back to Odawara to connect with the Shinkansen.",
          es: "Tramo corto en la línea Hakone Tozan/Odakyu de vuelta a Odawara para conectar con el Shinkansen.",
        },
      },
      {
        time: "09:00",
        name: { en: "Travel to Takayama", es: "Viaje a Takayama" },
        location: { en: "Takayama Station, Takayama", es: "Estación de Takayama, Takayama" },
        lat: 36.1397,
        lng: 137.2523,
        category: "transport",
        reservation: false,
        duration: { en: "~4-5 hr", es: "~4-5 h" },
        tip: {
          en: "Shinkansen (Odawara → Nagoya) then the Hida Express (Nagoya → Takayama) — the Hida Express leg is famously scenic, running along a river gorge.",
          es: "Shinkansen (Odawara → Nagoya) y luego el Hida Express (Nagoya → Takayama) — el tramo del Hida Express es muy escénico, bordeando un cañón de río.",
        },
      },
      {
        time: "15:00",
        name: { en: "Historic old town walk: Sanmachi Suji", es: "Paseo por el casco histórico: Sanmachi Suji" },
        location: { en: "Sanmachi Suji, Takayama", es: "Sanmachi Suji, Takayama" },
        lat: 36.1408,
        lng: 137.2519,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Look for sake breweries marked by a ball of cedar leaves (sugidama) hanging over the doorway — most offer a cheap self-guided tasting flight of local varieties.",
          es: "Busquen las destilerías de sake identificables por una bola de hojas de cedro (sugidama) colgada en la entrada — la mayoría ofrece catas autoguiadas económicas de variedades locales.",
        },
      },
    ],
  },
  {
    day: 9,
    date: "2026-11-13",
    city: { en: "Takayama", es: "Takayama" },
    title: { en: "Markets, temples & Hida beef", es: "Mercados, templos y carne de Hida" },
    summary: {
      en: "A full day in Takayama: riverside morning market, an Edo-era government house, and the region's famous beef.",
      es: "Un día completo en Takayama: mercado matutino junto al río, una casa de gobierno de la era Edo, y la famosa carne de la región.",
    },
    tips: [],
    activities: [
      {
        time: "07:30",
        name: {
          en: "Miyagawa morning market & Higashiyama temple walk",
          es: "Mercado matutino de Miyagawa y paseo por los templos de Higashiyama",
        },
        location: { en: "Miyagawa Morning Market, Takayama", es: "Mercado matutino de Miyagawa, Takayama" },
        lat: 36.1436,
        lng: 137.2524,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Farmers and artisans set up along the river — a great spot to pick up a Sarubobo, the faceless red good-luck charm. The Higashiyama Walking Course nearby links a dozen-plus temples through a quiet wooded path; the red Nakabashi Bridge close to the market is also worth a photo.",
          es: "Agricultores y artesanos ponen sus puestos junto al río — un gran lugar para comprar un Sarubobo, el amuleto rojo sin rostro de la buena suerte. El Higashiyama Walking Course conecta más de una docena de templos por un tranquilo sendero boscoso; el puente rojo Nakabashi, cerca del mercado, también vale una foto.",
        },
      },
      {
        time: "14:00",
        name: { en: "Takayama Jinya", es: "Takayama Jinya" },
        location: { en: "Takayama Jinya, Takayama", es: "Takayama Jinya, Takayama" },
        lat: 36.1417,
        lng: 137.2497,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "The only surviving shogunate government building left in Japan — tatami halls, administrative offices, and a huge 17th-century rice storehouse.",
          es: "El único edificio de gobierno del shogunato que sobrevive en todo Japón — salas de tatami, oficinas administrativas y un enorme almacén de arroz del siglo XVII.",
        },
      },
      {
        time: "19:00",
        name: { en: "Dinner: Hida beef", es: "Cena: carne de Hida" },
        location: { en: "Sanmachi Suji, Takayama", es: "Sanmachi Suji, Takayama" },
        lat: 36.1408,
        lng: 137.2519,
        category: "food",
        reservation: false,
        tip: {
          en: "Hida-gyu is some of Japan's finest wagyu — try it grilled on skewers (kushiyaki), as lightly seared sushi on a rice cracker, or as Hoba Miso (cooked on a magnolia leaf). Also worth trying: Takayama ramen (chuka soba), a light soy-chicken broth with thin, curly noodles.",
          es: "El Hida-gyu es uno de los mejores wagyu de Japón — pruébenlo asado en brochetas (kushiyaki), como sushi ligeramente sellado sobre una galleta de arroz, o como Hoba Miso (cocinado sobre una hoja de magnolia). También vale la pena el ramen de Takayama (chuka soba), un caldo ligero de soya y pollo con fideos finos y rizados.",
        },
      },
    ],
  },
  {
    day: 10,
    date: "2026-11-14",
    city: { en: "Kanazawa", es: "Kanazawa" },
    title: { en: "Shirakawa-go & on to Kanazawa", es: "Shirakawa-go y hacia Kanazawa" },
    summary: {
      en: "A scenic stop in the thatched-roof village of Shirakawa-go on the way to Kanazawa.",
      es: "Una parada escénica en el pueblo de techos de paja de Shirakawa-go camino a Kanazawa.",
    },
    tips: [],
    activities: [
      {
        time: "08:30",
        name: { en: "Nohi highway bus to Shirakawa-go", es: "Autobús Nohi a Shirakawa-go" },
        location: { en: "Shirakawa-go", es: "Shirakawa-go" },
        lat: 36.2578,
        lng: 136.9066,
        category: "transport",
        reservation: true,
        duration: { en: "~3-4 hr stop", es: "~3-4 h de parada" },
        tip: {
          en: "Book the Nohi bus online well in advance — seats sell out, especially in autumn. Get off in Shirakawa-go to walk among the gassho-zukuri thatched-roof farmhouses and have lunch before continuing.",
          es: "Reserven el autobús Nohi por internet con bastante anticipación — los asientos se agotan, sobre todo en otoño. Bájense en Shirakawa-go para caminar entre las casas gassho-zukuri de techos de paja y almorzar antes de continuar.",
        },
      },
      {
        time: "14:00",
        name: { en: "Transfer to Kanazawa", es: "Traslado a Kanazawa" },
        location: { en: "Kanazawa", es: "Kanazawa" },
        lat: 36.5613,
        lng: 136.6562,
        category: "transport",
        reservation: false,
        tip: {
          en: "Continue on the next Nohi bus from Shirakawa-go to Kanazawa.",
          es: "Sigan en el siguiente autobús Nohi de Shirakawa-go a Kanazawa.",
        },
      },
    ],
  },
  {
    day: 11,
    date: "2026-11-15",
    city: { en: "Kanazawa", es: "Kanazawa" },
    title: { en: "Gardens & samurai district", es: "Jardines y barrio samurái" },
    summary: {
      en: "One of Japan's most beautiful gardens, plus the old samurai and geisha quarters.",
      es: "Uno de los jardines más bellos de Japón, además de los antiguos barrios samurái y de geishas.",
    },
    tips: [
      { en: "The Loop Bus covers all of today's stops easily.", es: "El Loop Bus cubre fácilmente todas las paradas de hoy." },
    ],
    activities: [
      {
        time: "09:00",
        name: { en: "Kenrokuen Garden & Kanazawa Castle", es: "Jardín Kenrokuen y castillo de Kanazawa" },
        location: { en: "Kenrokuen Garden, Kanazawa", es: "Jardín Kenrokuen, Kanazawa" },
        lat: 36.562,
        lng: 136.6626,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Considered one of Japan's three most beautiful gardens — go early for the best light and fewer crowds.",
          es: "Considerado uno de los tres jardines más bellos de Japón — vayan temprano para la mejor luz y menos gente.",
        },
      },
      {
        time: "14:00",
        name: {
          en: "Samurai district (Nagamachi) & geisha district (Higashi Chaya)",
          es: "Barrio samurái (Nagamachi) y barrio de geishas (Higashi Chaya)",
        },
        location: { en: "Higashi Chaya District, Kanazawa", es: "Barrio de Higashi Chaya, Kanazawa" },
        lat: 36.5713,
        lng: 136.6642,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Higashi Chaya's teahouse-lined streets are especially atmospheric in the late-afternoon light.",
          es: "Las calles de casas de té de Higashi Chaya tienen un ambiente especial con la luz de media tarde.",
        },
      },
    ],
  },
  {
    day: 12,
    date: "2026-11-16",
    city: { en: "Kyoto", es: "Kioto" },
    title: { en: "Travel day: on to Kyoto", es: "Día de viaje: hacia Kioto" },
    summary: { en: "Transfer to Kyoto, check in, then an evening in Gion.", es: "Traslado a Kioto, registro en el hotel, y una noche en Gion." },
    tips: [],
    activities: [
      {
        time: "10:00",
        name: { en: "Travel to Kyoto", es: "Viaje a Kioto" },
        location: { en: "Kyoto Station, Kyoto", es: "Estación de Kioto, Kioto" },
        lat: 34.9858,
        lng: 135.7588,
        category: "transport",
        reservation: false,
        tip: { en: "Thunderbird limited express train from Kanazawa to Kyoto.", es: "Tren rápido Thunderbird de Kanazawa a Kioto." },
      },
      {
        time: "15:00",
        name: { en: "Check in — Kyoto hotel (central/station area)", es: "Registro — hotel en Kioto (zona centro/estación)" },
        location: { en: "Kyoto Station area, Kyoto", es: "Zona de la estación de Kioto, Kioto" },
        lat: 34.9858,
        lng: 135.7588,
        category: "lodging",
        reservation: true,
        tip: {
          en: "EXAMPLE — replace with your actual hotel booking details.",
          es: "EJEMPLO — reemplacen con los datos reales de la reserva del hotel.",
        },
      },
      {
        time: "18:00",
        name: { en: "Gion, Yasaka Shrine & Pontocho", es: "Gion, santuario Yasaka y Pontocho" },
        location: { en: "Gion, Kyoto", es: "Gion, Kioto" },
        lat: 35.0037,
        lng: 135.7788,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Gion is at its best at dusk and into the evening, when the lanterns come on — also your best chance of spotting a geiko or maiko on their way to an appointment.",
          es: "Gion está en su mejor momento al atardecer y por la noche, cuando se encienden los faroles — también es la mejor oportunidad de ver a una geiko o maiko de camino a una cita.",
        },
      },
    ],
  },
  {
    day: 13,
    date: "2026-11-17",
    city: { en: "Kyoto", es: "Kioto" },
    title: { en: "South & East: Fushimi Inari & Higashiyama", es: "Sur y Este: Fushimi Inari y Higashiyama" },
    summary: {
      en: "An early start for Fushimi Inari, then the temples and old streets of eastern Kyoto.",
      es: "Un madrugón para Fushimi Inari, y luego los templos y calles antiguas del este de Kioto.",
    },
    tips: [],
    activities: [
      {
        time: "07:00",
        name: { en: "Fushimi Inari Taisha", es: "Fushimi Inari Taisha" },
        location: { en: "Fushimi Inari Taisha, Kyoto", es: "Fushimi Inari Taisha, Kioto" },
        lat: 34.9671,
        lng: 135.7727,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Arrive before 7:30 AM to beat the tour groups and get the torii-gate tunnels largely to yourselves. Take the JR train to Inari Station.",
          es: "Lleguen antes de las 7:30 AM para adelantarse a los grupos turísticos y tener los túneles de torii casi para ustedes solos. Tomen el tren JR hasta la estación de Inari.",
        },
      },
      {
        time: "11:00",
        name: { en: "Kiyomizu-dera Temple", es: "Templo Kiyomizu-dera" },
        location: { en: "Kiyomizu-dera, Kyoto", es: "Kiyomizu-dera, Kioto" },
        lat: 34.9948,
        lng: 135.785,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Bus or taxi from Inari over to Kiyomizu-dera — famous for its wooden stage jutting out over the hillside.",
          es: "Bus o taxi desde Inari hasta Kiyomizu-dera — famoso por su plataforma de madera que sobresale sobre la ladera.",
        },
      },
      {
        time: "14:00",
        name: { en: "Sannenzaka & Ninenzaka streets, Higashiyama", es: "Calles Sannenzaka y Ninenzaka, Higashiyama" },
        location: { en: "Sannenzaka, Kyoto", es: "Sannenzaka, Kioto" },
        lat: 34.9959,
        lng: 135.7802,
        category: "shopping",
        reservation: false,
        tip: {
          en: "Preserved sloped streets lined with traditional shops and teahouses — an easy walk down from Kiyomizu-dera.",
          es: "Calles empedradas y en pendiente llenas de tiendas y casas de té tradicionales — a un paseo fácil bajando desde Kiyomizu-dera.",
        },
      },
    ],
  },
  {
    day: 14,
    date: "2026-11-18",
    city: { en: "Kyoto", es: "Kioto" },
    title: { en: "West: Arashiyama", es: "Oeste: Arashiyama" },
    summary: {
      en: "Bamboo, a riverside temple, and the option to explore by bike.",
      es: "Bambú, un templo junto al río, y la opción de explorar en bicicleta.",
    },
    tips: [
      { en: "You can rent a bicycle in Arashiyama to cover more ground.", es: "Pueden rentar una bicicleta en Arashiyama para recorrer más terreno." },
    ],
    activities: [
      {
        time: "08:00",
        name: { en: "Arashiyama Bamboo Grove & Tenryu-ji Temple", es: "Bosque de Bambú de Arashiyama y Templo Tenryu-ji" },
        location: { en: "Arashiyama Bamboo Grove, Kyoto", es: "Bosque de Bambú de Arashiyama, Kioto" },
        lat: 35.017,
        lng: 135.672,
        category: "nature",
        reservation: false,
        tip: {
          en: "Take the JR Sagano line to Saga-Arashiyama. Go early — the grove gets very crowded by mid-morning.",
          es: "Tomen la línea JR Sagano hasta Saga-Arashiyama. Vayan temprano — el bosque se llena mucho a media mañana.",
        },
      },
      {
        time: "13:00",
        name: { en: "Togetsukyo Bridge", es: "Puente Togetsukyo" },
        location: { en: "Togetsukyo Bridge, Arashiyama", es: "Puente Togetsukyo, Arashiyama" },
        lat: 35.0094,
        lng: 135.6779,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "A relaxed riverside spot to finish the morning — nice for a slow lunch nearby.",
          es: "Un lugar relajado junto al río para terminar la mañana — bueno para un almuerzo tranquilo cerca.",
        },
      },
    ],
  },
  {
    day: 15,
    date: "2026-11-19",
    city: { en: "Kyoto", es: "Kioto" },
    title: { en: "North: Kurama & Kibune", es: "Norte: Kurama y Kibune" },
    summary: {
      en: "A light, traditional hiking day connecting mountain temples north of the city.",
      es: "Un día de caminata ligera y tradicional que conecta templos de montaña al norte de la ciudad.",
    },
    tips: [],
    activities: [
      {
        time: "09:00",
        name: { en: "Day trip to Kurama & Kibune", es: "Excursión a Kurama y Kibune" },
        location: { en: "Kurama-dera, Kyoto", es: "Kurama-dera, Kioto" },
        lat: 35.1191,
        lng: 135.7724,
        category: "nature",
        reservation: false,
        duration: { en: "Full day", es: "Día completo" },
        tip: { en: "Take the Eizan train from Demachiyanagi Station.", es: "Tomen el tren Eizan desde la estación de Demachiyanagi." },
      },
      {
        time: "13:00",
        name: { en: "Temple-to-temple hiking trail", es: "Sendero de caminata entre templos" },
        location: { en: "Kibune, Kyoto", es: "Kibune, Kioto" },
        lat: 35.1225,
        lng: 135.7639,
        category: "nature",
        reservation: false,
        tip: {
          en: "A light, scenic hiking route connecting Kurama and Kibune through the forest — a nice change of pace from the city.",
          es: "Una ruta de caminata ligera y escénica que conecta Kurama y Kibune por el bosque — un buen cambio de ritmo respecto a la ciudad.",
        },
      },
    ],
  },
  {
    day: 16,
    date: "2026-11-20",
    city: { en: "Osaka", es: "Osaka" },
    title: { en: "Nara day trip, then on to Osaka", es: "Excursión a Nara, y luego a Osaka" },
    summary: { en: "Deer, temples, and a change of base to Osaka.", es: "Ciervos, templos, y un cambio de base a Osaka." },
    tips: [],
    activities: [
      {
        time: "08:00",
        name: {
          en: "Nara day trip: Todai-ji Temple, Deer Park, Kasuga Taisha",
          es: "Excursión a Nara: Templo Todai-ji, Parque de los Ciervos, Kasuga Taisha",
        },
        location: { en: "Nara Park, Nara", es: "Parque de Nara, Nara" },
        lat: 34.6851,
        lng: 135.843,
        category: "sightseeing",
        reservation: false,
        duration: { en: "Half day", es: "Medio día" },
        tip: {
          en: "Nara is fully walkable once you're there. Take the JR Nara line. Send bulky luggage ahead to Osaka if needed.",
          es: "Nara se recorre caminando una vez ahí. Tomen la línea JR Nara. Envíen el equipaje grande a Osaka si hace falta.",
        },
      },
      {
        time: "16:00",
        name: { en: "Arrive in Osaka & check in", es: "Llegada a Osaka y registro" },
        location: { en: "Namba, Osaka", es: "Namba, Osaka" },
        lat: 34.6667,
        lng: 135.5008,
        category: "lodging",
        reservation: true,
        tip: {
          en: "EXAMPLE — replace with your actual hotel booking details.",
          es: "EJEMPLO — reemplacen con los datos reales de la reserva del hotel.",
        },
      },
    ],
  },
  {
    day: 17,
    date: "2026-11-21",
    city: { en: "Osaka", es: "Osaka" },
    title: { en: "Osaka Castle & Dotonbori", es: "Castillo de Osaka y Dotonbori" },
    summary: { en: "History by day, neon and street food by night.", es: "Historia de día, neón y comida callejera de noche." },
    tips: [],
    activities: [
      {
        time: "09:30",
        name: { en: "Osaka Castle & Shinsekai", es: "Castillo de Osaka y Shinsekai" },
        location: { en: "Osaka Castle, Osaka", es: "Castillo de Osaka, Osaka" },
        lat: 34.6873,
        lng: 135.5259,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "The Midosuji subway line connects Osaka Castle and Shinsekai easily.",
          es: "La línea de metro Midosuji conecta fácilmente el Castillo de Osaka y Shinsekai.",
        },
      },
      {
        time: "19:00",
        name: { en: "Dotonbori at night", es: "Dotonbori de noche" },
        location: { en: "Dotonbori, Osaka", es: "Dotonbori, Osaka" },
        lat: 34.6687,
        lng: 135.5013,
        category: "nightlife",
        reservation: false,
        tip: {
          en: "Try takoyaki and okonomiyaki from the street stalls, and get the classic photo at the Glico running-man sign.",
          es: "Prueben takoyaki y okonomiyaki en los puestos callejeros, y tómense la clásica foto con el cartel del corredor Glico.",
        },
      },
    ],
  },
  {
    day: 18,
    date: "2026-11-22",
    city: { en: "Osaka", es: "Osaka" },
    title: { en: "Universal Studios Japan", es: "Universal Studios Japan" },
    summary: {
      en: "A full day at the park, built around Super Nintendo World.",
      es: "Un día completo en el parque, centrado en Super Nintendo World.",
    },
    tips: [],
    activities: [
      {
        time: "09:00",
        name: { en: "Universal Studios Japan (Super Nintendo World)", es: "Universal Studios Japan (Super Nintendo World)" },
        location: { en: "Universal Studios Japan, Osaka", es: "Universal Studios Japan, Osaka" },
        lat: 34.6657,
        lng: 135.4323,
        category: "activity",
        reservation: true,
        duration: { en: "Full day", es: "Día completo" },
        tip: {
          en: "Buy park tickets and an Express Pass well in advance — Super Nintendo World's timed entry and the popular rides sell out on peak days. Take the JR Yumesaki line to Universal City.",
          es: "Compren las entradas al parque y un Express Pass con bastante anticipación — el acceso programado a Super Nintendo World y las atracciones populares se agotan en días de alta demanda. Tomen la línea JR Yumesaki hasta Universal City.",
        },
      },
    ],
  },
  {
    day: 19,
    date: "2026-11-23",
    city: { en: "Hiroshima", es: "Hiroshima" },
    title: { en: "Travel day: Hiroshima", es: "Día de viaje: Hiroshima" },
    summary: {
      en: "Transfer to Hiroshima for an afternoon at the Peace Memorial Park.",
      es: "Traslado a Hiroshima para una tarde en el Parque Conmemorativo de la Paz.",
    },
    tips: [],
    activities: [
      {
        time: "09:00",
        name: { en: "Travel to Hiroshima", es: "Viaje a Hiroshima" },
        location: { en: "Hiroshima Station, Hiroshima", es: "Estación de Hiroshima, Hiroshima" },
        lat: 34.3978,
        lng: 132.4753,
        category: "transport",
        reservation: false,
        duration: { en: "~1.5 hr", es: "~1.5 h" },
        tip: { en: "Shinkansen from Shin-Osaka — about 1.5 hours.", es: "Shinkansen desde Shin-Osaka — aproximadamente 1.5 horas." },
      },
      {
        time: "13:00",
        name: {
          en: "Peace Memorial Park & Museum, Atomic Bomb Dome",
          es: "Parque y Museo Conmemorativo de la Paz, Cúpula de la Bomba Atómica",
        },
        location: { en: "Hiroshima Peace Memorial Park, Hiroshima", es: "Parque Conmemorativo de la Paz, Hiroshima" },
        lat: 34.3955,
        lng: 132.4536,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: "Give yourselves at least 2-3 unhurried hours here — it's a moving visit, not one to rush.",
          es: "Dense al menos 2-3 horas sin apuro aquí — es una visita conmovedora, no una para apurar.",
        },
      },
    ],
  },
  {
    day: 20,
    date: "2026-11-24",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Miyajima, then back to Tokyo", es: "Miyajima, y de vuelta a Tokio" },
    summary: {
      en: "A morning on Miyajima Island, then the long trip back to Tokyo for the final night.",
      es: "Una mañana en la isla de Miyajima, y luego el largo viaje de vuelta a Tokio para la última noche.",
    },
    tips: [],
    activities: [
      {
        time: "08:00",
        name: {
          en: "Miyajima Island: floating torii gate & Itsukushima Shrine",
          es: "Isla de Miyajima: torii flotante y santuario Itsukushima",
        },
        location: { en: "Itsukushima Shrine, Miyajima", es: "Santuario Itsukushima, Miyajima" },
        lat: 34.296,
        lng: 132.3197,
        category: "sightseeing",
        reservation: false,
        tip: {
          en: 'Take the ferry over to Miyajima — check tide times beforehand, since the famous torii gate only appears to "float" at high tide.',
          es: "Tomen el ferry hasta Miyajima — revisen antes los horarios de marea, ya que el famoso torii solo parece \"flotar\" en marea alta.",
        },
      },
      {
        time: "13:00",
        name: { en: "Return to Tokyo", es: "Regreso a Tokio" },
        location: { en: "Tokyo", es: "Tokio" },
        lat: 35.6812,
        lng: 139.7671,
        category: "transport",
        reservation: false,
        duration: { en: "~4 hr", es: "~4 h" },
        tip: {
          en: "Shinkansen from Hiroshima back to Tokyo — a long travel day, so keep the Miyajima morning relaxed and unrushed.",
          es: "Shinkansen de Hiroshima de vuelta a Tokio — un día largo de viaje, así que mantengan la mañana en Miyajima relajada y sin apuro.",
        },
      },
      {
        time: "18:00",
        name: { en: "Check in — Tokyo hotel (near JR station)", es: "Registro — hotel en Tokio (cerca de estación JR)" },
        location: { en: "Tokyo", es: "Tokio" },
        lat: 35.6812,
        lng: 139.7671,
        category: "lodging",
        reservation: true,
        tip: {
          en: "EXAMPLE — replace with your actual hotel booking details.",
          es: "EJEMPLO — reemplacen con los datos reales de la reserva del hotel.",
        },
      },
    ],
  },
  {
    day: 21,
    date: "2026-11-25",
    city: { en: "Tokyo", es: "Tokio" },
    title: { en: "Departure", es: "Salida" },
    summary: {
      en: "Last-minute shopping, then pack up and head to the airport.",
      es: "Compras de último momento, y luego empacar y salir hacia el aeropuerto.",
    },
    tips: [
      {
        en: "Ship bulky souvenirs home ahead of time if you're low on luggage space (post office or Takkyubin).",
        es: "Envíen a casa los recuerdos voluminosos con anticipación si les falta espacio en la maleta (correo o Takkyubin).",
      },
    ],
    activities: [
      {
        time: "10:00",
        name: { en: "Last-minute shopping", es: "Compras de último momento" },
        location: { en: "Ginza, Tokyo", es: "Ginza, Tokio" },
        lat: 35.6716,
        lng: 139.7649,
        category: "shopping",
        reservation: false,
        tip: {
          en: "Ginza or Shinjuku both work well for a final souvenir run close to the station.",
          es: "Ginza o Shinjuku funcionan bien para una última vuelta de recuerdos cerca de la estación.",
        },
      },
      {
        time: "14:00",
        name: { en: "Pack & transfer to the airport", es: "Empacar y traslado al aeropuerto" },
        location: { en: "Narita/Haneda Airport, Tokyo", es: "Aeropuerto de Narita/Haneda, Tokio" },
        lat: 35.7647,
        lng: 140.3864,
        category: "transport",
        reservation: false,
        tip: {
          en: "Double-check your terminal and flight time before heading out. Take the N'EX or Skyliner to the airport.",
          es: "Confirmen la terminal y el horario del vuelo antes de salir. Tomen el N'EX o el Skyliner hasta el aeropuerto.",
        },
      },
    ],
  },
];
