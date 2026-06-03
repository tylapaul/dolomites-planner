export const TRIP_INFO = {
  title: 'Dolomitų Alpių Ekspedicija',
  subtitle: '4 keliautojų grupė · Birželis 2025',
  dates: { start: '2025-06-14', end: '2025-06-20' },
  group: 4,
};

export const FLIGHTS = {
  outbound: {
    date: '06.14 (Sekmadienis)',
    time: '13:55',
    airport: 'Trevizo (TSF)',
    note: 'Atvykimas',
  },
  return: {
    date: '06.18 (Ketvirtadienis)',
    time: '20:40',
    airport: 'Trevizo (TSF)',
    passengers: 2,
    note: '2 asmenys skrenda atgal',
  },
  venice: {
    dates: '06.18–06.20',
    passengers: 2,
    meetingPoint: 'Venezia Mestre stotis',
    note: '2 asmenys lieka Venecijoje',
  },
};

export const NIGHT_ONE = {
  id: 'roncade',
  name: 'Castello di Roncade',
  emoji: '🏰',
  dates: '06.14–06.15',
  coords: { lat: 45.6276, lng: 12.3766 },
  fixed: true,
  description: 'Istorinė pilis vynuogynų apsuptyje, netoli Trevizo oro uosto',
  distance_from_tsf: '~25 min. nuo TSF',
};

export const TOWNS = [
  {
    id: 'cortina',
    name: "Cortina d'Ampezzo",
    coords: { lat: 46.5362, lng: 12.1355 },
    tag: 'Dolomitų sostinė',
    pros: 'Geriausias infrastruktūros centras, artumas POI',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Cortina+d%27Ampezzo&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1&order=popularity',
    distanceScore: 5,
    bestDays: 'Birž. 16 / 17 d.',
  },
  {
    id: 'misurina',
    name: 'Misurina',
    coords: { lat: 46.5828, lng: 12.2547 },
    tag: 'Prie pat Tre Cime',
    pros: 'Arčiausias taškas iki Tre Cime ir Lago di Sorapis',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Misurina&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 5,
    bestDays: 'Birž. 15 / 17 d.',
  },
  {
    id: 'dobbiaco',
    name: 'Dobbiaco (Toblach)',
    coords: { lat: 46.735, lng: 12.223 },
    tag: 'Šiaurinis slėnis',
    pros: 'Greitas privažiavimas prie Tre Cime ir Lago di Braies',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Dobbiaco&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 4,
    bestDays: 'Birž. 15 d.',
  },
  {
    id: 'villabassa',
    name: 'Villabassa (Niederdorf)',
    coords: { lat: 46.738, lng: 12.179 },
    tag: 'Prie pat Lago di Braies',
    pros: 'Arčiausias taškas iki Lago di Braies (~12 min.)',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Villabassa&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 4,
    bestDays: 'Birž. 15 d.',
  },
  {
    id: 'sanvito',
    name: 'San Vito di Cadore',
    coords: { lat: 46.4514, lng: 12.1928 },
    tag: 'Ramus ir jaukus',
    pros: 'Puikios kavinės, mažiau turistų, Bar Pasticceria Fiori',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=San+Vito+di+Cadore&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 4,
    bestDays: 'Birž. 16 d.',
  },
  {
    id: 'vodo',
    name: 'Vodo di Cadore',
    coords: { lat: 46.4181, lng: 12.2472 },
    tag: 'Chalet del Capriolo',
    pros: 'Rami aplinka slėnyje, puikus vietinis restoranas Al Capriolo',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Vodo+di+Cadore&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 3,
    bestDays: 'Birž. 16 d.',
  },
  {
    id: 'borca',
    name: 'Borca di Cadore',
    coords: { lat: 46.4333, lng: 12.2167 },
    tag: 'Miško kaimas',
    pros: 'Natūralus miško aplinka, rami atmosfera',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Borca+di+Cadore&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 3,
  },
  {
    id: 'tai',
    name: 'Tai di Cadore',
    coords: { lat: 46.4167, lng: 12.35 },
    tag: 'Cadore slėnis',
    pros: 'Kompaktiškas, artumas ežerams',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Tai+di+Cadore&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 3,
  },
  {
    id: 'pieve',
    name: 'Pieve di Cadore',
    coords: { lat: 46.4247, lng: 12.375 },
    tag: 'Istorinis miestelis',
    pros: 'Tiziano muziejus, patogu parduotuvėms',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Pieve+di+Cadore&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 2,
  },
];

