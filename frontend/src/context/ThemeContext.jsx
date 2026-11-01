import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'lovebyte_theme';

/**
 * Determine initial theme:
 * 1. Read stored preference from localStorage ('light' or 'dark')
 * 2. If no stored preference, detect OS / system preference via prefers-color-scheme
 * 3. Default fallback to 'dark' for Cafe Love Byte's signature intimate vibe
 */
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (err) {
    console.warn('Could not access theme storage:', err);
  }

  return 'dark';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply theme to DOM and persist to localStorage
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    const body = document.body;

    // Apply data-theme attribute
    root.setAttribute('data-theme', newTheme);
    body.setAttribute('data-theme', newTheme);

    // Set native browser color-scheme for scrollbars, inputs, etc.
    root.style.colorScheme = newTheme;

    // Persist to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('Could not save theme preference:', err);
    }
  }, []);

  // Update theme state and apply
  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
      applyTheme(newTheme);
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, [applyTheme]);

  // Initial sync on mount
  useEffect(() => {
    applyTheme(theme);
  }, [applyTheme, theme]);

  // Listen for OS system theme changes if user hasn't explicitly set preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      // Only auto-switch if user hasn't explicitly set a preference in this session
      if (!saved) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [setTheme]);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
