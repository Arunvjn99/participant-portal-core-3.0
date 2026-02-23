/**
 * Theme utility functions for the multi-tenant theming system.
 * Handles color manipulation, dark theme generation, and CSS variable application.
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  font: string;
  logo: string;
}

export interface CompanyTheme {
  light: ThemeColors;
  dark: ThemeColors;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function adjustColor(
  hex: string,
  lightnessDelta: number,
  saturationDelta = 0,
): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s + saturationDelta, l + lightnessDelta);
}

/**
 * Algorithmically generates a dark theme from a light theme.
 * Preserves brand hue/tone while adjusting for dark backgrounds.
 */
export function generateDarkTheme(light: ThemeColors): ThemeColors {
  const primaryHSL = hexToHSL(light.primary);
  const darkPrimary = hslToHex(
    primaryHSL.h,
    Math.min(primaryHSL.s + 5, 100),
    Math.min(primaryHSL.l + 10, 75),
  );

  const accentHSL = hexToHSL(light.accent);
  const darkAccent = hslToHex(
    accentHSL.h,
    Math.min(accentHSL.s + 5, 100),
    Math.min(accentHSL.l + 8, 70),
  );

  return {
    primary: darkPrimary,
    secondary: adjustColor(light.primary, -55, -10),
    accent: darkAccent,
    background: "#0f172a",
    surface: "#1e293b",
    textPrimary: "#f1f5f9",
    textSecondary: "#94a3b8",
    border: "#334155",
    success: adjustColor(light.success, 8),
    warning: adjustColor(light.warning, 5),
    danger: adjustColor(light.danger, 8),
    font: light.font,
    logo: light.logo,
  };
}

function hexToRGB(hex: string): string {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Maps a ThemeColors object to CSS custom properties and applies them
 * to document.documentElement.
 */
export function applyThemeToDOM(colors: ThemeColors): void {
  const root = document.documentElement;

  const vars: Record<string, string> = {
    "--color-primary": colors.primary,
    "--color-primary-hover": adjustColor(colors.primary, -8),
    "--color-primary-active": adjustColor(colors.primary, -15),
    "--color-primary-rgb": hexToRGB(colors.primary),
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-background": colors.background,
    "--color-background-secondary": adjustColor(colors.background, -3),
    "--color-background-tertiary": adjustColor(colors.background, -8),
    "--color-surface": colors.surface,
    "--color-surface-elevated": colors.surface,
    "--color-text": colors.textPrimary,
    "--color-text-secondary": colors.textSecondary,
    "--color-text-tertiary": adjustColor(colors.textSecondary, 15),
    "--color-border": colors.border,
    "--color-success": colors.success,
    "--color-warning": colors.warning,
    "--color-danger": colors.danger,
    "--color-danger-rgb": hexToRGB(colors.danger),
    "--accent": colors.primary,
    "--accent-primary": colors.primary,
    "--accent-success": colors.success,
    "--accent-warning": colors.warning,
    "--text-primary": colors.textPrimary,
    "--text-secondary": colors.textSecondary,
    "--bg": colors.background,
    "--surface": colors.surface,
    "--border": colors.border,
    "--bg-surface-muted": adjustColor(colors.background, -3),
    "--enroll-brand": colors.primary,
    "--enroll-brand-rgb": hexToRGB(colors.primary),
    "--enroll-accent": colors.accent,
    "--enroll-accent-rgb": hexToRGB(colors.accent),
    "--enroll-bg": colors.background,
    "--enroll-card-bg": colors.surface,
    "--enroll-card-border": colors.border,
    "--enroll-soft-bg": adjustColor(colors.background, -3),
    "--enroll-text-primary": colors.textPrimary,
    "--enroll-text-secondary": colors.textSecondary,
    "--enroll-text-muted": adjustColor(colors.textSecondary, 15),
    "--txn-brand": colors.primary,
    "--txn-brand-soft": `${colors.primary}14`,
    "--color-accent-soft": `${colors.primary}0f`,
    "--logo-url": `url(${colors.logo})`,
    "--banner-gradient": `linear-gradient(135deg, ${colors.primary} 0%, ${adjustColor(colors.primary, -20, 15)} 100%)`,
  };

  if (colors.font && colors.font !== "system-ui") {
    vars["--font-family"] = `"${colors.font}", system-ui, sans-serif`;
    root.style.fontFamily = vars["--font-family"];
  } else {
    vars["--font-family"] = `system-ui, Avenir, Helvetica, Arial, sans-serif`;
    root.style.fontFamily = vars["--font-family"];
  }

  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value);
  }
}

/** Removes all theme CSS custom properties so fallback defaults apply. */
export function clearThemeFromDOM(): void {
  const root = document.documentElement;
  const props = [
    "--color-primary",
    "--color-primary-hover",
    "--color-primary-active",
    "--color-primary-rgb",
    "--color-secondary",
    "--color-accent",
    "--color-background",
    "--color-background-secondary",
    "--color-background-tertiary",
    "--color-surface",
    "--color-surface-elevated",
    "--color-text",
    "--color-text-secondary",
    "--color-text-tertiary",
    "--color-border",
    "--color-success",
    "--color-warning",
    "--color-danger",
    "--color-danger-rgb",
    "--accent",
    "--accent-primary",
    "--accent-success",
    "--accent-warning",
    "--text-primary",
    "--text-secondary",
    "--bg",
    "--surface",
    "--border",
    "--bg-surface-muted",
    "--enroll-brand",
    "--enroll-brand-rgb",
    "--enroll-accent",
    "--enroll-accent-rgb",
    "--enroll-bg",
    "--enroll-card-bg",
    "--enroll-card-border",
    "--enroll-soft-bg",
    "--enroll-text-primary",
    "--enroll-text-secondary",
    "--enroll-text-muted",
    "--txn-brand",
    "--txn-brand-soft",
    "--color-accent-soft",
    "--logo-url",
    "--banner-gradient",
    "--font-family",
  ];
  for (const prop of props) {
    root.style.removeProperty(prop);
  }
  root.style.fontFamily = "";
}

/**
 * Validates a theme JSON structure.
 * Returns null if valid, or an error message string.
 */
export function validateThemeJSON(
  json: unknown,
): string | null {
  if (!json || typeof json !== "object") {
    return "Theme must be a JSON object.";
  }

  const obj = json as Record<string, unknown>;
  if (!obj.light || typeof obj.light !== "object") {
    return 'Theme must contain a "light" object.';
  }

  const requiredKeys: (keyof ThemeColors)[] = [
    "primary",
    "secondary",
    "accent",
    "background",
    "surface",
    "textPrimary",
    "textSecondary",
    "border",
    "success",
    "warning",
    "danger",
  ];

  const light = obj.light as Record<string, unknown>;
  for (const key of requiredKeys) {
    if (!light[key] || typeof light[key] !== "string") {
      return `light.${key} is required and must be a color string.`;
    }
  }

  const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  for (const key of requiredKeys) {
    if (!hexPattern.test(light[key] as string)) {
      return `light.${key} must be a valid hex color (e.g. #0052CC).`;
    }
  }

  return null;
}