export const POIS = [
  {
    id: 'trecime',
    name: 'Tre Cime di Lavaredo',
    shortName: 'Tre Cime',
    emoji: '⛰️',
    coords: { lat: 46.6124, lng: 12.2964 },
    parking: { cost: '40€', coords: { lat: 46.6124, lng: 12.2964 }, rule: 'Atvykti iki 08:00 ryto', urgent: true, note: 'Ankšta aikštelė greitai prisipildo!' },
    difficulty: 'Vidutinis', duration: '2.5–3 val.', trailLength: '9.5 km',
    elevation: '2999 m', elevationGain: '+340 m', recommendedDay: 16,
    description: 'Įspūdingiausias Dolomitų maršrutas – ikoninis trijų viršūnių panorama',
    highlights: ['UNESCO pasaulio paveldas', 'Žygis aplink 3 viršūnes', 'Rifugio Locatelli prie ežero'],
    officialUrl: 'https://www.dolomiti.org/en/cortina/experiences/tre-cime-di-lavaredo/',
    wikiloc: 'https://www.wikiloc.com/hiking-trails/tre-cime-di-lavaredo-loop',
  },
  {
    id: 'braies',
    name: 'Lago di Braies',
    shortName: 'L. Braies',
    emoji: '🏞️',
    coords: { lat: 46.7001, lng: 12.085 },
    parking: { cost: '15–30€', coords: { lat: 46.6995, lng: 12.0838 }, rule: 'Iki 09:00 arba po 16:00', urgent: false, note: 'Birželio viduryje ribojimai dar negalioja' },
    difficulty: 'Lengvas', duration: '1–1.5 val.', trailLength: '3.5 km',
    elevation: '1496 m', elevationGain: '+80 m', recommendedDay: 15,
    description: 'Turkio spalvos ežeras su valtelių nuoma – fotografų rojus',
    highlights: ['Valtelių nuoma', 'Apžvalginė takelė aplink ežerą', 'Kalnų atspindžiai vandenyje'],
    officialUrl: 'https://www.pragserwildsee.com/en/',
    wikiloc: 'https://www.wikiloc.com/hiking-trails/lago-di-braies-pragser-wildsee',
  },
  {
    id: 'sorapis',
    name: 'Lago di Sorapis',
    shortName: 'L. Sorapis',
    emoji: '💎',
    coords: { lat: 46.5566, lng: 12.1846 },
    parking: { cost: 'Nemokamas', coords: { lat: 46.5600, lng: 12.1900 }, rule: 'Atvykti iki 08:30', urgent: false, note: 'Šalikelinis parkavimas, vietos ribotai' },
    difficulty: 'Vidutinis', duration: '3–4 val.', trailLength: '11 km',
    elevation: '1923 m', elevationGain: '+510 m', recommendedDay: 18,
    description: 'Milžiniškas turkio ežeras aukštai kalnuose – vienas gražiausių Dolomituose',
    highlights: ['Nepaprastos spalvos vanduo', 'Ryškios uolų panoramos', 'Atokus – mažiau turistų'],
    officialUrl: 'https://www.dolomiti.org/en/cortina/experiences/lago-di-sorapiss/',
    wikiloc: 'https://www.wikiloc.com/hiking-trails/lago-di-sorapis',
  },
  {
    id: 'cinquetorri',
    name: 'Cinque Torri',
    shortName: 'Cinque Torri',
    emoji: '🗼',
    coords: { lat: 46.5181, lng: 12.0374 },
    parking: { cost: 'Nemokamas', coords: { lat: 46.5181, lng: 12.0374 }, rule: 'Keltuvo kaina ~20–25€/asm.', urgent: false, note: 'Keltuvai veikia nuo 09:00' },
    difficulty: 'Lengvas', duration: '2 val.', trailLength: '4 km',
    elevation: '2137 m', elevationGain: '+220 m', recommendedDay: 17,
    description: '5 akmeniniai bokštai virš Ampezzo slėnio – su keltuvu ir prosecco 🥂',
    highlights: ['Keltuvai iš Bai de Dones', 'Rifugio Scoiattoli – Prosecco terasa', 'WWI muziejus ant kalno'],
    officialUrl: 'https://www.dolomiti.org/en/cortina/experiences/cinque-torri/',
    wikiloc: 'https://www.wikiloc.com/hiking-trails/cinque-torri-cortina-dampezzo',
  },
]

