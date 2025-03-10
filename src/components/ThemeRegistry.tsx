'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, grey, blueGrey } from '@mui/material/colors';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  systemTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  setMode: () => {},
  systemTheme: 'light',
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Determine the actual theme mode
  const actualTheme = mode === 'system' ? systemTheme : mode;

  // Create theme based on mode
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: actualTheme,
        primary: {
          main: blue[600],
        },
        secondary: {
          main: actualTheme === 'dark' ? blueGrey[200] : grey[500],
        },
        background: {
          default: actualTheme === 'dark' ? '#121212' : '#f5f5f5',
          paper: actualTheme === 'dark' ? '#1e1e1e' : '#ffffff',
        },
      },
      typography: {
        fontFamily: 'var(--font-geist-sans)',
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '8px',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
            },
          },
        },
      },
    }),
    [actualTheme]
  );

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    systemTheme,
  }), [mode, systemTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeContext.Provider>
  );
}
