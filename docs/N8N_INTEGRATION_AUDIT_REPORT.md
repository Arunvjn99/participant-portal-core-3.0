# n8n Integration — Technical Audit Report

**Purpose:** Analyze the codebase before integrating n8n for AI orchestration.  
**Scope:** Retirement enrollment system, AI advisor prototype, AI integration points, state management, API layer, Supabase usage.  
**Date:** Generated from codebase audit. No code was modified.

---

## 1. PROJECT STRUCTURE

### Key Directories (src/)

| Area | Path | Notes |
|------|------|--------|
| App / Router | `src/app/router.tsx` | createBrowserRouter; RootLayout wraps all routes |
| Layouts | `src/layouts/` | RootLayout, DashboardLayout, EnrollmentLayout, EnrollmentLayoutV2 |
| Pages | `src/pages/` | Auth, dashboard, enrollment (legacy), profile, transactions, **AgentModeLab** |
| Enrollment V2 (6-step) | `src/features/enrollment/` | choose-plan, contribution, autoIncrease, investment, readiness, review |
| Enrollment legacy | `src/pages/enrollment/`, `src/enrollment/` | ChoosePlan, Contribution, FutureContributions, Review; context & draft store |
| Investment | `src/features/investment/` | InvestmentPage (allocation) |
| Core AI / Chat | `src/components/core-ai/` | CoreAssistantModal, MessageList, MessageInput, flowRouter, flows |
| Agent prototype | `src/pages/AgentModeLab.tsx`, `src/components/AgentAvatarScene.tsx` | Sandbox at `/agent-lab` |
| Advisor (human + AI) | `src/components/pre-enrollment/`, `src/components/dashboard/` | AdvisorSection, AdvisorCard, AdvisorBookingFlow, AIAdvisorModal |
| Voice | `src/components/voice/`, `src/hooks/useSpeechToText.ts`, `useTextToSpeech.ts` | VoiceHeader, VoiceFooter, VoiceOrb, VoiceTranscript |
| Context | `src/context/` | AuthContext, UserContext, ThemeContext, EnrollmentContext, CoreAIModalContext, AISettingsContext, InvestmentContext |
| Services | `src/services/` | coreAiService, enrollmentService, plansService, companyBrandingService |
| Agent (deprecated) | `src/agent/` | geminiClient (disabled), LLMEnhancer, taskDefinitions, conversationController — all AI via `/api/core-ai` now |

### Route Summary

- **Enrollment V1:** `/enrollment` → EnrollmentManagement, choose-plan, plans, contribution, future-contributions, investments, review (EnrollmentLayout).
- **Enrollment V2 (primary):** `/enrollment-v2` → EnrollmentLayoutV2 with 6 steps: choose-plan, contribution, auto-increase, investment, readiness, review.
- **Agent prototype:** `/agent-lab` → AgentModeLab (no auth, sandbox only).

---

## 2. ENROLLMENT FLOW COMPONENTS

### V2 Flow (6 steps — path-driven)

| Step | Component | File path | State | Navigation |
|------|-----------|-----------|--------|------------|
| 1. Plan Selection | ChoosePlanPage | `src/features/enrollment/plan/ChoosePlanPage.tsx` (and `src/enrollment-v2/pages/ChoosePlanPage.tsx`) | EnrollmentContext (selectedPlan, selectedPlanDbId), enrollmentDraftStore (sessionStorage) | React Router: `/enrollment-v2/choose-plan` |
| 2. Contribution | ContributionPage | `src/features/enrollment/contribution/ContributionPage.tsx` | EnrollmentContext (contributionAmount, salary, sourceAllocation, etc.) | `/enrollment-v2/contribution` |
| 3. Auto Increase | AutoIncreasePage | `src/features/enrollment/autoIncrease/AutoIncreasePage.tsx` | EnrollmentContext (autoIncrease) | `/enrollment-v2/auto-increase` |
| 4. Investment | InvestmentPage | `src/features/investment/InvestmentPage.tsx`, `src/features/enrollment/investment/InvestmentPage.tsx` | EnrollmentContext (investmentProfile), InvestmentContext | `/enrollment-v2/investment` |
| 5. Readiness | ReadinessPage | `src/features/enrollment/readiness/ReadinessPage.tsx` | EnrollmentContext (read-only for summary) | `/enrollment-v2/readiness` |
| 6. Review | ReviewPage | `src/features/enrollment/review/ReviewPage.tsx` | EnrollmentContext (full state for summary) | `/enrollment-v2/review` |

