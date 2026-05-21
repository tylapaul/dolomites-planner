import { useRef, useEffect, useState } from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap.js';
import { TOWNS, POIS, NIGHT_ONE } from '../data/tripData.js';

const DOLOMITES_CENTER = { lat: 46.55, lng: 12.18 };
const HAS_API_KEY = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MARKER_COLORS = {
  castle: '#52a879',
  town: '#c9a84c',
  poi: '#4fa3e0',
  selected: '#e88ea0',
};

function createMarkerIcon(color, label) {
  return {
    path: window.google?.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#fff',
    strokeWeight: 2,
  };
}

export default function MapView({ selectedTown, activeDay, mapFocus }) {
  const containerRef = useRef(null);
  const [layer, setLayer] = useState('all');
  const { ready, clearMarkers, addMarker, panTo, drawRoute } = useGoogleMap(
    containerRef,
    DOLOMITES_CENTER
  );

  // Add all markers when map is ready
  useEffect(() => {
    if (!ready || !window.google) return;
    clearMarkers();

    // Castle marker
    const castleMarker = addMarker(NIGHT_ONE.coords, {
      title: NIGHT_ONE.name,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: MARKER_COLORS.castle,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });

    const castleInfo = new window.google.maps.InfoWindow({
      content: `<div style="color:#0e1520;font-family:sans-serif;padding:4px">
        <b>🏰 ${NIGHT_ONE.name}</b><br/>
        <span style="font-size:12px">${NIGHT_ONE.description}</span><br/>
        <span style="font-size:11px;color:#555">${NIGHT_ONE.dates}</span>
      </div>`,
    });
    castleMarker?.addListener('click', () => castleInfo.open({ anchor: castleMarker }));

    // Town markers
    if (layer === 'all' || layer === 'towns') {
      TOWNS.forEach((town) => {
        const isSelected = town.id === selectedTown;
        const marker = addMarker(town.coords, {
          title: town.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 13 : 9,
            fillColor: isSelected ? MARKER_COLORS.selected : MARKER_COLORS.town,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: isSelected ? 3 : 2,
          },
        });
        const info = new window.google.maps.InfoWindow({
          content: `<div style="color:#0e1520;font-family:sans-serif;padding:4px">
            <b>📍 ${town.name}</b><br/>
            <span style="font-size:12px;color:#666">${town.tag}</span><br/>
            <span style="font-size:11px">${town.pros}</span>
          </div>`,
        });
        marker?.addListener('click', () => info.open({ anchor: marker }));
      });
    }

    // POI markers
    if (layer === 'all' || layer === 'pois') {
      POIS.forEach((poi) => {
        const marker = addMarker(poi.coords, {
          title: poi.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: MARKER_COLORS.poi,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
        });
        const info = new window.google.maps.InfoWindow({
          content: `<div style="color:#0e1520;font-family:sans-serif;padding:4px">
            <b>${poi.emoji} ${poi.name}</b><br/>
            <span style="font-size:11px">🅿️ ${poi.parking.cost} · ${poi.parking.rule}</span><br/>
            <span style="font-size:11px">🥾 ${poi.difficulty} · ${poi.duration}</span>
          </div>`,
        });
        marker?.addListener('click', () => info.open({ anchor: marker }));
      });
    }
  }, [ready, selectedTown, layer]);

  // Fly to focused location
  useEffect(() => {
    if (mapFocus && ready) {
      panTo(mapFocus, 12);
    }
  }, [mapFocus, ready]);

  // Draw route if hotel selected and active day has POI
  useEffect(() => {
    if (!ready || !selectedTown) return;
    const town = TOWNS.find((t) => t.id === selectedTown);
    if (!town) return;

    if (activeDay === 16) {
      const trecime = POIS.find((p) => p.id === 'trecime');
      drawRoute(town.coords, trecime.coords);
    } else if (activeDay === 17) {
      const cinquetorri = POIS.find((p) => p.id === 'cinquetorri');
      drawRoute(town.coords, cinquetorri.coords);
    } else if (activeDay === 15) {
      const sorapis = POIS.find((p) => p.id === 'sorapis');
      drawRoute(NIGHT_ONE.coords, town.coords, [sorapis.coords]);
    }
  }, [ready, selectedTown, activeDay]);

  if (!HAS_API_KEY) {
    return (
      <div className="map-container">
        <div className="map-no-key">
          <div className="icon">🗺️</div>
          <h3>Google Maps API raktas</h3>
          <p>
            Pridėkite <code>VITE_GOOGLE_MAPS_API_KEY</code> į Render.com
            Environment Variables, kad žemėlapis veiktų.
          </p>
          <p style={{ marginTop: 8, fontSize: '0.75rem', opacity: 0.6 }}>
            Visi kiti funkcionalumai veikia be žemėlapio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={containerRef} className="map-el" />
      <div className="map-overlay-btns">
        {['all', 'towns', 'pois'].map((l) => (
          <button
            key={l}
            className={`map-layer-btn ${layer === l ? 'active' : ''}`}
            onClick={() => setLayer(l)}
          >
            {l === 'all' ? '🗺️ Visi' : l === 'towns' ? '🏘️ Miesteliai' : '⛰️ POI'}
          </button>
        ))}
      </div>
    </div>
  );
}
