# Voice / AI Assistant Flow — Reuse Audit Report

**Scope:** The working AI assistant flow on `/voice` (BellaVoiceRoute → BellaScreen).  
**Goal:** Prepare this exact flow for reuse inside a floating search/command UI without changing behavior.  
**Status:** Audit only. No implementation.

---

## 1. Flow ownership

### Where conversation state lives
- **Single place:** `src/bella/BellaScreen.tsx`. All conversation and flow state is **component-scoped** (useState / useRef inside BellaScreen).
- **No global store:** No Redux, Zustand, or shared context for this flow.
- **Route usage:** The route is a thin wrapper. `BellaVoiceRoute` only:
  - Reads `location.state.from` (fallback `/dashboard`).
  - Renders `<BellaScreen onClose={() => navigate(from)} />`.

### State inventory (all inside BellaScreen)
| State | Purpose |
|-------|--------|
| `messages` | Chat history (user + assistant messages). |
| `userText` | Current text input value. |
| `listening` | Voice recognition active. |
| `isSpeaking` | TTS active. |
| `isDarkMode` | Theme (optional `initialDarkMode` prop). |
| **Enrollment** | `enrollmentState`, `isEnrolling`, `planInfoOpen`, `suggestedPlanWhyOpen`, `enrollmentCompleteState`, `showEnrollmentCompleteDetails`, plus several “info open” toggles. |
| **Loan** | `loanState`, `isApplyingForLoan`, `pendingLoanConfirmation`, `loanCompleteState`, `showLoanCompleteDetails`, `loanAmountDraft`, `loanTermDraft`, plus helper toggles. |
| **Withdrawal** | `withdrawalState`, `withdrawalDemoState`, `withdrawalCompleteState`, `withdrawalAmountDraft`. |
| **Vesting** | `vestingState`, `vestingExplainerOpen`. |

Active mode is **derived**, not stored: `getActiveMode()` returns `'NONE' | 'LOAN' | 'ENROLLMENT' | 'WITHDRAWAL' | 'VESTING'` from the above booleans/state objects.

### Dependencies
- **No React context** used by BellaScreen or the bella agents.
- **No providers** required; the route does not wrap BellaScreen in any provider.
- **External:** `@google/genai` (Gemini) for fallback when `activeMode === 'NONE'`. API key via `VITE_GEMINI_API_KEY`. Browser APIs: `SpeechRecognition` / `webkitSpeechRecognition`, `speechSynthesis`.

**Reusability:** The entire flow is **self-contained in one component**. No route-specific state store; the only route coupling is the **call site** (BellaVoiceRoute passes `onClose` that navigates).

---

## 2. Input handling

### Normalization
- **Entry point:** Single async function `handleUserInput(rawInput: string, source: UserInputSource)` with `UserInputSource = 'text' | 'voice' | 'chip'`.
- **Normalization:** `input = rawInput.trim()`. For confirmation and intents, `input.toLowerCase().trim()` or regex is used. No separate normalizer module; logic is inline in `handleUserInput` and intent helpers.
- **Voice path:** User clicks mic → `startVoiceInput()` → SpeechRecognition → on result, `setTimeout(() => handleUserInput(transcript, "voice"), 300)`. So voice and text **converge at the same handler** with the same semantics.
- **Chips:** Suggested prompts and contextual CTAs call `handleUserInput(questionOrCommand, "chip")`. Chips do **not** append a user message (only text/voice do).

