import { useRef, useEffect } from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap.js';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS, POIS, DAY_POI_MAP } from '../data/tripData.js';

const HAS_API_KEY = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// SVG marker: label box on top + circle dot below – always visible
function createSvgMarker(label, color = '#1565C0') {
  const padding = 10;
  const fontSize = 11;
  const charW = fontSize * 0.62;
  const textW = Math.ceil(label.length * charW);
  const boxW = textW + padding * 2;
  const boxH = 22;
  const dotR = 9;
  const totalH = boxH + 10 + dotR * 2; // box + stem + dot
  const cx = boxW / 2;
  const dotY = boxH + 12 + dotR;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boxW}" height="${totalH}">
    <filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.4"/></filter>
    <rect x="1" y="1" width="${boxW - 2}" height="${boxH}" rx="5" fill="${color}" filter="url(#s)"/>
    <text x="${cx}" y="${boxH - 7}" text-anchor="middle" font-family="'Segoe UI',Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="#fff">${label}</text>
    <line x1="${cx}" y1="${boxH}" x2="${cx}" y2="${boxH + 12}" stroke="${color}" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="${color}" stroke="#fff" stroke-width="2.5"/>
  </svg>`;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(boxW, totalH),
    anchor: new window.google.maps.Point(cx, dotY + dotR),
  };
}

// Rich info window HTML
function poiInfoHTML(poi) {
  const diff = poi.difficulty === 'Lengvas' ? '🟢' : '🟡';
  const rows = [
    ['⏱️ Trukmė', poi.duration],
    ['📏 Atstumas', poi.trailLength],
    ['🏔️ Aukštis', `${poi.elevation} (${poi.elevationGain})`],
    [`${diff} Sunkumas`, poi.difficulty],
    ['🅿️ Parkavimas', poi.parking.cost],
    ['⏰ Taisyklė', poi.parking.rule],
  ];
  const rowsHtml = rows.map(([k, v]) =>
    `<tr><td style="color:#888;padding:2px 8px 2px 0;white-space:nowrap">${k}</td>
     <td style="font-weight:600;color:${k.includes('Taisyklė') && poi.parking.urgent ? '#c62828' : '#1a1a1a'}">${v}</td></tr>`
  ).join('');
  const hlHtml = (poi.highlights || []).map(h => `<li style="margin:2px 0;color:#444">${h}</li>`).join('');

  return `<div style="font-family:'Segoe UI',Arial,sans-serif;width:280px;padding:2px 4px 4px">
    <div style="font-size:16px;font-weight:700;margin-bottom:4px;color:#111">${poi.emoji} ${poi.name}</div>
    <div style="font-size:12px;color:#555;margin-bottom:10px;line-height:1.5">${poi.description}</div>
    <table style="font-size:12px;margin-bottom:8px;border-collapse:collapse">${rowsHtml}</table>
    ${hlHtml ? `<div style="font-size:11px;margin-bottom:10px"><b style="color:#333">✨ Įdomu:</b>
      <ul style="margin:4px 0 0 14px;padding:0">${hlHtml}</ul></div>` : ''}
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">
      <a href="${poi.officialUrl}" target="_blank" style="background:#1565C0;color:#fff;padding:6px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600;line-height:1">🌐 Oficiali svetainė</a>
      <a href="${poi.wikiloc}" target="_blank" style="background:#2e7d32;color:#fff;padding:6px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600;line-height:1">🗺️ Maršrutas</a>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${poi.coords.lat},${poi.coords.lng}&travelmode=driving" target="_blank" style="background:#e65100;color:#fff;padding:6px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600;line-height:1">📍 Navigacija</a>
    </div>
  </div>`;
}

export default function MapView({ activeDay, mapFocus, className = '' }) {
  const containerRef = useRef(null);
  const { state } = useTripContext();
  const { getMap, ready, clearMarkers, addMarker, panTo, drawRoute } = useGoogleMap(
    containerRef,
    { lat: 46.55, lng: 12.18 }
  );

  useEffect(() => {
    if (!ready || !window.google) return;
    clearMarkers();
    const map = getMap();
    if (!map) return;

    const dayData = DAY_POI_MAP[activeDay];
    if (!dayData) return;

    panTo(dayData.center, dayData.zoom || 11);

    // ── Extra markers (castle, airport, brunch) ──────────────────
    dayData.extraMarkers.forEach((em) => {
      const icon = createSvgMarker(em.emoji + ' ' + em.name.split(' ').slice(0, 2).join(' '), em.color);
      const m = new window.google.maps.Marker({ position: em.coords, map, title: em.name, icon, zIndex: 10 });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:'Segoe UI',sans-serif;padding:4px 6px;max-width:220px">
          <b style="font-size:14px">${em.emoji} ${em.name}</b><br/>
          <span style="font-size:12px;color:#555">${em.info}</span></div>`,
      });
      m.addListener('click', () => iw.open({ anchor: m, map }));
    });

    // ── POI markers – labeled SVG + rich info window ─────────────
    const dayPois = POIS.filter(p => dayData.pois.includes(p.id));
    dayPois.forEach(poi => {
      const icon = createSvgMarker(poi.shortName || poi.name, '#1565C0');
      const m = new window.google.maps.Marker({ position: poi.coords, map, title: poi.name, icon, zIndex: 30 });
      const iw = new window.google.maps.InfoWindow({ content: poiInfoHTML(poi), maxWidth: 300 });
      m.addListener('click', () => iw.open({ anchor: m, map }));
    });

    // ── Locked hotel ─────────────────────────────────────────────
    const dateKey = `06.${String(activeDay).padStart(2, '0')}`;
    const night = state.nights[dateKey] || state.nights['06.15'];
    if (night?.is_locked && night.coordinates) {
      const icon = createSvgMarker('🏨 ' + (night.accommodation_name || '').split(' ').slice(0, 2).join(' '), '#ad1457');
      const m = new window.google.maps.Marker({ position: night.coordinates, map, title: night.accommodation_name, icon, zIndex: 20 });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:'Segoe UI',sans-serif;padding:4px 6px">
          <b>🔒 ${night.accommodation_name}</b><br/>
          <span style="font-size:12px;color:#555">✅ Patvirtinta nakvynė · ${dateKey}</span></div>`,
      });
      m.addListener('click', () => iw.open({ anchor: m, map }));
    }

    // ── Selected user hotel ───────────────────────────────────────
    if (state.selectedHotelId) {
      const hotel = (state.myHotels || []).find(h => h.id === state.selectedHotelId);
      if (hotel?.lat && hotel?.lng) {
        const icon = createSvgMarker('📌 ' + hotel.name.split(' ').slice(0, 2).join(' '), '#e65100');
        new window.google.maps.Marker({ position: { lat: hotel.lat, lng: hotel.lng }, map, title: hotel.name, icon, zIndex: 25 });
      }
    }

    // ── Draw route (Priority: Selected Hotel > Locked Hotel > Active Town) ──
    let routeOrigin = null;
    if (state.selectedHotelId) {
      const hotel = (state.myHotels || []).find(h => h.id === state.selectedHotelId);
      if (hotel?.lat && hotel?.lng) {
        routeOrigin = { lat: hotel.lat, lng: hotel.lng };
      }
    }
    if (!routeOrigin && night?.is_locked && night.coordinates) {
      routeOrigin = night.coordinates;
    }
    if (!routeOrigin && state.activeTown) {
      const activeTownObj = TOWNS.find(t => t.id === state.activeTown);
      if (activeTownObj?.coords) {
        routeOrigin = activeTownObj.coords;
      }
    }

    if (routeOrigin && dayPois.length > 0) {
      drawRoute(routeOrigin, dayPois[0].coords);
    }

    // ── Town dots (small, context only) ──────────────────────────
    TOWNS.forEach(t => {
      const isActive = t.id === state.activeTown || t.id === night?.accommodation_id;
      addMarker(t.coords, {
        title: t.name,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: isActive ? 8 : 5, fillColor: isActive ? '#e88ea0' : '#c9a84c', fillOpacity: 0.85, strokeColor: '#fff', strokeWeight: isActive ? 2 : 1 },
        zIndex: isActive ? 15 : 5,
      });
    });

  }, [ready, activeDay, state.nights, state.activeTown, state.selectedHotelId, state.myHotels]);

  useEffect(() => {
    if (mapFocus && ready) panTo(mapFocus, 14);
  }, [mapFocus, ready]);

  if (!HAS_API_KEY) {
    return (
      <div className={`map-container ${className}`}>
        <div className="map-no-key">
          <div className="icon">🗺️</div>
          <h3>Google Maps API raktas</h3>
          <p>Pridėkite <code>VITE_GOOGLE_MAPS_API_KEY</code> į Render.com Environment Variables.</p>
        </div>
      </div>
    );
  }

  return <div className={`map-container ${className}`}><div ref={containerRef} className="map-el" /></div>;
}
