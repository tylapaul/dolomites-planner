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
  },
  {
    id: 'sanvito',
    name: 'San Vito di Cadore',
    coords: { lat: 46.4514, lng: 12.1928 },
    tag: 'Ramus ir jaukus',
    pros: 'Puikios kavinės, mažiau turistų, Bar Pasticceria Fiori',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=San+Vito+di+Cadore&checkin=2025-06-15&checkout=2025-06-18&group_adults=4&no_rooms=1',
    distanceScore: 4,
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
    emoji: '⛰️',
    coords: { lat: 46.6124, lng: 12.2964 },
    parking: {
      cost: '40€',
      coords: { lat: 46.6124, lng: 12.2964 },
      rule: 'Atvykti iki 08:00 ryto',
      urgent: true,
      note: 'Ankšta aikštelė greitai prisipildo!',
    },
    difficulty: 'Vidutinis',
    duration: '2.5–3 val.',
    recommendedDay: 16,
    description: 'Įspūdingiausias Dolomitų maršrutas – ikoninis trijų viršūnių panorama',
  },
  {
    id: 'braies',
    name: 'Lago di Braies',
    emoji: '🏞️',
    coords: { lat: 46.7001, lng: 12.085 },
    parking: {
      cost: '15–30€',
      coords: { lat: 46.6995, lng: 12.0838 },
      rule: 'Iki 09:00 arba po 16:00',
      urgent: false,
      note: 'Birželio viduryje ribojimai dar negalioja',
    },
    difficulty: 'Lengvas',
    duration: '1–1.5 val.',
    recommendedDay: 15,
    description: 'Turkio spalvos ežeras su valtelių nuoma – fotografų rojus',
  },
  {
    id: 'sorapis',
    name: 'Lago di Sorapis',
    emoji: '💎',
    coords: { lat: 46.5566, lng: 12.1846 },
    parking: {
      cost: 'Nemokamas',
      coords: { lat: 46.5600, lng: 12.1900 },
      rule: 'Atvykti iki 08:30',
      urgent: false,
      note: 'Šalikelinis parkavimas, vietos ribotai',
    },
    difficulty: 'Vidutinis',
    duration: '3–4 val.',
    recommendedDay: 15,
    description: 'Milžiniškas turkio ežeras aukštai kalnuose – vienas gražiausių Dolomituose',
  },
  {
    id: 'cinquetorri',
    name: 'Cinque Torri',
    emoji: '🗼',
    coords: { lat: 46.5181, lng: 12.0374 },
    parking: {
      cost: 'Nemokamas',
      coords: { lat: 46.5181, lng: 12.0374 },
      rule: 'Keltuvo kaina ~20–25€/asm.',
      urgent: false,
      note: 'Keltuvai veikia nuo 09:00',
    },
    difficulty: 'Lengvas',
    duration: '2 val.',
    recommendedDay: 17,
    description: '5 akmeniniai bokštai virš Ampezzo slėnio – su keltuvu ir prosecco 🥂',
  },
];

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
    triggerTowns: ['sanvito', 'borca', 'tai', 'pieve'],
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