### Intent routing (where it happens)
- **Inside `handleUserInput`**, in order:
  1. **Pending loan confirmation** (if `pendingLoanConfirmation`): yes/no → start or cancel loan; then return.
  2. **Derive `activeMode`** via `getActiveMode()`.
  3. **Chip-only:** If `source === "chip"` and input matches a “top-level” intent (enrollment, withdrawal, loan, vesting), **reset all flow state** and set effective mode to `NONE` so the next branch can start the requested flow.
  4. **Scripted flows (by mode):**  
     - `ENROLLMENT` → `getEnrollmentResponse(enrollmentState, input)` (planEnrollmentAgent).  
     - `LOAN` → `getLoanResponse(loanState, input)` (loanApplicationAgent).  
     - `WITHDRAWAL` (demo) → `getWithdrawalDemoResponse(withdrawalDemoState, input)` (local in BellaScreen).  
     - `WITHDRAWAL` (non-demo) → `getWithdrawalResponse(withdrawalState, input)` (withdrawalInfoAgent).  
     - `VESTING` → `getVestingResponse(vestingState, input)` (vestingInfoAgent).  
  5. **`activeMode === 'NONE'`:**  
     - Vesting phrases → start vesting flow.  
     - `checkLoanIntent(input)` → direct → start loan; indirect → set `pendingLoanConfirmation`.  
     - `checkEnrollmentIntent(input)` → start enrollment.  
     - `checkWithdrawalIntent(input)` → start withdrawal demo.  
     - Else → **Gemini** (`callGeminiAPI`) or fallback `fallbackRetirementBrain`.

Intent helpers are **local functions** in BellaScreen:
- `checkEnrollmentIntent(input)`: enroll / start enrollment / sign up / join plan, etc.
- `checkWithdrawalIntent(input)`: “how much can I withdraw”, “withdraw from 401k”, etc.
- `checkLoanIntent(input)`: returns `{ isDirect, isIndirect }` (e.g. “apply for loan” vs “access my 401k money”).

### Suggested prompts
- **Initial chips:** `suggestedQuestions` array (four items: “I want to enroll”, “I want to apply for a loan”, “How much can I withdraw?”, “What is my vested balance?”). Rendered in the **fixed footer** when `!userText`; onClick calls `handleUserInput(question, "chip")` or `startVestedBalanceFlow()` for vesting.
- **Contextual chips:** Inline in the JSX, gated by flow and step (e.g. enrollment INTENT, loan RULES, withdrawal TYPE/AMOUNT/REVIEW). They call `handleUserInput(..., "chip")` with phrases like `"continue"`, `"cancel"`, `"type:IN_SERVICE"`, `"amount:${n}"`, `"submit"`, etc.

**Reusability:** Input handling is **fully inside BellaScreen**. No route-specific logic. To reuse in a floating UI, the same `handleUserInput` and intent logic would apply; only the **trigger** (e.g. floating input vs full-page input) would need to feed into the same handler.

---

## 3. Output rendering

### How responses are rendered
- **Assistant text:** Every scripted flow and Gemini path appends one assistant message: `setMessages(prev => [...prev, { id, role: 'assistant', content: assistantText, timestamp }])`. The **same** `messages` array is used for the whole conversation.
- **UI structure:** One `.map(message => ...)` over `messages` renders bubbles (user right, assistant left). **Below the last message**, a large block of **conditional UI** is rendered based on:
  - `isEnrolling && enrollmentState` (step-based: INTENT, CURRENT_AGE, RETIREMENT_AGE, PLAN_RECOMMENDATION, CONTRIBUTION, MONEY_HANDLING, INVESTMENT, REVIEW, etc.) → enrollment cards, sliders, CTAs.
  - `isApplyingForLoan && loanState` (ELIGIBILITY, RULES, AMOUNT, TERM, REVIEW, CONFIRMED) → account snapshot card, rules card, amount slider, term selector, review card, continue/cancel buttons.
  - `withdrawalDemoState` / `withdrawalCompleteState` (INTENT, SNAPSHOT, ELIGIBILITY, TYPE, AMOUNT, IMPACT, REVIEW, CONFIRMED) → snapshot, type buttons, amount slider, impact, review, submit.
  - `vestingState` → vesting explanation and links.
- **Structured blocks:** Implemented **inline** in BellaScreen (e.g. account snapshot, loan rules, amount/term inputs, withdrawal type/amount/review). Enrollment uses **shared UI components**: `EnrollmentDecisionBlock`, `EnrollmentReviewSummaryCard`, `ManualInvestmentBlock` from `bella/ui/EnrollmentDecisionUI.tsx` and `ManualInvestmentUI.tsx`. Those components receive callbacks (e.g. `onPlanSelect`, `onContributionSelect`) that ultimately call `handleUserInput(..., "chip")` or set draft state + `handleUserInput(...)`.

