# Authentication System — Full UX + UI + Technical Audit

**Date:** 2025-03-01  
**Scope:** Login, Signup, Forgot password, Reset password, Email verification (OTP), MFA (if any), and all related components, layouts, routes, and state.  
**Instruction:** Audit and analysis only. No code rewrites or fixes.

---

# PART 1 — STRUCTURE ANALYSIS

## 1. Auth-related routes and file paths

| Route path | Component (file path) | Purpose |
|------------|------------------------|---------|
| `/` | `Login` — `src/pages/auth/Login.tsx` | Primary login; redirects to dashboard when already authenticated + OTP verified |
| `/signup` | `Signup` — `src/pages/auth/Signup.tsx` | Registration (name, state, company, email, password); creates Supabase user + profile; redirects to verify |
| `/verify` | `VerifyCode` — `src/pages/auth/VerifyCode.tsx` | OTP entry; modes: `signup` (success modal → login) or `login` (set OTP verified → dashboard) |
| `/forgot` | `ForgotPassword` — `src/pages/auth/ForgotPassword.tsx` | Request reset: email only; no API call — navigates to `/forgot/verify` with email in location state |
| `/forgot/verify` | `ForgotPasswordVerify` — `src/pages/auth/ForgotPasswordVerify.tsx` | OTP entry; no Supabase call; navigates to `/reset` with email in state |
| `/reset` | `ResetPassword` — `src/pages/auth/ResetPassword.tsx` | New password + confirm; no Supabase `updateUser`; submit navigates to `/` |
| `/help` | `HelpCenter` — `src/pages/auth/HelpCenter.tsx` | Contact info (phone, email); back to login |

**Router definition:** `src/app/router.tsx` — `createBrowserRouter`; auth pages are direct children of `RootLayout`; no auth-specific layout route.

---

## 2. Components involved

### Form / input components

| Component | Path | Role |
|-----------|------|------|
| `AuthLayout` | `src/components/auth/AuthLayout.tsx` | Split layout: left panel (optional), right panel with children |
| `AuthFormShell` | `src/components/auth/AuthFormShell.tsx` | Wrapper: headerSlot, h1 title, optional description, bodySlot; spacing constants |
| `AuthInput` | `src/components/auth/AuthInput.tsx` | Text/email input with Radix Label; optional `error`; `aria-invalid` / `aria-describedby` |
| `AuthPasswordInput` | `src/components/auth/AuthPasswordInput.tsx` | Password input with show/hide toggle; label; error display; `aria-*` |
| `AuthButton` | `src/components/auth/AuthButton.tsx` | Primary/secondary/ghost; disabled, focus ring; Radix Slot for `asChild` |
| `AuthOTPInput` | `src/components/auth/AuthOTPInput.tsx` | 6 single-digit inputs; auto-focus next; paste support; `onComplete(value)` when length 6; `role="group"`, per-digit `aria-label` |
| `AuthCheckbox` | `src/components/auth/AuthCheckbox.tsx` | Radix Checkbox; not used on Login/Signup/Forgot/Reset/Verify in current code |

### Layout / chrome

| Component | Path | Role |
|-----------|------|------|
| `AuthLeftPanel` | `src/components/auth/AuthLeftPanel.tsx` | Left 50% on lg; background `#2F394B`; hosts `LeftPanelCarousel` |
| `AuthRightPanel` | `src/components/auth/AuthRightPanel.tsx` | Right panel: ThemeToggle top-right; centered card (max-w 420–560px); `AuthFooter` at bottom |
| `AuthFooter` | `src/components/auth/AuthFooter.tsx` | Copyright, Privacy link, CORE logo; reads from `config/branding` |
| `LeftPanelCarousel` | `src/components/auth/LeftPanelCarousel.tsx` | Rotating images from Supabase storage; 4s interval |

### Protection and shared UI

| Component | Path | Role |
|-----------|------|------|
| `ProtectedRoute` | `src/components/auth/ProtectedRoute.tsx` | Requires `user` (AuthContext) and `isOtpVerified` (OtpContext); else redirect to `/` or `/verify?mode=login`; `loading` → render null |

### Other UI used on auth flows

| Component | Path | Role |
|-----------|------|------|
| `PasswordStrength` | `src/components/ui/PasswordStrength.tsx` | Used on Reset password only; 4-segment bar + label (weak/fair/good/strong) |
| `Logo` | `src/components/brand/Logo.tsx` | Used as headerSlot on all auth pages |

