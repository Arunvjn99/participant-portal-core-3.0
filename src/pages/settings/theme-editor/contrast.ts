/**
 * WCAG contrast ratio utility.
 * Advisory only — does not block saving.
 * https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function hexToLuminance(hex: string): number {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const [rs, gs, bs] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Returns contrast ratio between two hex colors (1–21).
 * WCAG AA requires >= 4.5 for normal text.
 */
export function getContrastRatio(color1: string, color2: string): number | null {
  const c1 = color1.startsWith("#") ? color1 : `#${color1}`;
  const c2 = color2.startsWith("#") ? color2 : `#${color2}`;
  if (!HEX_REGEX.test(c1) || !HEX_REGEX.test(c2)) return null;
  const L1 = hexToLuminance(c1);
  const L2 = hexToLuminance(c2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const WCAG_AA_MIN_RATIO = 4.5;

export function meetsWCAGAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= WCAG_AA_MIN_RATIO;
}
