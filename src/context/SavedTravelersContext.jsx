import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tigerair.savedTravelers.v1';

const seedTravelers = [
  {
    id: 'tr-001',
    nickname: '爸爸',
    lastNameEn: 'CHEN',
    firstNameEn: 'TA-WEI',
    lastNameZh: '陳',
    firstNameZh: '大為',
    gender: 'male',
    birthDate: '1972-05-12',
    nationality: 'TW',
    passportNumber: '300123456',
    passportExpiry: '2030-08-21',
  },
  {
    id: 'tr-002',
    nickname: '媽媽',
    lastNameEn: 'CHEN',
    firstNameEn: 'MEI-YING',
    lastNameZh: '陳',
    firstNameZh: '美英',
    gender: 'female',
    birthDate: '1975-09-04',
    nationality: 'TW',
    passportNumber: '300456789',
    passportExpiry: '2028-11-30',
  },
];

const SavedTravelersContext = createContext(null);

const loadInitial = () => {
  if (typeof window === 'undefined') return seedTravelers;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedTravelers;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return seedTravelers;
};

export const SavedTravelersProvider = ({ children }) => {
  const [travelers, setTravelers] = useState(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(travelers));
    } catch {
      // ignore quota errors
    }
  }, [travelers]);

  const addTraveler = (traveler) => {
    const id = traveler.id || `tr-${Date.now().toString(36)}`;
    setTravelers((current) => [...current, { ...traveler, id }]);
    return id;
  };

  const updateTraveler = (id, patch) => {
    setTravelers((current) => current.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const removeTraveler = (id) => {
    setTravelers((current) => current.filter((t) => t.id !== id));
  };

  const value = useMemo(
    () => ({ travelers, addTraveler, updateTraveler, removeTraveler }),
    [travelers],
  );

  return <SavedTravelersContext.Provider value={value}>{children}</SavedTravelersContext.Provider>;
};

export const useSavedTravelers = () => {
  const ctx = useContext(SavedTravelersContext);
  if (!ctx) throw new Error('useSavedTravelers must be used inside SavedTravelersProvider');
  return ctx;
};