export const RESTAURANTS = {
  nearCortina: {
    id: 'tivoli',
    name: 'Ristorante Tivoli',
    emoji: '⭐',
    type: 'Michelin žvaigždutė',
    address: "Via Lacedel 34, Cortina d'Ampezzo",
    coords: { lat: 46.538, lng: 12.148 },
    note: 'Rezervacija būtina kelios savaitės iš anksto!',
    priceRange: '€€€€',
    bookingUrl: 'https://www.ristorantetivoli.it',
    triggerTowns: ['cortina'],
  },
  nearCadore: {
    id: 'capriolo',
    name: 'Ristorante Al Capriolo',
    emoji: '🦌',
    type: 'Tradicinis italų',
    address: 'Cadore slėnis',
    coords: { lat: 46.43, lng: 12.35 },
    note: 'Vietinė virtuvė – geriausias elnienos patiekalas regione',
    priceRange: '€€€',
    bookingUrl: 'https://maps.google.com/?q=Ristorante+Al+Capriolo+Cadore',
    triggerTowns: ['sanvito', 'borca', 'tai', 'pieve', 'vodo', 'misurina', 'dobbiaco', 'villabassa'],
  },
};


export const CAR_RENTAL = {
  company: "Ecovia",
  brand: "Autovia",
  car: "Audi A3 Sportback (arba panašus)",
  class: "Intermediate · Automatinė pavarų dėžė",
  pickup: { date: "06.14", time: "14:30" },
  dropoff: { date: "06.18", time: "18:30" },
  bookingRef: "734670081",
  address: "Via Noalese, 63E, Treviso, Italy, 31100",
  coords: { lat: 45.6535, lng: 12.1938 },
  pickupGuide: "Nusileidus Trevizo oro uoste (TSF) ir išėjus iš pagrindinio terminalo pastato, jokio šatlo (shuttle bus) ieškoti nereikia. Biuras ir automobilių aikštelė yra įsikūrę tiesiai kitoje gatvės pusėje, vos už kelių dešimčių metrų nuo terminalo išėjimo (adresu Via Noalese 63E). Pėsčiomis su bagažu nukeliausite per 1–2 minutes.",
};

export const TRE_CIME_RESERVATION = {
  url: "https://pass.auronzo.info/",
  price: 40,
  hours: 12,
  notice: "Kadangi automobilis yra nuomojamas, rezervaciją sistemoje atlikite dabar nenaudodami valstybinio numerio (palikite laukelį tuščią). Pasiėmus automobilį birželio 14 d. 14:30, jo valstybinį numerį (Targa) privaloma rankiniu būdu suvesti į sistemą likus ne mažiau kaip 1 dienai iki įvažiavimo (iki birželio 15 d. 23:59 val.).",
};

export const TRE_CIME_TRANSPORT = {
  byCar: {
    id: "car",
    label: "🚗 Savo automobiliu",
    parkingCoords: { lat: 46.6124, lng: 12.2964 },
    parkingCost: 40,
    parkingLabel: "Rifugio Auronzo aikštelė",
  },
  byBus: {
    id: "bus",
    label: "🚌 Kilti autobusu",
    parkingCoords: { lat: 46.5828, lng: 12.2547 },
    parkingCost: 14,
    parkingLabel: "Misurina Genzianella aikštelė",
    shuttleCostPerPerson: 15,
    persons: 4,
    shuttleUrl: "https://dolomitibus.it/",
    shuttleNote: "Autobusas Misurina → Rifugio Auronzo ir atgal",
  },
};
export const BRUNCH_SPOT = {
  name: 'Bar Pasticceria Fiori',
  emoji: '☕',
  address: 'San Vito di Cadore',
  coords: { lat: 46.4514, lng: 12.1928 },
  note: 'Geriausias croissant Dolomituose + vietinis espresso',
};

