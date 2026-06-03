import { useState } from 'react';
import { useTripContext } from '../context/TripContext.jsx';
import { POIS, DAY_POI_MAP, calcDistance, formatDuration } from '../data/tripData.js';

const EMPTY_FORM = { name: '', address: '', lat: '', lng: '', notes: '', bookingUrl: '', inputMode: 'address' };

function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps?.Geocoder) { reject('Maps API nepasiekiamas'); return; }
    new window.google.maps.Geocoder().geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng(), formattedAddress: results[0].formatted_address });
      } else {
        reject('Adresas nerastas. Patikrinkite ir bandykite dar kartą.');
      }
    });
  });
}

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
  fontFamily: 'DM Sans', fontSize: '0.82rem', marginBottom: 6, boxSizing: 'border-box',
};

export default function MyHotels({ activeDay }) {
  const { state, dispatch } = useTripContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const myHotels = state.myHotels || [];
  const selectedId = state.selectedHotelId;

  const dayPois = POIS.filter(p => (DAY_POI_MAP[activeDay]?.pois || []).includes(p.id));

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleGeocode = async () => {
    if (!form.address.trim()) { setFormError('Įveskite adresą'); return; }
    setGeocoding(true); setFormError('');
    try {
      const { lat, lng, formattedAddress } = await geocodeAddress(form.address);
      setForm(f => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6), address: formattedAddress }));
    } catch (e) { setFormError(e); }
    finally { setGeocoding(false); }
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { setFormError('Įveskite viešbučio pavadinimą'); return; }
    let lat, lng;
    if (form.inputMode === 'address') {
      if (!form.lat || !form.lng) {
        // Try geocoding first
        if (!form.address.trim()) { setFormError('Įveskite adresą arba koordinates'); return; }
        setGeocoding(true); setFormError('');
        try {
          const result = await geocodeAddress(form.address);
          lat = result.lat; lng = result.lng;
        } catch (e) { setFormError(e); setGeocoding(false); return; }
        setGeocoding(false);
      } else {
        lat = parseFloat(form.lat); lng = parseFloat(form.lng);
      }
    } else {
      if (!form.lat || !form.lng) { setFormError('Koordinatės privalomos'); return; }
      lat = parseFloat(form.lat); lng = parseFloat(form.lng);
    }
    if (isNaN(lat) || isNaN(lng)) { setFormError('Neteisingos koordinatės'); return; }
    dispatch({ type: 'ADD_HOTEL', payload: { name: form.name.trim(), address: form.address.trim(), lat, lng, notes: form.notes.trim(), bookingUrl: form.bookingUrl.trim() } });
    setForm(EMPTY_FORM); setFormError(''); setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>Mano viešbučiai</div>
        <button onClick={() => { setShowForm(!showForm); setFormError(''); setForm(EMPTY_FORM); }}
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', color: 'var(--gold)', fontSize: '0.75rem', cursor: 'pointer' }}>
          {showForm ? '✕ Atšaukti' : '+ Pridėti'}
        </button>
      </div>

      {/* ── ADD FORM ── */}
      {showForm && (
        <div style={{ background: 'var(--bg3)', border: '1px dashed var(--border)', borderRadius: 10, padding: 12, marginBottom: 12 }}>

          {/* Name */}
          <input value={form.name} onChange={e => setField('name', e.target.value)}
            placeholder="Viešbučio / kotedžo pavadinimas *" style={inputStyle} />

          {/* Input mode toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[['address', '📍 Adresas'], ['coords', '🌐 Koordinatės']].map(([id, label]) => (
              <button key={id} onClick={() => setField('inputMode', id)}
                className={`map-layer-btn ${form.inputMode === id ? 'active' : ''}`}
                style={{ flex: 1, fontSize: '0.75rem', padding: 6 }}>
                {label}
              </button>
            ))}
          </div>

          {/* Address mode */}
          {form.inputMode === 'address' && (
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input value={form.address} onChange={e => { setField('address', e.target.value); setField('lat', ''); setField('lng', ''); }}
                  placeholder="Adresas, pvz. Via Roma 12, Cortina d'Ampezzo"
                  style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                <button onClick={handleGeocode} disabled={geocoding}
                  style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', color: 'var(--gold)', fontSize: '0.78rem', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {geocoding ? '⏳' : '🔍 Rasti'}
                </button>
              </div>
              {form.lat && form.lng && (
                <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginBottom: 6, padding: '4px 8px', background: 'rgba(82,168,121,0.1)', borderRadius: 6 }}>
                  ✅ Koordinatės rastos: {parseFloat(form.lat).toFixed(5)}, {parseFloat(form.lng).toFixed(5)}
                </div>
              )}
            </div>
          )}

          {/* Coords mode */}
          {form.inputMode === 'coords' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                <input value={form.lat} onChange={e => setField('lat', e.target.value)} placeholder="Platuma (46.4584)" style={{ ...inputStyle, marginBottom: 0 }} />
                <input value={form.lng} onChange={e => setField('lng', e.target.value)} placeholder="Ilguma (12.2051)" style={{ ...inputStyle, marginBottom: 0 }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 6 }}>
                💡 Google Maps → dešinys pelės mygtukas → nukopijuokite
              </div>
            </div>
          )}

          {/* Booking URL */}
          <input value={form.bookingUrl} onChange={e => setField('bookingUrl', e.target.value)}
            placeholder="🔗 Booking.com arba Airbnb nuoroda (neprivaloma)"
            style={inputStyle} />

          {/* Notes */}
          <textarea value={form.notes} onChange={e => setField('notes', e.target.value)}
            placeholder="Pliusai / Minusai / Komentaras (neprivaloma)&#10;Pvz: + Yra garažas, restoranas vietoje&#10;- Toliau nuo Cortinos"
            rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

          {formError && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: 6 }}>⚠️ {formError}</div>}

          <button className="export-btn" onClick={handleAdd} disabled={geocoding} style={{ marginTop: 0 }}>
            {geocoding ? '⏳ Ieškoma...' : '💾 Išsaugoti viešbutį'}
          </button>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {myHotels.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🏨</div>
          Dar nėra išsaugotų viešbučių.<br />Spausti „+ Pridėti" kad pradėti.
        </div>
      )}

      {/* ── HOTEL CARDS ── */}
      {myHotels.map((hotel) => {
        const isSelected = selectedId === hotel.id;
        const distances = dayPois.map(poi => ({ poi, ...calcDistance(hotel.lat, hotel.lng, poi.coords.lat, poi.coords.lng) }));

        return (
          <div key={hotel.id}
            onClick={() => dispatch({ type: 'SELECT_HOTEL', payload: isSelected ? null : hotel.id })}
            style={{
              background: isSelected ? 'rgba(245,158,66,0.1)' : 'var(--bg3)',
              border: `1px solid ${isSelected ? 'rgba(245,158,66,0.5)' : 'var(--border)'}`,
              borderRadius: 10, padding: 12, marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s',
            }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: isSelected ? '#f59e42' : 'var(--snow)' }}>
                  🏨 {hotel.name}
                </div>
                {hotel.address && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 2 }}>📍 {hotel.address}</div>
                )}
                {!hotel.address && hotel.lat && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 2 }}>📍 {hotel.lat.toFixed(4)}, {hotel.lng.toFixed(4)}</div>
                )}
              </div>
              <button onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_HOTEL', payload: hotel.id }); if (isSelected) dispatch({ type: 'SELECT_HOTEL', payload: null }); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px', lineHeight: 1 }}>✕</button>
            </div>

            {/* Booking link */}
            {hotel.bookingUrl && (
              <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ display: 'inline-block', marginTop: 7, background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.3)', borderRadius: 6, padding: '4px 10px', color: '#4fa3e0', textDecoration: 'none', fontSize: '0.75rem' }}>
                🔗 Peržiūrėti rezervaciją →
              </a>
            )}

            {/* Notes */}
            {hotel.notes && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '6px 8px', marginTop: 7, fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {hotel.notes}
              </div>
            )}

            {/* Distance to active day POI */}
            {isSelected && distances.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Atstumas iki šios dienos žygio
                </div>
                {distances.map(d => (
                  <div key={d.poi.id} style={{ background: 'rgba(245,158,66,0.12)', border: '1px solid rgba(245,158,66,0.3)', borderRadius: 7, padding: '8px 10px' }}>
                    <div style={{ color: '#f59e42', fontWeight: 500, marginBottom: 3, fontSize: '0.82rem' }}>
                      {d.poi.emoji} {d.poi.name}
                    </div>
                    <div style={{ color: 'var(--snow)', fontSize: '0.85rem' }}>
                      ~{d.km} km · {formatDuration(d.min)}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: 2 }}>
                      * Apytikris važiavimo laikas kalnų keliais
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSelected && (
              <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {distances.length > 0
                  ? `Spausti → atstumas iki ${dayPois[0]?.name}`
                  : 'Spausti → rodyti žemėlapyje'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
