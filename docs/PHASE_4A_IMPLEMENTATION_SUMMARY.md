# Phase 4A — Answer Quality Upgrade: Implementation Summary

## 1. Files Modified

| File | Changes |
|------|---------|
| `server/coreAiController.js` | Use `promptBuilder.buildStructuredPrompt`; accept `sources`; `computeDeterministicConfidence(sources)` overrides model confidence; return `data_sources`; removed inline `buildContextBlock`. |
| `server/services/retirementService.js` | `getDataForIntent()` now returns `{ data, sources }` where `sources` is array of table names with non-empty data. |
| `server/index.js` | Destructure `{ data, sources }` from `getDataForIntent`; pass `sources` to `generateCoreReply` and `insertAILog`; include `data_sources` in `res.json()`. |
| `server/supabaseAdmin.js` | `insertAILog()` accepts optional `data_sources` (array) and includes it in insert when provided. |
| `src/services/coreAiService.ts` | Added `data_sources?: string[]` to `CoreAIResponse`; map `data.data_sources` in response. |

## 2. Files Created

| File | Purpose |
|------|---------|
| `server/promptBuilder.js` | Structured prompt with guardrail and fixed section headers (PARTICIPANT DATA, ACCOUNT DATA, PLAN RULES, TRANSACTIONS, KNOWLEDGE SNIPPETS, USER QUESTION); injects "Value unavailable" when data missing. |
| `supabase/migrations/20250225100000_ai_logs_data_sources.sql` | Adds `data_sources text[]` to `ai_logs`. |

## 3. Code Snippets

### promptBuilder.js (excerpt)

```javascript
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

export function buildStructuredPrompt(intent, data, serverContext, userMessage) {
  const sections = [];
  sections.push(GUARDRAIL);
  sections.push(SECTION_HEADERS.PARTICIPANT);
  // ... per-section: if data present → JSON.stringify; else → UNAVAILABLE or "(Not requested for this intent)"
  sections.push(SECTION_HEADERS.USER_QUESTION);
  sections.push(userMessage || UNAVAILABLE);
  return sections.join("\n");
}
```

### Deterministic confidence (coreAiController.js)

```javascript
export function computeDeterministicConfidence(sources) {
  if (!Array.isArray(sources)) return "low";
  const has = (name) => sources.includes(name);
  if (has("retirement_accounts") || has("plan_rules")) return "high";
  if (has("retirement_knowledge") && sources.length === 1) return "medium";
  return "low";
}
// Used after parseStructuredResponse: const confidence = computeDeterministicConfidence(sources);
// Returned in result; model confidence is not used.
```

### data_sources integration (index.js)

```javascript
const { data, sources } = await getDataForIntent(intent, auth.user_id, auth.company_id);

const result = await generateCoreReply(trimmedMessage, {
  intent,
  data,
  serverContext,
  sources,
});

const dataSources = result.data_sources ?? sources ?? [];

await insertAILog({
  user_id: auth.user_id,
  company_id: auth.company_id,
  question: trimmedMessage,
  detected_intent: intent,
  response: responseText,
  data_sources: dataSources,
});

res.json({
  reply: responseText,
  type: result.type ?? intent,
  spoken_text: result.spoken_text ?? responseText,
  ui_data: result.ui_data ?? {},
  confidence: result.confidence ?? "medium",
  data_sources: dataSources,
});
```

## 4. Example Request + Response

**Request**

```http
POST /api/core-ai HTTP/1.1
Authorization: Bearer <supabase_jwt>
Content-Type: application/json

{"message": "What is my current balance?"}
```

**Response (200)**

```json
{
  "reply": "Your total balance is $54,200, with a vested balance of $48,100.",
  "filtered": false,
  "type": "balance_answer",
  "spoken_text": "Your total balance is $54,200, with a vested balance of $48,100.",
  "ui_data": {
    "total_balance": 54200,
    "vested_balance": 48100
  },
  "confidence": "high",
  "data_sources": ["retirement_accounts"]
}
```

**Response when no account data (sources empty)**

```json
{
  "reply": "I don't have your account data available right now. Please check your dashboard or contact your plan administrator.",
  "filtered": false,
  "type": "balance_query",
  "spoken_text": "I don't have your account data available right now. Please check your dashboard or contact your plan administrator.",
  "ui_data": {},
  "confidence": "low",
  "data_sources": []
}
```

Backward compatibility: existing clients that only read `reply` (and optionally `spoken_text`, `type`, `ui_data`, `confidence`) continue to work; `data_sources` is additive.

## 5. Security Layer Untouched

| Layer | Status |
|-------|--------|
| **Authentication** | Unchanged. `verifyCoreAIAuth(bearerToken)` still required; 401 when invalid. No new auth logic. |
| **RLS** | Unchanged. No changes to Supabase RLS policies. New migration only adds nullable column to `ai_logs`. |
| **Rate limiting** | Unchanged. `coreAIRateLimiter` (30/min) still applied to `POST /api/core-ai`. |
| **Data scoping** | Unchanged. `getDataForIntent(intent, user_id, company_id)` still filters by `user_id` and `company_id`; no new tables or bypass. |
| **Supabase admin** | Unchanged. `verifyCoreAIAuth` and JWT handling unchanged; only `insertAILog` signature extended with optional `data_sources`. |

No removal or weakening of auth, RLS, rate limits, or data access checks.