**State management (enrollment):**

- **EnrollmentContext** (`src/enrollment/context/EnrollmentContext.tsx`): React Context + useState. Holds selectedPlan, selectedPlanDbId, salary, contributionType/Amount, sourceAllocation, autoIncrease, currentAge, retirementAge, investmentProfile, etc. Persisted via **enrollmentDraftStore** (sessionStorage key `enrollment-draft`).
- **Step config:** `src/features/enrollment/config/stepConfig.ts` — `ENROLLMENT_V2_STEP_PATHS`, `getV2StepIndex(pathname)`, `isEnrollmentV2Path(pathname)`.
- **Navigation:** React Router `<Outlet />` inside EnrollmentLayoutV2; stepper and footer use pathname to derive active step; links to next/previous step paths.

**Layout:**

- **EnrollmentLayoutV2** wraps with `EnrollmentProvider` (EnrollmentContext), renders `EnrollmentHeaderWithStepper` (activeStep from pathname) and `DashboardLayout` with `<Outlet />` for the step page.

---

## 3. ADVISOR MODE COMPONENTS (Agent prototype)

### File paths

| File | Purpose |
|------|--------|
| `src/pages/AgentModeLab.tsx` | Sandbox page at `/agent-lab`. Renders 3-panel layout: left 3D scene, center step card, bottom-left advisor panel. |
| `src/components/AgentAvatarScene.tsx` | R3F Canvas; loads GLB `/models/advisor.glb` and FBX animations (talking, pointing); Environment, lights, floor; OrbitControls. |

### Component hierarchy

```
AgentModeLab
├── Left (35%): div → AgentAvatarScene
│   └── AgentAvatarScene (Canvas)
│       └── SceneContent
│           ├── Lights, Environment, FloorPlane
│           ├── SceneErrorBoundary → Suspense → AvatarModel (primitive + useAnimations)
│           └── OrbitControls
├── Center: step label + StepCard(step) + Back / Next Step buttons
│   └── StepCard switches: PlanStepCard | ContributionStepCard | AutoIncreaseStepCard | InvestmentStepCard | ReadinessStepCard | ReviewStepCard
└── Bottom-left (absolute): AdvisorPanel
    └── "Advisor" label, 6% match message, "Set Contribution to 6%", "Ask Core AI"
```

### Props and state (advisor UI)

- **AgentModeLab state:** `stepIndex` (0..5), `animationState` (`"talking"` | `"pointing"`).  
- **AgentModeLab → AgentAvatarScene:** `animationState` (triggers Talking vs Pointing animation).  
- **AgentAvatarScene:** Accepts `animationState`; passes to `SceneContent` → `AvatarModel`. No other props.  
- **AdvisorPanel:** No props; static copy and buttons (no backend or Core AI wired).  
- **Step cards:** Local useState only (e.g. contribution percent in ContributionStepCard). No EnrollmentContext, no Supabase, no API.

### Summary

- Advisor mode is **fully isolated**: no enrollment pages, no auth, no Supabase, no AI API.  
- User prompts and AI responses are **not** connected; “Ask Core AI” is a placeholder.  
- Best place to plug n8n: **AgentModeLab** (e.g. when user clicks “Ask Core AI” or sends a message in a future chat strip), and optionally **AdvisorPanel** to show n8n-driven advisor messages.

---

## 4. AI INTEGRATION STATUS

### Existing AI API

