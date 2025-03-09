'use client';

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, grey } from '@mui/material/colors';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: blue[600],
    },
    secondary: {
      main: grey[500],
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
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
