# Personalize Popup – UI, UX & Flow Audit

**Scope:** Personalize Plan Modal (3-step wizard: Age → Location → Savings)  
**Component:** `src/components/enrollment/PersonalizePlanModal.tsx`  
**Date:** 2025-03-03

---

## 1. Flow audit

### 1.1 Entry & exit

| Action | Behavior | Assessment |
|--------|----------|------------|
| Open modal | Step 1, state from `DEFAULT_STATE` or restored from `loadEnrollmentDraft()` | ✅ Draft restore works; clear entry point. |
| Close (X / overlay) | `closeOnOverlayClick={false}` → overlay does nothing; X and Escape call `handleCloseAttempt` → **Exit confirmation** | ✅ Prevents accidental loss; overlay can’t close. |
| Exit confirmation | "Keep Going" / "Exit Setup". On "Exit Setup": `persistDraft()` → `onClose()`. | ✅ Progress saved before close. |
| Save & Exit | `persistDraft()` → `onClose()` (no confirmation) | ⚠️ No confirmation; same as "exit after save." Consider consistency with X (e.g. both show confirmation or neither). |

### 1.2 Step navigation

| Action | Behavior | Assessment |
|--------|----------|------------|
| Continue / View My Plan | Step 1–2: `setStep(step + 1)`. Step 3: `persistDraft()` → `onClose()` → `navigate("/enrollment/choose-plan")`. | ✅ Linear flow; last step CTA matches Figma ("View My Plan"). |
| Back | `setStep(step - 1)`. No explicit persist. | ✅ Draft is only saved on exit or completion; in-memory state is enough. |
| Step order | 1 Age → 2 Location → 3 Savings. Stepper shows completed (green check), current (blue), upcoming (grey). | ✅ Clear and matches Figma. |

### 1.3 Data persistence

- **When:** On "Save & Exit", "Exit Setup" (from confirmation), and "View My Plan" (step 3).
- **Where:** `sessionStorage` via `saveEnrollmentDraft()`; merged with existing `EnrollmentDraft`.
- **What:** `dateOfBirth`, `retirementAge`, `currentAge`, `yearsToRetire`, `annualSalary`, `retirementLocation`, `otherSavings` (when `savingsAmount > 0`).
- **Gaps:** Back/Continue do not persist; user must use Save & Exit or complete step 3 to save. Intentional but could be clarified in copy (e.g. "Your answers are saved when you exit or finish").

---

## 2. UX audit

### 2.1 Clarity & copy

| Area | Finding | Recommendation |
|------|---------|----------------|
| Step 1 | Age card + retirement age stepper + slider + "Popular" (58) + summary + timeline. | ✅ Purpose clear; "Apply this age" and timeline reinforce intent. |
| Step 2 | Heading + search + "Popular Retirement Destinations" + 4 cards + optional Smart Choice. | ✅ Clear. Helper text explains why location matters. |
| Step 3 | Heading + label + $ input + helper ("Exclude 401(k)...") + "Great Start!" card. | ✅ Optional savings is clear; helper avoids scope confusion. |
| Exit | "Your progress will be saved. You can pick up where you left off anytime." | ✅ Reassuring. |
| CTA labels | Step 1–2: "Continue". Step 3: "View My Plan". | ✅ Matches Figma and intent. |

### 2.2 Validation & errors

| Step | Current behavior | Gap / risk |
|------|-------------------|------------|
| 1 Age | DOB and retirement age constrained (min/max, slider). No explicit "invalid" UI. | ✅ Constraints prevent invalid ages. Consider inline hint if DOB in future (currently guarded by `max`). |
| 2 Location | No required validation; user can leave empty or type free text (onBlur sets `retirementLocation` to search). | ⚠️ Optional by design; free text is stored as-is. Consider clarifying "optional" or validating known locations. |
| 2 Clear input | If user selects "Florida" then clears the input, `onBlur` only calls `onChange(search)` when `search && !value`. So clearing to "" does not clear `value`. | ⚠️ **Bug:** Selected location stays set while input looks empty. Recommend: when `search === ""`, call `onChange("")` (or sync value to search on blur so clearing input clears selection). |
| 3 Savings | Optional; `parseCurrencyInput` strips non-numeric; 0 allowed. | ✅ No validation needed; consider max length or max value to avoid overflow. |

### 2.3 Feedback & loading

- No loading states (wizard is local state + sessionStorage). ✅ Acceptable.
- No success toast after "Save & Exit" or "View My Plan". ⚠️ **Recommendation:** After Save & Exit, show a short toast (e.g. "Progress saved") if the app uses toasts elsewhere (`ENROLLMENT_SAVED_TOAST_KEY` exists in draft store).
- Step transitions use Framer Motion (opacity + x). ✅ Feels responsive.

### 2.4 Accessibility

