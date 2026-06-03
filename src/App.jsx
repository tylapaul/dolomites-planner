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
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <TripProvider>
      <div className="app">
        <Header />
        <DayTimeline activeDay={activeDay} onDaySelect={setActiveDay} />

        {/* Mobile-only toggle bar – hidden on desktop via CSS */}
        <div className="mobile-view-toggle">
          <button
            className={!mapVisible ? 'active' : ''}
            onClick={() => setMapVisible(false)}
          >
            📋 Planas
          </button>
          <button
            className={mapVisible ? 'active' : ''}
            onClick={() => setMapVisible(true)}
          >
            🗺️ Žemėlapis
          </button>
        </div>

        <div className="main-layout">
          <MapView
            activeDay={activeDay}
            mapFocus={mapFocus}
            className={!mapVisible ? 'mobile-hidden' : ''}
          />
          <Sidebar
            strategy={strategy}
            setStrategy={setStrategy}
            activeDay={activeDay}
            onFlyTo={(coords) => { setMapFocus(coords); setMapVisible(true); }}
            className={mapVisible ? 'mobile-hidden' : ''}
          />
        </div>
      </div>
    </TripProvider>
  );
}

