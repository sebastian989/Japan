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
 *
 * Times marked as estimates below come from a source itinerary that only
 * specified "morning" / "afternoon" blocks, not exact hours — adjust freely
 * once you lock in specific reservations or train times.
 */

const TRIP = {
  title: "Japan Trip",
  subtitle: "Our itinerary, day by day",
  startDate: "2026-11-05",
  endDate: "2026-11-25",
  travelers: ["You", "Your friend"],
  heroTip:
    "Tokyo → Hakone → Takayama → Shirakawa-go → Kanazawa → Kyoto → Nara → Osaka → Hiroshima → Miyajima → Tokyo. Edit assets/data/itinerary.js to keep refining it.",
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
    title: "Weigh the Japan Rail Pass against a regional pass",
    body:
      "This trip covers Tokyo, Hakone, Takayama, Kanazawa, Kyoto, Osaka and Hiroshima — a lot of long-distance Shinkansen legs, so a JR Pass (or the JR West/Takayama-Hokuriku regional pass covering Nagoya–Takayama–Kanazawa–Kyoto–Osaka) may well pay for itself. Compare the exact route cost before buying.",
  },
  {
    title: "Book the big-ticket items well ahead",
    body:
      "Shibuya Sky, teamLab Planets, Universal Studios Japan (especially Super Nintendo World timed entry), and the Nohi highway bus to Shirakawa-go all sell out — book these as soon as dates are fixed, ideally 2-4 weeks ahead.",
  },
  {
    title: "Use Takkyubin to forward your luggage",
    body:
      "You'll change hotels often (Tokyo → Hakone → Takayama → Kanazawa → Kyoto → Osaka → Hiroshima → Tokyo). Send bulky suitcases ahead via Takkyubin (e.g. from Tokyo to Takayama or Kyoto) and travel the trickier legs — especially the Hakone ropeway/boat day — with just a light bag.",
  },
  {
    title: "Carry cash",
    body:
      "Japan is more card-friendly than it used to be, but small shops, shrines, ryokan, and rural areas (Shirakawa-go, Takayama's markets) may be cash-only. Withdraw yen from 7-Eleven ATMs — they reliably accept foreign cards.",
  },
  {
    title: "Pack for the weather",
    body:
      "Nov 5-25 is deep autumn: mild days in Tokyo/Osaka/Hiroshima (~14-19°C / 57-66°F) but noticeably colder mornings and nights in Hakone, Takayama and Kanazawa (~2-8°C / 36-46°F). Layers, a warm jacket for the mountain stops, and a compact umbrella.",
  },
  {
    title: "Early starts pay off at the popular sights",
    body:
      "Fushimi Inari (before 7:30 AM) and Arashiyama Bamboo Grove are dramatically quieter first thing in the morning — build in an early alarm on those specific days rather than everywhere.",
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
    title: "Arrival",
    summary:
      "Landing day — clear immigration, get to the hotel in Asakusa/Ueno, and ease into the trip with a relaxed evening walk.",
    tips: ["Pick up your JR Pass (if applicable) and a pocket wifi/SIM at the airport before heading into the city."],
    activities: [
      {
        time: "13:00",
        name: "Arrival & transfer to hotel",
        location: "Narita/Haneda Airport, Tokyo",
        category: "transport",
        reservation: false,
        tip: "Take the Narita Express (N'EX) or Keisei Skyliner into the city, then local metro to the hotel.",
      },
      {
        time: "17:00",
        name: "Check in — hotel in Asakusa/Ueno",
        location: "Asakusa, Tokyo",
        category: "lodging",
        reservation: true,
        tip: "EXAMPLE — replace with your actual hotel name and confirmation number once booked.",
      },
      {
        time: "19:00",
        name: "Evening walk: Asakusa & Senso-ji by night",
        location: "Senso-ji Temple, Asakusa",
        category: "sightseeing",
        reservation: false,
        tip: "Senso-ji and the Nakamise shopping street are beautifully lit and far less crowded at night. Cap it off with a look at Tokyo Skytree from outside.",
      },
    ],
  },
  {
    day: 2,
    date: "2026-11-06",
    city: "Tokyo",
    title: "Ueno & Yanaka",
    summary: "A gentle adjustment day in neighborhoods that sit close together, so there's not much transit involved.",
    tips: ["Good day to recover from jet lag — Ueno and Yanaka are an easy walk/short metro ride apart."],
    activities: [
      {
        time: "09:30",
        name: "Ueno Park & Ameyoko Market",
        location: "Ueno Park, Tokyo",
        category: "sightseeing",
        reservation: false,
        tip: "Ameyoko is a lively old market street just south of Ueno Station — good for street food and browsing.",
      },
      {
        time: "14:00",
        name: "Yanaka Ginza (old town neighborhood)",
        location: "Yanaka Ginza, Tokyo",
        category: "sightseeing",
        reservation: false,
        tip: "One of the few Tokyo neighborhoods that survived WWII largely intact — an old-fashioned shopping street, cats, and traditional shops. Reachable on foot or by local metro (Ginza/Yamanote line).",
      },
    ],
  },
  {
    day: 3,
    date: "2026-11-07",
    city: "Tokyo",
    title: "Harajuku & Shibuya",
    summary: "Youth culture and one of Tokyo's best sunset views.",
    tips: [],
    activities: [
      {
        time: "09:30",
        name: "Meiji Jingu Shrine & Harajuku (Takeshita Street)",
        location: "Meiji Jingu Shrine, Harajuku",
        category: "sightseeing",
        reservation: false,
        tip: "Take the JR Yamanote line (Ueno → Harajuku → Shibuya) to link today's stops.",
      },
      {
        time: "15:00",
        name: "Shibuya Crossing, Hachiko statue & Shibuya Sky at sunset",
        location: "Shibuya Sky, Shibuya",
        category: "sightseeing",
        reservation: true,
        tip: "Book Shibuya Sky several weeks in advance — sunset time slots are the first to sell out.",
      },
    ],
  },
  {
    day: 4,
    date: "2026-11-08",
    city: "Tokyo",
    title: "Ikebukuro & Akihabara",
    summary: "A pop-culture and electronics day.",
    tips: ["The best day on the trip for anime/video game shopping."],
    activities: [
      {
        time: "09:30",
        name: "Ikebukuro: Sunshine City & Pokémon Center",
        location: "Sunshine City, Ikebukuro",
        category: "shopping",
        reservation: false,
        tip: "The JR Yamanote line connects Ikebukuro and Akihabara.",
      },
      {
        time: "14:00",
        name: "Akihabara: Mandarake & electronics stores",
        location: "Akihabara, Tokyo",
        category: "shopping",
        reservation: false,
        tip: "Mandarake is a multi-floor treasure hunt for manga, figures and retro games.",
      },
    ],
  },
  {
    day: 5,
    date: "2026-11-09",
    city: "Tokyo",
    title: "Nikko day trip",
    summary: "A full-day excursion out to the shrines of Nikko.",
    tips: ["Leave early to make the most of the day — Nikko is roughly 2 hours from Tokyo."],
    activities: [
      {
        time: "07:00",
        name: "Day trip to Nikko: Toshogu Shrine",
        location: "Toshogu Shrine, Nikko",
        category: "sightseeing",
        reservation: false,
        duration: "Full day",
        tip: "Take the Tobu train from Asakusa, or JR Shinkansen plus a local line. Toshogu is Japan's most lavishly decorated shrine complex.",
      },
      {
        time: "13:00",
        name: "Shinkyo Bridge",
        location: "Shinkyo Bridge, Nikko",
        category: "sightseeing",
        reservation: false,
        tip: "The bright red sacred bridge at the entrance to Nikko's shrine district — a quick, scenic stop.",
      },
    ],
  },
  {
    day: 6,
    date: "2026-11-10",
    city: "Tokyo",
    title: "Tokyo Bay: teamLab & Odaiba",
    summary: "Digital art and the waterfront, last full day based in Tokyo.",
    tips: [],
    activities: [
      {
        time: "09:30",
        name: "teamLab Planets",
        location: "teamLab Planets, Tokyo",
        category: "activity",
        reservation: true,
        tip: "Book ahead — timed-entry tickets sell out, especially on weekends. You'll walk through water, so shorts/roll-up trousers help.",
      },
      {
        time: "14:00",
        name: "Gundam Statue & Odaiba",
        location: "Odaiba, Tokyo",
        category: "sightseeing",
        reservation: false,
        tip: "Take the metro plus the Yurikamome monorail out to Odaiba — the elevated monorail ride itself has great bay views.",
      },
    ],
  },
  {
    day: 7,
    date: "2026-11-11",
    city: "Hakone",
    title: "Classic Hakone loop",
    summary: "Change of base to a ryokan with an onsen — the classic Hakone loop by boat and ropeway.",
    tips: [
      "Send your big suitcase ahead to Kyoto or Takayama via Takkyubin before you leave Tokyo, and travel to Hakone with just a light bag — it makes the ropeway/boat transfers much easier.",
    ],
    activities: [
      {
        time: "09:00",
        name: "Depart Tokyo for Hakone",
        location: "Odawara Station, Hakone",
        category: "transport",
        reservation: false,
        tip: "Take the Romancecar direct from Shinjuku, or a Shinkansen to Odawara — then use the Hakone Free Pass to cover the rest of today's loop.",
      },
      {
        time: "11:30",
        name: "Lake Ashi pirate ship cruise",
        location: "Lake Ashi, Hakone",
        category: "sightseeing",
        reservation: false,
        tip: "On a clear day you can see Mt. Fuji from the water.",
      },
      {
        time: "14:30",
        name: "Owakudani ropeway & volcanic valley",
        location: "Owakudani, Hakone",
        category: "nature",
        reservation: false,
        tip: "Try a kuro-tamago (black egg), boiled in the sulphuric hot springs — legend says eating one adds seven years to your life.",
      },
      {
        time: "18:00",
        name: "Check in — ryokan with onsen",
        location: "Hakone",
        category: "lodging",
        reservation: true,
        tip: "EXAMPLE — replace with your actual ryokan name and booking details.",
      },
    ],
  },
  {
    day: 8,
    date: "2026-11-12",
    city: "Takayama",
    title: "Travel day: on to Takayama",
    summary: "Transfer from Hakone to Takayama, then a first wander through the old town.",
    tips: [],
    activities: [
      {
        time: "09:00",
        name: "Travel to Takayama",
        location: "Takayama Station, Takayama",
        category: "transport",
        reservation: false,
        duration: "~4-5 hr",
        tip: "Shinkansen (Odawara → Nagoya) then the Hida Express (Nagoya → Takayama) — the Hida Express leg is famously scenic, running along a river gorge.",
      },
      {
        time: "15:00",
        name: "Historic old town walk: Sanmachi Suji",
        location: "Sanmachi Suji, Takayama",
        category: "sightseeing",
        reservation: false,
        tip: "Look for sake breweries marked by a ball of cedar leaves (sugidama) hanging over the doorway — most offer a cheap self-guided tasting flight of local varieties.",
      },
    ],
  },
  {
    day: 9,
    date: "2026-11-13",
    city: "Takayama",
    title: "Markets, temples & Hida beef",
    summary: "A full day in Takayama: riverside morning market, an Edo-era government house, and the region's famous beef.",
    tips: [],
    activities: [
      {
        time: "07:30",
        name: "Miyagawa morning market & Higashiyama temple walk",
        location: "Miyagawa Morning Market, Takayama",
        category: "sightseeing",
        reservation: false,
        tip: "Farmers and artisans set up along the river — a great spot to pick up a Sarubobo, the faceless red good-luck charm. The Higashiyama Walking Course nearby links a dozen-plus temples through a quiet wooded path; the red Nakabashi Bridge close to the market is also worth a photo.",
      },
      {
        time: "14:00",
        name: "Takayama Jinya",
        location: "Takayama Jinya, Takayama",
        category: "sightseeing",
        reservation: false,
        tip: "The only surviving shogunate government building left in Japan — tatami halls, administrative offices, and a huge 17th-century rice storehouse.",
      },
      {
        time: "19:00",
        name: "Dinner: Hida beef",
        location: "Sanmachi Suji, Takayama",
        category: "food",
        reservation: false,
        tip: "Hida-gyu is some of Japan's finest wagyu — try it grilled on skewers (kushiyaki), as lightly seared sushi on a rice cracker, or as Hoba Miso (cooked on a magnolia leaf). Also worth trying: Takayama ramen (chuka soba), a light soy-chicken broth with thin, curly noodles.",
      },
    ],
  },
  {
    day: 10,
    date: "2026-11-14",
    city: "Kanazawa",
    title: "Shirakawa-go & on to Kanazawa",
    summary: "A scenic stop in the thatched-roof village of Shirakawa-go on the way to Kanazawa.",
    tips: [],
    activities: [
      {
        time: "08:30",
        name: "Nohi highway bus to Shirakawa-go",
        location: "Shirakawa-go",
        category: "transport",
        reservation: true,
        duration: "~3-4 hr stop",
        tip: "Book the Nohi bus online well in advance — seats sell out, especially in autumn. Get off in Shirakawa-go to walk among the gassho-zukuri thatched-roof farmhouses and have lunch before continuing.",
      },
      {
        time: "14:00",
        name: "Transfer to Kanazawa",
        location: "Kanazawa",
        category: "transport",
        reservation: false,
        tip: "Continue on the next Nohi bus from Shirakawa-go to Kanazawa.",
      },
    ],
  },
  {
    day: 11,
    date: "2026-11-15",
    city: "Kanazawa",
    title: "Gardens & samurai district",
    summary: "One of Japan's most beautiful gardens, plus the old samurai and geisha quarters.",
    tips: ["The Loop Bus covers all of today's stops easily."],
    activities: [
      {
        time: "09:00",
        name: "Kenrokuen Garden & Kanazawa Castle",
        location: "Kenrokuen Garden, Kanazawa",
        category: "sightseeing",
        reservation: false,
        tip: "Considered one of Japan's three most beautiful gardens — go early for the best light and fewer crowds.",
      },
      {
        time: "14:00",
        name: "Samurai district (Nagamachi) & geisha district (Higashi Chaya)",
        location: "Higashi Chaya District, Kanazawa",
        category: "sightseeing",
        reservation: false,
        tip: "Higashi Chaya's teahouse-lined streets are especially atmospheric in the late-afternoon light.",
      },
    ],
  },
  {
    day: 12,
    date: "2026-11-16",
    city: "Kyoto",
    title: "Travel day: on to Kyoto",
    summary: "Transfer to Kyoto, check in, then an evening in Gion.",
    tips: [],
    activities: [
      {
        time: "10:00",
        name: "Travel to Kyoto",
        location: "Kyoto Station, Kyoto",
        category: "transport",
        reservation: false,
        tip: "Thunderbird limited express train from Kanazawa to Kyoto.",
      },
      {
        time: "15:00",
        name: "Check in — Kyoto hotel (central/station area)",
        location: "Kyoto Station area, Kyoto",
        category: "lodging",
        reservation: true,
        tip: "EXAMPLE — replace with your actual hotel booking details.",
      },
      {
        time: "18:00",
        name: "Gion, Yasaka Shrine & Pontocho",
        location: "Gion, Kyoto",
        category: "sightseeing",
        reservation: false,
        tip: "Gion is at its best at dusk and into the evening, when the lanterns come on — also your best chance of spotting a geiko or maiko on their way to an appointment.",
      },
    ],
  },
  {
    day: 13,
    date: "2026-11-17",
    city: "Kyoto",
    title: "South & East: Fushimi Inari & Higashiyama",
    summary: "An early start for Fushimi Inari, then the temples and old streets of eastern Kyoto.",
    tips: [],
    activities: [
      {
        time: "07:00",
        name: "Fushimi Inari Taisha",
        location: "Fushimi Inari Taisha, Kyoto",
        category: "sightseeing",
        reservation: false,
        tip: "Arrive before 7:30 AM to beat the tour groups and get the torii-gate tunnels largely to yourselves. Take the JR train to Inari Station.",
      },
      {
        time: "11:00",
        name: "Kiyomizu-dera Temple",
        location: "Kiyomizu-dera, Kyoto",
        category: "sightseeing",
        reservation: false,
        tip: "Bus or taxi from Inari over to Kiyomizu-dera — famous for its wooden stage jutting out over the hillside.",
      },
      {
        time: "14:00",
        name: "Sannenzaka & Ninenzaka streets, Higashiyama",
        location: "Sannenzaka, Kyoto",
        category: "shopping",
        reservation: false,
        tip: "Preserved sloped streets lined with traditional shops and teahouses — an easy walk down from Kiyomizu-dera.",
      },
    ],
  },
  {
    day: 14,
    date: "2026-11-18",
    city: "Kyoto",
    title: "West: Arashiyama",
    summary: "Bamboo, a riverside temple, and the option to explore by bike.",
    tips: ["You can rent a bicycle in Arashiyama to cover more ground."],
    activities: [
      {
        time: "08:00",
        name: "Arashiyama Bamboo Grove & Tenryu-ji Temple",
        location: "Arashiyama Bamboo Grove, Kyoto",
        category: "nature",
        reservation: false,
        tip: "Take the JR Sagano line to Saga-Arashiyama. Go early — the grove gets very crowded by mid-morning.",
      },
      {
        time: "13:00",
        name: "Togetsukyo Bridge",
        location: "Togetsukyo Bridge, Arashiyama",
        category: "sightseeing",
        reservation: false,
        tip: "A relaxed riverside spot to finish the morning — nice for a slow lunch nearby.",
      },
    ],
  },
  {
    day: 15,
    date: "2026-11-19",
    city: "Kyoto",
    title: "North: Kurama & Kibune",
    summary: "A light, traditional hiking day connecting mountain temples north of the city.",
    tips: [],
    activities: [
      {
        time: "09:00",
        name: "Day trip to Kurama & Kibune",
        location: "Kurama-dera, Kyoto",
        category: "nature",
        reservation: false,
        duration: "Full day",
        tip: "Take the Eizan train from Demachiyanagi Station.",
      },
      {
        time: "13:00",
        name: "Temple-to-temple hiking trail",
        location: "Kibune, Kyoto",
        category: "nature",
        reservation: false,
        tip: "A light, scenic hiking route connecting Kurama and Kibune through the forest — a nice change of pace from the city.",
      },
    ],
  },
  {
    day: 16,
    date: "2026-11-20",
    city: "Osaka",
    title: "Nara day trip, then on to Osaka",
    summary: "Deer, temples, and a change of base to Osaka.",
    tips: [],
    activities: [
      {
        time: "08:00",
        name: "Nara day trip: Todai-ji Temple, Deer Park, Kasuga Taisha",
        location: "Nara Park, Nara",
        category: "sightseeing",
        reservation: false,
        duration: "Half day",
        tip: "Nara is fully walkable once you're there. Take the JR Nara line. Send bulky luggage ahead to Osaka if needed.",
      },
      {
        time: "16:00",
        name: "Arrive in Osaka & check in",
        location: "Namba, Osaka",
        category: "lodging",
        reservation: true,
        tip: "EXAMPLE — replace with your actual hotel booking details.",
      },
    ],
  },
  {
    day: 17,
    date: "2026-11-21",
    city: "Osaka",
    title: "Osaka Castle & Dotonbori",
    summary: "History by day, neon and street food by night.",
    tips: [],
    activities: [
      {
        time: "09:30",
        name: "Osaka Castle & Shinsekai",
        location: "Osaka Castle, Osaka",
        category: "sightseeing",
        reservation: false,
        tip: "The Midosuji subway line connects Osaka Castle and Shinsekai easily.",
      },
      {
        time: "19:00",
        name: "Dotonbori at night",
        location: "Dotonbori, Osaka",
        category: "nightlife",
        reservation: false,
        tip: "Try takoyaki and okonomiyaki from the street stalls, and get the classic photo at the Glico running-man sign.",
      },
    ],
  },
  {
    day: 18,
    date: "2026-11-22",
    city: "Osaka",
    title: "Universal Studios Japan",
    summary: "A full day at the park, built around Super Nintendo World.",
    tips: [],
    activities: [
      {
        time: "09:00",
        name: "Universal Studios Japan (Super Nintendo World)",
        location: "Universal Studios Japan, Osaka",
        category: "activity",
        reservation: true,
        duration: "Full day",
        tip: "Buy park tickets and an Express Pass well in advance — Super Nintendo World's timed entry and the popular rides sell out on peak days. Take the JR Yumesaki line to Universal City.",
      },
    ],
  },
  {
    day: 19,
    date: "2026-11-23",
    city: "Hiroshima",
    title: "Travel day: Hiroshima",
    summary: "Transfer to Hiroshima for an afternoon at the Peace Memorial Park.",
    tips: [],
    activities: [
      {
        time: "09:00",
        name: "Travel to Hiroshima",
        location: "Hiroshima Station, Hiroshima",
        category: "transport",
        reservation: false,
        duration: "~1.5 hr",
        tip: "Shinkansen from Shin-Osaka — about 1.5 hours.",
      },
      {
        time: "13:00",
        name: "Peace Memorial Park & Museum, Atomic Bomb Dome",
        location: "Hiroshima Peace Memorial Park, Hiroshima",
        category: "sightseeing",
        reservation: false,
        tip: "Give yourselves at least 2-3 unhurried hours here — it's a moving visit, not one to rush.",
      },
    ],
  },
  {
    day: 20,
    date: "2026-11-24",
    city: "Tokyo",
    title: "Miyajima, then back to Tokyo",
    summary: "A morning on Miyajima Island, then the long trip back to Tokyo for the final night.",
    tips: [],
    activities: [
      {
        time: "08:00",
        name: "Miyajima Island: floating torii gate & Itsukushima Shrine",
        location: "Itsukushima Shrine, Miyajima",
        category: "sightseeing",
        reservation: false,
        tip: "Take the ferry over to Miyajima — check tide times beforehand, since the famous torii gate only appears to \"float\" at high tide.",
      },
      {
        time: "13:00",
        name: "Return to Tokyo",
        location: "Tokyo",
        category: "transport",
        reservation: false,
        duration: "~4 hr",
        tip: "Shinkansen from Hiroshima back to Tokyo — a long travel day, so keep the Miyajima morning relaxed and unrushed.",
      },
      {
        time: "18:00",
        name: "Check in — Tokyo hotel (near JR station)",
        location: "Tokyo",
        category: "lodging",
        reservation: true,
        tip: "EXAMPLE — replace with your actual hotel booking details.",
      },
    ],
  },
  {
    day: 21,
    date: "2026-11-25",
    city: "Tokyo",
    title: "Departure",
    summary: "Last-minute shopping, then pack up and head to the airport.",
    tips: ["Ship bulky souvenirs home ahead of time if you're low on luggage space (post office or Takkyubin)."],
    activities: [
      {
        time: "10:00",
        name: "Last-minute shopping",
        location: "Ginza, Tokyo",
        category: "shopping",
        reservation: false,
        tip: "Ginza or Shinjuku both work well for a final souvenir run close to the station.",
      },
      {
        time: "14:00",
        name: "Pack & transfer to the airport",
        location: "Narita/Haneda Airport, Tokyo",
        category: "transport",
        reservation: false,
        tip: "Double-check your terminal and flight time before heading out. Take the N'EX or Skyliner to the airport.",
      },
    ],
  },
];