### Context providers

| Provider | Path | Role |
|----------|------|------|
| `AuthProvider` | `src/context/AuthContext.tsx` | `user`, `session`, `loading`; `signIn`, `signUp`, `signOut`; Supabase session init + `onAuthStateChange`; error mapping to user-facing messages |
| `OtpProvider` | `src/context/OtpContext.tsx` | `isOtpVerified`, `setOtpVerified`, `resetOtp`; persistence via `sessionStorage` key `otp_verified` |
| `NetworkProvider` | `src/lib/network/networkContext.tsx` | `status`: healthy | offline | degraded; used on Login to disable submit and show banner when not healthy |

### Validation utilities

- **Signup:** In-page `validate()` in `Signup.tsx`: name, state, company, email (regex), password length ≥ 6, password match; `getPasswordStrength()` (weak/medium/strong) for UI only.
- **AuthContext:** `getAuthErrorMessage()` maps Supabase `AuthError` to friendly strings (e.g. already registered, invalid credentials, email not confirmed, rate limit).
- No shared auth validation module; no Zod/Yup usage in auth flows.

---

## 3. Authentication flow (end-to-end)

### Page load

1. **App bootstrap:** `main.tsx` → `NetworkProvider` → `AuthProvider` → `OtpProvider` → … → `RouterProvider`.
2. **AuthProvider** runs `getSession()` once; subscribes to `onAuthStateChange`. Session stored in React state (`user`, `session`); Supabase persists session in storage (default).
3. **OtpProvider** reads `sessionStorage.getItem("otp_verified")` for initial `isOtpVerified`.
4. User lands on `/` (Login) or another auth route; no automatic redirect from auth pages unless already logged in + OTP verified (Login only).

### Login flow: user input → submit → API → response → redirect

1. **Input:** Email and password in controlled state; optional company logo preview from `companies` by email domain (debounced).
2. **Submit:** `handleLogin` clears error; if `!canReachServer` returns; if empty email/password sets error and returns; sets `submitting` true; calls `signIn(email, password)` (Supabase `signInWithPassword`).
3. **API:** `AuthContext.signIn` → `supabase.auth.signInWithPassword({ email, password })`. On success, no throw; on error, `throwIfError` throws with mapped message.
4. **Response handling:** Success → `navigate("/verify?mode=login", { replace: true })`. Failure → `setError(message)`; `submitting` set false in `finally`.
5. **Redirect logic:** If already `user && isOtpVerified`, `useEffect` redirects to `/dashboard` (replace). After successful login, user is sent to Verify; after OTP, Verify page sets `setOtpVerified(true)` and navigates to `/dashboard`.

### Signup flow

1. **Input:** Name, state (combobox), company (select from Supabase `companies`), email, password, confirm password. Client-side validation on submit.
2. **Submit:** `handleSubmit`; `validate()`; if errors, set and return. Then `signUp(email, password, metadata)`; then `profiles` upsert (id, name, location, company_id, role); then `signOut()` and `resetOtp()`; then `navigate("/verify?mode=signup", { replace: true })`.
3. **API:** Supabase `signUp` with `emailRedirectTo` for confirm; then `profiles` upsert. No email confirmation enforced in this flow before redirect to verify.
4. **Response:** Already-registered and signup-disabled mapped to locale messages; generic message otherwise.
5. **Redirect:** Always to `/verify?mode=signup`; Verify shows success modal then “Go to Login” → `/`.

### Forgot password flow

1. **ForgotPassword:** User enters email; “Send reset link” runs `handleSendResetLink` → `navigate("/forgot/verify", { state: { email } })`. **No call to `supabase.auth.resetPasswordForEmail()`** — no email is sent; no server-side step.
2. **ForgotPasswordVerify:** OTP UI only; no Supabase `verifyOtp`. On 6 digits `onComplete` or “Verify & continue” → `navigate("/reset", { state: { email } })`. Resend is a no-op.
3. **ResetPassword:** New password + confirm; “Reset password” runs `handleResetPassword` → `navigate("/")`. **No call to `supabase.auth.updateUser({ password })`** — password is not changed.

### Email verification (VerifyCode)

