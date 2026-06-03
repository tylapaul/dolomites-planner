import { useState } from 'react';
import { useTripContext } from '../context/TripContext.jsx';
import { POIS, DAY_POI_MAP, calcDistance, formatDuration } from '../data/tripData.js';

const EMPTY_FORM = { name: '', lat: '', lng: '', notes: '' };

export default function MyHotels({ activeDay }) {
  const { state, dispatch } = useTripContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const myHotels = state.myHotels || [];
  const selectedId = state.selectedHotelId;

  // Get active day's POI
  const dayData = DAY_POI_MAP[activeDay];
  const dayPoiIds = dayData?.pois || [];
  const dayPois = POIS.filter(p => dayPoiIds.includes(p.id));

  const handleAdd = () => {
    if (!form.name.trim()) { setFormError('Įveskite viešbučio pavadinimą'); return; }
    if (!form.lat || !form.lng) { setFormError('Koordinatės privalomos atstumų skaičiavimui'); return; }
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng)) { setFormError('Neteisingos koordinatės'); return; }
    dispatch({ type: 'ADD_HOTEL', payload: { name: form.name.trim(), lat, lng, notes: form.notes.trim() } });
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(false);
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
    fontFamily: 'DM Sans', fontSize: '0.82rem', marginBottom: 6,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>Mano viešbučiai</div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(''); }}
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', color: 'var(--gold)', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          {showForm ? '✕ Atšaukti' : '+ Pridėti'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: 'var(--bg3)', border: '1px dashed var(--border)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Viešbučio pavadinimas *" style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
              placeholder="Platuma *  (46.4584)" style={{ ...inputStyle, marginBottom: 0 }} />
            <input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
              placeholder="Ilguma *  (12.2051)" style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Pliusai / Minusai / Komentaras (neprivaloma)"
            rows={3} style={{ ...inputStyle, resize: 'vertical', marginBottom: 6 }} />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 8 }}>
            💡 Google Maps → dešinys pelės mygtukas ant vietos → nukopijuokite koordinates
          </div>
          {formError && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: 6 }}>⚠️ {formError}</div>}
          <button className="export-btn" onClick={handleAdd} style={{ marginTop: 0 }}>
            💾 Išsaugoti viešbutį
          </button>
        </div>
      )}

      {/* Hotels list */}
      {myHotels.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🏨</div>
          Dar nėra išsaugotų viešbučių.<br />Spausti „+ Pridėti" kad pradėti.
        </div>
      )}

      {myHotels.map((hotel) => {
        const isSelected = selectedId === hotel.id;

        // Calculate distances to active day POIs
        const distances = dayPois.map(poi => ({
          poi,
          ...calcDistance(hotel.lat, hotel.lng, poi.coords.lat, poi.coords.lng),
        }));

        return (
          <div key={hotel.id}
            style={{
              background: isSelected ? 'rgba(245,158,66,0.1)' : 'var(--bg3)',
              border: `1px solid ${isSelected ? 'rgba(245,158,66,0.5)' : 'var(--border)'}`,
              borderRadius: 10, padding: 12, marginBottom: 8,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onClick={() => dispatch({ type: 'SELECT_HOTEL', payload: isSelected ? null : hotel.id })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: isSelected ? '#f59e42' : 'var(--snow)' }}>
                  🏨 {hotel.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2 }}>
                  📍 {hotel.lat.toFixed(4)}, {hotel.lng.toFixed(4)}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_HOTEL', payload: hotel.id }); if (isSelected) dispatch({ type: 'SELECT_HOTEL', payload: null }); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.85rem', padding: 2 }}
              >✕</button>
            </div>

            {/* Notes */}
            {hotel.notes && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '6px 8px', marginTop: 8, fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.5 }}>
                {hotel.notes}
              </div>
            )}

            {/* Distance to active day POI */}
            {isSelected && distances.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Atstumas iki šios dienos žygio
                </div>
                {distances.map(d => (
                  <div key={d.poi.id} style={{
                    background: 'rgba(245,158,66,0.12)', border: '1px solid rgba(245,158,66,0.3)',
                    borderRadius: 7, padding: '8px 10px', fontSize: '0.8rem',
                  }}>
                    <div style={{ color: '#f59e42', fontWeight: 500, marginBottom: 3 }}>
                      {d.poi.emoji} {d.poi.name}
                    </div>
                    <div style={{ color: 'var(--snow)' }}>
                      ~{d.km} km · {formatDuration(d.min)}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: 2 }}>
                      * Apytikris važiavimo laikas kalnų keliais
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSelected && distances.length > 0 && (
              <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Spausti → pamatyti atstumą iki {dayPois[0]?.name}
              </div>
            )}

            {isSelected && distances.length === 0 && (
              <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Ši diena neturi konkretaus žygio taško.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