export const RIFUGIO = {
  name: 'Rifugio Scoiattoli',
  emoji: '🥂',
  address: 'Cinque Torri, Cortina d\'Ampezzo',
  coords: { lat: 46.518, lng: 12.038 },
  note: 'Prosecco taurė panoraminėje terasoje – būtina!',
};

// Day-by-day plans generated based on selected town
export const generateDayPlans = (selectedTown) => {
  const town = TOWNS.find((t) => t.id === selectedTown);
  const isCortina = selectedTown === 'cortina';
  const restaurant = isCortina ? RESTAURANTS.nearCortina : RESTAURANTS.nearCadore;

  return [
    {
      day: 14,
      date: 'Sekmadienis, Birž. 14',
      title: 'Atvykimas ✈️',
      type: 'arrival',
      events: [
        { time: '13:55', icon: '✈️', text: 'Atvykimas į Trevizo (TSF) oro uostą' },
        { time: '14:30', icon: '🚗', text: 'Automobilių nuoma + išvykimas' },
        { time: '15:15', icon: '🏰', text: 'Atvykimas į Castello di Roncade' },
        { time: '18:00', icon: '🍷', text: 'Vyno degustacija pilies vynuogyne' },
      ],
      poi: null,
      overnight: NIGHT_ONE,
    },
    {
      day: 15,
      date: 'Pirmadienis, Birž. 15',
      title: 'Kelias į Dolomitus 🏔️',
      type: 'travel',
      events: [
        { time: '09:00', icon: '🏰', text: 'Pusryčiai pilyje, išvykimas' },
        { time: '11:30', icon: '🚗', text: `Atvykimas į ${town?.name || 'Dolomitus'} (~2.5 val.)` },
        { time: '13:00', icon: '🏨', text: 'Įsiregistravimas į būstą' },
        { time: '14:30', icon: '🏞️', text: 'Lago di Sorapis arba Lago di Braies (pasirinkti)' },
        { time: '20:00', icon: '🍝', text: 'Vakarienė vietiniame restorane' },
      ],
      poi: POIS.find((p) => p.id === 'sorapis'),
      parking: POIS.find((p) => p.id === 'sorapis').parking,
      overnight: town,
    },
    {
      day: 16,
      date: 'Antradienis, Birž. 16',
      title: '🎂 Gimtadienis #1 – Tre Cime',
      type: 'birthday',
      birthdayNumber: 1,
      events: [
        { time: '06:30', icon: '⏰', text: '🚨 Ankstyvas kėlimasis! Parkavimas prie Tre Cime užpildomas greitai' },
        { time: '07:00', icon: '🚗', text: 'Išvykimas į Tre Cime' },
        {
          time: '08:00',
          icon: '⛰️',
          text: `Atvykimas į Tre Cime (${isCortina ? '~50 min.' : '~65 min.'} nuo ${town?.name || 'bazės'})`,
          warning: !isCortina,
        },
        { time: '08:00–11:00', icon: '🥾', text: 'Žygis aplink Tre Cime (ikoninis maršrutas)' },
        { time: '14:00', icon: '☕', text: 'Grįžimas + poilsis' },
        { time: '19:30', icon: restaurant.emoji, text: `🎉 Gimtadienio vakarienė: ${restaurant.name} (${restaurant.type})` },
      ],
      poi: POIS.find((p) => p.id === 'trecime'),
      parking: POIS.find((p) => p.id === 'trecime').parking,
      restaurant,
      overnight: town,
    },
    {
      day: 17,
      date: 'Trečiadienis, Birž. 17',
      title: '🎂 Gimtadienis #2 – Cinque Torri',
      type: 'birthday',
      birthdayNumber: 2,
      events: [
        { time: '09:30', icon: '☕', text: 'Vėlyvi pusryčiai – laisva diena!' },
        { time: '10:30', icon: '🥐', text: `Brunch: Bar Pasticceria Fiori (${selectedTown === 'sanvito' ? '2 min.' : 'San Vito di Cadore'})` },
        { time: '12:00', icon: '🗼', text: 'Cinque Torri – keltuvas į kalnų bokštus' },
        { time: '13:00', icon: '🥂', text: 'Prosecco taurė Rifugio Scoiattoli panoraminėje terasoje' },
        { time: '15:00', icon: '🏃', text: 'Lengvas žygis aplink bokštus' },
        { time: '18:00', icon: '🌅', text: 'Saulėlydis nuo Cinque Torri viršūnės' },
      ],
      poi: POIS.find((p) => p.id === 'cinquetorri'),
      parking: POIS.find((p) => p.id === 'cinquetorri').parking,
      overnight: town,
    },
    {
      day: 18,
      date: 'Ketvirtadienis, Birž. 18',
      title: 'Išvykimas ✈️🚂',
      type: 'departure',
      events: [
        { time: '09:00', icon: '🌄', text: 'Paskutiniai pusryčiai Dolomituose' },
        { time: '10:00', icon: '🏨', text: 'Išsiregistravimas' },
        { time: '10:30', icon: '🚗', text: 'Išvykimas į Trevizo/Veneciją (~2.5 val.)' },
        { time: '13:00', icon: '🚂', text: '2 asm. → Venezia Mestre (Venecijos pratęsimas iki 06.20)' },
        { time: '17:30', icon: '🚗', text: '2 asm. → TSF oro uostas' },
        { time: '20:40', icon: '✈️', text: 'Skrydis atgal iš TSF (2 asm.)' },
      ],
      poi: null,
      overnight: null,
    },
  ];
};