1. **Signup mode:** User arrives from Signup. `AuthOTPInput onComplete` calls `handleVerify` → `setShowSuccessModal(true)`. Button “Verify & continue” also calls `handleVerify` with no OTP check. Modal “Go to Login” → `/`.
2. **Login mode:** After Login, user lands on Verify. `onComplete(otp)` calls `handleVerify` → `setOtpVerified(true)`; `navigate("/dashboard", { replace: true })`. Button “Verify & continue” calls same `handleVerify` **without requiring 6 digits** — user can proceed without entering OTP.
3. **Resend:** Link present but `onClick` only `e.preventDefault()`; no resend API or toast.
4. No Supabase `verifyOtp` or magic-link handling in this screen; “verification” is client-side state only (OtpContext + sessionStorage).

### MFA

- **No MFA implementation found.** Locale key `auth.authenticatorApp` exists (e.g. en/common.json) but is not used in Login, Verify, or any auth component. No TOTP enrollment or challenge flow.

---

## 4. Where auth state is stored; session persistence; protected routes; errors

| Concern | Finding |
|--------|---------|
| **Auth state storage** | Supabase client holds session (default: localStorage). React state: `AuthContext` holds `user`, `session`, `loading`. `OtpContext` holds `isOtpVerified` and mirrors it in `sessionStorage` under `otp_verified`. |
| **Session persistence** | Supabase SDK persistence (localStorage by default). On reload, `AuthProvider` runs `getSession()` and updates state; `onAuthStateChange` keeps state in sync. OTP verification is separate and persisted only in sessionStorage. |
| **Protected routes** | `ProtectedRoute` wraps dashboard, profile, enrollment, transactions, settings, investments. If `loading` → render null. If `!user` → `<Navigate to="/" replace />`. If user but `!isOtpVerified` → `<Navigate to="/verify?mode=login" replace />`. No role-based or path-based checks. |
| **Error handling** | **Login:** Try/catch; error message from AuthContext mapping or generic “Login failed.” Displayed in `role="alert"` div. **Signup:** Validation errors per field; server errors in single alert; already-registered and signup-disabled mapped. **Forgot/Reset/Verify:** No API errors (no API calls). AuthContext `getAuthErrorMessage()` covers common Supabase messages (invalid credentials, email not confirmed, rate limit, etc.). |

---

# PART 2 — UX ANALYSIS

## 1. Clarity

| Area | Finding |
|------|---------|
| **User action obvious?** | Login: “Login” CTA clear. Signup: “Sign Up” clear. Forgot: “Send reset link” suggests email will be sent (but no email is sent). Reset: “Reset password” suggests password will change (but it does not). Verify: “Verify & continue” clear intent; no explanation that login flow uses client-side OTP only. |
| **Heading clear?** | Login: “Login”. Signup: “Create Account”. Forgot: “Forgot your password?”. Forgot/verify: “Verification code”. Reset: “Reset your password”. Help: “Help Center”. All present and readable. |
| **Helper text sufficient?** | Signup has description “Sign up to get started with your retirement plan.” Forgot has “Enter your email address and we'll send you a link…” (misleading — no link sent). Reset has description about 8+ chars and mix of characters (PasswordStrength on Reset uses different rules; Signup requires only 6+ chars). Verify says “We've sent a 6-digit code…” — no actual send. Help Center describes contact options. Login has no short description under title. |

## 2. Validation

| Area | Finding |
|------|---------|
| **Inline vs post-submit** | **Signup:** All validation on submit; errors set and shown per field (post-submit). **Login:** Empty email/password checked on submit; server errors after submit. **Forgot:** No validation; user can submit empty email and still go to next screen. **Reset:** No validation; submit ignores match/strength and navigates to `/`. **Verify:** No validation; button allows continue without 6 digits (login mode). |
| **Password rules visible?** | **Signup:** Only “at least 6 characters” in validation message; strength bar (weak/medium/strong) visible. **Reset:** Description says 8+ chars and mix; PasswordStrength shows weak/fair/good/strong (different algorithm). No inline list of rules (e.g. length, uppercase, number, symbol) on either. |
| **Errors helpful or generic?** | AuthContext messages are specific (already registered, invalid credentials, email not confirmed, rate limit, etc.). Signup validation messages are specific per field. Login fallback “Login failed. Please try again.” is generic. Network banner “Unable to reach authentication server…” is clear. |

## 3. Loading states

| Area | Finding |
|------|---------|
| **Buttons disabled while submitting?** | **Login:** Button disabled when `submitting \|\| !canReachServer`; label switches to “Logging in…”. **Signup:** Submit disabled when `loading \|\| companiesLoading \|\| selectedState === null`; label “Creating account…”. **Forgot:** Button never disabled; no loading state. **ForgotPasswordVerify:** Continue disabled until `otpValue.length === 6`. **Reset:** No loading state; button never disabled. **Verify:** Button not disabled; no loading state. |
| **Spinner?** | No spinner component on any auth form; only button label change (Login, Signup). |
| **Double-submit?** | Login and Signup disable primary button during submit, reducing double-submit. Forgot, Reset, Verify do not disable; user can click repeatedly. |

