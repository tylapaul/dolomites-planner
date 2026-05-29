import { useTripContext, getRoutingData, calcDepartureTime } from '../context/TripContext.jsx';

const DAY_POI_MAP = {
  15: [
    { poiId: 'sorapis', name: 'Lago di Sorapis', targetArrival: '08:30', emoji: '💎' },
    { poiId: 'braies', name: 'Lago di Braies', targetArrival: '09:00', emoji: '🏞️' },
  ],
  16: [
    { poiId: 'trecime', name: 'Tre Cime di Lavaredo', targetArrival: '08:00', emoji: '⛰️', urgent: true },
  ],
  17: [
    { poiId: 'cinquetorri', name: 'Cinque Torri', targetArrival: '12:00', emoji: '🗼' },
  ],
};

export default function RoutingEngine({ day }) {
  const { state } = useTripContext();
  const dateKey = `06.${String(day).padStart(2, '0')}`;
  const night = state.nights[dateKey];

  if (!night?.is_locked) return null;

  const pois = DAY_POI_MAP[day];
  if (!pois) return null;

  const townId = night.accommodation_id || 'custom';

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="section-label">🧭 Maršruto skaičiavimas</div>
      <div style={{ background: 'var(--bg3)', border: '1px solid rgba(82,168,121,0.3)', borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📍</span>
          <span>Startas: <strong>{night.accommodation_name}</strong></span>
        </div>
        {pois.map((poi) => {
          const route = getRoutingData(townId, poi.poiId);
          const departure = calcDepartureTime(poi.targetArrival, route.min);
          return (
            <div
              key={poi.poiId}
              style={{
                background: poi.urgent ? 'rgba(224,82,82,0.08)' : 'rgba(0,0,0,0.2)',
                border: `1px solid ${poi.urgent ? 'rgba(224,82,82,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 8, padding: 10, marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--snow)' }}>
                  {poi.emoji} {poi.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {route.km} km · {route.min} min.
                </span>
              </div>
              <div style={{
                background: poi.urgent ? 'rgba(224,82,82,0.15)' : 'rgba(201,168,76,0.1)',
                borderRadius: 6, padding: '6px 10px',
                fontSize: '0.78rem',
                color: poi.urgent ? 'var(--danger)' : 'var(--gold)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {poi.urgent ? '🚨' : '⏰'}
                <span>
                  Norint atvykti iki <strong>{poi.targetArrival}</strong>,
                  išvykite iš viešbučio vėliausiai <strong>{departure}</strong>
                </span>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4 }}>
          ↩️ Grįžtama į: {night.accommodation_name}
        </div>
      </div>
    </div>
  );
}
