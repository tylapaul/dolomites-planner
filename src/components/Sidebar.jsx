import { useState } from 'react';
import { useTripContext } from '../context/TripContext.jsx';
import { TOWNS, NIGHT_ONE, generateDayPlans, RESTAURANTS, BRUNCH_SPOT, RIFUGIO, CAR_RENTAL, TRE_CIME_RESERVATION, TRE_CIME_TRANSPORT } from '../data/tripData.js';
import LockReservation from './LockReservation.jsx';
import RoutingEngine from './RoutingEngine.jsx';

function StrategyToggle({ strategy, setStrategy }) {
  return (
    <div className="strategy-toggle">
      <div className="strategy-label">Nakvynės strategija</div>
      <div className="strategy-btns">
        <button className={`strat-btn ${strategy === 'A' ? 'active' : ''}`} onClick={() => setStrategy('A')}>
          <div className="strat-btn-title">A – Viena bazė</div>
          <div className="strat-btn-desc">06.15–06.18 toje pačioje vietoje. Kotedžas 4 asm. iki 350€/n.</div>
        </button>
        <button className={`strat-btn ${strategy === 'B' ? 'active' : ''}`} onClick={() => setStrategy('B')}>
          <div className="strat-btn-title">B – Skirtinga kas naktį</div>
          <div className="strat-btn-desc">Nauja viešbutis kiekvienai dienai. Daugiau lankstumo.</div>
        </button>
      </div>
    </div>
  );
}