## 4. Edge cases

| Edge case | Finding |
|-----------|---------|
| **Expired reset token** | No token used; Forgot/Reset do not call Supabase. N/A. |
| **Wrong password** | Login: AuthContext maps “Invalid login credentials” to “Invalid email or password.” Shown in alert. No lockout or rate-limit UI. |
| **Unverified email** | AuthContext maps “Email not confirmed” to message telling user to confirm. No in-app resend or link to verify. |
| **Already registered** | Signup: Mapped to “This email is already registered…” (or locale equivalent). Clear. |
| **Slow network** | Login: NetworkProvider marks offline/degraded; button disabled and banner shown. Signup: Companies fetch can fail with message; no global “slow” indicator. No request timeout UX on auth calls beyond Supabase client. |

## 5. Accessibility

| Area | Finding |
|------|---------|
| **Label association** | AuthInput, AuthPasswordInput use Radix Label with `htmlFor` / `id`. Signup state combobox and company select have explicit labels and `aria-describedby` for errors. |
| **Keyboard navigation** | AuthOTPInput: arrow keys move between digits; Backspace goes back. Signup state listbox: ArrowUp/Down, Enter to select, Escape to close. Buttons and links focusable. Login “Forgot password” and other links are `<a href="#">` with onClick preventDefault. |
| **ARIA** | AuthInput/AuthPasswordInput: `aria-invalid`, `aria-describedby` when error. AuthOTPInput: `role="group"`, `aria-label` for group and each digit. Signup state: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-activedescendant`, `aria-invalid`. Error spans use `role="alert"`. AuthButton `aria-disabled` when disabled. Signup submit has `aria-busy={loading}`. AuthFooter `role="contentinfo"`. |
| **Contrast** | Uses CSS variables (`--color-text`, `--color-textSecondary`, `--color-primary`, etc.); no audit of actual contrast ratios in theme. Left panel background hardcoded `#2F394B`. |

---

# PART 3 — UI STRUCTURE REVIEW

(Descriptive only; no design judgment.)

## 1. Layout structure

- **Global:** Flex row on large (50/50); left panel hidden below lg. Right side is a single column: top-right theme toggle, then scrollable center content, then footer.
- **Form container:** Centered card with max-width 420px (md 520px, lg 560px), rounded-2xl, border, shadow, padding p-6 / md:p-8 / lg:p-10.
- **Form content:** AuthFormShell provides logo (optional), h1, optional description, then body slot. Login/Signup/Forgot/Reset/Verify use this; body is form or stacked blocks. Signup uses 2-column grid on md.
- **No split “brand vs form” layout on small screens;** left panel is hidden, so one column.

## 2. Typography hierarchy

- **Title:** h1, text-2xl md:text-3xl, bold, `--color-text`.
- **Description:** text-sm md:text-base, `--color-textSecondary`, mb-6 after.
- **Labels:** text-sm font-medium, `--color-text`.
- **Inputs:** text-base.
- **Links and secondary:** text-sm, primary color or textSecondary.
- **Footer:** text-xs, textSecondary.

## 3. Spacing consistency

- AuthFormShell: logo mb-6, title mb-2, description mb-6, body gap-6.
- AuthRightPanel: viewport px/py and card padding use consistent breakpoint steps.
- Form body: Login uses gap-6 between sections; Signup uses gap-4 / md:gap-6 and grid gap.

## 4. CTA prominence

- Primary CTA: full-width button, primary background, high contrast. Login and Signup use it for submit. Forgot, Verify, Reset use same for main action.
- Secondary actions (Back to sign in, Resend, Sign up / Sign in link) are text links below or in a row; less prominent.

## 5. Visual clutter

- Login: Optional company logo above form when domain matches; network alert when offline; error alert; “Explore Demo Scenarios” floating button (portaled) and demo persona modal — adds cognitive load on login.
- Signup: Many fields (name, email, state, company, password, confirm); strength bar and two password fields; no progressive disclosure.
- Verify: OTP inputs + button + two links (Resend, Back); minimal.
- Forgot/Reset: Sparse; no extra elements.
- Left panel: Carousel only; no text overlay in current implementation.

