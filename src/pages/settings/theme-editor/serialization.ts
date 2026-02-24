import type { BrandingState } from "./types";
import { DEFAULT_EXPERIENCE, DEFAULT_TYPOGRAPHY } from "./types";

/**
 * Serialization layer for Supabase (and other persistence).
 * No Supabase imports or API calls — transformation only.
 */

export interface SerializedBranding {
  light: BrandingState["colors"];
  experience: BrandingState["experience"];
  typography: BrandingState["typography"];
  meta: BrandingState["meta"];
}

/**
 * Format branding for DB / persistence.
 * Light-only; dark is intended to be auto-generated from light later.
 */
export function serializeBranding(branding: BrandingState): SerializedBranding {
  return {
    light: { ...branding.colors },
    experience: { ...branding.experience },
    typography: { ...branding.typography },
    meta: { ...branding.meta },
  };
}

/**
 * Convert DB payload back into BrandingState.
 * Accepts SerializedBranding (e.g. from Supabase).
 * Handles older payloads: missing experience/typography/meta get defaults.
 */
export function deserializeBranding(payload: unknown): BrandingState | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const light = obj.light;
  if (!light || typeof light !== "object") return null;

  const colors = light as Record<string, unknown>;
  const requiredColorKeys = [
    "primary", "secondary", "accent", "background", "surface",
    "textPrimary", "textSecondary", "border", "success", "warning", "danger", "font",
  ];
  for (const k of requiredColorKeys) {
    if (colors[k] == null || typeof colors[k] !== "string") return null;
  }

  const exp = obj.experience && typeof obj.experience === "object"
    ? { ...DEFAULT_EXPERIENCE, ...(obj.experience as object) }
    : DEFAULT_EXPERIENCE;
  const typo = obj.typography && typeof obj.typography === "object"
    ? { ...DEFAULT_TYPOGRAPHY, ...(obj.typography as object) }
    : DEFAULT_TYPOGRAPHY;
  const meta = obj.meta && typeof obj.meta === "object" && typeof (obj.meta as { lastModified?: unknown }).lastModified === "number"
    ? { lastModified: (obj.meta as { lastModified: number }).lastModified }
    : { lastModified: Date.now() };

  return {
    colors: { ...colors } as BrandingState["colors"],
    experience: exp as BrandingState["experience"],
    typography: typo as BrandingState["typography"],
    meta,
  };
}
