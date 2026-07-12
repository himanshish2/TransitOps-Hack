import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, getStorageString, setStorageItem, setStorageString, removeStorageItem } from '../utils/storageUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on initial mount.
  useEffect(() => {
    const storedToken = getStorageString(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = getStorageItem(STORAGE_KEYS.AUTH_USER);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    setStorageString(STORAGE_KEYS.AUTH_TOKEN, data.token);
    setStorageItem(STORAGE_KEYS.AUTH_USER, data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeStorageItem(STORAGE_KEYS.AUTH_USER);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
