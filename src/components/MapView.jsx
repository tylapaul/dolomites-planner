import { useRef, useEffect } from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap.js';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS, POIS, DAY_POI_MAP } from '../data/tripData.js';

const HAS_API_KEY = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function makeIcon(color, scale = 9, strokeWeight = 2) {
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale, fillColor: color, fillOpacity: 1,
    strokeColor: '#fff', strokeWeight,
  };
}

export default function MapView({ activeDay, mapFocus }) {
  const containerRef = useRef(null);
  const { state } = useTripContext();
  const { ready, clearMarkers, addMarker, panTo, drawRoute } = useGoogleMap(
    containerRef,
    { lat: 46.55, lng: 12.18 }
  );

  // Re-draw markers whenever day or lock state changes
  useEffect(() => {
    if (!ready || !window.google) return;
    clearMarkers();

    const dayData = DAY_POI_MAP[activeDay];
    if (!dayData) return;

    // Fly to day center
    panTo(dayData.center, dayData.zoom);

    // Draw day-specific extra markers (castle, airports, brunch spots)
    dayData.extraMarkers.forEach((em) => {
      const m = addMarker(em.coords, {
        title: em.name,
        icon: makeIcon(em.color, 11, 2),
        zIndex: 10,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:4px;color:#0e1520">
          <b>${em.emoji} ${em.name}</b><br/>
          <span style="font-size:11px">${em.info}</span>
        </div>`,
      });
      m?.addListener('click', () => iw.open({ anchor: m }));
    });

    // Draw POIs for this day
    const dayPois = POIS.filter((p) => dayData.pois.includes(p.id));
    dayPois.forEach((poi) => {
      const m = addMarker(poi.coords, {
        title: poi.name,
        icon: makeIcon('#4fa3e0', 13, 3),
        zIndex: 20,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:4px;color:#0e1520">
          <b>${poi.emoji} ${poi.name}</b><br/>
          <span style="font-size:11px">🅿️ ${poi.parking.cost} · ${poi.parking.rule}</span><br/>
          <span style="font-size:11px">🥾 ${poi.difficulty} · ${poi.duration}</span>
        </div>`,
      });
      m?.addListener('click', () => iw.open({ anchor: m }));
    });

    // Draw locked hotel marker
    const dateKey = `06.${String(activeDay).padStart(2, '0')}`;
    const night = state.nights[dateKey];
    if (night?.is_locked && night.coordinates) {
      const hm = addMarker(night.coordinates, {
        title: night.accommodation_name,
        icon: makeIcon('#e88ea0', 13, 3),
        zIndex: 15,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:4px;color:#0e1520">
          <b>🔒 ${night.accommodation_name}</b><br/>
          <span style="font-size:11px">📍 Patvirtinta nakvynė · ${dateKey}</span>
        </div>`,
      });
      hm?.addListener('click', () => iw.open({ anchor: hm }));
    }

    // Draw user-selected hotel (from MyHotels) if any
    if (state.selectedHotelId) {
      const hotel = (state.myHotels || []).find(h => h.id === state.selectedHotelId);
      if (hotel?.lat && hotel?.lng) {
        const hm = addMarker({ lat: hotel.lat, lng: hotel.lng }, {
          title: hotel.name,
          icon: makeIcon('#f59e42', 12, 3),
          zIndex: 18,
        });
        const iw = new window.google.maps.InfoWindow({
          content: `<div style="font-family:sans-serif;padding:4px;color:#0e1520">
            <b>🏨 ${hotel.name}</b><br/>
            <span style="font-size:11px">${hotel.notes || ''}</span>
          </div>`,
        });
        hm?.addListener('click', () => iw.open({ anchor: hm }));

        // Draw route from hotel to day POI if available
        if (dayPois.length > 0) {
          drawRoute({ lat: hotel.lat, lng: hotel.lng }, dayPois[0].coords);
        }
      }
    } else if (night?.is_locked && night.coordinates && dayPois.length > 0) {
      // Draw route from locked hotel to POI
      drawRoute(night.coordinates, dayPois[0].coords);
    }

    // Also show all towns as small dots for context
    TOWNS.forEach((t) => {
      const isActive = t.id === state.activeTown || t.id === night?.accommodation_id;
      addMarker(t.coords, {
        title: t.name,
        icon: makeIcon(isActive ? '#e88ea0' : '#c9a84c', isActive ? 10 : 7, isActive ? 3 : 1),
        zIndex: isActive ? 12 : 5,
      });
    });

  }, [ready, activeDay, state.nights, state.activeTown, state.selectedHotelId, state.myHotels]);

  // Fly to focused location
  useEffect(() => {
    if (mapFocus && ready) panTo(mapFocus, 13);
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