- **Single backend AI endpoint:** `POST /api/core-ai`  
  - **Client:** `src/services/coreAiService.ts` — `sendCoreAIMessage(message, context?, accessToken?)`.  
  - **Auth:** JWT (Supabase session `access_token`) in `Authorization: Bearer`.  
  - **Request:** `{ message, context }`. Context can include `isEnrolled`, `isInEnrollmentFlow`, `currentRoute`, `selectedPlan`, `contributionAmount`, etc.  
  - **Response:** `{ reply, filtered, isFallback?, type?, spoken_text?, ui_data?, confidence?, data_sources? }`.

### Where AI is used

| Location | How | Notes |
|----------|-----|--------|
| **CoreAssistantModal** | `sendCoreAIMessage(trimmed, userContext, session?.access_token)` | After scripted flow router; builds `userContext` from enrollment + route. |
| **BellaScreen** | Same `sendCoreAIMessage(input, {}, accessToken)` | Voice/conversation UI; same backend. |

### Where user queries are captured

- **CoreAssistantModal:** `MessageInput` (text) and `useSpeechRecognition` (mic) → `handleSend(text)` → either scripted `routeMessage()` or `sendCoreAIMessage()`.  
- **BellaScreen:** Voice/text input → same `sendCoreAIMessage`.  
- **AgentModeLab:** No capture yet; “Ask Core AI” does not send to any API.

### AI response handling

- **CoreAssistantModal:** Response pushed to `messages` state as assistant `ChatMessage`; optional TTS via `useTextToSpeech`; flow router can set `flowStateRef` and navigation.  
- **BellaScreen:** Reply displayed in conversation UI; same pattern.

### Deprecated / unused

