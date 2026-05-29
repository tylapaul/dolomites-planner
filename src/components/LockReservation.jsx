import { useState } from 'react';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS } from '../data/tripData.js';

const LOCK_MODES = [
  { id: '3nights', label: '3 naktys', desc: '06.15 – 06.18 (viena bazė)', nights: 3 },
  { id: '1night', label: '1 naktis', desc: 'Pasirinkta diena', nights: 1 },
];

export default function LockReservation({ activeDay }) {
  const { state, dispatch } = useTripContext();
  const [mode, setMode] = useState('3nights');
  const [hotelName, setHotelName] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [usePreset, setUsePreset] = useState(true);
  const [selectedTownId, setSelectedTownId] = useState('');

  const dateKey = `06.${String(activeDay).padStart(2, '0')}`;
  const night = state.nights[dateKey];

  if (!night || activeDay === 14 || activeDay >= 18) return null;

  // Already locked
  if (night.is_locked) {
    return (
      <div className="lock-card locked">
        <div className="lock-header">
          <span className="lock-icon">🔒</span>
          <div>
            <div className="lock-name">{night.emoji} {night.accommodation_name}</div>
            <div className="lock-coords">
              📍 {night.coordinates?.lat?.toFixed(4)}, {night.coordinates?.lng?.toFixed(4)}
            </div>
            {night.check_in_time && (
              <div className="lock-times">
                {night.check_in_time && `✅ Įsiregistravimas: ${night.check_in_time}`}
                {night.check_out_time && ` · Išsiregistravimas: ${night.check_out_time}`}
              </div>
            )}
          </div>
          <span className="badge badge-fixed" style={{ marginLeft: 'auto', flexShrink: 0 }}>Patvirtinta</span>
        </div>
        {!night.fixed && (
          <button
            className="unlock-btn"
            onClick={() => dispatch({ type: 'UNLOCK_NIGHT', payload: { date: dateKey } })}
          >
            🔓 Atrakinti / Keisti rezervaciją
          </button>
        )}
      </div>
    );
  }

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
    } else {
      return;
    }

    const nights = mode === '3nights' ? 3 : 1;
    dispatch({
      type: 'LOCK_NIGHTS',
      payload: {
        startDate: '06.15',
        accommodation: { name, id, coordinates: coords, nights, emoji: '🏨' },
      },
    });
  };

  const canLock = usePreset ? !!selectedTownId : (!!customLat && !!customLng && !!hotelName.trim());

  return (
    <div className="lock-card unlocked">
      <div className="lock-header">
        <span className="lock-icon">🔓</span>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--snow)' }}>Patvirtinti rezervaciją</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Užrakinkite vietą, kad maršrutai perskaičiuotų</div>
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
        {LOCK_MODES.map((m) => (
          <button
            key={m.id}
            className={`strat-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <div className="strat-btn-title">{m.label}</div>
            <div className="strat-btn-desc">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button
          className={`map-layer-btn ${usePreset ? 'active' : ''}`}
          style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
          onClick={() => setUsePreset(true)}
        >
          📍 Miestelio sąrašas
        </button>
        <button
          className={`map-layer-btn ${!usePreset ? 'active' : ''}`}
          style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
          onClick={() => setUsePreset(false)}
        >
          ✏️ Rankinis įvedimas
        </button>
      </div>

      {usePreset ? (
        <div style={{ marginBottom: 8 }}>
          <select
            value={selectedTownId}
            onChange={(e) => setSelectedTownId(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
              fontFamily: 'DM Sans', fontSize: '0.82rem', marginBottom: 6,
            }}
          >
            <option value="">-- Pasirinkite miestelį --</option>
            {TOWNS.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.tag})</option>)}
          </select>
          <input
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            placeholder="Viešbučio / kotedžo pavadinimas (neprivaloma)"
            style={{
              width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
              fontFamily: 'DM Sans', fontSize: '0.82rem',
            }}
          />
        </div>
      ) : (
        <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            placeholder="Viešbučio pavadinimas *"
            style={{
              width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
              fontFamily: 'DM Sans', fontSize: '0.82rem',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              placeholder="Platuma (pvz. 46.4584)"
              style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
                fontFamily: 'DM Sans', fontSize: '0.78rem',
              }}
            />
            <input
              value={customLng}
              onChange={(e) => setCustomLng(e.target.value)}
              placeholder="Ilguma (pvz. 12.2051)"
              style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
                fontFamily: 'DM Sans', fontSize: '0.78rem',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            💡 Koordinates rasite Google Maps → dešiniu pelės mygtuku ant vietos
          </div>
        </div>
      )}

      <button
        className="export-btn"
        disabled={!canLock}
        onClick={handleLock}
        style={{ marginTop: 4 }}
      >
        🔒 Patvirtinti rezervaciją {mode === '3nights' ? '(3 naktims)' : '(1 nakčiai)'}
      </button>
    </div>
  );
}
