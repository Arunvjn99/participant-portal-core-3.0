import { supabase } from "../lib/supabase";
import type { SerializedBranding } from "../pages/settings/theme-editor/serialization";

const COMPANIES_TABLE = "companies";

/**
 * Update company branding on the companies table.
 * Updates branding_json and optionally primary_color, secondary_color, logo_url from payload.light.
 * Returns the updated branding_json on success, null on error.
 */
export async function updateCompanyBranding(
  companyId: string,
  brandingPayload: SerializedBranding,
): Promise<SerializedBranding | null> {
  if (!companyId?.trim()) return null;
  if (!supabase) return null;
  try {
    const light = brandingPayload?.light && typeof brandingPayload.light === "object" ? brandingPayload.light as Record<string, unknown> : {};
    const updates: {
      branding_json: SerializedBranding;
      primary_color?: string | null;
      secondary_color?: string | null;
      logo_url?: string | null;
    } = {
      branding_json: brandingPayload,
    };
    if (typeof light.primary === "string") updates.primary_color = light.primary.trim() || null;
    if (typeof light.secondary === "string") updates.secondary_color = light.secondary.trim() || null;
    if (typeof light.logo === "string") updates.logo_url = light.logo.trim() || null;

    const { data, error } = await supabase
      .from(COMPANIES_TABLE)
      .update(updates)
      .eq("id", companyId)
      .select("branding_json")
      .single();

    if (error) {
      if (import.meta.env.DEV) console.error("[companyBranding] updateCompanyBranding error:", error.message);
      return null;
    }
    const row = data as { branding_json: unknown } | null;
    if (!row?.branding_json || typeof row.branding_json !== "object") return null;
    return row.branding_json as SerializedBranding;
  } catch (e) {
    if (import.meta.env.DEV) console.error("[companyBranding] updateCompanyBranding exception:", e);
    return null;
  }
}
