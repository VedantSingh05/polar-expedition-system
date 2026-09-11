import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('polar_token');
    const storedUser = localStorage.getItem('polar_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('polar_token');
        localStorage.removeItem('polar_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('polar_token', newToken);
    localStorage.setItem('polar_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('polar_token');
    localStorage.removeItem('polar_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
