# ⛰️ Dolomitų Alpių Kelionės Planuoklis

Interaktyvus web planuoklis 4 asmenų grupei kelionei Dolomitinėse Alpėse (2025 m. birželis).

## Funkcijos
- 🗺️ Interaktyvus Google Maps žemėlapis su maršrutais
- 🏘️ Dolomitų koridoriaus miestelių filtravimas
- 📅 Diena po dienos planas su laiko grafiku
- 🅿️ Parkavimo taisyklės ir įspėjimai
- 🎂 Gimtadienio scenarijus birž. 16 ir 17
- A/B nakvynės strategija
- 🔗 Booking.com nuorodos ir Google Maps eksportas

## Paleidimas lokaliai
```bash
cp .env.example .env
# Įrašykite Google Maps API raktą į .env
npm install
npm run dev
```

## Deploy į Render.com
1. Įkelkite kodą į GitHub
2. Render.com → New → Static Site → sujunkite repo
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Environment Variables → `VITE_GOOGLE_MAPS_API_KEY` = jūsų raktas
6. Deploy! 🚀

## Google Maps API raktas
- console.cloud.google.com → sukurkite projektą
- Įjunkite: Maps JavaScript API + Directions API
- Credentials → Create API Key
- Apribokite pagal domeną: `*.onrender.com`
