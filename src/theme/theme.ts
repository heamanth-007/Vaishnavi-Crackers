import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1D4ED8', // Royal Blue
      light: '#EFF6FF', // Soft Ice Blue
      dark: '#1E3A8A', // Deep Navy Blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EAB308', // Vibrant Yellow / Amber Gold
      light: '#FEF08A',
      dark: '#CA8A04',
      contrastText: '#0B0F19',
    },
    info: {
      main: '#0284C7', // Sky / Cyan Blue
      light: '#F0F9FF',
      dark: '#0369A1',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#059669', // Garland Green
      light: '#ECFDF5',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#0B0F19', // Deep Onyx Black
      secondary: '#475569', // Slate Grey
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#0B0F19',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#0B0F19',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#0B0F19',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: '14.5px',
      fontWeight: 600,
      color: '#0B0F19',
    },
    body1: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#0B0F19',
    },
    body2: {
      fontSize: '13px',
      fontWeight: 500,
      color: '#475569',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#0B0F19',
          backgroundColor: '#F8FAFC',
          borderBottom: '2px solid #E2E8F0',
        },
        body: {
          fontSize: '13.5px',
          fontWeight: 500,
          color: '#0F172A',
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },
  },
});
