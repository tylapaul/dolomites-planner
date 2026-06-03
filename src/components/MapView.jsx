import { useRef, useEffect } from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap.js';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS, POIS, DAY_POI_MAP } from '../data/tripData.js';

const HAS_API_KEY = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Rich HTML info window for a POI
function poiInfoHTML(poi) {
  const stars = poi.difficulty === 'Lengvas' ? '🟢' : poi.difficulty === 'Vidutinis' ? '🟡' : '🔴';
  const highlights = (poi.highlights || []).map(h => `<li style="margin:2px 0">${h}</li>`).join('');
  return `
    <div style="font-family:'Segoe UI',sans-serif;max-width:280px;padding:4px">
      <div style="font-size:15px;font-weight:700;color:#0e1520;margin-bottom:4px">${poi.emoji} ${poi.name}</div>
      <div style="font-size:12px;color:#555;margin-bottom:8px;line-height:1.4">${poi.description}</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px">
        <tr><td style="color:#777;padding:2px 4px 2px 0">⏱️ Trukmė</td><td style="font-weight:500">${poi.duration}</td></tr>
        <tr><td style="color:#777;padding:2px 4px 2px 0">📏 Maršrutas</td><td style="font-weight:500">${poi.trailLength}</td></tr>
        <tr><td style="color:#777;padding:2px 4px 2px 0">🏔️ Aukštis</td><td style="font-weight:500">${poi.elevation} (${poi.elevationGain})</td></tr>
        <tr><td style="color:#777;padding:2px 4px 2px 0">${stars} Sunkumas</td><td style="font-weight:500">${poi.difficulty}</td></tr>
        <tr><td style="color:#777;padding:2px 4px 2px 0">🅿️ Parkavimas</td><td style="font-weight:500">${poi.parking.cost}</td></tr>
        <tr><td style="color:#777;padding:2px 4px 2px 0">⏰ Taisyklė</td><td style="font-weight:500;color:${poi.parking.urgent ? '#d32f2f' : '#333'}">${poi.parking.rule}</td></tr>
      </table>
      ${highlights ? `<div style="font-size:11px;color:#555;margin-bottom:8px"><b>✨ Įdomu:</b><ul style="margin:4px 0 0 16px;padding:0">${highlights}</ul></div>` : ''}
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <a href="${poi.officialUrl}" target="_blank"
          style="background:#1a73e8;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">
          🌐 Oficiali svetainė
        </a>
        <a href="${poi.wikiloc}" target="_blank"
          style="background:#2e7d32;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">
          🗺️ Maršrutas
        </a>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${poi.coords.lat},${poi.coords.lng}" target="_blank"
          style="background:#f57c00;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">
          📍 Navigacija
        </a>
      </div>
    </div>`;
}

// POI marker with label
function addPoiMarker(poi, map) {
  if (!window.google) return null;

  // Outer circle marker
  const marker = new window.google.maps.Marker({
    position: poi.coords,
    map,
    title: poi.name,
    icon: {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 14,
      fillColor: '#4fa3e0',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    },
    label: {
      text: poi.shortName || poi.name.split(' ').slice(0, 2).join(' '),
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: 'bold',
      fontFamily: 'Segoe UI, sans-serif',
    },
    zIndex: 30,
  });

  const iw = new window.google.maps.InfoWindow({
    content: poiInfoHTML(poi),
    maxWidth: 300,
  });

  marker.addListener('click', () => iw.open({ anchor: marker, map }));
  return marker;
}

export default function MapView({ activeDay, mapFocus }) {
  const containerRef = useRef(null);
  const { state } = useTripContext();
  const { ready, getMap, clearMarkers, addMarker, panTo, drawRoute } = useGoogleMap(
    containerRef,
    { lat: 46.55, lng: 12.18 }
  );

  useEffect(() => {
    if (!ready || !window.google) return;
    clearMarkers();

    const dayData = DAY_POI_MAP[activeDay];
    if (!dayData) return;

    panTo(dayData.center, dayData.zoom || 11);

    // Extra markers (castle, airports, brunch)
    dayData.extraMarkers.forEach((em) => {
      const m = addMarker(em.coords, {
        title: em.name,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: em.color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
        label: { text: em.emoji, fontSize: '14px' },
        zIndex: 10,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:6px;max-width:220px">
          <b style="font-size:14px">${em.emoji} ${em.name}</b><br/>
          <span style="font-size:12px;color:#555">${em.info}</span>
        </div>`,
      });
      m?.addListener('click', () => iw.open({ anchor: m, map: getMap() }));
    });

    // Day POIs – labeled markers with rich info window
    const dayPois = POIS.filter(p => dayData.pois.includes(p.id));
    dayPois.forEach(poi => {
      addPoiMarker(poi, getMap());
    });

    // Locked hotel marker
    const dateKey = `06.${String(activeDay).padStart(2, '0')}`;
    const night = state.nights[dateKey] || state.nights['06.15'];
    if (night?.is_locked && night.coordinates) {
      const hm = addMarker(night.coordinates, {
        title: night.accommodation_name,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#e88ea0', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 },
        label: { text: '🏨', fontSize: '13px' },
        zIndex: 20,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:6px">
          <b>🔒 ${night.accommodation_name}</b><br/>
          <span style="font-size:12px;color:#555">Patvirtinta nakvynė · ${dateKey}</span>
        </div>`,
      });
      hm?.addListener('click', () => iw.open({ anchor: hm }));

      // Draw route from hotel to POI
      if (dayPois.length > 0) drawRoute(night.coordinates, dayPois[0].coords);
    }

    // Selected user hotel
    if (state.selectedHotelId) {
      const hotel = (state.myHotels || []).find(h => h.id === state.selectedHotelId);
      if (hotel?.lat && hotel?.lng) {
        const hm = addMarker({ lat: hotel.lat, lng: hotel.lng }, {
          title: hotel.name,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#f59e42', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 },
          label: { text: '📌', fontSize: '13px' },
          zIndex: 25,
        });
        if (dayPois.length > 0) drawRoute({ lat: hotel.lat, lng: hotel.lng }, dayPois[0].coords);
      }
    }

    // Town dots (context)
    TOWNS.forEach(t => {
      const isActive = t.id === state.activeTown || t.id === night?.accommodation_id;
      addMarker(t.coords, {
        title: t.name,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: isActive ? 9 : 6, fillColor: isActive ? '#e88ea0' : '#c9a84c', fillOpacity: 0.9, strokeColor: '#fff', strokeWeight: isActive ? 2 : 1 },
        zIndex: isActive ? 15 : 5,
      });
    });

  }, [ready, activeDay, state.nights, state.activeTown, state.selectedHotelId, state.myHotels]);

  useEffect(() => {
    if (mapFocus && ready) panTo(mapFocus, 14);
  }, [mapFocus, ready]);

  if (!HAS_API_KEY) {
    return (
      <div className="map-container">
        <div className="map-no-key">
          <div className="icon">🗺️</div>
          <h3>Google Maps API raktas</h3>
          <p>Pridėkite <code>VITE_GOOGLE_MAPS_API_KEY</code> į Render.com Environment Variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={containerRef} className="map-el" />
    </div>
  );
}