### Full-page vs flexible container assumptions
- **Root:** `min-h-screen flex flex-col w-full ...` — assumes it can use the full viewport height and width.
- **Background:** Absolute-positioned layers (gradients, scrim) `inset-0` — full viewport.
- **Mode indicators:** `fixed top-2 left-2 ... z-50` (enrollment/withdrawal/loan phase labels) — fixed to viewport.
- **Header:** Fixed top bar with dark/light toggle and **Close** button — full width.
- **Initial greeting:** `min-h-[70vh]` centering when `messages.length === 1` — assumes a lot of vertical space.
- **Chat area:** `max-w-4xl mx-auto` with `pb-44 sm:pb-48` so content scrolls above the footer.
- **Footer:** `fixed bottom-0 left-0 right-0 z-20 w-full` — suggested questions + input bar; inner content again `max-w-4xl mx-auto`.
- **Scroll:** After each assistant response, `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })` — assumes a **scrollable page** with a single “end” node.

So the current UI **assumes**:
- Full viewport (min-height screen, fixed header/footer).
- Centered column `max-w-4xl` with horizontal padding.
- Scroll container is the **page** (or a full-height main), not a small floating panel.

**Reusability:**  
- **Logic and data flow** (messages, state, agents, CTAs) are **reusable as-is**; they don’t depend on layout.  
- **Rendering** is **tightly bound to full-page layout**: fixed header/footer, `min-h-[70vh]`, `scrollIntoView` on the page, and many `rounded-2xl` / `max-w-4xl` wrappers. To run the **same** flow in a floating UI, the **output layer** would need to be abstracted so that:
  - The same message list and same step-based blocks are rendered inside a **constrained scrollable container** (e.g. a panel with `max-height` and `overflow-y: auto`).
  - Fixed header/footer become **relative** to the panel (or a compact header/footer inside the panel).
  - `scrollIntoView` targets the scroll container of the panel, not the document.

---

## 4. Control flow

### Continue / Cancel / Confirmation
- **Continue:** Most steps use a “Continue” (or “Next”) button or chip that calls `handleUserInput("continue", "chip")` or `handleUserInput("yes", "chip")`. The **agent** (e.g. loan, enrollment, withdrawal) interprets these and returns the next state + message.
- **Cancel:** Explicit “Cancel” / “Cancel loan request” / “Back” buttons call `handleUserInput("cancel", "chip")` or similar. Agents return `isCancelled` or reset state (e.g. withdrawal demo: “cancel|exit|stop|never mind” → `nextState: null`, “Okay — no changes were made”).
- **Loan confirmation:** When the user says something that matches **indirect** loan intent, `pendingLoanConfirmation` is set; the next turn only accepts yes/no. “Yes” starts the loan flow; “No” clears it and says “No changes were made.”
- **Final confirmation (e.g. loan/enrollment submit):** Review step shows “Submit” / “Confirm”; user says “submit” or “confirm” or clicks; agent returns `isComplete: true` and often a final state (e.g. CONFIRMED). BellaScreen then sets completion state (e.g. `loanCompleteState`, `enrollmentCompleteState`) and shows a completion view; “Done” or similar can clear the flow.

### State transitions
- **No explicit FSM type;** transitions are encoded in each agent’s response (`nextState`, `isComplete`, `isCancelled`). BellaScreen just:
  - Updates the relevant state (e.g. `setLoanState(response.nextState)`).
  - If `isComplete`, may set a “complete” state and clear the main flow state so `getActiveMode()` returns `NONE` (or keeps a completion state for the UI).
- **Chip “switch flow”:** If the user clicks a top-level chip (e.g. “I want to enroll”) while already in a flow, all flow state is cleared and the new flow starts from its first step. So there is an implicit “exit flow and start another” transition.

### What breaks if container size changes
- **Scroll:** If the conversation lives in a short panel, `scrollIntoView` must run in the **panel’s** scroll container; otherwise it will scroll the page and may not bring the latest message into view inside the panel.
- **Fixed header/footer:** If the floating UI has its own chrome, the current fixed top bar (close, theme) and fixed bottom bar (suggestions + input) need to be **inside** the floating container and use flex so the middle area scrolls. Otherwise the “page” will still assume viewport-sized layout.
- **Initial greeting:** `min-h-[70vh]` would be wrong in a small panel; the greeting should use a smaller min-height or just flow.
- **Cards and sliders:** Layout is responsive (`grid-cols-1 sm:grid-cols-2`, etc.). In a narrow panel, single column would dominate; behavior would be OK, but very dense steps (e.g. loan amount + term + review) might feel cramped. No logic depends on width; only UX.
- **Mode indicators:** Currently `fixed top-2 left-2`; in a floating panel they should be positioned relative to the panel (e.g. top of content area) so they don’t overlap the host page.

