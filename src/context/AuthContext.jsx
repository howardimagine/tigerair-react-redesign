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

  const login = (email) => {
    const userData = { name: '陳明偉', email };
    setUser(userData);
    return true;
  };

  const register = (name, email) => {
    const userData = { name, email };
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
