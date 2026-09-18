import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = [
  { username: 'admin_TRT', password: '@dmin369', role: 'admin', name: 'TRT Admin' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('trt-admin-user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (username, password) => {
    const found = ADMIN_CREDENTIALS.find(
      c => c.username === username && c.password === password
    );
    if (found) {
      const userData = { username: found.username, role: found.role, name: found.name };
      setUser(userData);
      localStorage.setItem('trt-admin-user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trt-admin-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
