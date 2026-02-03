import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

/**
 * Application theme configuration
 * Based on React Native Paper's Material Design 3
 */
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6B35', // InadeAfrica brand orange
    secondary: '#004E89', // Deep blue
    tertiary: '#1B9AAA', // Teal
    background: '#F7F9FC',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
    info: '#1976D2',
    placeholder: '#9E9E9E',
  },
  roundness: 8,
};

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6B35',
    secondary: '#0077B6',
    tertiary: '#1B9AAA',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    error: '#CF6679',
    success: '#81C784',
    warning: '#FFB74D',
    info: '#64B5F6',
    placeholder: '#757575',
  },
  roundness: 8,
};
