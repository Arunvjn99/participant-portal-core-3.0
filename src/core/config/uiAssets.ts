/**
 * Centralized illustration / asset URLs (e.g. from `/ai-assets` → Supabase).
 * Fill keys as needed; empty string means “no custom asset” for that slot.
 */
export const UI_ASSETS = {
  /** Pre-enrollment dashboard hero illustration. */
  dashboardHero:
    "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/Heromeeting.webm",
  enrollmentHero: "",
  aiAssistant: "",
  emptyState: "",
} as const;

export type UIAssetKey = keyof typeof UI_ASSETS;
