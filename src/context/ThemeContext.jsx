import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageString, setStorageString } from '../utils/storageUtils';

const ThemeContext = createContext(null);

function getInitialTheme() {
  const stored = getStorageString(STORAGE_KEYS.THEME);
  if (stored === 'light' || stored === 'dark') return stored;

  // Only fall back to system preference when there is no saved choice.
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStorageString(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
