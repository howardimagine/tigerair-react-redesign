import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tigerair.boardingPasses.v1';

const BoardingPassesContext = createContext(null);

const loadInitial = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return [];
};

export const BoardingPassesProvider = ({ children }) => {
  const [passes, setPasses] = useState(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
    } catch {
      // ignore quota
    }
  }, [passes]);

  const addPasses = (newPasses) => {
    setPasses((current) => [
      ...newPasses.map((p) => ({ ...p, id: p.id || `bp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` })),
      ...current,
    ]);
  };

  const removePass = (id) => {
    setPasses((current) => current.filter((p) => p.id !== id));
  };

  const clearAll = () => setPasses([]);

  const value = useMemo(() => ({ passes, addPasses, removePass, clearAll }), [passes]);
  return <BoardingPassesContext.Provider value={value}>{children}</BoardingPassesContext.Provider>;
};

export const useBoardingPasses = () => {
  const ctx = useContext(BoardingPassesContext);
  if (!ctx) throw new Error('useBoardingPasses must be used inside BoardingPassesProvider');
  return ctx;
};
