import { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import DayTimeline from './components/DayTimeline';
import './styles/app.css';

export default function App() {
  const [strategy, setStrategy] = useState('A');
  const [selectedTown, setSelectedTown] = useState(null);
  const [activeDay, setActiveDay] = useState(14);
  const [mapFocus, setMapFocus] = useState(null);

  return (
    <div className="app">
      <Header />
      <DayTimeline activeDay={activeDay} onDaySelect={setActiveDay} />
      <div className="main-layout">
        <MapView selectedTown={selectedTown} activeDay={activeDay} mapFocus={mapFocus} />
        <Sidebar
          strategy={strategy}
          setStrategy={setStrategy}
          selectedTown={selectedTown}
          onTownSelect={setSelectedTown}
          activeDay={activeDay}
          onFlyTo={setMapFocus}
        />
      </div>
    </div>
  );
}
