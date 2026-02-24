import { supabase } from "../lib/supabase";
import type { SerializedBranding } from "../pages/settings/theme-editor/serialization";

const TABLE = "company_branding";

export type CompanyBrandingRow = {
  id: string;
  company_id: string;
  branding_json: SerializedBranding;
  created_at: string;
  updated_at: string;
};

/**
 * Fetch company branding by company ID.
 * Returns branding_json or null if not found / error.
 */
export async function getCompanyBranding(
  companyId: string,
): Promise<SerializedBranding | null> {
  if (!companyId?.trim()) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("branding_json")
      .eq("company_id", companyId)
      .maybeSingle();

    if (error) {
      console.error("[companyBranding] getCompanyBranding error:", error.message);
      return null;
    }
    const row = data as { branding_json: unknown } | null;
    if (!row?.branding_json || typeof row.branding_json !== "object") {
      return null;
    }
    return row.branding_json as SerializedBranding;
  } catch (e) {
    console.error("[companyBranding] getCompanyBranding exception:", e);
    return null;
  }
}

/**
 * Upsert company branding (insert or update by company_id).
 * brandingPayload is stored as-is in branding_json.
 * Returns the stored payload on success, null on error.
 */
export async function upsertCompanyBranding(
  companyId: string,
  brandingPayload: SerializedBranding,
): Promise<SerializedBranding | null> {
  if (!companyId?.trim()) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(
        {
          company_id: companyId,
          branding_json: brandingPayload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "company_id" },
      )
      .select("branding_json")
      .single();

    if (error) {
      console.error("[companyBranding] upsertCompanyBranding error:", error.message);
      return null;
    }
    const row = data as { branding_json: unknown } | null;
    if (!row?.branding_json || typeof row.branding_json !== "object") {
      return null;
    }
    return row.branding_json as SerializedBranding;
  } catch (e) {
    console.error("[companyBranding] upsertCompanyBranding exception:", e);
    return null;
  }
}