function TownSelector() {
  const { state, dispatch } = useTripContext();
  const night15 = state.nights['06.15'];
  const isLocked = night15?.is_locked;
  const selectedTownId = isLocked ? night15.accommodation_id : null;
  const town = TOWNS.find((t) => t.id === selectedTownId);

  if (isLocked) return null;

  return (
    <div className="town-selector">
      <div className="section-label">Pasirinkite miestelį</div>
      <div className="towns-grid">
        {TOWNS.map((t) => (
          <div
            key={t.id}
            className={`town-card ${state.activeTown === t.id ? 'selected' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOWN', payload: t.id })}
          >
            <div>
              <div className="town-name">{t.name}</div>
              <div className="town-tag">{t.tag}</div>
            </div>
            <span className="town-check">✓</span>
          </div>
        ))}
      </div>
      {state.activeTown && (
        <a
          href={TOWNS.find(t => t.id === state.activeTown)?.bookingUrl}
          target="_blank" rel="noopener noreferrer"
          className="booking-link"
        >
          🏨 Ieškoti būsto Booking.com → {TOWNS.find(t => t.id === state.activeTown)?.name}
        </a>
      )}
    </div>
  );
}

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

function CarRentalCard() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="castle-card" style={{ borderColor: 'rgba(201,168,76,0.4)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="castle-name">🚗 {CAR_RENTAL.company} · {CAR_RENTAL.car}</div>
        <span className="badge badge-fixed">Rezervuota</span>
      </div>
      <div className="castle-desc" style={{ marginTop: 6 }}>{CAR_RENTAL.class}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: 2 }}>PAĖMIMAS</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>{CAR_RENTAL.pickup.date} · {CAR_RENTAL.pickup.time}</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: 2 }}>GRĄŽINIMAS</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--snow)' }}>{CAR_RENTAL.dropoff.date} · {CAR_RENTAL.dropoff.time}</div>
        </div>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 8 }}>
        Užsakymo Nr.: <span style={{ color: 'var(--gold-light)' }}>{CAR_RENTAL.bookingRef}</span>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--gold)', fontSize: '0.75rem', padding: '5px 10px', cursor: 'pointer', marginTop: 8, width: '100%' }}
      >
        {expanded ? '▲ Slėpti' : '📍 Kaip rasti Ecovia biurą?'}
      </button>
      {expanded && (
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 10, marginTop: 8, fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.6 }}>
          <div style={{ color: 'var(--gold-light)', fontWeight: 500, marginBottom: 4 }}>📍 {CAR_RENTAL.address}</div>
          {CAR_RENTAL.pickupGuide}
        </div>
      )}
    </div>
  );
}

function TreCimeReservationCard({ transport, setTransport }) {
  const isBus = transport === 'bus';
  const busData = TRE_CIME_TRANSPORT.byBus;
  const shuttleTotal = busData.shuttleCostPerPerson * busData.persons;
  const totalCost = isBus ? (busData.parkingCost + shuttleTotal) : TRE_CIME_TRANSPORT.byCar.parkingCost;

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="strategy-toggle" style={{ marginBottom: 10 }}>
        <div className="strategy-label">Transportas iki Tre Cime</div>
        <div className="strategy-btns">
          <button className={`strat-btn ${!isBus ? 'active' : ''}`} onClick={() => setTransport('car')}>
            <div className="strat-btn-title">🚗 Savo auto</div>
            <div className="strat-btn-desc">Iki Rifugio Auronzo. Kaina: 40€.</div>
          </button>
          <button className={`strat-btn ${isBus ? 'active' : ''}`} onClick={() => setTransport('bus')}>
            <div className="strat-btn-title">🚌 Autobusu</div>
            <div className="strat-btn-desc">Misurina + šatlas. ~{busData.parkingCost + shuttleTotal}€.</div>
          </button>
        </div>
      </div>

      <div className="parking-alert" style={{ borderColor: isBus ? 'rgba(79,163,224,0.4)' : 'var(--border)' }}>
        <div className="parking-title" style={{ color: isBus ? 'var(--ice)' : 'var(--gold)' }}>💶 Išlaidų suvestinė · Tre Cime</div>
        {isBus ? (
          <>
            <div className="parking-row"><span>🅿️ Misurina aikštelė:</span><span>{busData.parkingCost}€</span></div>
            <div className="parking-row"><span>🚌 Šatlas (4 × {busData.shuttleCostPerPerson}€):</span><span>{shuttleTotal}€</span></div>
            <div className="parking-row" style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
              <span style={{ color: 'var(--snow)', fontWeight: 500 }}>Iš viso:</span>
              <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{totalCost}€</span>
            </div>
            <a href={busData.shuttleUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', marginTop: 8, textAlign: 'center', background: 'rgba(79,163,224,0.12)', border: '1px solid rgba(79,163,224,0.3)', borderRadius: 6, padding: 6, color: 'var(--ice)', textDecoration: 'none', fontSize: '0.75rem' }}>
              🕐 Tvarkaraštis → dolomitibus.it
            </a>
          </>
        ) : (
          <>
            <div className="parking-row"><span>🅿️ Rifugio Auronzo:</span><span>40€ / 12 val.</span></div>
            <div className="parking-row"><span>⏰ Taisyklė:</span><span style={{ color: 'var(--danger)' }}>Atvykti iki 08:00!</span></div>
          </>
        )}
      </div>

      <div className="parking-alert urgent" style={{ borderColor: 'rgba(224,138,82,0.5)' }}>
        <div className="parking-title" style={{ color: 'var(--warn)' }}>⚠️ Privaloma rezervacija iš anksto</div>
        <div style={{ fontSize: '0.77rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: 8 }}>{TRE_CIME_RESERVATION.notice}</div>
        <a href={TRE_CIME_RESERVATION.url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', background: 'rgba(224,138,82,0.15)', border: '1px solid rgba(224,138,82,0.4)', borderRadius: 6, padding: 8, color: 'var(--warn)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
          🎫 Rezervuoti leidimą → pass.auronzo.info
        </a>
      </div>
    </div>
  );
}

function BirthdayCard({ number, selectedTown, isBrunch }) {
  const isCortina = selectedTown === 'cortina';
  const restaurant = isCortina ? RESTAURANTS.nearCortina : RESTAURANTS.nearCadore;
  if (isBrunch) {
    return (
      <div className="birthday-card">
        <div className="birthday-title">🎂 Gimtadienis #{number} – programa</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: 8 }}>Lengva diena su vėlyvu startu 🌞</div>
        <div className="birthday-restaurant">
          <div className="rest-name">{BRUNCH_SPOT.emoji} {BRUNCH_SPOT.name}</div>
          <div className="rest-type">Brunch · {BRUNCH_SPOT.address}</div>
          <div className="rest-note">{BRUNCH_SPOT.note}</div>
        </div>
        <div className="birthday-restaurant" style={{ marginTop: 8 }}>
          <div className="rest-name">{RIFUGIO.emoji} {RIFUGIO.name}</div>
          <div className="rest-type">Po keltuvo · Cinque Torri</div>
          <div className="rest-note">{RIFUGIO.note}</div>
        </div>
      </div>
    );
  }
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

function Day14Panel() {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        Skrydžiai ir logistika <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'inline-block' }}/>
      </div>
      <div className="flight-card">
        <div className="flight-row"><span className="flight-label">✈️ Atvykimas</span><span className="flight-value gold">06.14 · 13:55 TSF</span></div>
        <div className="flight-row"><span className="flight-label">✈️ Išskridimas (2 asm.)</span><span className="flight-value">06.18 · 20:40 TSF</span></div>
        <div className="flight-row"><span className="flight-label">🚂 Venecija (2 asm.)</span><span className="flight-value">06.18–06.20 · Mestre</span></div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
      <div className="section-label">Automobilio nuoma</div>
      <CarRentalCard />
      <div className="section-label">Pirmoji naktis</div>
      <div className="castle-card">
        <div className="castle-name">🏰 Castello di Roncade</div>
        <div className="castle-desc">{NIGHT_ONE.description}</div>
        <div className="castle-detail">✓ Fiksuota rezervacija · 06.14–06.15 · {NIGHT_ONE.distance_from_tsf}</div>
      </div>
      <div className="events-list">
        {[
          { time: '13:55', icon: '✈️', text: 'Nusileidimas Trevize (TSF)' },
          { time: '14:30', icon: '🚗', text: 'Ecovia biuras – Via Noalese 63E (2 min. pėsčiomis)' },
          { time: '15:15', icon: '🏰', text: 'Atvykimas į Castello di Roncade (~25 min.)' },
          { time: '18:00', icon: '🍷', text: 'Vyno degustacija pilies vynuogyne' },
          { time: '20:00', icon: '🍝', text: 'Vakarienė vietiniame restorane' },
        ].map((e, i) => (
          <div key={i} className="event-row">
            <span className="event-time">{e.time}</span>
            <span className="event-icon">{e.icon}</span>
            <span className="event-text">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayPlanPanel({ day, onFlyTo, transport, setTransport }) {
  const { state } = useTripContext();
  const dateKey = `06.${String(day).padStart(2, '0')}`;
  const night = state.nights[dateKey];
  const isLocked = night?.is_locked;
  const townId = isLocked ? night.accommodation_id : state.activeTown;
  const selectedTown = townId;

  const plans = townId ? generateDayPlans(townId) : null;
  const plan = plans?.find((p) => p.day === day);

  if (!plan) {
    return (
      <div className="no-selection">
        <div className="big-icon">👆</div>
        <h3>Pasirinkite miestelį</h3>
        <p>Pasirinkite nakvynės vietą aukščiau, kad pamatytumėte dienos planą.</p>
      </div>
    );
  }

  return (
    <div className="day-plan">
      <div className="day-plan-header">
        <div>
          <div className="day-plan-title">{plan.title}</div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: 2 }}>{plan.date}</div>
        </div>
        {isLocked && <span className="badge badge-fixed" style={{ marginLeft: 'auto' }}>🔒 Rezervuota</span>}
        {plan.type === 'birthday' && <span className="badge badge-birthday">Gimtadienis</span>}
      </div>

      {/* Routing engine - shows departure times if locked */}
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

      {day === 16 && (
        <div style={{ marginTop: 12 }}>
          <TreCimeReservationCard transport={transport} setTransport={setTransport} />
        </div>
      )}

      {day !== 16 && plan.parking && (
        <div style={{ marginTop: 12 }}>
          <ParkingAlert parking={plan.parking} poiName={plan.poi?.name} />
        </div>
      )}

      {day === 16 && <BirthdayCard number={1} selectedTown={selectedTown} isBrunch={false} />}
      {day === 17 && <BirthdayCard number={2} selectedTown={selectedTown} isBrunch={true} />}

      {plan.poi && (
        <button
          className="export-btn"
          style={{ background: 'var(--bg3)', color: 'var(--gold)', border: '1px solid var(--border)', marginTop: 6 }}
          onClick={() => onFlyTo(day === 16 && transport === 'bus' ? TRE_CIME_TRANSPORT.byBus.parkingCoords : plan.poi.coords)}
        >
          🗺️ Rodyti žemėlapyje → {day === 16 && transport === 'bus' ? 'Misurina' : plan.poi.name}
        </button>
      )}
    </div>
  );
}

function VenicePanel() {
  return (
    <div>
      <div className="castle-card" style={{ borderColor: 'rgba(79,163,224,0.35)', background: 'linear-gradient(135deg, rgba(26,58,92,0.4), rgba(26,37,64,0.5))' }}>
        <div className="castle-name">🚢 Venecija pratęsimas</div>
        <div className="castle-desc">2 asmenys lieka Venecijoje iki birželio 20 d.</div>
        <div className="castle-detail" style={{ color: 'var(--ice)' }}>🚂 Venezia Mestre → Santa Lucia (~10 min.)</div>
      </div>
      {['🚢 Gondolų kanalas · Rialto tiltas · San Marco', '🏛️ Dožų rūmai · Gallerie dell\'Accademia', '🏝️ Murano sala · Burano (spalvotos nameliai)', '🍽️ Cicchetti ir Spritz – tikras venetiškas vakaras'].map((t, i) => (
        <div key={i} className="event-row" style={{ marginTop: 4 }}>
          <span className="event-icon" style={{ gridColumn: 2 }}>{t.slice(0, 2)}</span>
          <span className="event-text" style={{ gridColumn: 3 }}>{t.slice(3)}</span>
        </div>
      ))}
    </div>
  );
}

function ExportButton({ transport }) {
  const { state } = useTripContext();
  const night = state.nights['06.15'];
  const townId = night?.is_locked ? night.accommodation_id : state.activeTown;
  const town = TOWNS.find((t) => t.id === townId);
  if (!town) return null;
  const isBus = transport === 'bus';
  const trecimeStop = isBus ? '46.5828,12.2547' : '46.6124,12.2964';
  const url = `https://www.google.com/maps/dir/${encodeURIComponent(town.name + ', Italy')}/${trecimeStop}/46.5181,12.0374`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <button className="export-btn">🗺️ Eksportuoti maršrutą į Google Maps</button>
    </a>
  );
}

export default function Sidebar({ strategy, setStrategy, activeDay, onFlyTo }) {
  const [transport, setTransport] = useState('car');
  const { state } = useTripContext();
  const showVenice = activeDay === 19 || activeDay === 20;
  const show14 = activeDay === 14;
  const night15 = state.nights['06.15'];
  const isAnythingLocked = night15?.is_locked;
  const townId = isAnythingLocked ? night15.accommodation_id : state.activeTown;

  return (
    <aside className="sidebar">
      <div className="sidebar-scroll">

        {/* Day 14 */}
        {show14 && <Day14Panel />}

        {/* Venice */}
        {showVenice && <VenicePanel />}

        {/* Planning days 15-17 */}
        {!show14 && !showVenice && activeDay <= 17 && (
          <>
            {/* Strategy toggle only if not locked */}
            {!isAnythingLocked && <StrategyToggle strategy={strategy} setStrategy={setStrategy} />}

            {/* Town selector (hidden when locked) */}
            <TownSelector />

            {/* Lock reservation card */}
            <LockReservation activeDay={activeDay} />

            <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />

            {/* Day plan */}
            <DayPlanPanel
              day={activeDay}
              onFlyTo={onFlyTo}
              transport={transport}
              setTransport={setTransport}
            />
          </>
        )}

        {/* Day 18 - departure */}
        {activeDay === 18 && (
          <div>
            <div className="castle-card" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
              <div className="castle-name">✈️ Išvykimo diena</div>
              <div className="castle-desc">Paskutiniai pusryčiai Dolomituose, išsiregistravimas.</div>
            </div>
            {[
              { time: '09:00', icon: '🌄', text: 'Paskutiniai pusryčiai Dolomituose' },
              { time: '10:00', icon: '🏨', text: 'Išsiregistravimas' },
              { time: '10:30', icon: '🚗', text: 'Išvykimas į Trevizo / Veneciją (~2.5 val.)' },
              { time: '13:00', icon: '🚂', text: '2 asm. → Venezia Mestre' },
              { time: '17:30', icon: '🚗', text: '2 asm. → TSF oro uostas' },
              { time: '18:30', icon: '🚗', text: 'Automobilio grąžinimas Ecovia (užsakymas #734670081)' },
              { time: '20:40', icon: '✈️', text: 'Skrydis atgal iš TSF' },
            ].map((e, i) => (
              <div key={i} className="event-row">
                <span className="event-time">{e.time}</span>
                <span className="event-icon">{e.icon}</span>
                <span className="event-text">{e.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Export button */}
        {!show14 && !showVenice && activeDay <= 17 && <ExportButton transport={transport} />}

      </div>
    </aside>
  );
}
