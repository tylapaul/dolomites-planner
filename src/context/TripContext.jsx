import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { NIGHT_ONE } from '../data/tripData.js';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../firebase.js';

const TripContext = createContext(null);

const INITIAL_NIGHTS = {
  '06.14': {
    date: '06.14', is_locked: true, accommodation_name: NIGHT_ONE.name,
    accommodation_id: 'roncade', coordinates: NIGHT_ONE.coords,
    check_in_time: '15:15', check_out_time: '09:00', nights: 1, emoji: '🏰', fixed: true,
  },
  '06.15': { date: '06.15', is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null, check_in_time: '15:00', check_out_time: '10:00', nights: 3 },
  '06.16': { date: '06.16', is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null },
  '06.17': { date: '06.17', is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null },
};

// Pre-calculated driving distances: town → POI
export const ROUTING_DATA = {
  cortina:    { trecime: { km: 28, min: 40 }, braies: { km: 45, min: 55 }, sorapis: { km: 12, min: 18 }, cinquetorri: { km: 8,  min: 12 } },
  misurina:   { trecime: { km: 7,  min: 15 }, braies: { km: 34, min: 40 }, sorapis: { km: 8,  min: 10 }, cinquetorri: { km: 22, min: 30 } },
  dobbiaco:   { trecime: { km: 30, min: 35 }, braies: { km: 16, min: 20 }, sorapis: { km: 26, min: 30 }, cinquetorri: { km: 38, min: 45 } },
  villabassa: { trecime: { km: 34, min: 40 }, braies: { km: 12, min: 15 }, sorapis: { km: 30, min: 35 }, cinquetorri: { km: 42, min: 50 } },
  sanvito:    { trecime: { km: 42, min: 52 }, braies: { km: 58, min: 68 }, sorapis: { km: 18, min: 25 }, cinquetorri: { km: 14, min: 20 } },
  vodo:       { trecime: { km: 50, min: 60 }, braies: { km: 66, min: 75 }, sorapis: { km: 26, min: 35 }, cinquetorri: { km: 22, min: 30 } },
  borca:      { trecime: { km: 45, min: 55 }, braies: { km: 60, min: 70 }, sorapis: { km: 20, min: 28 }, cinquetorri: { km: 16, min: 22 } },
  tai:        { trecime: { km: 38, min: 50 }, braies: { km: 52, min: 62 }, sorapis: { km: 22, min: 30 }, cinquetorri: { km: 18, min: 25 } },
  pieve:      { trecime: { km: 40, min: 52 }, braies: { km: 55, min: 65 }, sorapis: { km: 24, min: 32 }, cinquetorri: { km: 20, min: 27 } },
  roncade:    { trecime: { km: 185, min: 135 }, braies: { km: 190, min: 140 }, sorapis: { km: 160, min: 120 }, cinquetorri: { km: 170, min: 125 } },
};

export function getRoutingData(townId, poiId) {
  return ROUTING_DATA[townId]?.[poiId] || null;
}

export function calcDepartureTime(arrivalTarget, travelMinutes) {
  const [h, m] = arrivalTarget.split(':').map(Number);
  const total = h * 60 + m - travelMinutes;
  const dh = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const dm = ((total % 1440) + 1440) % 1440 % 60;
  return `${String(dh).padStart(2, '0')}:${String(dm).padStart(2, '0')}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SYNC_STATE':
      return { ...state, ...action.payload };
    case 'LOCK_NIGHTS': {
      const { accommodation } = action.payload;
      const newNights = { ...state.nights };
      const dates = accommodation.nights === 3 ? ['06.15', '06.16', '06.17'] : ['06.15'];
      dates.forEach((d, i) => {
        newNights[d] = {
          ...newNights[d], is_locked: true,
          accommodation_name: accommodation.name,
          accommodation_id: accommodation.id,
          coordinates: accommodation.coordinates,
          emoji: accommodation.emoji || '🏨',
          fixed: false,
          check_in_time: i === 0 ? '15:00' : null,
          check_out_time: i === dates.length - 1 ? '10:00' : null,
        };
      });
      return { ...state, nights: newNights };
    }
    case 'UNLOCK_NIGHT': {
      const newNights = { ...state.nights };
      const accId = newNights['06.15']?.accommodation_id;
      ['06.15', '06.16', '06.17'].forEach((d) => {
        if (!newNights[d]?.fixed && newNights[d]?.accommodation_id === accId) {
          newNights[d] = { ...newNights[d], is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null, emoji: null };
        }
      });
      return { ...state, nights: newNights };
    }
    case 'SET_ACTIVE_TOWN':
      return { ...state, activeTown: action.payload };
    case 'SET_TRANSPORT':
      return { ...state, transport: action.payload };

    // My Hotels CRUD
    case 'ADD_HOTEL': {
      const hotel = { ...action.payload, id: Date.now().toString() };
      return { ...state, myHotels: [...(state.myHotels || []), hotel] };
    }
    case 'REMOVE_HOTEL':
      return { ...state, myHotels: (state.myHotels || []).filter(h => h.id !== action.payload) };
    case 'SELECT_HOTEL':
      return { ...state, selectedHotelId: action.payload };

    default:
      return state;
  }
}

const INITIAL_STATE = {
  nights: INITIAL_NIGHTS,
  activeTown: null,
  transport: 'car',
  myHotels: [],
  selectedHotelId: null,
};

const STORAGE_KEY = 'dolomites_trip_v2';

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, nights: { ...parsed.nights, '06.14': INITIAL_NIGHTS['06.14'] } };
      }
    } catch {}
    return init;
  });

  const stateRef = useRef(state);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Firestore real-time snapshot subscription
  useEffect(() => {
    if (!isFirebaseEnabled || !db) return;
    const docRef = doc(db, 'trips', 'dolomites-trip');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        if (docSnap.metadata.hasPendingWrites) return;
        const data = docSnap.data();
        const currentLocalState = stateRef.current;

        const isDifferent = JSON.stringify(data.nights) !== JSON.stringify(currentLocalState.nights) ||
                            data.activeTown !== currentLocalState.activeTown ||
                            data.transport !== currentLocalState.transport ||
                            JSON.stringify(data.myHotels) !== JSON.stringify(currentLocalState.myHotels) ||
                            data.selectedHotelId !== currentLocalState.selectedHotelId;

        if (isDifferent) {
          isRemoteUpdateRef.current = true;
          dispatch({ type: 'SYNC_STATE', payload: data });
        }
      } else {
        const currentLocalState = stateRef.current;
        setDoc(docRef, {
          nights: currentLocalState.nights,
          activeTown: currentLocalState.activeTown,
          transport: currentLocalState.transport,
          myHotels: currentLocalState.myHotels,
          selectedHotelId: currentLocalState.selectedHotelId,
        }).catch(err => console.error('Nepavyko sukurti pradinio dokumento Firebase:', err));
      }
    });

    return () => unsubscribe();
  }, []);

  // Save changes locally and to Firestore
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}

    if (isFirebaseEnabled && db) {
      if (isRemoteUpdateRef.current) {
        isRemoteUpdateRef.current = false;
        return;
      }

      const docRef = doc(db, 'trips', 'dolomites-trip');
      setDoc(docRef, {
        nights: state.nights,
        activeTown: state.activeTown,
        transport: state.transport,
        myHotels: state.myHotels,
        selectedHotelId: state.selectedHotelId,
      }).catch(err => console.error('Klaida išsaugant būseną į Firebase:', err));
    }
  }, [state]);

  return <TripContext.Provider value={{ state, dispatch }}>{children}</TripContext.Provider>;
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used inside TripProvider');
  return ctx;
}
