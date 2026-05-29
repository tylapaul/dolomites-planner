import { useState } from 'react';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS } from '../data/tripData.js';

export default function LockReservation() {
  const { state, dispatch } = useTripContext();
  const [mode, setMode] = useState('3nights');
  const [hotelName, setHotelName] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [usePreset, setUsePreset] = useState(true);

  const night15 = state.nights['06.15'];
  if (night15?.is_locked) return null;

  const selectedTownId = state.activeTown;
  if (!selectedTownId) return null;

  const handleLock = () => {
    let coords, name, id;
    if (usePreset && selectedTownId) {
      const town = TOWNS.find((t) => t.id === selectedTownId);
      coords = town.coords;
      name = hotelName.trim() || town.name;
      id = selectedTownId;
    } else if (!usePreset && customLat && customLng && hotelName.trim()) {
      coords = { lat: parseFloat(customLat), lng: parseFloat(customLng) };
      name = hotelName.trim();
      id = 'custom';
    } else return;

    dispatch({
      type: 'LOCK_NIGHTS',
      payload: {
        startDate: '06.15',
        accommodation: { name, id, coordinates: coords, nights: mode === '3nights' ? 3 : 1, emoji: '🏨' },
      },
    });
  };

  const canLock = usePreset ? !!selectedTownId : (!!customLat && !!customLng && !!hotelName.trim());
  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
    fontFamily: 'DM Sans', fontSize: '0.82rem',
  };

  return (
    <div className="lock-card unlocked" style={{ marginTop: 10 }}>
      <div className="lock-header">
        <span className="lock-icon">🔒</span>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--snow)' }}>Patvirtinti rezervaciją</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Užrakinkite vietą – maršrutai perskaičiuos automatiškai</div>
        </div>
      </div>

      {/* Nights mode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
        {[
          { id: '3nights', label: '🏠 3 naktys', desc: 'Birž. 15–18 (viena bazė)' },
          { id: '1night', label: '🛏️ 1 naktis', desc: 'Tik pasirinkta diena' },
        ].map((m) => (
          <button key={m.id} className={`strat-btn ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
            <div className="strat-btn-title">{m.label}</div>
            <div className="strat-btn-desc">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button className={`map-layer-btn ${usePreset ? 'active' : ''}`} style={{ flex: 1, fontSize: '0.75rem', padding: 6 }} onClick={() => setUsePreset(true)}>
          📍 Miestelio koordinatės
        </button>
        <button className={`map-layer-btn ${!usePreset ? 'active' : ''}`} style={{ flex: 1, fontSize: '0.75rem', padding: 6 }} onClick={() => setUsePreset(false)}>
          ✏️ Tikslios koordinatės
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
        <input
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          placeholder={usePreset ? 'Viešbučio / kotedžo pavadinimas (neprivaloma)' : 'Viešbučio pavadinimas *'}
          style={inputStyle}
        />
        {!usePreset && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input value={customLat} onChange={(e) => setCustomLat(e.target.value)} placeholder="Platuma (46.4584)" style={{ ...inputStyle, width: 'auto' }} />
            <input value={customLng} onChange={(e) => setCustomLng(e.target.value)} placeholder="Ilguma (12.2051)" style={{ ...inputStyle, width: 'auto' }} />
          </div>
        )}
        {!usePreset && (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            💡 Google Maps → dešiniu pelės mygtuku ant vietos → nukopijuokite koordinates
          </div>
        )}
      </div>

      <button className="export-btn" disabled={!canLock} onClick={handleLock} style={{ marginTop: 0 }}>
        🔒 Patvirtinti rezervaciją {mode === '3nights' ? '(3 naktims: Birž. 15–18)' : '(1 nakčiai)'}
      </button>
    </div>
  );
}