**Reusability:** Control flow and state transitions are **independent of layout**. The only requirements for a different container are **presentation**: scroll target, header/footer placement, and min-heights.

---

## 5. Side effects

### Navigation
- **Only in the route:** `BellaVoiceRoute` passes `onClose={() => navigate(from)}`. BellaScreen does **not** use `useNavigate` or `useLocation`. When the user clicks Close, it either calls `onClose()` (navigate away) or, if `onClose` is missing, **resets** all state and clears messages to the initial greeting. So “close” is either “leave the page” or “reset in place.”
- **No in-flow navigation:** Scripted flows do not navigate to other routes (e.g. no “Go to enrollment” that does `navigate('/enrollment')`). All “continue” / “submit” stays inside the same screen and state.

### Read-only vs transactional
- **Agents are deterministic and local:** They take current state + user input and return next state + message. No API calls for enrollment/loan/withdrawal/vesting; they use **demo data** (e.g. `demoParticipant`, `demoEnrollmentParticipant`, `demoWithdrawalParticipant`) and in-memory state. So currently **no real transactions**; only simulated flows.
- **Gemini:** When `activeMode === 'NONE'`, `callGeminiAPI` is used for general questions; that’s the only external I/O besides Speech Recognition and TTS.

### Assumptions about being on a dedicated page
- **Body scroll:** None observed in BellaScreen (no explicit `document.body.style.overflow` in the reviewed code). RootLayout doesn’t change scroll behavior for `/voice`.
- **FloatingRetirementSearch visibility:** RootLayout hides the floating search on `/` and `/voice` so the full-page voice UI is not competing with another AI trigger. If the same flow is embedded in a floating UI, the host would need to decide whether to show the floating trigger on the same view (e.g. “open full-screen voice” vs “open in-panel voice”).
- **Close semantics:** On the dedicated route, “Close” means “navigate back.” In a floating panel, “Close” would typically mean “close panel and optionally keep or reset state”; the current `onClose` contract (callback with no args) supports both.

**Reusability:** No hard dependency on being on `/voice`. The only route-specific behavior is **who** provides `onClose` and what it does (navigate vs close overlay). Side effects are **minimal and callback-based**.

---

## 6. Reusability assessment

### What can be reused as-is
- **All conversation and flow logic:** `handleUserInput`, intent checks, agent calls (enrollment, loan, withdrawal, vesting), Gemini fallback, `getActiveMode`, and all state transitions.
- **Agents:** `planEnrollmentAgent`, `loanApplicationAgent`, `withdrawalInfoAgent`, `vestingInfoAgent` have no route or DOM dependencies; they are pure state + input → response.
- **Shared UI components:** `EnrollmentDecisionUI` and `ManualInvestmentUI` are presentational + callbacks; they don’t assume full page.
- **Voice and TTS:** SpeechRecognition and speechSynthesis are used inside BellaScreen; they work the same regardless of where the component is mounted (same origin, user gesture for mic).
- **Props:** `BellaScreenProps` (`onClose`, `initialDarkMode`) are already sufficient for “close” and theme; no route coupling in the component API.

### What must be abstracted for a floating UI
- **Layout and scrolling:**
  - Replace “full viewport” root (min-h-screen, fixed header/footer) with a **constrained container** (e.g. a div with `max-h-[…] overflow-hidden flex flex-col`).
  - Make the **scrollable region** the middle section (messages + step UI) with `overflow-y: auto` and a single `messagesEndRef` that scrolls **within that region**.
  - Move fixed header (close, theme) and fixed footer (suggestions, input) to be **inside** this container so they don’t use viewport coordinates.
