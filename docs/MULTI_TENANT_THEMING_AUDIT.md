# Multi-Tenant Theming Audit — Analysis and Report

**Scope:** Company-based theming and logo rendering on signup and login.  
**No code changes made; analysis only.**

---

## STEP 1 — Signup Flow

### 1.1 Signup logic location

- **File:** `src/pages/auth/Signup.tsx`
- **Handler:** `handleSubmit` (lines 117–145).

### 1.2 What happens on signup

1. User submits form with: name, state (location), **company (companyId from dropdown)**, email, password.
2. **Validation:** `companyId` is required (`validate()`).
3. **Auth call:**
   ```ts
   await signUp(email, password, {
     name: name.trim(),
     company_id: companyId,   // from <select> value = companies.id
     location: selectedState ?? "",
   });
   ```
4. **Immediately after:** `await supabase.auth.signOut()` and `navigate("/verify?mode=signup")`.

So: **company_id is sent only in Supabase Auth user metadata** (`user_metadata`). It is **not** written to `profiles` by any app code in this repo.

### 1.3 Is company_id saved into profiles?

- **In app code:** No. There is **no** `insert` or `upsert` into `profiles` in the codebase.
- **Possible elsewhere:** A Supabase Database Trigger on `auth.users` (e.g. `INSERT`) could copy `raw_user_meta_data` into `public.profiles` (id, name, company_id, location). **No such trigger exists in the repo** (only migration present is `supabase/migrations/company_branding.sql`).
- **Conclusion:** **company_id is only reliably stored in auth user_metadata** until/unless a trigger (or other backend) creates a `profiles` row and sets `profiles.company_id`.

### 1.4 profiles row creation

- **In app:** No code creates a `profiles` row after signup.
- **Assumption:** Either a trigger in Supabase (not in repo) creates it on `auth.users` insert, or the profile is created by another process. If neither exists, **no profile row is created** and the profile fetch on login will fail.

### 1.5 company_id and companies.id

- Signup dropdown options are from `companies` table (`id`, `name`). Selected value is `companyId` = `companies.id` (UUID).
- So **company_id in metadata matches `companies.id`** by construction, **if** a trigger later writes it to `profiles.company_id`.

### 1.6 Report: Signup

| Question | Answer |
|----------|--------|
| Is company_id reliably stored? | Only in **auth user_metadata**. Stored in **profiles** only if a DB trigger (or other mechanism) exists outside this repo. |
| Any async issues? | Yes. After `signUp()` the app signs out and redirects to verify. There is no wait for a trigger or API to create the profile. If the trigger is slow or missing, **profile may not exist when the user later logs in.** |

---

## STEP 2 — Login Flow

### 2.1 Execution order (trace)

1. **Auth:** User signs in → `AuthContext` gets session/user → `authLoading` false, `user` set.
2. **UserContext** `useEffect` (depends on `authUser`, `authLoading`):
   - If `!authUser` → clear profile/company, setBrandingLoading(false), return.
   - If `authUser` → `setProfileLoading(true)`, then **async** `fetchUserData()`:
     - **Step A:** `supabase.from("profiles").select("id, name, company_id, location, role").eq("id", authUser.id).single()`
     - If profileError or !profileData → set profile/company null, setBrandingLoading(false), setProfileLoading(false), **return** (no company fetch, no setCompanyBranding).
     - **Step B:** `setProfile(profileData)` (sync state update).
     - **Step C:** `supabase.from("companies").select("...").eq("id", profileData.company_id).single()`
     - If cancelled → return.
     - **Step D:** `setCompany(company)` (sync state update).
     - **Step E:** If `company?.name`: optionally `getCompanyBranding(company.id)`, then **setCompanyBranding(company.name, ... , company.logo_url)** (or with company.branding_json).
     - **Step F:** `setBrandingLoading(false)`, `setProfileLoading(false)`.

So: **Profile is fetched first. Company is fetched using profile.company_id. setCompanyBranding is called only after both exist and company has a name.** It **cannot** run before profile resolves.

### 2.2 Answers

| Question | Answer |
|----------|--------|
| Where is profile fetched? | **UserContext** `fetchUserData()` → `supabase.from("profiles").select(...).eq("id", authUser.id).single()`. |
| Where is company fetched? | Same function, **after** profile → `supabase.from("companies").select(...).eq("id", profileData.company_id).single()`. |
| Where is branding_json fetched? | (1) **companies.branding_json** from the company row. (2) **company_branding** table via `getCompanyBranding(company.id)`; if that returns a payload with `light`, it overrides and is passed to setCompanyBranding. |
| When is setCompanyBranding called? | Inside `fetchUserData()`, only when `company?.name` is truthy, after profile and company are both fetched. |
| Is it dependent on profile load? | **Yes.** It runs only after a successful profile fetch and then company fetch. |
| Could it run before profile resolves? | **No.** It is in the same async chain after profile and company. |

