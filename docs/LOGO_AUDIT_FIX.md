# Multi-Tenant Logo Audit — Fix Summary

**Date:** 2025-02-24  
**Scope:** Full trace from `companies.logo_url` (Supabase) → ThemeContext → Dashboard header.  
**Outcome:** Chain fixed; default-logo fallback and debug logging added.

---

## Exact failure point(s)

1. **DB / data:** If `companies.logo_url` is null or empty, the header had no logo URL to show, so it correctly fell back to company name text. The app did not use a fallback from default themes (e.g. Congruent / Lincoln) when DB had no logo.
2. **Merge / fallback:** When `company.logo_url` and any logo in `branding_json` were both empty, `effectiveLogo` stayed `""`, so the header showed text. No default theme logo was used.
3. **URL handling:** Supabase storage URLs or paths with spaces in filenames (e.g. `Congruent Logo.png`) can break `<img src>`. The header did not normalize URLs (e.g. encode spaces).

---

## Files modified

| File | Change |
|------|--------|
| `src/context/UserContext.tsx` | Added dev-only logs: `user.id`, `profile.company_id`, full company row, `company.logo_url`, and `setCompanyBranding(…, company.logo_url)` calls. Confirmed logo is always passed as third argument. |
| `src/context/ThemeContext.tsx` | In `setCompanyBranding`: (1) `effectiveLogo = dbLogo \|\| jsonLogo \|\| defaultLogo` where `defaultLogo` comes from `themeManager.getTheme(companyName).light.logo` so known companies get a default logo when DB has none. (2) Dev-only log of merge result. |
| `src/components/dashboard/DashboardHeader.tsx` | (1) `companyLogo = currentColors.logo?.trim() \|\| ""`. (2) Dev-only `useEffect` logging `companyLogo` and `company?.name`. (3) `showLogoImg = Boolean(companyLogo && !logoError)`. (4) `src={companyLogo.includes(" ") ? encodeURI(companyLogo) : companyLogo}` so paths/URLs with spaces load correctly. |
| `supabase/migrations/add_companies_logo_url.sql` | New migration: add `companies.logo_url` if missing (idempotent). |

---

## What was fixed

1. **Default logo fallback**  
   In `ThemeContext.setCompanyBranding`, when both DB and JSON logo are empty, the app now uses the default theme logo for that company name (e.g. Congruent Solutions → `/logos/congruent-solutions.png`). So the header can show a logo even before `companies.logo_url` is populated.

2. **Logo merge**  
   Logo is still merged into both `resolved.light` and `resolved.dark`; the new fallback only affects the value of `effectiveLogo` when DB and JSON are empty.

3. **Header URL handling**  
   - `currentColors.logo` is trimmed.  
   - If the logo string contains a space, `encodeURI(companyLogo)` is used as `img` `src` so storage URLs or paths with spaces (e.g. `Congruent Logo.png`) load correctly.

4. **Audit logging (dev only)**  
   - **UserContext:** Logs `user.id`, `profile.company_id`, full company row, `company.logo_url`, and each `setCompanyBranding(…, logo)` call.  
   - **ThemeContext:** Logs `dbLogo`, `jsonLogo`, `defaultLogo`, `effectiveLogo` after merge.  
   - **DashboardHeader:** Logs `companyLogo` and `company?.name` in a `useEffect`.  

   All logs are behind `import.meta.env.DEV` and prefixed with `[logo-audit]`.

5. **Schema**  
   Migration `add_companies_logo_url.sql` ensures `public.companies.logo_url` exists so new or existing DBs can store logo URLs.

---

## Why it failed originally

- **Header showed company name instead of logo** because:
  - `companies.logo_url` was often null/empty, and there was no fallback to default theme logos.
  - So `currentColors.logo` was `""`, and the header correctly fell back to `{company?.name}`.
- **If logos were later added in storage** with filenames containing spaces, the raw URL in `logo_url` could break `<img src>` without encoding.

---

## Verification (Phase 6)

After deploy:

1. Logout, then login as a user whose company has `logo_url` set in `companies` → header should show the logo.
2. Login as a user whose company has `logo_url` null → header should show the default theme logo for that company name (if in `defaultThemes`) or company name text.
3. In DevTools: `[logo-audit]` logs should show `user.id`, `profile.company_id`, `company.id`, `company.logo_url`, merge result, and header `companyLogo`.
4. Network tab: the logo image request should be 200 (or 304). If 404, fix the URL in DB or rename files in storage (e.g. `Congruent Logo.png` → `congruent.png`) and update `companies.logo_url` accordingly.

---

## Optional: Populate logo_url in DB

To use real logos from Supabase Storage:

1. Upload assets to a public bucket (e.g. `logos`).
2. Set `companies.logo_url` to the public URL or a path your app serves (e.g. `/logos/congruent.png`).
3. If filenames had spaces, prefer renaming to lowercase without spaces and updating URLs in the DB.
