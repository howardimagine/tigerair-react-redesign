import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tigerair_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('tigerair_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tigerair_user');
    }
  }, [user]);

  const memberProfile = {
    name: '陳明偉',
    lastNameEn: 'CHEN',
    firstNameEn: 'MING-WEI',
    lastNameZh: '陳',
    firstNameZh: '明偉',
    gender: 'male',
    birthDate: '1990-03-15',
    nationality: 'TW',
    passportNumber: 'A1234567',
    passportExpiry: '2032-06-10',
    phone: '+886 912 345 678',
    membershipTier: 'gold',
    points: 12480,
  };

  const login = (email) => {
    const userData = { ...memberProfile, email };
    setUser(userData);
    return true;
  };

  const register = (name, email) => {
    const userData = { ...memberProfile, name, email };
    setUser(userData);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
