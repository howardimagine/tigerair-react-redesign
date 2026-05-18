import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tigerair.creditCards.v1';

const CreditCardsContext = createContext(null);

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

// Detect card brand from first digits (very rough heuristic for demo)
export const detectBrand = (number) => {
  const n = (number || '').replace(/\s+/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^35/.test(n)) return 'jcb';
  if (/^62/.test(n)) return 'unionpay';
  return 'unknown';
};

export const formatCardNumber = (digits) => {
  const cleaned = (digits || '').replace(/\D/g, '').slice(0, 19);
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const maskCardNumber = (digits) => {
  const cleaned = (digits || '').replace(/\D/g, '');
  if (cleaned.length < 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

export const CreditCardsProvider = ({ children }) => {
  const [cards, setCards] = useState(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {
      // ignore quota
    }
  }, [cards]);

  const addCard = (card) => {
    const id = `cc-${Date.now().toString(36)}`;
    const cleaned = (card.number || '').replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    const brand = detectBrand(cleaned);
    const stored = {
      id,
      last4,
      brand,
      holderName: card.holderName,
      expiry: card.expiry, // MM/YY
      nickname: card.nickname || '',
      isDefault: card.isDefault || false,
    };
    setCards((current) => {
      let next = [...current, stored];
      if (stored.isDefault) {
        next = next.map((c) => ({ ...c, isDefault: c.id === id }));
      } else if (current.length === 0) {
        next = next.map((c) => ({ ...c, isDefault: true }));
      }
      return next;
    });
    return id;
  };

  const removeCard = (id) => {
    setCards((current) => {
      const remaining = current.filter((c) => c.id !== id);
      if (remaining.length > 0 && !remaining.some((c) => c.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  const setDefaultCard = (id) => {
    setCards((current) => current.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const value = useMemo(() => ({ cards, addCard, removeCard, setDefaultCard }), [cards]);

  return <CreditCardsContext.Provider value={value}>{children}</CreditCardsContext.Provider>;
};

export const useCreditCards = () => {
  const ctx = useContext(CreditCardsContext);
  if (!ctx) throw new Error('useCreditCards must be used inside CreditCardsProvider');
  return ctx;
};