| Item | Status | Note |
|------|--------|------|
| Modal | `role="dialog"`, `aria-modal="true"`, `tabIndex={-1}`. | ✅ |
| Focus trap | Tab cycles within modal; first/last focusable handled. | ✅ |
| Escape | Calls `onClose` → exit confirmation. | ✅ |
| Stepper | `aria-label="Progress"`. Steps are visual only (no `aria-current="step"` on current step). | ⚠️ Add `aria-current="step"` on the current step container for screen readers. |
| Form labels | Step 1: `htmlFor` + `id` on DOB. Step 3: `htmlFor="savings-input"` + `id="savings-input"`, `aria-describedby="savings-helper"`. | ✅ |
| Decorative icons | Many use `aria-hidden`. Check icon in stepper and cards. | ✅ |
| Exit confirmation | No `role="alertdialog"` or focus move to the confirmation. | ⚠️ When exit confirmation opens, move focus to "Keep Going" (or the dialog) and consider `role="alertdialog"` so SR users get the prompt immediately. |

### 2.5 Keyboard & interaction

- Slider (step 1): Native range input. ✅
- Location cards and "Apply this age": Buttons. ✅
- Save & Exit / Back / Continue: Buttons. ✅
- No Enter-to-submit on inputs (step 2 search, step 3 savings). Optional: submit on Enter for step 2/3 to advance (would need to avoid submitting when focus is in a multi-line area).

---

## 3. UI audit

### 3.1 Visual consistency (Figma alignment)

| Element | Assessment |
|---------|------------|
| Header | Gradient, "Hi, {name} 👋", subtitle, close button. Matches Figma. |
| Stepper | Green completed (#00c950), blue current (#155dfc), grey upcoming; green connectors. Matches Figma. |
| Step 1 | Age card, retirement stepper, slider with gradient fill, "Popular" card, summary + timeline. Matches Figma. |
| Step 2 | Centered title/sub, search (52px, 14px radius), 2×2 location cards, Smart Choice card. Matches Figma. |
| Step 3 | Centered title/sub, label, $ input (64px), helper, Great Start card. Matches Figma. |
| Footer | Save & Exit (ghost), Back (when not step 1), primary CTA (Continue / View My Plan). Matches Figma. |

### 3.2 Layout & responsiveness

- Modal uses `premium-wizard__dialog` and fixed widths in CSS (e.g. 672px in Figma). Body has `padding: 20px 24px 24px` and scrolls (`overflow-y: auto`) when content is tall.
- **Risk:** Small viewports (e.g. 360px) may need max-width: 100% and horizontal padding so the modal doesn’t overflow. Recommend checking `modal-dialog` and `premium-wizard` on narrow screens.

### 3.3 Theming & tokens

- Many Figma-specific values are hardcoded (e.g. #155dfc, #00c950, #101828). Light theme is the default.
- **Gap:** No dark-mode overrides for the personalize wizard. If the app supports dark mode elsewhere, consider CSS variables or a dark variant for the wizard so it doesn’t stay light-only.

### 3.4 Motion

- Modal enter: scale + opacity. Step transition: horizontal slide + opacity. Exit confirmation: fade + scale. ✅ Feels consistent and not overwhelming.

---

## 4. Summary & priority fixes

### High priority

1. **Step 2 – Clear selection:** When the user clears the location search, clear the stored location (`onChange("")`) so the selection and input stay in sync. Option: on blur, set `value` from `search`; or on clear (search === ""), call `onChange("")`.

### Medium priority

2. **Exit confirmation focus:** When the exit confirmation is shown, move focus into the confirmation (e.g. "Keep Going") and consider `role="alertdialog"` and `aria-labelledby` / `aria-describedby` for the title and description.
3. **Stepper accessibility:** Add `aria-current="step"` to the current step in the stepper for screen readers.
4. **Save & Exit feedback:** If the product uses toasts, show a brief "Progress saved" (or use `ENROLLMENT_SAVED_TOAST_KEY`) after Save & Exit so the user knows the draft was saved.

### Low priority

5. **Save & Exit vs X:** Align behavior: either both show confirmation or neither (or document that "Save & Exit" is an explicit save-and-close).
6. **Responsive width:** Confirm modal and wizard layout on small viewports and add constraints if needed.
7. **i18n:** Replace hardcoded strings with `useTranslation` (e.g. `t('personalize.title')`) if the app is localized.
8. **Dark mode:** If applicable, add dark theme for the wizard so it fits the rest of the app.

---

## 5. Checklist (quick reference)

| # | Item | Done |
|---|------|------|
| 1 | Draft restore on open | ✅ |
| 2 | Exit confirmation on X/Escape | ✅ |
| 3 | Save & Exit persists and closes | ✅ |
| 4 | Back/Continue in-memory only | ✅ |
| 5 | Step 3 "View My Plan" → persist + navigate | ✅ |
| 6 | Stepper completed/current/upcoming | ✅ |
| 7 | Step 2 clear input clears selection | ❌ |
| 8 | Focus trap in modal | ✅ |
| 9 | Exit confirmation focus + alertdialog | ❌ |
| 10 | Stepper aria-current | ❌ |
| 11 | Toast on Save & Exit | Optional |
| 12 | Responsive / small viewport | Verify |
| 13 | Localization (i18n) | ❌ |
| 14 | Dark mode for wizard | Optional |