---

# PART 4 — RISK & TRUST ANALYSIS

(Retirement / financial platform lens.)

## 1. Does the auth experience communicate trust?

- **Positive:** Consistent layout, CORE branding, Privacy in footer, “Create Account” and “Sign up to get started with your retirement plan” frame a serious product. No obvious gamification on primary flows.
- **Gaps:** Forgot flow promises “we'll send you a link” but sends nothing. Reset promises a new password but does not change it. Verify promises “we've sent a 6-digit code” but no code is sent (login mode). If discovered, this undermines trust.

## 2. Is security messaging visible?

- No explicit “secure connection” or “your data is protected” line on login/signup.
- No mention of MFA or extra verification in UI (only unused locale key).
- Password strength is shown (Signup, Reset) but not framed as security.

## 3. Is the tone appropriate for a retirement product?

- Headings and copy are neutral and professional (“Login”, “Create Account”, “Forgot your password?”).
- Help Center and support contact support a “we’re here to help” tone.
- Demo personas (“Pick a persona to explore”) and “Explore Demo Scenarios” are more playful; positioned as secondary on login.

## 4. Too casual or startup-like?

- Floating “Explore Demo Scenarios” and persona picker could feel consumer/startup; they are optional and below the main CTA.
- Overall form tone is formal enough for retirement; main risk is broken promises (reset/verify) rather than tone.

---

# PART 5 — PRIORITIZED ISSUES

## Critical UX issues

1. **Forgot password does not send email** — “Send reset link” only navigates to next screen; no `resetPasswordForEmail()`; user never receives a link. Flow is non-functional.
2. **Reset password does not change password** — “Reset password” only navigates to `/`; no `updateUser({ password })`; user’s password is unchanged.
3. **Verify (login) allows bypass** — “Verify & continue” calls `handleVerify` without requiring 6 digits; user can reach dashboard without entering OTP, weakening the intended “second step” security.
4. **Forgot/Verify (reset) not wired to backend** — ForgotPasswordVerify and Reset do not call Supabase; entire reset flow is UI-only and misleading.

## Technical risks

1. **OTP verification is client-only** — VerifyCode does not call Supabase `verifyOtp`; “verification” is a local flag in sessionStorage. Anyone who can open the app can set the flag and access protected routes after login (e.g. via devtools or by clicking Verify without code).
2. **Session vs OTP state** — ProtectedRoute requires both `user` and `isOtpVerified`. If sessionStorage is cleared but session remains, user is sent to Verify again; if session is lost but `otp_verified` remains, user is redirected to login. Edge cases depend on storage and tab behavior.
3. **No token-based reset** — Reset flow does not use Supabase recovery tokens or hashes; even if backend were added, current UI does not pass or validate tokens.
4. **Signup then signOut** — Signup explicitly calls `signOut()` after profile upsert and before navigating to Verify; user is logged out. Verify (signup mode) does not log them back in — user must use Login. Intentional but adds a step and can confuse.

## Medium improvements

1. **Forgot: validate email before next step** — Prevent navigating to verify with empty or invalid email; show inline or alert error.
2. **Reset: validate match and strength** — Disable submit or show errors when passwords don’t match or strength is weak; align rules with description (e.g. 8+ chars).
3. **Verify: require 6 digits for button** — Disable “Verify & continue” until OTP length is 6 (login and signup mode) to match user expectation and copy.
4. **Resend code** — Verify and ForgotPasswordVerify: implement resend (e.g. Supabase resend) or remove/hide link to avoid dead end.
5. **Loading indicator** — Add spinner or skeleton for Login/Signup submit so users see progress on slow networks.
6. **Unified password rules** — One set of rules (length, complexity) and one strength algorithm across Signup and Reset; show rules inline where appropriate.

## Quick wins

1. **Login: “loggingIn” locale key** — Used with fallback “Logging in…”; ensure key exists in all locale files to avoid fallback in production.
2. **AuthCheckbox typo** — Class uses `text-[var(--color-text-secondary)]` (hyphen); tokens often use `--color-textSecondary` (camelCase); may be wrong token.
3. **Help Center links** — `tel:` and `mailto:` use placeholder numbers/emails; ensure they are correct or configurable for environment.
4. **Demo button visibility** — “Explore Demo Scenarios” is prominent; consider moving or making it less prominent if login should feel minimal and secure-first.

---

**End of audit.** No code changes or redesign recommendations; findings only.
