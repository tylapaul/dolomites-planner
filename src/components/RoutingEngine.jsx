import { useTripContext, getRoutingData, calcDepartureTime } from '../context/TripContext.jsx';
import { calcDistance, formatDuration, POIS } from '../data/tripData.js';

const DAY_TARGETS = {
  15: [{ poiId: 'braies',      name: 'Lago di Braies',       targetArrival: '09:00', emoji: '🏞️', urgent: false }],
  16: [{ poiId: 'trecime',     name: 'Tre Cime di Lavaredo', targetArrival: '08:00', emoji: '⛰️', urgent: true  }],
  17: [{ poiId: 'sorapis',     name: 'Lago di Sorapis',       targetArrival: '12:30', emoji: '💎', urgent: false }],
  18: [{ poiId: 'cinquetorri', name: 'Cinque Torri',          targetArrival: '10:00', emoji: '🗼', urgent: false }],
};

export default function RoutingEngine({ day }) {
  const { state } = useTripContext();
  const dateKey = `06.${String(day).padStart(2, '0')}`;
  const night = day === 18 ? state.nights['06.17'] : (state.nights[dateKey] || state.nights['06.15']);
  if (!night?.is_locked) return null;

  const targets = DAY_TARGETS[day];
  if (!targets) return null;

  const townId = night.accommodation_id;

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="section-label">🧭 Maršruto skaičiavimas</div>
      <div style={{ background: 'var(--bg3)', border: '1px solid rgba(82,168,121,0.35)', borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          📍 Startas ir finišas: <strong>{night.accommodation_name}</strong>
        </div>
        {targets.map((target) => {
          // Try pre-calculated first; fallback to Haversine
          const preCalc = getRoutingData(townId, target.poiId);
          const poi = POIS.find(p => p.id === target.poiId);
          let route;
          if (preCalc) {
            route = preCalc;
          } else if (night.coordinates && poi) {
            const hav = calcDistance(night.coordinates.lat, night.coordinates.lng, poi.coords.lat, poi.coords.lng);
            route = hav;
          } else {
            return null;
          }

          const departure = calcDepartureTime(target.targetArrival, route.min);

          return (
            <div key={target.poiId} style={{
              background: target.urgent ? 'rgba(224,82,82,0.08)' : 'rgba(0,0,0,0.2)',
              border: `1px solid ${target.urgent ? 'rgba(224,82,82,0.3)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 8, padding: 10, marginBottom: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--snow)' }}>
                  {target.emoji} {target.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  ~{route.km} km · {formatDuration(route.min)}
                </span>
              </div>
              <div style={{
                background: target.urgent ? 'rgba(224,82,82,0.15)' : 'rgba(201,168,76,0.1)',
                borderRadius: 6, padding: '7px 10px', fontSize: '0.78rem',
                color: target.urgent ? 'var(--danger)' : 'var(--gold)',
                display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.4,
              }}>
                {target.urgent ? '🚨' : '⏰'}
                Norint atvykti iki <strong style={{ margin: '0 3px' }}>{target.targetArrival}</strong>,
                išvykite vėliausiai <strong style={{ margin: '0 3px' }}>{departure}</strong>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
          ↩️ Grįžtama į: {night.accommodation_name}
        </div>
      </div>
    </div>
  );
}
