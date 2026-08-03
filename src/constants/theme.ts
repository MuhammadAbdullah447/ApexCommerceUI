import { Platform, StatusBar } from 'react-native';
export const COLORS = {
  // Backgrounds
  background: '#faf8ff',
  surfaceDim: '#d2d9f4',
  surfaceBright: '#faf8ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f3ff',
  surfaceContainer: '#eaedff',
  surfaceContainerHigh: '#e2e7ff',
  surfaceContainerHighest: '#dae2fd',

  // Text
  onSurface: '#131b2e',
  onSurfaceVariant: '#434655',
  inverseSurface: '#283044',
  inverseOnSurface: '#eef0ff',

  // Borders / outlines
  outline: '#737686',
  outlineVariant: '#c3c6d7',

  // Primary (Apex Blue)
  primary: '#2563eb',
  onPrimary: '#ffffff',
  primaryContainer: '#2563eb',
  onPrimaryContainer: '#eeefff',

  // Secondary (Amber - ratings, promos)
  secondary: '#855300',
  onSecondary: '#ffffff',
  secondaryContainer: '#fea619',
  onSecondaryContainer: '#684000',

  // Tertiary (Rose - favorites/wishlist heart)
  tertiary: '#ad0033',
  onTertiary: '#ffffff',
  tertiaryContainer: '#f43f5e',
  onTertiaryContainer: '#ffecec',

  // Error
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Neutral helpers
  white: '#ffffff',
  black: '#000000',
};


export { TYPOGRAPHY } from './typography';


export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  marginMobile: 20,
};


export const RADIUS = {
  sm: 4,
  md: 12,
  lg: 16,
  full: 9999,
};

export const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;


export const DARK_COLORS = {
  background: '#10131a',
  surfaceDim: '#10131a',
  surfaceBright: '#363941',
  surfaceContainerLowest: '#0b0e15',
  surfaceContainerLow: '#191b23',
  surfaceContainer: '#1d2027',
  surfaceContainerHigh: '#272a31',
  surfaceContainerHighest: '#32353c',

  onSurface: '#e1e2ec',
  onSurfaceVariant: '#c2c6d6',
  inverseSurface: '#e1e2ec',
  inverseOnSurface: '#2e3038',

  outline: '#8c909f',
  outlineVariant: '#424754',

  primary: '#adc6ff',
  onPrimary: '#002e6a',
  primaryContainer: '#4d8eff',
  onPrimaryContainer: '#00285d',

  secondary: '#ffb95f',
  onSecondary: '#472a00',
  secondaryContainer: '#ee9800',
  onSecondaryContainer: '#5b3800',

  tertiary: '#ffb786',
  onTertiary: '#502400',
  tertiaryContainer: '#df7412',
  onTertiaryContainer: '#461f00',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  white: '#ffffff',
  black: '#000000',
};


export const getColors = (isDarkMode: boolean) => (isDarkMode ? DARK_COLORS : COLORS);


export type ColorScheme = typeof COLORS;