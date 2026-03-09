import { brandingConfig } from '../config/branding';

/**
 * Custom hook to access branding configuration throughout the app
 */
export function useBranding() {
  return brandingConfig;
}

/**
 * Helper function to get CSS variable strings for dynamic styling
 */
export function getBrandingStyles() {
  const { colors } = brandingConfig;
  
  return {
    '--brand-primary': colors.primary,
    '--brand-primary-hover': colors.primaryHover,
    '--brand-primary-light': colors.primaryLight,
    '--brand-secondary': colors.secondary,
    '--brand-accent-1': colors.accent1,
    '--brand-accent-2': colors.accent2,
    '--brand-accent-3': colors.accent3,
    '--brand-accent-4': colors.accent4,
  } as React.CSSProperties;
}