- **Scroll target:** After appending a message, call `scrollIntoView` on the **scroll container** of the floating panel (or ensure `messagesEndRef` is inside the panel’s scroll area and the panel’s scroll is used). This may require a prop (e.g. `scrollContainerRef`) or a wrapper that provides the scroll context.
- **Initial greeting:** Avoid `min-h-[70vh]` when rendered in a panel; use a smaller min-height or no min-height so the panel doesn’t force viewport-sized space.
- **Mode indicators:** Render the “Enrollment · …” / “Loan application” / “Withdrawal · …” badges relative to the **panel content** (e.g. top of the scrollable area), not `fixed` to viewport.

### What must remain unique to the /voice route
- **BellaVoiceRoute** itself: it is the only place that reads `location.state.from` and passes `onClose={() => navigate(from)}`. When the same flow is used in a floating UI, a **different** wrapper would pass `onClose` to close the panel (and optionally reset state or not). The route would still be valid for “open full-page voice” (e.g. from header mic).
- **Hiding FloatingRetirementSearch on `/voice`:** So long as the full-page voice experience exists, keeping the floating search hidden on `/voice` avoids two AI entry points on the same page. If later the floating panel **is** the same flow, the host could show the floating trigger everywhere and open the panel instead of navigating to `/voice`.

### Minimal abstraction required
- **Option A (minimal):** Add a **layout mode** prop to BellaScreen, e.g. `variant: 'fullpage' | 'embedded'`. When `embedded`, the root uses a constrained layout (no min-h-screen, no viewport-fixed positioning; header/footer and content live in a flex column with a scrollable middle). `scrollIntoView` is called on the same ref, but the parent of that ref is the embedded scroll container. This keeps one component with two layouts.
- **Option B (extract shell):** Extract the “shell” (header, scroll area, footer) into a small wrapper that receives `children` (messages + step UI) and a ref for scroll. BellaScreen then renders that shell and passes its content; the same shell could be used with a different root (e.g. a modal or sidebar) by providing a different wrapper around the shell. This is a bit more refactor but keeps layout and behavior clearly separated.

Either way, **no change to** `handleUserInput`, agents, intent routing, or message/state handling is required for reuse; only **where** the existing UI is mounted and how **scroll + layout** are applied.

### Risks of reuse in a floating UI
- **Small viewport:** Dense steps (e.g. loan amount + term + review) may feel cramped; responsive breakpoints already reduce to one column, but small panels may need tighter spacing or optional “compact” mode.
- **Voice/TTS and focus:** If the floating panel doesn’t have focus when TTS runs, browser behavior is unchanged, but if the host captures focus (e.g. for accessibility), ensure focus management doesn’t interrupt Speech Recognition or user interaction inside the panel.
- **Z-index and overlays:** Fixed elements (e.g. mode indicators) that are made relative in the panel could still conflict with the host’s modals or other overlays; the panel itself should have a clear z-index and stacking context.
- **Double entry points:** If both “navigate to /voice” and “open floating panel with same flow” exist, product and UX need to decide when to use which (e.g. mic → full page, search bar → panel).
- **State persistence:** Currently, closing the route unmounts BellaScreen and state is lost. In a floating panel, closing might be expected to “minimize” and reopen with state intact; that would require lifting state to a provider or parent that outlives the panel, which is a **behavioral** change, not required for “same flow in a smaller container.”

---

## Summary table

| Area | Reusable as-is | Must abstract | Route-only |
|------|----------------|---------------|------------|
| **Flow ownership** | All state and logic in BellaScreen | — | BellaVoiceRoute: pass `onClose` from navigate |
| **Input handling** | handleUserInput, intents, voice/text/chip | — | — |
| **Output rendering** | Message list, step blocks, agent-driven UI | Root layout, fixed header/footer, scroll container, min-heights, mode indicator position | — |
| **Control flow** | Continue/cancel/confirmation, state transitions | scrollIntoView target | — |
| **Side effects** | Callbacks only (onClose) | — | Navigate on close only in route |
| **Risks** | — | Scroll, viewport, z-index, focus in small panel | Two entry points (full page vs panel) |

**Deliverable:** This audit. No code changes. Next step (when implementing) is to introduce a minimal layout/scroll abstraction so the same BellaScreen (or its shell) can be mounted inside a floating panel without changing behavior.
