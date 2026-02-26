# Phase 4A — Answer Quality Upgrade: Architecture Audit & Reuse Analysis

**Date:** 2025-02-25  
**Scope:** Core AI pipeline only. No workflows, no agent execution. Answer reliability and structure only.  
**Constraints:** Do not modify authentication, RLS, or security.

---

## STEP 1 — Current AI Pipeline Analysis

### 1.1 Full Flow Location Map

| Stage | Location | Description |
|-------|----------|-------------|
| **Entry point (UI)** | `src/components/core-ai/CoreAssistantModal.tsx` (Core AI modal), `src/bella/BellaScreen.tsx` (Bella voice) | User types/speaks → `sendCoreAIMessage(message, context, session?.access_token)` |
| **Frontend client** | `src/services/coreAiService.ts` | `sendCoreAIMessage()` → `POST /api/core-ai` with `Authorization: Bearer <jwt>`, body `{ message, context }` |
| **API handler** | `server/index.js` (lines 222–279) | Auth → resolve intent → fetch data → build context → call controller → log → respond |
| **Intent resolver** | `server/intentResolver.js` | `resolveIntent(message)` → one of 8 intents or `general_retirement_knowledge` |
| **Data fetching** | `server/services/retirementService.js` | `getDataForIntent(intent, user_id, company_id)` → `{ retirement_accounts, plan_rules, account_transactions, retirement_knowledge }` |
| **Prompt construction** | `server/coreAiController.js` → `buildContextBlock()` | Single SYSTEM_PROMPT + JSON_SCHEMA + context block + "User question: ..." |
| **LLM call** | `server/coreAiController.js` → `generateCoreReply()` | `model.generateContent(fullPrompt)` (Gemini) |
| **Response formatting** | `server/coreAiController.js` → `parseStructuredResponse()` | Regex extract `{...}`, parse JSON; fallback to `{ type: intent, spoken_text: trimmed, ui_data: {}, confidence: "medium" }` |
| **ai_logs** | `server/supabaseAdmin.js` → `insertAILog()` | Called from handler with `user_id`, `company_id`, `question`, `detected_intent`, `response` (text only) |

### 1.2 Pipeline Diagram

```
User (Modal or Bella)
       │
       ▼
 sendCoreAIMessage(message, context, accessToken)
       │
       ▼
 POST /api/core-ai  ────────────────────────────────────────────────────────────
       │
       ├─► verifyCoreAIAuth(Authorization)  →  user_id, company_id, profile
       │
       ├─► resolveIntent(message)            →  intent (e.g. balance_query)
       │
       ├─► getDataForIntent(intent, user_id, company_id)
       │        → retirement_accounts, plan_rules, account_transactions, retirement_knowledge
       │
       ├─► generateCoreReply(message, { intent, data, serverContext })
       │        │
       │        ├─► buildContextBlock(intent, data, serverContext)  →  single text block
       │        ├─► fullPrompt = SYSTEM_PROMPT + contextBlock + JSON_SCHEMA + "User question: ..."
       │        ├─► model.generateContent(fullPrompt)
       │        └─► parseStructuredResponse(text, intent)  →  { type, spoken_text, ui_data, confidence }
       │
       ├─► insertAILog({ user_id, company_id, question, detected_intent, response })
       │
       └─► res.json({ reply, filtered, type, spoken_text, ui_data, confidence })
       │
       ▼
 Frontend: CoreAssistantModal / Bella use reply (and optionally type, spoken_text, ui_data, confidence)
```

### 1.3 Confirmations

| Question | Answer |
|----------|--------|
| **System prompt centralized or scattered?** | **Centralized.** Single `SYSTEM_PROMPT` and single `JSON_SCHEMA` in `coreAiController.js`. No other files define Core AI system prompts. |
| **Context blocks structured or concatenated?** | **Concatenated.** `buildContextBlock()` appends labeled lines (Participant, Account data, Plan rules, Recent transactions, Knowledge) into one string with `lines.join("\n")`. No strict section headers like `PARTICIPANT DATA` / `PLAN RULES`; labels are inline (e.g. "Account data (use only these numbers):"). |
| **Response JSON structured or plain text?** | **Structured.** Controller asks for JSON and parses it. Response has `type`, `spoken_text`, `ui_data`, `confidence`. API returns same shape. Fallback when parse fails: default object with `confidence: "medium"`. |
| **Confidence deterministic or LLM-generated?** | **LLM-generated.** Schema tells the model to return `"confidence": "high" \| "medium" \| "low"`. No server-side rule; if LLM omits or invalidates, `parseStructuredResponse` forces `"medium"`. |
| **Are data_sources tracked?** | **No.** Neither the prompt nor the response schema mention `data_sources`. The model is not asked to list which blocks were used, and the API does not return or log `data_sources`. |

