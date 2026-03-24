import { supabase } from "../lib/supabase";

/**
 * Save or update the current user's enrollment with the selected plan_id.
 * Uses upsert on user_id (one row per user). Does not modify routing or contribution flow.
 */
export async function saveEnrollmentPlanId(planId: string | null): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "Supabase not configured" };
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return { ok: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: user.id,
          plan_id: planId || null,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      if (import.meta.env.DEV) console.error("[enrollmentService] saveEnrollmentPlanId error:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    if (import.meta.env.DEV) console.error("[enrollmentService] saveEnrollmentPlanId exception:", e);
    return { ok: false, error: String(e) };
  }
}
