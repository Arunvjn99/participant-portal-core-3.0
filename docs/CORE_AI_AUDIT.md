# Core AI — Technical Audit Report

**Date:** 2025-02-25  
**Scope:** Multi-tenant US Retirement Participant Portal — Core AI and related AI paths  
**Purpose:** Audit before refactoring to data-backed, tool-based architecture. No code was modified.

---

## 1. How Core AI Currently Works

### 1.1 Entry Points

| Entry Point | Location | Behavior |
|-------------|----------|----------|
| **Core AI FAB** | `src/components/ai/CoreAIFab.tsx` | Opens `CoreAssistantModal` (single entry for “Ask Core AI”). |
| **Core Assistant Modal** | `src/components/core-ai/CoreAssistantModal.tsx` | Handles chat UI, scripted flows, and fallback to backend AI. |
| **Bella (Voice) Screen** | `src/bella/BellaScreen.tsx` | Separate flow: can call Gemini **from the frontend** with an API key (see Security). |

### 1.2 Request Flow (Core Assistant Modal)

1. User sends a message in `CoreAssistantModal`.
2. **Scripted flows first** (`flowRouter.ts`):
   - If an active flow exists (enrollment, loan, withdrawal, vesting), message is routed to that flow’s handler.
   - If no active flow, intent is detected; matching intents start the corresponding flow.
3. **If no flow handles the message** → frontend calls `sendCoreAIMessage(message, context)` in `src/services/coreAiService.ts`.
4. **coreAiService**:
   - `POST /api/core-ai` with `{ message, context }`.
   - If the backend is unreachable, falls back to **local** `getResponseForQuery(message, context)` in `src/utils/aiIntentDetection.ts` (no DB, scripted/mock only).

### 1.3 Backend (Core AI API)

- **Route:** `POST /api/core-ai` in `server/index.js` (lines 209–230).
- **Handler:** `generateCoreReply(message, context)` in `server/coreAiController.js`.
- **Flow:**
  1. **Intent guard:** `isAllowedTopic(message)` — keyword allowlist (`ALLOWED_TOPICS`) + greeting patterns. If not allowed → return fixed “out of scope” message; **no Gemini call**.
  2. **Prompt:** System prompt (retirement scope) + optional `User context` (JSON) + `User question`.
  3. **LLM:** Single `model.generateContent(fullPrompt)` via `server/geminiClient.js` (Gemini 2.0 Flash, key from `process.env.GEMINI_API_KEY`).
  4. **Response:** `{ reply, filtered }` — plain text only; no structured type, no `ui_data`, no confidence.

### 1.4 Context Passed to Backend

- **Source:** Built in `CoreAssistantModal` as `userContext` (enrollment state, route, selected plan, contribution amount). **No user_id, no company_id, no Supabase/JWT.**
- **Content:** `isEnrolled`, `isInEnrollmentFlow`, `isPostEnrollment`, `currentRoute`, `selectedPlan`, `contributionAmount`.
- **Backend:** Receives whatever the client sends; **no authentication or tenant resolution**. Context is trusted as-is and injected into the prompt.

### 1.5 Local Fallback (When Backend Unreachable)

- **Implementation:** `getResponseForQuery()` in `src/utils/aiIntentDetection.ts` → `detectIntent()` + `generateResponse()` (switch on intent) and optionally `getMockResponseForQuery()` from `src/data/bellaMockResponses.ts`.
- **Data:** 100% scripted. Uses only the in-memory `UserContext` (enrollment state, contribution %). **No database access.** Mock responses in `bellaMockResponses.ts` use **hardcoded numbers** (e.g. “$234,992”, “50% match up to 6%”, “TechVantage 401(k)”).

### 1.6 Database Usage in AI Path

- **Core AI backend (`/api/core-ai`):** **No database access.** No Supabase client, no queries to `retirement_accounts`, `plan_rules`, `account_transactions`, `retirement_knowledge`, or any other table.
- **Frontend (CoreAssistantModal + coreAiService + aiIntentDetection):** **No database access** for AI. Context is from React state/route only.
- **New tables** (`retirement_accounts`, `plan_rules`, `account_transactions`, `retirement_knowledge`) are **not referenced** anywhere in the current AI flow.

---

## 2. Weaknesses

- **No real participant data in AI:** Balances, plan rules, transactions, and knowledge are not loaded from DB. Backend only sees client-provided context (enrollment state, route, contribution %). Local fallback uses hardcoded numbers.
- **No intent-based data fetching:** No routing by intent (e.g. balance vs loan vs withdrawal) to fetch only relevant data.
- **Single generic prompt:** One system prompt for all questions; no structured “participant + account + plan rules + transactions” blocks.
- **Unstructured response:** Reply is free-form text only. No `type`, `ui_data`, or `confidence` for voice or UI triggers.
- **Two separate AI paths:** Core Assistant (backend Gemini) vs Bella (frontend Gemini with different prompt and key handling). Logic and security are inconsistent.
- **Hardcoded financial numbers in fallback:** Mock responses contain specific dollar amounts and plan names; not tenant- or user-specific and misleading if shown as “your” data.