---

## STEP 2 — Reuse & Isolation Analysis

| Component | Classification | Notes |
|-----------|----------------|------|
| **intentResolver.js** | **B) Needs enhancement** | Reusable as-is for routing. Enhancement: optional export of a small set of “data-dependent” intents for deterministic confidence (e.g. which intents are DB-backed). No need to replace. |
| **retirementService.js** | **A) Reusable as-is** | Already filters by user_id/company_id, returns structured buckets. Optional: return a small “data_sources” summary (e.g. `{ used: ["retirement_accounts"], empty: ["plan_rules"] }`) for deterministic confidence. |
| **/api/core-ai handler** | **B) Needs enhancement** | Keep auth, rate limit, flow. Enhancement: pass through new response fields (e.g. `data_sources`), and optionally compute deterministic confidence from data presence before sending to client. |
| **Prompt builder logic** | **C) Should be isolated/refactored** | Currently inline in `buildContextBlock()`. Isolate into a small module (e.g. `server/promptBuilder.js`) with explicit sections: PARTICIPANT DATA, PLAN RULES, TRANSACTIONS, KNOWLEDGE, USER QUESTION. Same content, clearer structure and easier to extend. |
| **Response formatter** | **B) Needs enhancement** | `parseStructuredResponse()` is fine. Enhancement: accept and pass through `data_sources`; optionally override `confidence` with a deterministic rule when `data_sources` is available. |
| **ai_logs logging** | **B) Needs enhancement** | Reusable. Enhancement: add optional column or JSON field for `data_sources` / `response_meta` if we add it to the pipeline; keep existing fields unchanged. |
| **Bella integration layer** | **A) Reusable as-is** | Bella only calls `sendCoreAIMessage()` and uses `res.reply`. No separate AI logic. No change required for answer quality; any new fields (e.g. `data_sources`) can be ignored by Bella until needed. |

---

## STEP 3 — Answer Quality Gap Analysis

| Requirement | Target | Current State | Gap |
|-------------|--------|----------------|------|
| **1. Strict financial guardrails** | "Use only provided data"; "Never hallucinate numbers"; missing data explicitly stated | **Partially implemented.** System prompt says "Use ONLY the provided data below. If data is missing, say so clearly. Never hallucinate financial numbers." Context block adds "Account data: None provided. Tell the user..." for some intents. | Prompt is good. Missing: (a) explicit "If data is missing, say 'I don't have that data' and do not infer" in the schema; (b) no server-side check that the model did not invent numbers (audit only). |
| **2. Structured context injection** | Separate blocks: PARTICIPANT DATA, PLAN RULES, TRANSACTIONS, KNOWLEDGE, USER QUESTION | **Partially implemented.** Labels exist but are inline (e.g. "Plan rules:"). No uppercase section headers; order is Participant → Account → Plan rules → Transactions → Knowledge, then user question. | Add explicit section headers (PARTICIPANT DATA, PLAN RULES, etc.) and a final USER QUESTION block so the model and future tooling see a fixed structure. |
| **3. Structured JSON response** | Required: type, spoken_text, ui_data, confidence, **data_sources** | **Partially implemented.** type, spoken_text, ui_data, confidence are requested and returned. **data_sources** is not in schema or response. | Add `data_sources` to the requested JSON (e.g. array of strings like `["retirement_accounts", "plan_rules"]`) and to API response and parsing. |
| **4. Deterministic confidence scoring** | high = DB-backed; medium = knowledge-only; low = partial data | **Not implemented.** Confidence is entirely LLM-generated; no server-side rule. | Implement server-side rule: e.g. high = at least one DB block present and used; medium = knowledge only; low = no data or partial. Optionally use as override when present. |
| **5. Missing data handling strategy** | Clear strategy when data is absent | **Partially implemented.** Prompt says "if data is missing, say so." Context injects "None provided. Tell the user..." for some intents. No single place that defines the exact phrase or behavior for all intents. | Centralize: e.g. "When a section says 'None provided', respond only that you don't have that information and suggest where to find it (e.g. plan administrator). Do not infer or use numbers from other sections." |

---

## STEP 4 — Safe Implementation Plan

### 4.1 Minimal Modification Plan to Achieve Target

1. **Prompt and context (no auth/RLS change)**  
   - In `coreAiController.js` (or a new `promptBuilder.js`):  
     - Add explicit section headers: `PARTICIPANT DATA`, `PLAN RULES`, `TRANSACTIONS`, `KNOWLEDGE`, `USER QUESTION`.  
     - Add one line to system/schema: "If a section says 'None provided', state that you don't have that information; do not infer or use numbers from other sections."  
   - Keep SYSTEM_PROMPT and JSON_SCHEMA in one place (centralized).

