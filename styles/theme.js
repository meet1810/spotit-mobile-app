import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Swachh Bharat Theme Colors
// Saffron (Strength/Courage) -> Primary
// White (Peace/Truth) -> Background
// Green (Fertility/Growth) -> Secondary/Success
// Navy Blue (Ashoka Chakra) -> Text/Links

export const COLORS = {
  primary: '#FF9933', // Deep Saffron
  primaryDark: '#D67D20', // Darker Saffron for active states
  secondary: '#138808', // India Green
  secondaryLight: '#E8F5E9', // Light Green for backgrounds
  white: '#FFFFFF',
  background: '#F8F9FA', // Very light grey/white for app background
  text: '#000080', // Navy Blue (Official Chakra Color) for headers/dark text
  textLight: '#555555', // Grey for subtitles
  border: '#E0E0E0',
  danger: '#FF3B30',
  success: '#138808', // Green
  warning: '#FFC107',
  info: '#2196F3',

  // Glassmorphism hints
  glass: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
};

export const FONTS = {
  // Assuming default system fonts for now, can be swapped for Inter/Roboto later
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto',
  // In a real setup, we'd load 'Inter-Bold', 'Inter-Regular' via expo-font
};

export const SIZES = {
  width,
  height,
  padding: 20,
  radius: 12,
  h1: 30,
  h2: 22,
  h3: 16,
  body: 14,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5, // Android stronger shadow
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  }
};

export const COMMON_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...SHADOWS.card,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 15,
    ...SHADOWS.card,
  }
};

export default { COLORS, FONTS, SIZES, SHADOWS, COMMON_STYLES };
