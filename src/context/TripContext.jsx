import { createContext, useContext, useReducer, useEffect } from 'react';
import { NIGHT_ONE } from '../data/tripData.js';

const TripContext = createContext(null);

// Initial locked nights state
const INITIAL_NIGHTS = {
  '06.14': {
    date: '06.14',
    is_locked: true,
    accommodation_name: NIGHT_ONE.name,
    accommodation_id: 'roncade',
    coordinates: NIGHT_ONE.coords,
    check_in_time: '15:15',
    check_out_time: '09:00',
    nights: 1,
    emoji: '🏰',
    fixed: true, // cannot be unlocked
  },
  '06.15': { date: '06.15', is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null, check_in_time: '15:00', check_out_time: '10:00', nights: 3 },
  '06.16': { date: '06.16', is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null, check_in_time: null, check_out_time: null, nights: null },
  '06.17': { date: '06.17', is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null, check_in_time: null, check_out_time: null, nights: null },
};

// Routing distances (minutes) from each town to POIs - pre-calculated approximations
const ROUTING_DATA = {
  cortina: {
    trecime: { km: 28, min: 40 },
    braies: { km: 45, min: 55 },
    sorapis: { km: 12, min: 18 },
    cinquetorri: { km: 8, min: 12 },
  },
  sanvito: {
    trecime: { km: 42, min: 52 },
    braies: { km: 58, min: 68 },
    sorapis: { km: 18, min: 25 },
    cinquetorri: { km: 14, min: 20 },
  },
  borca: {
    trecime: { km: 45, min: 55 },
    braies: { km: 60, min: 70 },
    sorapis: { km: 20, min: 28 },
    cinquetorri: { km: 16, min: 22 },
  },
  tai: {
    trecime: { km: 38, min: 50 },
    braies: { km: 52, min: 62 },
    sorapis: { km: 22, min: 30 },
    cinquetorri: { km: 18, min: 25 },
  },
  pieve: {
    trecime: { km: 40, min: 52 },
    braies: { km: 55, min: 65 },
    sorapis: { km: 24, min: 32 },
    cinquetorri: { km: 20, min: 27 },
  },
  custom: {
    trecime: { km: 40, min: 50 },
    braies: { km: 55, min: 65 },
    sorapis: { km: 20, min: 28 },
    cinquetorri: { km: 18, min: 24 },
  },
};

export function getRoutingData(townId, poiId) {
  const town = ROUTING_DATA[townId] || ROUTING_DATA.custom;
  return town[poiId] || { km: 40, min: 50 };
}

export function calcDepartureTime(arrivalTarget, travelMinutes) {
  const [h, m] = arrivalTarget.split(':').map(Number);
  const total = h * 60 + m - travelMinutes;
  const dh = Math.floor(total / 60);
  const dm = total % 60;
  return `${String(dh).padStart(2, '0')}:${String(dm).padStart(2, '0')}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOCK_NIGHTS': {
      const { startDate, accommodation } = action.payload;
      const dates = ['06.15', '06.16', '06.17'];
      const startIdx = dates.indexOf(startDate);
      const newNights = { ...state.nights };

      // If locking 3 nights from 06.15, lock all three with same accommodation
      if (accommodation.nights === 3) {
        dates.forEach((d) => {
          newNights[d] = {
            ...newNights[d],
            is_locked: true,
            accommodation_name: accommodation.name,
            accommodation_id: accommodation.id,
            coordinates: accommodation.coordinates,
            check_in_time: d === '06.15' ? '15:00' : null,
            check_out_time: d === '06.17' ? '10:00' : null,
            nights: accommodation.nights,
            emoji: accommodation.emoji || '🏨',
            fixed: false,
          };
        });
      } else {
        // Lock single date
        newNights[startDate] = {
          ...newNights[startDate],
          is_locked: true,
          accommodation_name: accommodation.name,
          accommodation_id: accommodation.id,
          coordinates: accommodation.coordinates,
          check_in_time: '15:00',
          check_out_time: '10:00',
          nights: 1,
          emoji: accommodation.emoji || '🏨',
          fixed: false,
        };
      }
      return { ...state, nights: newNights };
    }

    case 'UNLOCK_NIGHT': {
      const { date } = action.payload;
      const newNights = { ...state.nights };
      if (newNights[date]?.fixed) return state; // cannot unlock fixed
      // Unlock all nights with same accommodation
      const accId = newNights[date]?.accommodation_id;
      ['06.15', '06.16', '06.17'].forEach((d) => {
        if (newNights[d]?.accommodation_id === accId) {
          newNights[d] = { ...newNights[d], is_locked: false, accommodation_name: null, accommodation_id: null, coordinates: null, emoji: null };
        }
      });
      return { ...state, nights: newNights };
    }

    case 'SET_ACTIVE_TOWN': {
      return { ...state, activeTown: action.payload };
    }

    case 'SET_TRANSPORT': {
      return { ...state, transport: action.payload };
    }

    case 'LOAD_FROM_STORAGE': {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}

const INITIAL_STATE = {
  nights: INITIAL_NIGHTS,
  activeTown: null,
  transport: 'car',
};

const STORAGE_KEY = 'dolomites_trip_v1';

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Always keep roncade locked
        return { ...init, ...parsed, nights: { ...parsed.nights, '06.14': INITIAL_NIGHTS['06.14'] } };
      }
    } catch {}
    return init;
  });

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  return <TripContext.Provider value={{ state, dispatch }}>{children}</TripContext.Provider>;
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used inside TripProvider');
  return ctx;
}

// Helper: get the locked accommodation for a given date
export function getLockedAccommodation(nights, date) {
  const key = `06.${String(date).padStart(2, '0')}`;
  const night = nights[key];
  return night?.is_locked ? night : null;
}