---

## STEP 3 — Theme Application

### 3.1 Where is setCompanyBranding invoked?

- **Only in:** `src/context/UserContext.tsx` (lines 95–108), inside `fetchUserData()` when `company?.name` is truthy.
- **Twice:** Once when `getCompanyBranding(company.id)` returns a valid payload (use that + company.logo_url), else when using `company.branding_json` and `company.logo_url`.

### 3.2 Does it pass logo_url?

- **Yes.** Both branches call `setCompanyBranding(company.name, ..., company.logo_url)` (third argument).

### 3.3 Does applyThemeToDOM run afterward?

- **Yes.** ThemeContext:
  - `setCompanyBranding` updates `companyTheme` state.
  - `activeTheme = overrideTheme ?? companyTheme` and `currentColors` are derived from `activeTheme`.
  - `useEffect(() => { applyThemeToDOM(currentColors); }, [currentColors])` runs when `currentColors` changes, so after `setCompanyTheme` (and thus after setCompanyBranding).

### 3.4 effectiveTheme and override

- **effectiveTheme:** Not a single variable name; effectively **activeTheme** = `overrideTheme ?? companyTheme`, and **currentColors** = activeTheme.light or activeTheme.dark by mode.
- **Override:** When `overrideTheme` is set (e.g. “Preview Globally”), it takes precedence. On normal login there is no override, so **companyTheme** (and thus setCompanyBranding) drives the theme. No conflict for initial load.

---

## STEP 4 — Header Logo

### 4.1 Header component

- **File:** `src/components/dashboard/DashboardHeader.tsx`.

### 4.2 Logo source

- **From ThemeContext:** `const { currentColors } = useTheme();` then `const companyLogo = currentColors.logo;`
- **Not from company object directly for the img src:** The `<img src={companyLogo}>` uses `currentColors.logo`. That value is whatever was last set in theme (setCompanyBranding merges `company.logo_url` into resolved theme and sets companyTheme).
- So: **Logo is rendered from ThemeContext (currentColors.logo), which was set from company.logo_url when setCompanyBranding ran.** Company name fallback comes from `useUser().company` when logo is missing or fails.

### 4.3 Is logo_url used correctly?

- **Yes.** UserContext passes `company.logo_url` into setCompanyBranding; ThemeContext (via themeManager) merges it: `effectiveLogo = dbLogo || jsonLogo`, then `resolved.light.logo = resolved.dark.logo = effectiveLogo`. Header then reads `currentColors.logo`.

### 4.4 &lt;img src&gt;

- **Points to:** `currentColors.logo` (string). Can be:
  - Empty string → no img (fallback: company name).
  - Relative path (e.g. `/logos/...`) from defaultThemes or companies.branding_json.
  - Full URL (e.g. Supabase Storage) if `companies.logo_url` is such a URL.
- **Local assets:** defaultThemes use paths like `/logos/congruent-solutions.png` (no import; assumed in public). Header does not import logos; it uses the string from theme.

---

## STEP 5 — Supabase Storage (logo_url)

- **In code:** No direct Supabase Storage API calls for logo. Logo is just a string from `companies.logo_url` passed through theme to `<img src>`.
- **If logo_url is a Supabase Storage URL:**
  1. **Bucket public:** Must be configured in Supabase (Dashboard → Storage). Not visible in repo.
  2. **URL validity:** Must be a valid, reachable URL (e.g. `https://<project>.supabase.co/storage/v1/object/public/...`).
  3. **CORS:** Browser loads image from same origin or storage domain; CORS must allow the app origin if different. Not configurable in app code.
- **Conclusion:** No app-code issue; any logo failure from Supabase is **bucket policy / CORS / URL configuration**.

---

## STEP 6 — Failure Points

### 6.1 Execution order (diagram)

