# Branding Architecture (Post Ascend Removal)

## Overview

- **Pre-auth (Login, Signup, Forgot Password, Verify, Help Center):** CORE product branding only. No tenant logo. No Ascend.
- **Post-auth (Dashboard, all app routes):** Tenant company logo only (from `currentColors.logo` / Supabase). No CORE logo in header. No Ascend.

## Components

| Component | Use | Logo source |
|-----------|-----|-------------|
| `Logo` | Pre-auth pages (header slot in AuthFormShell) | Renders `CoreProductBranding` → `/image/core-logo.png` |
| `CoreProductBranding` | Shared CORE block (logo + "Retirement Intelligence Platform" + optional "by Congruent Solutions") | Static asset, no ThemeContext |
| `DashboardHeader` | Post-auth only | `currentColors.logo` (tenant) or company name fallback |
| `AuthFooter` | Pre-auth layout | `branding.footer.core` → CORE logo |

## What Not to Do

- Do not use ThemeContext or tenant logo on auth pages.
- Do not show CORE logo in the dashboard header (tenant logo only after login).
- Do not reintroduce Ascend branding or assets.

## Multi-Tenant Theming

Unchanged: ThemeContext, UserContext, and `companies.logo_url` flow remain as-is. Tenant logo and colors apply only after login.
