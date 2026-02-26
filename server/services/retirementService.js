/**
 * Retirement service — server-side only. Fetches participant data for Core AI.
 * Always filters by user_id and company_id. Never exposes full DB.
 */

import { getAdminClient } from "../supabaseAdmin.js";

/**
 * Fetch retirement account(s) for user. Filter by user_id and company_id.
 */
async function fetchRetirementAccounts(client, userId, companyId) {
  if (!client) return null;
  try {
    let q = client.from("retirement_accounts").select("*").eq("user_id", userId);
    if (companyId) q = q.eq("company_id", companyId);
    const { data, error } = await q.limit(5);
    if (error) {
      console.warn("[retirementService] retirement_accounts:", error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn("[retirementService] retirement_accounts error:", e.message);
    return null;
  }
}

/**
 * Fetch plan rules for company.
 */
async function fetchPlanRules(client, companyId) {
  if (!client) return null;
  if (!companyId) return null;
  try {
    const { data, error } = await client
      .from("plan_rules")
      .select("*")
      .eq("company_id", companyId)
      .limit(5);
    if (error) {
      console.warn("[retirementService] plan_rules:", error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn("[retirementService] plan_rules error:", e.message);
    return null;
  }
}

/**
 * Fetch recent account transactions for user. Filter by user_id and company_id if column exists.
 */
async function fetchAccountTransactions(client, userId, companyId) {
  if (!client) return null;
  try {
    let q = client
      .from("account_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (companyId) q = q.eq("company_id", companyId);
    const { data, error } = await q;
    if (error) {
      console.warn("[retirementService] account_transactions:", error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn("[retirementService] account_transactions error:", e.message);
    return null;
  }
}

/**
 * Fetch retirement knowledge snippets (company-specific or global). For general_retirement_knowledge.
 */
async function fetchRetirementKnowledge(client, companyId) {
  if (!client) return null;
  try {
    let q = client.from("retirement_knowledge").select("topic, content").limit(10);
    if (companyId) {
      q = q.or(`company_id.is.null,company_id.eq.${companyId}`);
    }
    const { data, error } = await q;
    if (error) {
      console.warn("[retirementService] retirement_knowledge:", error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn("[retirementService] retirement_knowledge error:", e.message);
    return null;
  }
}

/**
 * Get data needed for the given intent. Always filters by user_id and company_id.
 * Returns data plus list of sources that had non-empty results (for confidence and logging).
 * @param {string} intent - One of balance_query, loan_query, withdrawal_query, contribution_query, enrollment_status, plan_rules_query, transaction_history, general_retirement_knowledge
 * @param {string} userId - auth user id
 * @param {string|null} companyId - from profile
 * @returns {Promise<{ data: object, sources: string[] }>} data for prompt; sources = table names with data
 */
export async function getDataForIntent(intent, userId, companyId) {
  const client = getAdminClient();
  const data = {
    retirement_accounts: null,
    plan_rules: null,
    account_transactions: null,
    retirement_knowledge: null,
  };

  const needAccounts = ["balance_query", "loan_query", "withdrawal_query", "contribution_query", "enrollment_status"].includes(intent);
  const needPlanRules = ["loan_query", "withdrawal_query", "plan_rules_query", "contribution_query"].includes(intent);
  const needTransactions = ["transaction_history", "contribution_query"].includes(intent);
  const needKnowledge = intent === "general_retirement_knowledge" || intent === "plan_rules_query";

  if (needAccounts) {
    data.retirement_accounts = await fetchRetirementAccounts(client, userId, companyId);
  }
  if (needPlanRules) {
    data.plan_rules = await fetchPlanRules(client, companyId);
  }
  if (needTransactions) {
    data.account_transactions = await fetchAccountTransactions(client, userId, companyId);
  }
  if (needKnowledge) {
    data.retirement_knowledge = await fetchRetirementKnowledge(client, companyId);
  }

  const sources = [];
  if (data.retirement_accounts != null && data.retirement_accounts.length > 0) {
    sources.push("retirement_accounts");
  }
  if (data.plan_rules != null && data.plan_rules.length > 0) {
    sources.push("plan_rules");
  }
  if (data.account_transactions != null && data.account_transactions.length > 0) {
    sources.push("account_transactions");
  }
  if (data.retirement_knowledge != null && data.retirement_knowledge.length > 0) {
    sources.push("retirement_knowledge");
  }

  return { data, sources };
}
