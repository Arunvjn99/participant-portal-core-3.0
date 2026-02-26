/**
 * Supabase admin client — service role for JWT verification and server-side DB access.
 * Used only for /api/core-ai auth and profile lookup. Never expose to frontend.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let adminClient = null;

if (supabaseUrl && serviceRoleKey) {
  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
} else {
  console.warn(
    "Supabase admin not configured (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). Core AI auth will reject all requests."
  );
}

export function getAdminClient() {
  return adminClient;
}

/**
 * Verify JWT and return { user_id, company_id, profile } or null.
 * @param {string} bearerToken - Authorization header value (e.g. "Bearer <jwt>")
 * @returns {Promise<{ user_id: string, company_id: string | null, profile: object } | null>}
 */
export async function verifyCoreAIAuth(bearerToken) {
  if (!adminClient) return null;

  if (!bearerToken || typeof bearerToken !== "string") return null;
  const token = bearerToken.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  try {
    const {
      data: { user },
      error,
    } = await adminClient.auth.getUser(token);

    if (error || !user?.id) return null;

    const { data: profileRow, error: profileError } = await adminClient
      .from("profiles")
      .select("id, company_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[supabaseAdmin] profile fetch error:", profileError.message);
      return null;
    }

    return {
      user_id: user.id,
      company_id: profileRow?.company_id ?? null,
      profile: {
        id: user.id,
        company_id: profileRow?.company_id ?? null,
        email: user.email ?? null,
      },
    };
  } catch (err) {
    console.error("[supabaseAdmin] verify error:", err.message);
    return null;
  }
}

/**
 * Insert a row into ai_logs. Uses service role so RLS allows insert.
 * data_sources: optional array of table names (e.g. ["retirement_accounts", "plan_rules"]).
 */
export async function insertAILog({ user_id, company_id, question, detected_intent, response, data_sources }) {
  if (!adminClient) return;

  try {
    const row = {
      user_id,
      company_id: company_id || null,
      question: question?.slice(0, 10000) ?? "",
      detected_intent: detected_intent ?? null,
      response: response?.slice(0, 10000) ?? "",
    };
    if (Array.isArray(data_sources) && data_sources.length > 0) {
      row.data_sources = data_sources;
    }
    await adminClient.from("ai_logs").insert(row);
  } catch (err) {
    console.error("[supabaseAdmin] ai_logs insert error:", err.message);
  }
}
