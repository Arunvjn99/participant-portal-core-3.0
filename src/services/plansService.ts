import { supabase } from "../lib/supabase";
import type { PlanOption } from "../types/enrollment";

export interface PlanRow {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  match_info: string | null;
  benefits: unknown;
  sort_order: number;
  is_eligible: boolean;
  created_at: string;
  updated_at: string;
}

function rowToPlanOption(row: PlanRow): PlanOption {
  const benefits = Array.isArray(row.benefits) ? row.benefits as string[] : [];
  return {
    id: row.id,
    title: row.name?.trim() || row.id,
    matchInfo: row.match_info?.trim() ?? "",
    description: row.description?.trim() ?? "",
    benefits,
    isEligible: row.is_eligible !== false,
  };
}

/**
 * Fetch plans for a company. Filtered by company_id only.
 * RLS ensures user only sees plans for their profile's company.
 */
export async function fetchPlansByCompanyId(companyId: string | null): Promise<PlanOption[]> {
  if (!companyId?.trim()) {
    if (import.meta.env.DEV) console.log("[plansService] fetchPlansByCompanyId: no companyId, returning []");
    return [];
  }
  if (!supabase) {
    if (import.meta.env.DEV) console.warn("[plansService] Supabase not configured, returning []");
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("id, company_id, name, description, match_info, benefits, sort_order, is_eligible, created_at, updated_at")
      .eq("company_id", companyId)
      .order("sort_order", { ascending: true });

    if (import.meta.env.DEV) {
      console.log("[plansService] Supabase query result:", { companyId, rowCount: data?.length ?? 0, data, error: error?.message ?? null });
    }

    if (error) {
      if (import.meta.env.DEV) console.error("[plansService] fetchPlansByCompanyId error:", error.message);
      return [];
    }
    const rows = (data ?? []) as PlanRow[];
    const plans = rows.map(rowToPlanOption);
    if (import.meta.env.DEV) console.log("[plansService] plans.length:", plans.length);
    return plans;
  } catch (e) {
    if (import.meta.env.DEV) console.error("[plansService] fetchPlansByCompanyId exception:", e);
    return [];
  }
}
