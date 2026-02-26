/**
 * Structured prompt builder for Core AI. Explicit sections and missing-data placeholders.
 * Do not allow the model to guess; use "Value unavailable" when data is absent.
 */

const GUARDRAIL = `Use ONLY the provided structured data below.
If any required value is missing, explicitly state it is unavailable.
Never fabricate financial numbers.`;

const SECTION_HEADERS = {
  PARTICIPANT: "### PARTICIPANT DATA",
  ACCOUNT: "### ACCOUNT DATA",
  PLAN_RULES: "### PLAN RULES",
  TRANSACTIONS: "### TRANSACTIONS",
  KNOWLEDGE: "### KNOWLEDGE SNIPPETS",
  USER_QUESTION: "### USER QUESTION",
};

const UNAVAILABLE = "Value unavailable";

/**
 * Build the full context block with fixed section headers.
 * When data is null or empty for a section that applies to the intent, inject "Value unavailable".
 * @param {string} intent
 * @param {object} data - { retirement_accounts, plan_rules, account_transactions, retirement_knowledge }
 * @param {object} serverContext - { user_id, company_id, email }
 * @param {string} userMessage
 * @returns {string}
 */
export function buildStructuredPrompt(intent, data, serverContext, userMessage) {
  const sections = [];

  sections.push(GUARDRAIL);
  sections.push("");

  // PARTICIPANT DATA
  sections.push(SECTION_HEADERS.PARTICIPANT);
  if (serverContext && typeof serverContext === "object") {
    sections.push(JSON.stringify(serverContext, null, 2));
  } else {
    sections.push(UNAVAILABLE);
  }
  sections.push("");

  const needAccounts = [
    "balance_query",
    "loan_query",
    "withdrawal_query",
    "contribution_query",
    "enrollment_status",
  ].includes(intent);
  sections.push(SECTION_HEADERS.ACCOUNT);
  if (needAccounts) {
    if (data.retirement_accounts != null && data.retirement_accounts.length > 0) {
      sections.push(JSON.stringify(data.retirement_accounts, null, 2));
    } else {
      sections.push(UNAVAILABLE);
    }
  } else {
    sections.push("(Not requested for this intent)");
  }
  sections.push("");

  const needPlanRules = [
    "loan_query",
    "withdrawal_query",
    "plan_rules_query",
    "contribution_query",
  ].includes(intent);
  sections.push(SECTION_HEADERS.PLAN_RULES);
  if (needPlanRules) {
    if (data.plan_rules != null && data.plan_rules.length > 0) {
      sections.push(JSON.stringify(data.plan_rules, null, 2));
    } else {
      sections.push(UNAVAILABLE);
    }
  } else {
    sections.push("(Not requested for this intent)");
  }
  sections.push("");

  const needTransactions = ["transaction_history", "contribution_query"].includes(intent);
  sections.push(SECTION_HEADERS.TRANSACTIONS);
  if (needTransactions) {
    if (data.account_transactions != null && data.account_transactions.length > 0) {
      sections.push(JSON.stringify(data.account_transactions.slice(0, 10), null, 2));
    } else {
      sections.push(UNAVAILABLE);
    }
  } else {
    sections.push("(Not requested for this intent)");
  }
  sections.push("");

  sections.push(SECTION_HEADERS.KNOWLEDGE);
  if (data.retirement_knowledge != null && data.retirement_knowledge.length > 0) {
    sections.push(JSON.stringify(data.retirement_knowledge, null, 2));
  } else {
    sections.push(UNAVAILABLE);
  }
  sections.push("");

  sections.push(SECTION_HEADERS.USER_QUESTION);
  sections.push(userMessage || UNAVAILABLE);

  return sections.join("\n");
}