---

## 3. Security Risks

| Risk | Severity | Details |
|------|----------|---------|
| **Exposed Gemini API key (Bella)** | **Critical** | `BellaScreen.tsx` (around line 984): `const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 'AIzaSyD1DwNBYcgL8Yxw2_iV4LLX2WaURuXZiws';` — **hardcoded key in frontend bundle.** Anyone can extract and abuse it. Must be removed; Bella should use a backend proxy only. |
| **No auth on /api/core-ai** | **High** | `POST /api/core-ai` has no authentication. No JWT, no `user_id`, no `company_id`. Any client can send any `message` and `context`. Enables abuse, prompt injection, and no multi-tenant isolation. |
| **Context spoofing** | **High** | Backend trusts `context` from the request body. A client could send fake `contributionAmount`, `selectedPlan`, etc., and the model would use them. No server-side validation or binding to a real user. |
| **No audit trail** | **Medium** | No logging of who asked what, with what intent, or what was returned. `ai_logs` (or equivalent) does not exist yet. |

---

## 4. Scalability Issues

- **No rate limiting** on `/api/core-ai` — one client can spam Gemini.
- **No per-tenant or per-user quotas** — multi-tenant abuse possible.
- **Single prompt per request** — no streaming; long answers block until full response.
- **Gemini client** is a single global `model`; fine for now but no circuit breaker or retry policy documented.

---

## 5. Hardcoded Logic

- **Topic allowlist:** `ALLOWED_TOPICS` in `coreAiController.js` is a long hardcoded array; adding intents requires code change.
- **Mock responses:** `bellaMockResponses.ts` and `generateResponse()` in `aiIntentDetection.ts` use fixed copy and numbers (e.g. $234,992, 50% match, TechVantage 401(k)).
- **Bella API key:** Hardcoded fallback key in `BellaScreen.tsx` (must be removed).
- **System prompt:** Single long string in `coreAiController.js`; not split by intent or data type.

---

## 6. Areas That Must Be Refactored

1. **Remove frontend Gemini and hardcoded key**  
   Bella (and any other frontend LLM call) must use a backend proxy only; no `VITE_GEMINI_API_KEY` or fallback key in the client.

2. **Authenticate and scope /api/core-ai**  
   Require a valid session (e.g. Supabase JWT). Resolve `user_id` and `company_id` on the server; never trust body for tenant or user identity.

3. **Intent routing**  
   Add an explicit intent layer (e.g. `balance_query`, `loan_query`, `withdrawal_query`, `contribution_query`, `enrollment_status`, `plan_rules_query`, `transaction_history`, `general_retirement_knowledge`) and route to the right data and prompt.

4. **Secure, server-side data fetching**  
   Implement a retirement service that:
   - Fetches only what the resolved user/company is allowed to see (RLS-compliant).
   - Loads from `retirement_accounts`, `plan_rules`, `account_transactions`, `retirement_knowledge` as needed by intent.
   - Never exposes full DB; no raw queries from the AI layer.

5. **Structured prompt and response**  
   - System prompt: “Use only provided data; if data is missing, say so; never hallucinate financial numbers.”
   - Inject structured blocks: Participant info, Account info, Plan rules, Recent transactions, Knowledge snippet (if any), then user question.
   - Return a structured response, e.g. `{ type, spoken_text, ui_data, confidence }`, for voice and UI.

6. **AI logging**  
   Add `ai_logs` (or equivalent) and log `user_id`, `company_id`, question, detected intent, and response (or hash) for audit and debugging.

7. **Unify Core AI and Bella**  
   One backend AI pipeline (intent → data → prompt → LLM → structured response). Bella should call the same backend, not a different frontend Gemini path.

---

## 7. File Reference Summary

| Role | File(s) |
|------|--------|
| Core AI UI entry | `src/components/ai/CoreAIFab.tsx` |
| Chat + flow orchestration | `src/components/core-ai/CoreAssistantModal.tsx` |
| Flow router | `src/components/core-ai/flows/flowRouter.ts` |
| Frontend → backend | `src/services/coreAiService.ts` |
| Local fallback (no DB) | `src/utils/aiIntentDetection.ts`, `src/data/bellaMockResponses.ts` |
| API route | `server/index.js` (POST /api/core-ai) |
| Backend prompt + guard | `server/coreAiController.js` |
| Gemini client | `server/geminiClient.js` |
| **Frontend Gemini (security issue)** | `src/bella/BellaScreen.tsx` (callGeminiAPI + hardcoded key) |

---

## 8. Conclusion

Core AI is **script-based and context-light**: backend uses a topic allowlist and a single Gemini call with client-provided context and no DB. The local fallback is fully scripted with hardcoded numbers. There is **no use of** `retirement_accounts`, `plan_rules`, `account_transactions`, or `retirement_knowledge` in the AI path. Security issues are critical (exposed API key in Bella, no auth on /api/core-ai, context spoofing). The refactor should introduce authenticated, intent-based, data-backed AI with a single server-side pipeline, structured prompts and responses, and audit logging.