2. **Response shape**  
   - Add `data_sources` to the JSON schema (e.g. `"data_sources": ["retirement_accounts"]`).  
   - In `parseStructuredResponse()`, extract `data_sources` (array of strings); default `[]` if missing.  
   - In `server/index.js`, include `data_sources` in `res.json()`.

3. **Deterministic confidence**  
   - In the handler or controller: compute `confidenceDeterministic` from which data buckets were non-empty (and optionally which intent).  
   - Rule: e.g. high = accounts or plan_rules or transactions used; medium = knowledge only; low = no data.  
   - Either send as separate field (e.g. `confidence_source: "deterministic"`) or override `confidence` when we have data_sources.  
   - No change to auth or RLS.

4. **Data-source tracking**  
   - From `getDataForIntent` result, derive a simple list of used sources (e.g. `["retirement_accounts"]`).  
   - Pass into prompt or only use for deterministic confidence and logging.  
   - Optional: add to `ai_logs` (new column or JSON) for audit.

5. **ai_logs**  
   - Optional: log `data_sources` or `response_meta` (e.g. JSON) if we add it. Migration: add nullable column; backfill null.

### 4.2 Files to Update

| File | Change |
|------|--------|
| `server/coreAiController.js` | Prompt sections (headers), JSON schema (+ data_sources), parseStructuredResponse (+ data_sources), optional deterministic confidence helper. |
| `server/index.js` | Pass `data_sources` in response; optionally compute and attach deterministic confidence. |
| `server/services/retirementService.js` | Optional: return `data_sources_used: string[]` from `getDataForIntent` (derived from which buckets are non-empty). |
| `server/supabaseAdmin.js` | Optional: extend `insertAILog` to accept and store `data_sources` or `response_meta` if we add a column. |
| `src/services/coreAiService.ts` | Add `data_sources?: string[]` to `CoreAIResponse`; pass through from API. No auth or token change. |

### 4.3 Files to Leave Untouched (Security-Critical)

| File | Reason |
|------|--------|
| `server/supabaseAdmin.js` (auth part) | `verifyCoreAIAuth` and JWT handling. |
| `server/index.js` (auth + rate limit) | Auth check, rate limiter, and 401/400 handling. |
| `server/services/retirementService.js` (filters) | All `user_id` / `company_id` filters must remain. |
| RLS policies / Supabase migrations | No change to RLS or auth model. |

### 4.4 Migration Strategy (Response Format Change)

- **Backward compatibility:**  
  - Keep `reply` and `spoken_text`; add `data_sources` as optional.  
  - Frontend (CoreAssistantModal, Bella) continues to use `reply`; can later use `data_sources` for UI (e.g. “Based on your account and plan rules”).  
- **Versioning:** Not required; additive fields only.  
- **Bella:** No change required; can ignore `data_sources` and confidence source until needed.

### 4.5 Backward Compatibility Plan

- API response remains a superset: existing clients that only read `reply`, `type`, `spoken_text`, `ui_data`, `confidence` keep working.  
- New fields: `data_sources` (optional array), optionally `confidence_source: "deterministic" | "model"`.  
- If we override `confidence` deterministically, clients that show “high/medium/low” still work; behavior becomes more consistent.

---

## Summary Tables

### Reuse Matrix

| Component | A Reusable | B Enhance | C Isolate | D Replace |
|------------|------------|-----------|-----------|-----------|
| intentResolver.js | ✓ | ✓ | | |
| retirementService.js | ✓ | (optional) | | |
| /api/core-ai handler | | ✓ | | |
| Prompt builder | | | ✓ | |
| Response formatter | | ✓ | | |
| ai_logs logging | | ✓ | | |
| Bella integration | ✓ | | | |

### Gap Summary

| # | Requirement | Implemented | Partial | Not |
|---|-------------|------------|---------|-----|
| 1 | Financial guardrails | ✓ (prompt) | ✓ (no audit) | |
| 2 | Structured context blocks | | ✓ | |
| 3 | JSON: type, spoken_text, ui_data, confidence, **data_sources** | ✓ (4/5) | | ✓ (data_sources) |
| 4 | Deterministic confidence | | | ✓ |
| 5 | Missing data strategy | | ✓ | |

### Implementation Priority (Controlled)

1. Add **data_sources** to schema, parser, and API (and optionally to retirementService return).  
2. Introduce **deterministic confidence** from data presence; expose in response (and optionally in ai_logs).  
3. Refactor prompt into **explicit sections** (PARTICIPANT DATA, PLAN RULES, TRANSACTIONS, KNOWLEDGE, USER QUESTION) and tighten missing-data instruction.  
4. Optionally isolate **prompt builder** into a dedicated module.  
5. Optionally extend **ai_logs** with data_sources/response_meta for audit.

All steps are answer-quality and structure only; no auth, RLS, or security weakening.
