import { createTheme } from '@mui/material/styles';

// Material 3 Color Palette
const material3Colors = {
  primary: {
    main: '#6750A4', // Material 3 primary color
    light: '#8B79B8',
    dark: '#4F378B',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#625B71', // Material 3 secondary color
    light: '#7A7289',
    dark: '#4A4458',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#7D5260', // Material 3 tertiary color
    light: '#9B6B7A',
    dark: '#5D3A47',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#BA1A1A',
    light: '#FF5449',
    dark: '#93000A',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF8F00',
    light: '#FFB74D',
    dark: '#E65100',
    contrastText: '#000000',
  },
  info: {
    main: '#006C4C',
    light: '#4CAF50',
    dark: '#004D40',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    default: '#FFFBFE',
    paper: '#FFFBFE',
  },
  surface: {
    default: '#FFFBFE',
    paper: '#FFFBFE',
    variant: '#F3F1F5',
  },
  text: {
    primary: '#1C1B1F',
    secondary: '#49454F',
    disabled: '#9E9E9E',
  },
};

// Material 3 Typography
const material3Typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '3.5rem',
    fontWeight: 400,
    lineHeight: 1.12,
    letterSpacing: '-0.25px',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 400,
    lineHeight: 1.16,
    letterSpacing: '0px',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 400,
    lineHeight: 1.22,
    letterSpacing: '0px',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: 1.25,
    letterSpacing: '0px',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '0px',
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.22,
    letterSpacing: '0.15px',
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.43,
    letterSpacing: '0.1px',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.5px',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.25px',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.1px',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0.4px',
  },
  overline: {
    fontSize: '0.625rem',
    fontWeight: 500,
    lineHeight: 2.66,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
};

// Material 3 Shape Configuration
const material3Shape = {
  borderRadius: 12, // Material 3 uses 12px as default border radius
};

// Material 3 Component Overrides
const material3Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 20, // Material 3 button radius
        textTransform: 'none',
        fontWeight: 500,
        padding: '10px 24px',
        minHeight: 40,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        },
      },
      outlined: {
        borderWidth: 1,
        '&:hover': {
          borderWidth: 1,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16, // Material 3 card radius
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        '&:hover': {
          boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 4, // Material 3 text field radius
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16, // Material 3 paper radius
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      },
    },
  },
};

// Create the Material 3 theme
export const material3Theme = createTheme({
  palette: material3Colors,
  typography: material3Typography,
  shape: material3Shape,
  components: material3Components,
  spacing: 8, // Material 3 uses 8px as base spacing unit
});

export default material3Theme; 