/**
 * Centralized Theme System
 * Export all theme-related constants and utilities
 */

export { colors } from './colors';
export type { ColorKey, SolanaColorKey } from './colors';

// Re-export commonly used colors for convenience
import { colors } from './colors';
export const {
  mainBackgroundColor,
  mainSectionColor,
  mainBorderColor,
  mainTextColor,
  secondaryTextColor,
  mainAccentColor,
  successColor,
  errorColor,
} = colors;