```
Login (user exists)
    │
    ▼
AuthContext: user set, authLoading false
    │
    ▼
UserContext useEffect runs
    │
    ▼
fetchUserData()
    │
    ├─► 1. supabase.from("profiles").eq("id", authUser.id).single()
    │       │
    │       ├─ ERROR or no row ─► setProfile(null), setCompany(null), setBrandingLoading(false) ─► STOP
    │       │                      (setCompanyBranding never called; theme stays fallback; no logo from DB)
    │       │
    │       └─ OK ─► setProfile(profileData)
    │                   │
    │                   ▼
    │              2. supabase.from("companies").eq("id", profileData.company_id).single()
    │                   │
    │                   ├─ no row / error ─► setCompany(null); if !company?.name, setCompanyBranding not called ─► STOP
    │                   │
    │                   └─ OK ─► setCompany(company)
    │                               │
    │                               ▼
    │                          3. getCompanyBranding(company.id) [optional]
    │                               │
    │                               ▼
    │                          4. setCompanyBranding(company.name, payload, company.logo_url)
    │                               │
    │                               ▼
    │                          ThemeContext: setCompanyTheme(...) → currentColors update
    │                               │
    │                               ▼
    │                          useEffect: applyThemeToDOM(currentColors)
    │
    └─► setBrandingLoading(false), setProfileLoading(false)
```

### 6.2 Exact broken link in chain

- **Most likely:** **Profile row does not exist** when the user logs in after signup.
  - **Reason:** Signup only calls `signUp(..., { name, company_id, location })`. Metadata lives in **auth.users**. There is **no app code and no migration in the repo** that inserts into `profiles`. If there is no Supabase trigger (or other backend) that creates `profiles` from `auth.users`, **profile fetch returns error or no row** → profile and company stay null → **setCompanyBranding is never called** → theme and logo stay fallback.
- **Secondary:** If profile exists but **profile.company_id** is null, wrong, or points to a missing company, company fetch fails or company is null → again setCompanyBranding not called.
- **Tertiary:** If `companies.logo_url` is a Supabase Storage URL and the bucket is private or CORS is wrong, the **image** fails to load (onError in header shows company name; theme still applied).

### 6.3 Minimal fix required

1. **Ensure profile exists with company_id after signup**
   - **Option A (recommended):** Add a Supabase trigger on `auth.users` INSERT that inserts into `public.profiles` (id, name, company_id, location, …) from `NEW.id` and `NEW.raw_user_meta_data` (e.g. `raw_user_meta_data->>'company_id'`, etc.), so `company_id` matches `companies.id`.
   - **Option B:** After signUp in the app, call an Edge Function or API that creates the profile row (same shape). Less ideal than trigger (race, extra latency).
   - **Option C:** On first profile fetch 404, create profile from `user.user_metadata` (name, company_id, location) and then retry. More complex and duplicates trigger logic.

2. **Optional:** If using Supabase Storage for logos, ensure the bucket is public (or signed URLs are used) and CORS allows the app origin.

### 6.4 Files to modify (for minimal fix)

| Change | File(s) |
|--------|--------|
| Create profile from auth metadata (trigger) | New migration, e.g. `supabase/migrations/YYYYMMDD_handle_new_user_profiles.sql` (trigger on `auth.users` INSERT → INSERT into `public.profiles`). |
| Or create profile from app after signup | `src/pages/auth/Signup.tsx`: after `signUp()` (and before or after signOut), call Supabase to insert into `profiles` (id = user.id, name, company_id, location from metadata). Requires RLS/policy allowing insert. |
| No change required for login/theme/header | UserContext, ThemeContext, DashboardHeader already use profile → company → setCompanyBranding → currentColors.logo correctly. |

### 6.5 Risk level

| Risk | Level | Note |
|------|--------|-----|
| Profile never created after signup | **High** | Theming and logo will not work for new signups if no trigger/backend creates profiles. |
| Trigger wrong or slow | **Medium** | Wrong company_id or delayed insert could cause wrong theme or transient “no company” state. |
| Company or logo_url missing in DB | **Low** | Fallback theme and company-name-only header already handle missing logo. |
| Storage/CORS for logo_url | **Low** | Only affects image load; theme and company name still work. |

---

## Summary Table

| Item | Status |
|------|--------|
| company_id on signup | Stored only in auth user_metadata; in profiles only if trigger/backend exists. |
| profiles row after signup | Not created by app; depends on Supabase trigger or other backend. |
| Profile fetch on login | UserContext; by auth user id. |
| Company fetch | After profile; by profile.company_id. |
| setCompanyBranding | Only in UserContext; after profile + company; passes logo_url. |
| applyThemeToDOM | Runs after companyTheme update; no race with setCompanyBranding. |
| Header logo source | ThemeContext currentColors.logo (set from company.logo_url via setCompanyBranding). |
| Logo URL usage | Correct; img src is dynamic; fallback to company name on error. |
| Likely failure | Profile row missing after signup → no profile → no company → no setCompanyBranding → fallback theme, no DB logo. |
| Minimal fix | Ensure profile (with company_id) is created on signup (trigger or app insert). |
