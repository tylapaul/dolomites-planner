import { useState } from 'react';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS, NIGHT_ONE, generateDayPlans, RESTAURANTS, BRUNCH_SPOT, RIFUGIO, CAR_RENTAL, TRE_CIME_RESERVATION, TRE_CIME_TRANSPORT } from '../data/tripData.js';
import LockReservation from './LockReservation.jsx';
import RoutingEngine from './RoutingEngine.jsx';
import MyHotels from './MyHotels.jsx';

// ── Strategy Toggle ──────────────────────────────────────────────
function StrategyToggle({ strategy, setStrategy }) {
  return (
    <div className="strategy-toggle">
      <div className="strategy-label">Nakvynės strategija</div>
      <div className="strategy-btns">
        {[
          { id: 'A', label: 'A – Viena bazė', desc: '06.15–06.18 toje pačioje vietoje' },
          { id: 'B', label: 'B – Skirtinga kas naktį', desc: 'Nauja viešbutis kiekvienai dienai' },
        ].map(s => (
          <button key={s.id} className={`strat-btn ${strategy === s.id ? 'active' : ''}`} onClick={() => setStrategy(s.id)}>
            <div className="strat-btn-title">{s.label}</div>
            <div className="strat-btn-desc">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Town Selector ────────────────────────────────────────────────
function TownSelector() {
  const { state, dispatch } = useTripContext();
  const night15 = state.nights['06.15'];
  const isLocked = night15?.is_locked;

  if (isLocked) {
    const town = TOWNS.find(t => t.id === night15.accommodation_id);
    return (
      <div className="town-selector">
        <div className="section-label">Nakvynės vieta</div>
        <div className="lock-card locked">
          <div className="lock-header">
            <span className="lock-icon">🔒</span>
            <div style={{ flex: 1 }}>
              <div className="lock-name">{night15.emoji} {night15.accommodation_name}</div>
              <div className="lock-coords">📍 {night15.coordinates?.lat?.toFixed(4)}, {night15.coordinates?.lng?.toFixed(4)}</div>
              <div className="lock-times">✅ Birž. 15–18 · Check-in: 15:00 · Check-out: 10:00</div>
            </div>
            <span className="badge badge-fixed" style={{ flexShrink: 0 }}>Patvirtinta</span>
          </div>
          <button className="unlock-btn" onClick={() => dispatch({ type: 'UNLOCK_NIGHT', payload: { date: '06.15' } })}>
            🔓 Atrakinti / Keisti rezervaciją
          </button>
        </div>
        {town && (
          <a href={town.bookingUrl} target="_blank" rel="noopener noreferrer" className="booking-link">
            🏨 Peržiūrėti Booking.com → {night15.accommodation_name}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="town-selector">
      <div className="section-label">Pasirinkite miestelį</div>
      <div className="towns-grid">
        {TOWNS.map(t => (
          <div key={t.id}
            className={`town-card ${state.activeTown === t.id ? 'selected' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOWN', payload: t.id })}
          >
            <div><div className="town-name">{t.name}</div><div className="town-tag">{t.tag}</div></div>
            <span className="town-check">✓</span>
          </div>
        ))}
      </div>
      {state.activeTown && (
        <>
          <a href={TOWNS.find(t => t.id === state.activeTown)?.bookingUrl} target="_blank" rel="noopener noreferrer" className="booking-link">
            🏨 Ieškoti Booking.com → {TOWNS.find(t => t.id === state.activeTown)?.name}
          </a>
          <LockReservation />
        </>
      )}
    </div>
  );
}

// ── Parking Alert ────────────────────────────────────────────────
function ParkingAlert({ parking, poiName }) {
  if (!parking) return null;
  return (
    <div className={`parking-alert ${parking.urgent ? 'urgent' : ''}`}>
      <div className="parking-title">{parking.urgent ? '🚨' : '🅿️'} Parkavimas · {poiName}</div>
      <div className="parking-row"><span>Kaina:</span><span>{parking.cost}</span></div>
      <div className="parking-row"><span>Taisyklė:</span><span>{parking.rule}</span></div>
      {parking.note && <div className="parking-row"><span>Pastaba:</span><span style={{ color: parking.urgent ? 'var(--danger)' : 'var(--warn)' }}>{parking.note}</span></div>}
    </div>
  );
}

// ── Car Rental ───────────────────────────────────────────────────
function CarRentalCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="castle-card" style={{ borderColor: 'rgba(201,168,76,0.4)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="castle-name">🚗 {CAR_RENTAL.company} · {CAR_RENTAL.car}</div>
        <span className="badge badge-fixed">Rezervuota</span>
      </div>
      <div className="castle-desc" style={{ marginTop: 6 }}>{CAR_RENTAL.class}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
        {[['PAĖMIMAS', CAR_RENTAL.pickup.date + ' · ' + CAR_RENTAL.pickup.time, true],
          ['GRĄŽINIMAS', CAR_RENTAL.dropoff.date + ' · ' + CAR_RENTAL.dropoff.time, false]].map(([label, val, gold]) => (
          <div key={label} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: '0.82rem', color: gold ? 'var(--gold)' : 'var(--snow)' }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 8 }}>Užsakymo Nr.: <span style={{ color: 'var(--gold-light)' }}>{CAR_RENTAL.bookingRef}</span></div>
      <button onClick={() => setOpen(!open)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--gold)', fontSize: '0.75rem', padding: '5px 10px', cursor: 'pointer', marginTop: 8, width: '100%' }}>
        {open ? '▲ Slėpti' : '📍 Kaip rasti Ecovia biurą?'}
      </button>
      {open && (
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 10, marginTop: 8, fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.6 }}>
          <div style={{ color: 'var(--gold-light)', fontWeight: 500, marginBottom: 4 }}>📍 {CAR_RENTAL.address}</div>
          {CAR_RENTAL.pickupGuide}
        </div>
      )}
    </div>
  );
}

// ── Tre Cime Transport ───────────────────────────────────────────
function TreCimeCard({ transport, setTransport }) {
  const isBus = transport === 'bus';
  const bus = TRE_CIME_TRANSPORT.byBus;
  const total = bus.parkingCost + bus.shuttleCostPerPerson * bus.persons;
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="strategy-toggle" style={{ marginBottom: 10 }}>
        <div className="strategy-label">Transportas iki Tre Cime</div>
        <div className="strategy-btns">
          <button className={`strat-btn ${!isBus ? 'active' : ''}`} onClick={() => setTransport('car')}>
            <div className="strat-btn-title">🚗 Savo auto</div><div className="strat-btn-desc">Rifugio Auronzo. 40€.</div>
          </button>
          <button className={`strat-btn ${isBus ? 'active' : ''}`} onClick={() => setTransport('bus')}>
            <div className="strat-btn-title">🚌 Autobusu</div><div className="strat-btn-desc">Misurina + šatlas. ~{total}€.</div>
          </button>
        </div>
      </div>
      <div className="parking-alert" style={{ borderColor: isBus ? 'rgba(79,163,224,0.4)' : 'var(--border)' }}>
        <div className="parking-title" style={{ color: isBus ? 'var(--ice)' : 'var(--gold)' }}>💶 Išlaidų suvestinė</div>
        {isBus ? (
          <>
            <div className="parking-row"><span>🅿️ Misurina:</span><span>{bus.parkingCost}€</span></div>
            <div className="parking-row"><span>🚌 Šatlas (4×{bus.shuttleCostPerPerson}€):</span><span>{bus.shuttleCostPerPerson * bus.persons}€</span></div>
            <div className="parking-row" style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
              <span style={{ fontWeight: 500, color: 'var(--snow)' }}>Iš viso:</span><span style={{ color: 'var(--gold)', fontWeight: 500 }}>{total}€</span>
            </div>
            <a href={bus.shuttleUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', marginTop: 8, textAlign: 'center', background: 'rgba(79,163,224,0.12)', border: '1px solid rgba(79,163,224,0.3)', borderRadius: 6, padding: 6, color: 'var(--ice)', textDecoration: 'none', fontSize: '0.75rem' }}>
              🕐 Tvarkaraštis → dolomitibus.it
            </a>
          </>
        ) : (
          <>
            <div className="parking-row"><span>🅿️ Rifugio Auronzo:</span><span>40€ / 12 val.</span></div>
            <div className="parking-row"><span>⏰ Taisyklė:</span><span style={{ color: 'var(--danger)' }}>Iki 08:00!</span></div>
          </>
        )}
      </div>
      <div className="parking-alert urgent" style={{ borderColor: 'rgba(224,138,82,0.5)' }}>
        <div className="parking-title" style={{ color: 'var(--warn)' }}>⚠️ Privaloma rezervacija iš anksto</div>
        <div style={{ fontSize: '0.77rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: 8 }}>{TRE_CIME_RESERVATION.notice}</div>
        <a href={TRE_CIME_RESERVATION.url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', background: 'rgba(224,138,82,0.15)', border: '1px solid rgba(224,138,82,0.4)', borderRadius: 6, padding: 8, color: 'var(--warn)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
          🎫 Rezervuoti → pass.auronzo.info
        </a>
      </div>
    </div>
  );
}

// ── Birthday Card ────────────────────────────────────────────────
function BirthdayCard({ number, townId, isBrunch }) {
  const isCortina = townId === 'cortina';
  const restaurant = isCortina ? RESTAURANTS.nearCortina : RESTAURANTS.nearCadore;
  if (isBrunch) return (
    <div className="birthday-card">
      <div className="birthday-title">🎂 Gimtadienis #{number}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: 8 }}>Lengva diena · vėlyvas startas 🌞</div>
      {[BRUNCH_SPOT, RIFUGIO].map(s => (
        <div key={s.name} className="birthday-restaurant" style={{ marginBottom: 6 }}>
          <div className="rest-name">{s.emoji} {s.name}</div>
          <div className="rest-type">{s.address}</div>
          <div className="rest-note">{s.note}</div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="birthday-card">
      <div className="birthday-title">🎂 Gimtadienis #{number} – vakarienė</div>
      <div className="birthday-restaurant">
        <div className="rest-name">{restaurant.emoji} {restaurant.name}</div>
        <div className="rest-type">{restaurant.type} · {restaurant.priceRange}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: 2 }}>{restaurant.address}</div>
        <div className="rest-note">⚠️ {restaurant.note}</div>
        <a href={restaurant.bookingUrl} target="_blank" rel="noopener noreferrer" className="rest-link">📅 Rezervuoti stalą →</a>
      </div>
    </div>
  );
}

// ── Day Plan Panel ───────────────────────────────────────────────
function DayPlanPanel({ day, onFlyTo, transport, setTransport }) {
  const { state } = useTripContext();
  const dateKey = `06.${String(day).padStart(2, '0')}`;
  const night = state.nights[dateKey] || state.nights['06.15'];
  const isLocked = night?.is_locked;
  const townId = isLocked ? night.accommodation_id : state.activeTown;

  const plans = townId ? generateDayPlans(townId) : null;
  const plan = plans?.find(p => p.day === day);

  if (!plan) return (
    <div className="no-selection">
      <div className="big-icon">👆</div>
      <h3>Pasirinkite miestelį</h3>
      <p>Pasirinkite nakvynės vietą ir patvirtinkite rezervaciją, kad pamatytumėte dienos planą su tiksliais maršrutais.</p>
    </div>
  );

  return (
    <div className="day-plan">
      <div className="day-plan-header">
        <div>
          <div className="day-plan-title">{plan.title}</div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: 2 }}>{plan.date}</div>
        </div>
        <div style={{ display: 'flex', gap: 5, marginLeft: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {isLocked && <span className="badge badge-fixed">🔒 Rezervuota</span>}
          {plan.type === 'birthday' && <span className="badge badge-birthday">🎂 Gimtadienis</span>}
        </div>
      </div>

      <RoutingEngine day={day} />

      <div className="events-list">
        {plan.events.map((e, i) => (
          <div key={i} className={`event-row ${e.warning ? 'warning' : ''}`}>
            <span className="event-time">{e.time}</span>
            <span className="event-icon">{e.icon}</span>
            <span className="event-text">{e.text}</span>
          </div>
        ))}
      </div>

      {day === 16 && <div style={{ marginTop: 12 }}><TreCimeCard transport={transport} setTransport={setTransport} /></div>}
      {day !== 16 && plan.parking && <div style={{ marginTop: 12 }}><ParkingAlert parking={plan.parking} poiName={plan.poi?.name} /></div>}
      {day === 16 && <BirthdayCard number={1} townId={townId} isBrunch={false} />}
      {day === 17 && <BirthdayCard number={2} townId={townId} isBrunch={true} />}

      {plan.poi && (
        <button className="export-btn"
          style={{ background: 'var(--bg3)', color: 'var(--gold)', border: '1px solid var(--border)', marginTop: 6 }}
          onClick={() => onFlyTo(day === 16 && transport === 'bus' ? TRE_CIME_TRANSPORT.byBus.parkingCoords : plan.poi.coords)}>
          🗺️ Rodyti žemėlapyje → {day === 16 && transport === 'bus' ? 'Misurina' : plan.poi.name}
        </button>
      )}
    </div>
  );
}

// ── Venice Panel ─────────────────────────────────────────────────
function VenicePanel() {
  return (
    <div>
      <div className="castle-card" style={{ borderColor: 'rgba(79,163,224,0.35)', background: 'linear-gradient(135deg,rgba(26,58,92,0.4),rgba(26,37,64,0.5))' }}>
        <div className="castle-name">🚢 Venecija pratęsimas</div>
        <div className="castle-desc">2 asmenys lieka Venecijoje iki birželio 20 d.</div>
        <div className="castle-detail" style={{ color: 'var(--ice)' }}>🚂 Venezia Mestre → Santa Lucia (~10 min.)</div>
      </div>
      {['🚢 Gondolų kanalas · Rialto · San Marco', '🏛️ Dožų rūmai · Gallerie dell\'Accademia', '🏝️ Murano · Burano (spalvoti nameliai)', '🍽️ Cicchetti ir Spritz – tikras venetiškas vakaras'].map((t, i) => (
        <div key={i} className="event-row" style={{ marginTop: 4 }}>
          <span className="event-icon" style={{ gridColumn: 2 }}>{t.slice(0, 2)}</span>
          <span className="event-text" style={{ gridColumn: 3 }}>{t.slice(3)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Day 14 Panel ─────────────────────────────────────────────────
function Day14Panel() {
  return (
    <div>
      <div className="section-label">Skrydžiai ir logistika</div>
      <div className="flight-card">
        {[['✈️ Atvykimas', '06.14 · 13:55 TSF', true], ['✈️ Išskridimas (2 asm.)', '06.18 · 20:40 TSF', false], ['🚂 Venecija (2 asm.)', '06.18–06.20 · Mestre', false]].map(([l, v, g]) => (
          <div key={l} className="flight-row"><span className="flight-label">{l}</span><span className={`flight-value ${g ? 'gold' : ''}`}>{v}</span></div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
      <div className="section-label">Automobilio nuoma</div>
      <CarRentalCard />
      <div className="section-label">Pirmoji naktis</div>
      <div className="castle-card">
        <div className="castle-name">🏰 Castello di Roncade</div>
        <div className="castle-desc">{NIGHT_ONE.description}</div>
        <div className="castle-detail">✓ Fiksuota rezervacija · {NIGHT_ONE.distance_from_tsf}</div>
      </div>
      <div className="events-list">
        {[
          { time: '13:55', icon: '✈️', text: 'Nusileidimas Trevize (TSF)' },
          { time: '14:30', icon: '🚗', text: 'Ecovia – Via Noalese 63E (2 min. pėsčiomis)' },
          { time: '15:15', icon: '🏰', text: 'Castello di Roncade (~25 min.)' },
          { time: '18:00', icon: '🍷', text: 'Vyno degustacija vynuogyne' },
          { time: '20:00', icon: '🍝', text: 'Vakarienė vietiniame restorane' },
        ].map((e, i) => (
          <div key={i} className="event-row">
            <span className="event-time">{e.time}</span><span className="event-icon">{e.icon}</span><span className="event-text">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Export Button ────────────────────────────────────────────────
function ExportButton({ transport }) {
  const { state } = useTripContext();
  const night = state.nights['06.15'];
  const townId = night?.is_locked ? night.accommodation_id : state.activeTown;
  const town = TOWNS.find(t => t.id === townId);
  if (!town) return null;
  const isBus = transport === 'bus';
  const stop = isBus ? '46.5828,12.2547' : '46.6124,12.2964';
  const url = `https://www.google.com/maps/dir/${encodeURIComponent(town.name + ', Italy')}/${stop}/46.5181,12.0374`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <button className="export-btn">🗺️ Eksportuoti maršrutą į Google Maps</button>
    </a>
  );
}

// ── MAIN SIDEBAR ─────────────────────────────────────────────────
export default function Sidebar({ strategy, setStrategy, activeDay, onFlyTo }) {
  const [transport, setTransport] = useState('car');
  const [tab, setTab] = useState('plan'); // 'plan' | 'hotels'
  const show14 = activeDay === 14;
  const showVenice = activeDay === 19 || activeDay === 20;
  const showPlanning = !show14 && !showVenice && activeDay <= 17;
  const show18 = activeDay === 18;

  return (
    <aside className="sidebar">

      {/* Tabs – only for planning days */}
      {showPlanning && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {[['hotels', '🏨 Mano viešbučiai'], ['plan', '📅 Planas']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                flex: 1, background: 'none', border: 'none', padding: '10px 0',
                color: tab === id ? 'var(--gold)' : 'var(--text-dim)',
                borderBottom: tab === id ? '2px solid var(--gold)' : '2px solid transparent',
                fontFamily: 'DM Sans', fontSize: '0.8rem', cursor: 'pointer', fontWeight: tab === id ? 500 : 400,
                transition: 'all 0.2s',
              }}
            >{label}</button>
          ))}
        </div>
      )}

      <div className="sidebar-scroll">
        {show14 && <Day14Panel />}
        {showVenice && <VenicePanel />}

        {showPlanning && tab === 'plan' && (
          <>
            <StrategyToggle strategy={strategy} setStrategy={setStrategy} />
            <TownSelector />
            <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
            <DayPlanPanel day={activeDay} onFlyTo={onFlyTo} transport={transport} setTransport={setTransport} />
            <ExportButton transport={transport} />
          </>
        )}

        {showPlanning && tab === 'hotels' && (
          <MyHotels activeDay={activeDay} />
        )}

        {show18 && (
          <div>
            <div className="castle-card" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
              <div className="castle-name">✈️ Išvykimo diena</div>
              <div className="castle-desc">Grąžinimas automobilio ir skrydis atgal.</div>
            </div>
            {[
              { time: '09:00', icon: '🌄', text: 'Paskutiniai pusryčiai Dolomituose' },
              { time: '10:00', icon: '🏨', text: 'Išsiregistravimas' },
              { time: '10:30', icon: '🚗', text: 'Išvykimas į Trevizo / Veneciją (~2.5 val.)' },
              { time: '13:00', icon: '🚂', text: '2 asm. → Venezia Mestre' },
              { time: '17:30', icon: '🚗', text: '2 asm. → TSF oro uostas' },
              { time: '18:30', icon: '🚗', text: 'Automobilio grąžinimas Ecovia · #734670081' },
              { time: '20:40', icon: '✈️', text: 'Skrydis atgal iš TSF' },
            ].map((e, i) => (
              <div key={i} className="event-row">
                <span className="event-time">{e.time}</span><span className="event-icon">{e.icon}</span><span className="event-text">{e.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
