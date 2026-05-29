import { useState } from 'react';
import { TripProvider } from './context/TripContext.jsx';
import Header from './components/Header';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import DayTimeline from './components/DayTimeline';
import './styles/app.css';

export default function App() {
  const [strategy, setStrategy] = useState('A');
  const [activeDay, setActiveDay] = useState(14);
  const [mapFocus, setMapFocus] = useState(null);

  return (
    <TripProvider>
      <div className="app">
        <Header />
        <DayTimeline activeDay={activeDay} onDaySelect={setActiveDay} />
        <div className="main-layout">
          <MapView activeDay={activeDay} mapFocus={mapFocus} />
          <Sidebar
            strategy={strategy}
            setStrategy={setStrategy}
            activeDay={activeDay}
            onFlyTo={setMapFocus}
          />
        </div>
      </div>
    </TripProvider>
  );
}
