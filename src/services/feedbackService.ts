import { supabase } from "@/lib/supabase";
import { stripRoutingVersionPrefix } from "@/core/version";
import type { PostgrestError } from "@supabase/supabase-js";

/** JSON stored in `feedback.metadata` (jsonb). Route context lives here — not as a top-level DB column. */
export type FeedbackMetadata = {
  /** Full `location.pathname` (e.g. `/v1/dashboard/pre-enrollment`). */
  page: string;
  /** Normalized screen key for analytics (e.g. `dashboard_pre_enrollment`). */
  screen: string;
  /** Same path with routing version prefix stripped, for grouping across `/v1` vs `/v2`. */
  path_normalized: string;
  device: "web";
  timestamp: string;
  scenario?: string | null;
};

export type FeedbackPayload = {
  rating: number;
  comment?: string | null;
  /** Current route — stored only under `metadata.page` (never a root insert column). */
  pathname: string;
  /** From `profiles.company_id` when available. */
  companyId?: string | null;
  /** Optional demo / analytics scenario id — stored under `metadata.scenario`. */
  scenario?: string | null;
};

export type FeedbackResponse =
  | { ok: true }
  | { ok: false; code: string; message: string; details?: string | null };

/** Row shape for production `feedback` (user_id, company_id, workflow_name, rating, comment, metadata, …). */
export type FeedbackInsertRow = {
  user_id: string | null;
  company_id?: string | null;
  rating: number;
  comment: string | null;
  workflow_name: string;
  metadata: FeedbackMetadata;
};

function deriveWorkflowName(pathname: string): string {
  const p = stripRoutingVersionPrefix(pathname) || "/";
  if (p === "/" || p === "") return "landing";
  if (p.includes("/dashboard/pre-enrollment")) return "pre-enrollment";
  if (p.includes("/dashboard/post-enrollment")) return "post-enrollment";
  if (p.startsWith("/enrollment") || p.includes("/enrollment/")) return "enrollment";
  if (p.startsWith("/transactions") || p.includes("/transactions/")) return "transactions";
  if (p.startsWith("/investments") || p.includes("/investments/")) return "investments";
  if (p.startsWith("/profile") || p.includes("/profile/")) return "profile";
  return "participant_portal";
}

function pathnameToScreen(pathname: string): string {
  const p = stripRoutingVersionPrefix(pathname) || "/";
  const trimmed = p.replace(/^\/+|\/+$/g, "");
  const normalized = (trimmed.replace(/\//g, "_") || "root").replace(/[^a-zA-Z0-9_]/g, "_");
  return normalized.toLowerCase() || "unknown";
}

function buildMetadata(pathname: string, scenario?: string | null): FeedbackMetadata {
  const page = (pathname && String(pathname).trim()) || "/";
  const path_normalized = stripRoutingVersionPrefix(page) || "/";
  const meta: FeedbackMetadata = {
    page,
    screen: pathnameToScreen(path_normalized),
    path_normalized,
    device: "web",
    timestamp: new Date().toISOString(),
  };
  const s = scenario != null ? String(scenario).trim() : "";
  if (s.length > 0) meta.scenario = s;
  return meta;
}

function formatInsertError(error: PostgrestError): string {
  const m = error.message ?? "";
  if (/row-level security|RLS|permission denied/i.test(m)) {
    return "Could not save feedback. Try signing in again.";
  }
  if (/check constraint|violates check constraint/i.test(m)) {
    return "Invalid feedback. Please choose a rating from 1 to 5.";
  }
  return m || "Something went wrong. Please try again.";
}

/**
 * Inserts into `feedback` using production columns: `rating`, `comment`, `user_id`,
 * `workflow_name`, `metadata` (route context lives in `metadata.page`, not a table column).
 */
export async function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
  if (!supabase) {
    console.warn("[feedback] submitFeedback: Supabase client not configured");
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      message: "Feedback is not available because the backend is not configured.",
    };
  }

  const rating = Math.trunc(Number(payload.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    console.warn("[feedback] submitFeedback: invalid rating", payload.rating);
    return {
      ok: false,
      code: "VALIDATION_RATING",
      message: "Please select a rating from 1 to 5 stars.",
    };
  }

  const pathname = (payload.pathname && String(payload.pathname).trim()) || "/";
  const commentRaw = payload.comment != null ? String(payload.comment).trim() : "";
  const comment = commentRaw.length > 0 ? commentRaw : null;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("[feedback] submitFeedback: getSession error", sessionError);
  }
  const userId = sessionData.session?.user?.id ?? null;

  const companyIdTrimmed =
    payload.companyId != null && String(payload.companyId).trim().length > 0
      ? String(payload.companyId).trim()
      : null;

  const workflow_name = deriveWorkflowName(pathname);
  const metadata = buildMetadata(pathname, payload.scenario);

  const row: FeedbackInsertRow = {
    user_id: userId,
    rating,
    comment,
    workflow_name,
    metadata,
  };
  if (companyIdTrimmed) {
    row.company_id = companyIdTrimmed;
  }

  if (import.meta.env.DEV) {
    console.log("[feedback] submitFeedback: inserting", {
      user_id: userId ? `${userId.slice(0, 8)}…` : null,
      rating: row.rating,
      workflow_name: row.workflow_name,
      metadata: row.metadata,
      hasComment: Boolean(row.comment),
    });
  }

  // Only columns that exist on production `feedback` — never send a root-level `page` key.
  const { error } = await supabase.from("feedback").insert(row);

  if (error) {
    console.error("Feedback insert error:", error);
    console.error("[feedback] submitFeedback: insert failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return {
      ok: false,
      code: error.code ?? "INSERT_FAILED",
      message: formatInsertError(error),
      details: error.details ?? null,
    };
  }

  if (import.meta.env.DEV) {
    console.log("[feedback] submitFeedback: insert succeeded");
  }
  return { ok: true };
}

/** @deprecated Use {@link submitFeedback} */
export type FeedbackRow = {
  user_id: string | null;
  rating: number;
  comment: string | null;
  page: string;
  scenario: string | null;
};

/** @deprecated Use {@link submitFeedback} */
export async function insertFeedback(row: FeedbackRow): Promise<void> {
  const res = await submitFeedback({
    rating: row.rating,
    comment: row.comment,
    pathname: row.page,
    companyId: null,
    scenario: row.scenario,
  });
  if (!res.ok) {
    const err = new Error(res.message) as Error & { code?: string };
    err.code = res.code;
    throw err;
  }
}