// POI per day mapping – single source of truth
export const DAY_POI_MAP = {
  14: {
    pois: [],
    extraMarkers: [
      { id: 'roncade', name: 'Castello di Roncade', emoji: '🏰', coords: { lat: 45.6276, lng: 12.3766 }, color: '#52a879', info: 'Pirmoji naktis · 06.14–06.15' },
      { id: 'ecovia', name: 'Ecovia / TSF oro uostas', emoji: '🚗', coords: { lat: 45.6484, lng: 12.1939 }, color: '#c9a84c', info: 'Auto paėmimas 14:30 · Via Noalese 63E' },
    ],
    center: { lat: 45.64, lng: 12.28 },
    zoom: 11,
  },
  15: {
    pois: ['braies'],
    extraMarkers: [],
    center: { lat: 46.7001, lng: 12.085 },
    zoom: 12,
  },
  16: {
    pois: ['trecime'],
    extraMarkers: [],
    center: { lat: 46.6124, lng: 12.2964 },
    zoom: 12,
  },
  17: {
    pois: ['cinquetorri'],
    extraMarkers: [
      { id: 'fiori', name: 'Bar Pasticceria Fiori', emoji: '☕', coords: { lat: 46.4514, lng: 12.1928 }, color: '#e88ea0', info: 'Brunch · San Vito di Cadore' },
    ],
    center: { lat: 46.49, lng: 12.11 },
    zoom: 11,
  },
  18: {
    pois: ['sorapis'],
    extraMarkers: [
      { id: 'tsf', name: 'TSF – Trevizo oro uostas', emoji: '✈️', coords: { lat: 45.6484, lng: 12.1939 }, color: '#c9a84c', info: 'Ecovia grąžinimas 18:30 · Skrydis 20:40' },
    ],
    center: { lat: 46.5566, lng: 12.1846 },
    zoom: 11,
  },
};

// Haversine distance calculator (straight line * road factor)
export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const straight = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const road = straight * 1.45; // mountain road factor
  const min = Math.round(road / 45 * 60); // ~45km/h mountain avg
  return { km: Math.round(road * 10) / 10, min };
}

export function formatDuration(min) {
  if (min < 60) return `${min} min.`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h} val. ${m} min.` : `${h} val.`;
}
