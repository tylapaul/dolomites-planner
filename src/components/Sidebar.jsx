import { TOWNS, NIGHT_ONE, FLIGHTS, generateDayPlans, POIS, RESTAURANTS, BRUNCH_SPOT, RIFUGIO } from '../data/tripData.js';

function StrategyToggle({ strategy, setStrategy }) {
  return (
    <div className="strategy-toggle">
      <div className="strategy-label">Nakvynės strategija</div>
      <div className="strategy-btns">
        <button
          className={`strat-btn ${strategy === 'A' ? 'active' : ''}`}
          onClick={() => setStrategy('A')}
        >
          <div className="strat-btn-title">A – Viena bazė</div>
          <div className="strat-btn-desc">06.15–06.18 toje pačioje vietoje. Kotedžas 4 asm. iki 350€/n.</div>
        </button>
        <button
          className={`strat-btn ${strategy === 'B' ? 'active' : ''}`}
          onClick={() => setStrategy('B')}
        >
          <div className="strat-btn-title">B – Skirtinga kas naktį</div>
          <div className="strat-btn-desc">Nauja viešbutis kiekvienai dienai. Daugiau lankstumo.</div>
        </button>
      </div>
    </div>
  );
}

function TownSelector({ selectedTown, onTownSelect }) {
  const town = TOWNS.find((t) => t.id === selectedTown);
  return (
    <div className="town-selector">
      <div className="section-label">Pasirinkite miestelį</div>
      <div className="towns-grid">
        {TOWNS.map((t) => (
          <div
            key={t.id}
            className={`town-card ${selectedTown === t.id ? 'selected' : ''}`}
            onClick={() => onTownSelect(t.id)}
          >
            <div>
              <div className="town-name">{t.name}</div>
              <div className="town-tag">{t.tag}</div>
            </div>
            <span className="town-check">✓</span>
          </div>
        ))}
      </div>
      {town && (
        <a
          href={town.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="booking-link"
        >
          🏨 Ieškoti būsto Booking.com → {town.name} (4 asm., 06.15–06.18)
        </a>
      )}
    </div>
  );
}

function ParkingAlert({ parking, poiName }) {
  if (!parking) return null;
  return (
    <div className={`parking-alert ${parking.urgent ? 'urgent' : ''}`}>
      <div className="parking-title">
        {parking.urgent ? '🚨' : '🅿️'} Parkavimas · {poiName}
      </div>
      <div className="parking-row"><span>Kaina:</span> <span>{parking.cost}</span></div>
      <div className="parking-row"><span>Taisyklė:</span> <span>{parking.rule}</span></div>
      {parking.note && (
        <div className="parking-row"><span>Pastaba:</span> <span style={{ color: parking.urgent ? 'var(--danger)' : 'var(--warn)' }}>{parking.note}</span></div>
      )}
    </div>
  );
}

function BirthdayCard({ number, restaurant, isBrunch }) {
  if (isBrunch) {
    return (
      <div className="birthday-card">
        <div className="birthday-title">🎂 Gimtadienis #{number} – programa</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: 8 }}>
          Lengva diena su vėlyvu startu 🌞
        </div>
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
        <a href={restaurant.bookingUrl} target="_blank" rel="noopener noreferrer" className="rest-link">
          📅 Rezervuoti stalą →
        </a>
      </div>
    </div>
  );
}

function FlightInfo() {
  return (
    <div>
      <div className="section-label">Skrydžiai ir logistika</div>
      <div className="flight-card">
        <div className="flight-row">
          <span className="flight-label">✈️ Atvykimas</span>
          <span className="flight-value gold">06.14 · 13:55 TSF</span>
        </div>
        <div className="flight-row">
          <span className="flight-label">✈️ Išskridimas (2 asm.)</span>
          <span className="flight-value">06.18 · 20:40 TSF</span>
        </div>
        <div className="flight-row">
          <span className="flight-label">🚂 Venecija (2 asm.)</span>
          <span className="flight-value">06.18–06.20 · Mestre</span>
        </div>
      </div>
    </div>
  );
}

function Day14Panel() {
  return (
    <div>
      <div className="castle-card">
        <div className="castle-name">🏰 Castello di Roncade</div>
        <div className="castle-desc">{NIGHT_ONE.description}</div>
        <div className="castle-detail">✓ Fiksuota rezervacija · 06.14–06.15 · {NIGHT_ONE.distance_from_tsf}</div>
      </div>
      <div className="events-list">
        {[
          { time: '13:55', icon: '✈️', text: 'Nusileidimas Trevize (TSF)' },
          { time: '14:30', icon: '🚗', text: 'Automobilių nuoma + bagažas' },
          { time: '15:15', icon: '🏰', text: 'Atvykimas į Castello di Roncade (~25 min.)' },
          { time: '18:00', icon: '🍷', text: 'Vyno degustacija pilies vynuogyne (nebūtina)' },
          { time: '20:00', icon: '🍝', text: 'Vakarienė vietiniame restorane (el centre ~10 min.)' },
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

function DayPlanPanel({ day, selectedTown, onFlyTo }) {
  const plans = selectedTown ? generateDayPlans(selectedTown) : null;
  const plan = plans?.find((p) => p.day === day);
  const town = TOWNS.find((t) => t.id === selectedTown);

  if (!plan) {
    return (
      <div className="no-selection">
        <div className="big-icon">👆</div>
        <h3>Pasirinkite miestelį</h3>
        <p>Pasirinkite nakvynės vietą aukščiau, kad pamatytumėte dienos planą su maršrutais ir rekomendacijomis.</p>
      </div>
    );
  }

  const isBirthday = plan.type === 'birthday';
  const isCortina = selectedTown === 'cortina';
  const restaurant = isCortina ? RESTAURANTS.nearCortina : RESTAURANTS.nearCadore;

  return (
    <div className="day-plan">
      <div className="day-plan-header">
        <div>
          <div className="day-plan-title">{plan.title}</div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: 2 }}>{plan.date}</div>
        </div>
        {isBirthday && <span className="badge badge-birthday">Gimtadienis</span>}
      </div>

      {/* Events */}
      <div className="events-list">
        {plan.events.map((e, i) => (
          <div key={i} className={`event-row ${e.warning ? 'warning' : ''}`}>
            <span className="event-time">{e.time}</span>
            <span className="event-icon">{e.icon}</span>
            <span className="event-text">{e.text}</span>
          </div>
        ))}
      </div>

      {/* Parking */}
      {plan.parking && (
        <div style={{ marginTop: 12 }}>
          <ParkingAlert parking={plan.parking} poiName={plan.poi?.name} />
        </div>
      )}

      {/* Birthday module */}
      {day === 16 && (
        <BirthdayCard number={1} restaurant={restaurant} isBrunch={false} />
      )}
      {day === 17 && (
        <BirthdayCard number={2} isBrunch={true} />
      )}

      {/* Fly to POI button */}
      {plan.poi && (
        <button
          className="export-btn"
          style={{ background: 'var(--bg3)', color: 'var(--gold)', border: '1px solid var(--border)', marginTop: 6 }}
          onClick={() => onFlyTo(plan.poi.coords)}
        >
          🗺️ Rodyti žemėlapyje → {plan.poi.name}
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
        <div className="castle-desc">2 asmenys lieka Venecijoje iki birželio 20 d. Susitikimo taškas – Venezia Mestre geležinkelio stotis.</div>
        <div className="castle-detail" style={{ color: 'var(--ice)' }}>🚂 Venezia Mestre → Venezia Santa Lucia (~10 min.)</div>
      </div>
      {[
        { icon: '🚢', text: 'Gondolų kanalas · Rialto tiltas · San Marco aikštė' },
        { icon: '🏛️', text: 'Dožų rūmai · Gallerie dell\'Accademia' },
        { icon: '🏝️', text: 'Murano sala (stiklo dirbtuvės) · Burano (spalvotos nameliai)' },
        { icon: '🍽️', text: 'Cicchetti ir Spritz – tikras venetiškas vakaras' },
      ].map((e, i) => (
        <div key={i} className="event-row" style={{ marginTop: 4 }}>
          <span className="event-icon" style={{ gridColumn: '2' }}>{e.icon}</span>
          <span className="event-text" style={{ gridColumn: '3' }}>{e.text}</span>
        </div>
      ))}
    </div>
  );
}

function ExportButton({ selectedTown }) {
  const town = TOWNS.find((t) => t.id === selectedTown);
  if (!town) return null;

  const buildMapsUrl = () => {
    const pois = [
      'Tre Cime di Lavaredo, Italy',
      'Lago di Braies, Italy',
      "Cinque Torri, Cortina d'Ampezzo, Italy",
    ];
    const base = `https://www.google.com/maps/dir/${encodeURIComponent(town.name + ', Italy')}/${pois.map(encodeURIComponent).join('/')}`;
    return base;
  };

  return (
    <a href={buildMapsUrl()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <button className="export-btn">
        🗺️ Eksportuoti maršrutą į Google Maps
      </button>
    </a>
  );
}

export default function Sidebar({ strategy, setStrategy, selectedTown, onTownSelect, activeDay, onFlyTo }) {
  const showVenice = activeDay === 19 || activeDay === 20;
  const show14 = activeDay === 14;

  return (
    <aside className="sidebar">
      <div className="sidebar-scroll">
        {/* Strategy + Town only show for planning days */}
        {!show14 && !showVenice && activeDay <= 18 && (
          <>
            <StrategyToggle strategy={strategy} setStrategy={setStrategy} />
            <TownSelector selectedTown={selectedTown} onTownSelect={onTownSelect} />
            <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
          </>
        )}

        {/* Day-specific content */}
        {show14 && (
          <>
            <FlightInfo />
            <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
            <div className="section-label">Pirmoji naktis</div>
            <Day14Panel />
          </>
        )}

        {showVenice && <VenicePanel />}

        {!show14 && !showVenice && activeDay <= 18 && (
          <DayPlanPanel day={activeDay} selectedTown={selectedTown} onFlyTo={onFlyTo} />
        )}

        {/* Export */}
        {selectedTown && !show14 && !showVenice && (
          <ExportButton selectedTown={selectedTown} />
        )}
      </div>
    </aside>
  );
}
