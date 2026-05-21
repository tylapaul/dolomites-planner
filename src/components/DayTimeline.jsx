const DAYS = [
  { day: 14, label: 'Birž. 14', sub: 'Atvykimas', type: 'arrival' },
  { day: 15, label: 'Birž. 15', sub: 'Kelias į Dolomitus', type: 'normal' },
  { day: 16, label: 'Birž. 16', sub: '🎂 Gimtadienis #1', type: 'birthday' },
  { day: 17, label: 'Birž. 17', sub: '🎂 Gimtadienis #2', type: 'birthday' },
  { day: 18, label: 'Birž. 18', sub: 'Išvykimas', type: 'departure' },
  { day: 19, label: 'Birž. 19', sub: 'Venecija (2 asm.)', type: 'venice' },
  { day: 20, label: 'Birž. 20', sub: 'Venecija / Grįžimas', type: 'venice' },
];

export default function DayTimeline({ activeDay, onDaySelect }) {
  return (
    <nav className="day-timeline">
      {DAYS.map(({ day, label, sub, type }) => (
        <button
          key={day}
          className={`day-btn ${type === 'birthday' ? 'birthday' : ''} ${activeDay === day ? 'active' : ''}`}
          onClick={() => onDaySelect(day)}
        >
          <div style={{ fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: '0.68rem', opacity: 0.75 }}>{sub}</div>
        </button>
      ))}
    </nav>
  );
}
