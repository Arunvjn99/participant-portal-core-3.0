import type { ThemeColors } from "../../../theme/utils";

/** Light-only editor: colors without logo (logo managed elsewhere). */
export type ThemeColorsForEditor = Omit<ThemeColors, "logo">;

/** Experience controls — affect preview only */
export type ShadowLevel = "none" | "soft" | "elevated";
export type LayoutDensity = "compact" | "comfortable" | "spacious";

export interface ExperienceState {
  cardRadius: number;
  buttonRadius: number;
  shadowLevel: ShadowLevel;
  density: LayoutDensity;
}

/** Typography controls — affect preview only */
export type FontFamilyOption = "Inter" | "Open Sans" | "Montserrat" | "System Default";
export type BaseFontSizeOption = 14 | 16 | 18;
export type HeadingScaleOption = "standard" | "large";

export interface TypographyState {
  fontFamily: FontFamilyOption;
  baseFontSize: BaseFontSizeOption;
  headingScale: HeadingScaleOption;
}

export interface BrandingMeta {
  lastModified: number;
}

/** Full branding state used in local component state (no ThemeContext writes). Light-only; dark is auto-generated later. */
export interface BrandingState {
  colors: ThemeColorsForEditor;
  experience: ExperienceState;
  typography: TypographyState;
  meta: BrandingMeta;
}

export const DEFAULT_EXPERIENCE: ExperienceState = {
  cardRadius: 12,
  buttonRadius: 8,
  shadowLevel: "soft",
  density: "comfortable",
};

export const DEFAULT_TYPOGRAPHY: TypographyState = {
  fontFamily: "Inter",
  baseFontSize: 16,
  headingScale: "standard",
};

/** Build default branding from ThemeColors (e.g. from ThemeContext). Strips logo; sets meta.lastModified. */
export function defaultBrandingFromColors(colors: ThemeColors): BrandingState {
  const { logo: _logo, ...colorsForEditor } = colors;
  return {
    colors: { ...colorsForEditor },
    experience: { ...DEFAULT_EXPERIENCE },
    typography: { ...DEFAULT_TYPOGRAPHY },
    meta: { lastModified: Date.now() },
  };
}