- **Frontend LLM:** `src/agent/geminiClient.ts` — deprecated; throws if called; all AI must go through `/api/core-ai`.  
- **agent/** (taskDefinitions, LLMEnhancer, conversationController, etc.): Referenced for flows/intent; actual generation is backend-only.

### Conclusion

- **One** live AI path: frontend → `POST /api/core-ai` with JWT and context; backend resolves intent and returns reply (and optional ui_data).  
- n8n can replace or sit behind this same endpoint, or expose a new webhook that the frontend calls instead of (or in addition to) `/api/core-ai` for advisor-specific flows.

---

## 5. VOICE AND CHAT SYSTEMS

### Voice

- **Components:** `src/components/voice/VoiceHeader.tsx`, `VoiceFooter.tsx`, `VoiceOrb.tsx`, `VoiceTranscript.tsx` — “Voice Assistant” UI.  
- **Hooks:** `src/hooks/useSpeechToText.ts` (calls `/api/voice/stt`), `src/hooks/useTextToSpeech.ts` (calls `/api/voice/tts`).  
- **Core AI modal:** `src/components/core-ai/useSpeechRecognition.ts`, `useTextToSpeech.ts` — used inside CoreAssistantModal for mic and TTS.  
- **No standalone “VoiceAssistant.tsx”** in the main app; voice is integrated into CoreAssistantModal and BellaScreen.

### Chat UI

- **CoreAssistantModal** (`src/components/core-ai/CoreAssistantModal.tsx`): Full chat UI (MessageList, MessageInput, suggestions, actions).  
- **MessageList / MessageBubble / MessageInput / MessageActions** in `src/components/core-ai/`.  
- **CoreAIFab** opens CoreAssistantModal; **CoreAIModalContext** provides `openWithPrompt(prompt)` for “Ask AI about this plan” flows.  
- **BellaScreen:** Alternate conversation UI (e.g. voice-first) using same `/api/core-ai`.

### Summary

- User prompts: **text** (MessageInput) and **voice** (speech-to-text → same send path).  
- AI replies: **text** in chat; optional **TTS** via `/api/voice/tts`.  
- n8n can receive the same text (and optional context) and return reply text (and optional structured payload for UI).

---

## 6. STATE MANAGEMENT

- **No Zustand or Redux** found; **React Context + useState** throughout.

| Concern | Mechanism | Location |
|---------|------------|----------|
| Enrollment step data | EnrollmentContext (React Context) + sessionStorage (enrollmentDraftStore) | EnrollmentContext.tsx, enrollmentDraftStore.ts |
| Auth / session | AuthContext (Supabase session) | AuthContext.tsx |
| User profile / company | UserContext (profiles, companies from Supabase) | UserContext.tsx |
| Core AI modal open/initial prompt | CoreAIModalContext | CoreAIModalContext.tsx |
| AI settings (e.g. Core AI on/off) | AISettingsContext | AISettingsContext.tsx |
| Theme / branding | ThemeContext | ThemeContext.tsx |
| Investment (allocation) | InvestmentContext | InvestmentContext.tsx |
| Advisor panel / agent lab | Local useState (stepIndex, animationState) | AgentModeLab.tsx |
| Stepper highlight | Derived from pathname (getV2StepIndex) | stepConfig.ts, EnrollmentHeaderWithStepper |

Enrollment state is the main shared state for the wizard; advisor prototype state is local to AgentModeLab.

---

## 7. API LAYER

### Backend / fetch usage

| API / usage | Purpose | Called from |
|-------------|---------|-------------|
| `POST /api/core-ai` | AI chat (retirement assistant) | coreAiService.sendCoreAIMessage; CoreAssistantModal, BellaScreen |
| `POST /api/voice/tts` | Text-to-speech | useTextToSpeech.ts |
| `POST /api/voice/stt` | Speech-to-text | useSpeechToText.ts |
| Supabase client | Auth, DB | AuthContext, UserContext, enrollmentService, plansService, companyBrandingService, FeedbackModal, Signup/Login |

No axios; all API calls use `fetch`. No generic `/api` route list in repo (backend lives elsewhere).  
References in agent (e.g. `POST /api/llm/normalize`, `POST /api/llm/polish` in LLMEnhancer) are legacy; current AI path is `/api/core-ai`.

### Supabase

- **Client:** `src/lib/supabase.ts` — createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY), custom timeout fetch.  
- **Auth:** `supabase.auth.getSession`, `signInWithPassword`, `signUp`, `signOut`, `onAuthStateChange` (AuthContext).  
- **Tables observed:**  
  - `enrollments` (user_id, plan_id, status, updated_at) — enrollmentService.  
  - `plans` — plansService.  
  - `profiles` — UserContext.  
  - `companies` — Login, Signup, UserContext; companyBrandingService uses a companies table.  
  - `feedback` — FeedbackModal insert.

---

## 8. RECOMMENDED N8N INTEGRATION POINTS

### Where user prompts originate

1. **CoreAssistantModal** — Main production entry: user types or speaks → `handleSend(text)` → either scripted flow or `sendCoreAIMessage(message, context, accessToken)`.  
2. **BellaScreen** — Same: user input → `sendCoreAIMessage`.  
3. **AgentModeLab (future)** — “Ask Core AI” and any future chat in the advisor panel; currently no API call.

### Where AI responses should return

1. **CoreAssistantModal:** `messages` state; append assistant message with `reply`; optional TTS and flow/navigation from `ui_data`.  
2. **BellaScreen:** Same pattern.  
3. **AgentModeLab / AdvisorPanel:** When n8n is used for the advisor, responses should drive: (a) advisor message text in the bottom-left panel, (b) optional 3D animation state (e.g. “pointing” when suggesting a value), (c) optional “Set Contribution to 6%” style actions.

### Options for n8n

- **Option A — Replace backend of `/api/core-ai`:** Keep frontend unchanged; backend (or a proxy) forwards to n8n webhook; n8n returns reply (and optional context). Same JWT and context from frontend.  
- **Option B — New advisor webhook for Agent Mode:** Add e.g. `POST /api/advisor` or `/api/n8n/advisor` called only from AgentModeLab (and future advisor UIs). Payload: `{ message, step?, enrollmentContext? }`; response: `{ reply, suggestedAction?, animationHint? }`. Frontend sends from AdvisorPanel / future chat and renders reply and actions in the advisor panel.  
- **Option C — Hybrid:** Production Core AI stays on current backend; Agent Mode (and later “advisor mode” inside enrollment) call n8n webhook with enrollment context; n8n returns advisor-specific copy and suggested actions.

### Components to receive n8n output

- **CoreAssistantModal** — If n8n backs `/api/core-ai`: already receives reply and optional ui_data; no component change if contract is compatible.  
- **AgentModeLab / AdvisorPanel** — New: state for “advisor message” and “suggested action”; when “Ask Core AI” or a future input is sent to n8n, set message from reply and optional button from suggestedAction; optionally set `animationState` from animationHint.

---

## 9. ARCHITECTURE SUMMARY

### Current UI architecture

- **React + TypeScript + Vite;** routing via React Router (createBrowserRouter).  
- **Two enrollment flows:** Legacy under `/enrollment`, primary 6-step flow under `/enrollment-v2` (path-based steps, EnrollmentContext + draft in sessionStorage).  
- **Global UI:** RootLayout → CoreAIModalProvider, CoreAIFab (hidden on login/dashboard), DemoSwitcher, SplashScreen.  
- **Core AI:** Single modal (CoreAssistantModal) opened by CoreAIFab or `openWithPrompt`; one backend endpoint `/api/core-ai`; scripted flows + backend AI.

### Advisor prototype architecture

- **Route:** `/agent-lab` → AgentModeLab.  
- **Layout:** Left 35% 3D (AgentAvatarScene with GLB + FBX), center step cards (simulated), bottom-left AdvisorPanel (static).  
- **State:** Local only (step index, animation state). No auth, no Supabase, no AI.  
- **Purpose:** Prototype for “AI advisor guided” experience; ready for n8n-backed messages and actions.

### AI integration status

- **Centralized:** All production AI through `POST /api/core-ai` with JWT and context.  
- **Frontend:** CoreAssistantModal and BellaScreen send user message + context; responses rendered as chat and optionally TTS.  
- **Deprecated:** Frontend Gemini/LLM calls disabled; agent/* used for flow/intent logic, not generation.

### Missing pieces for n8n

1. **Agent Mode:** No API call from AdvisorPanel or AgentModeLab; need to add a call to an n8n webhook (or `/api/advisor`) and state for advisor message + suggested actions.  
2. **Contract:** Define n8n webhook payload (e.g. message, step, enrollmentContext) and response (reply, suggestedAction, animationHint) so the same backend or frontend can call n8n and map to UI.  
3. **Auth (optional):** If advisor is only in AgentModeLab for testing, unauthenticated webhook may be acceptable; if advisor is used in enrollment, use same JWT as Core AI.  
4. **Enrollment context:** For n8n to give step-aware advice, pass current step and key enrollment fields (plan, contribution %, etc.) in the request; EnrollmentContext already has this for the real flow; AgentModeLab would need to send simulated or real context.

---

## 10. OUTPUT FORMAT CHECKLIST

- [x] **PROJECT STRUCTURE** — Key dirs and routes.  
- [x] **ENROLLMENT FLOW COMPONENTS** — All 6 steps, components, paths, state, navigation.  
- [x] **ADVISOR MODE COMPONENTS** — AgentModeLab, AgentAvatarScene, hierarchy, props, state.  
- [x] **AI INTEGRATION STATUS** — Single endpoint, where used, where prompts/responses are handled.  
- [x] **STATE MANAGEMENT** — React Context + useState; no Zustand/Redux.  
- [x] **API LAYER** — fetch, /api/core-ai, /api/voice/*, Supabase.  
- [x] **SUPABASE** — Auth and tables (enrollments, plans, profiles, companies, feedback).  
- [x] **RECOMMENDED N8N INTEGRATION POINT** — Where prompts originate, where responses go, options A/B/C, components to update.  
- [x] **ARCHITECTURE SUMMARY** — UI, advisor prototype, AI status, missing pieces for n8n.

---

*End of audit report.*
