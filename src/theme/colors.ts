/**
 * Centralized Color Theme
 * All colors used throughout the application should reference these values
 */

export const colors = {
  // Background Colors
  mainBackgroundColor: '#000000',        // Main dark background (body, main containers) - keep black
  mainSectionColor: '#0F0F0F',          // Secondary background (cards, panels, sections) - darker grey
  dropdownBackground: '#0F0F0F',        // Dropdown menus, modals - match mainSectionColor
  inputBackground: '#2A2A2A',           // Input field background when focused - greyish
  tabInactiveBackground: '#1A1A1A',     // Inactive tab background - greyish
  tabActiveBackground: '#3A3A3A',       // Active tab background - greyish
  buttonGreyBackground: '#3A3A3A',      // Grey button background - greyish
  buttonGreyHover: '#4A4A4A',           // Grey button hover state - greyish
  infoBoxBackground: '#2A2A2A',         // Info boxes, lifetime earned section - greyish
  performanceBoxBackground: '#1A1A1A',  // Performance metrics boxes - darker grey
  positionBoxBackground: '#1A1A1A',     // Your Position box - subtle grey hint
  disabledBackground: '#333333',        // Disabled elements
  
  // Border Colors
  mainBorderColor: '#3A3A3A',           // Primary border color (thin lines) - greyish
  secondaryBorderColor: '#4A4A4A',      // Secondary border color (thicker elements) - greyish
  
  // Text Colors
  mainTextColor: '#ffffff',             // Primary text color (white)
  secondaryTextColor: '#888888',        // Secondary text color (grey)
  tertiaryTextColor: '#666666',         // Tertiary text color (darker grey)
  infoTextColor: '#b8bcc8',             // Info text color (blueish grey)
  buttonTextColor: '#00020a',           // Button text color (dark)
  
  // Accent Colors
  mainAccentColor: '#FF6B5A',           // Primary accent color (more red luxurious pink)
  accentHover: '#E55A4A',               // Accent color hover state (darker more red pink)
  accentBright: '#FF7A6A',              // Bright accent color (brighter more red pink)
  subtleAccentColor: '#4A3A2A',         // Subtle accent for highlights (muted warm brown)
  
  // Status Colors
  successColor: '#42f5b9',              // Success/positive (green)
  successBright: '#14F195',             // Bright success green (for buy actions)
  errorColor: '#e0284a',                // Error/negative (red)
  
  // Solana Brand Colors (for logos/gradients)
  solanaColors: {
    purple: '#9945FF',
    purpleLight: '#8752F3',
    blue: '#5497D5',
    teal: '#43B4CA',
    green: '#28E0B9',
    greenLight: '#19FB9B'
  },
  
  // Scrollbar Colors
  scrollbarTrack: '#1A1A1A',            // Scrollbar track background - greyish
  scrollbarThumb: '#4A4A4A',            // Scrollbar thumb color - greyish
  scrollbarThumbHover: '#5A5A5A',       // Scrollbar thumb hover color - greyish
  
  // Focus Colors
  focusColor: '#007bff',                // Focus outline color
} as const;

// Type for better TypeScript support
export type ColorKey = keyof typeof colors;
export type SolanaColorKey = keyof typeof colors.solanaColors;
