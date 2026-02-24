# Company logos — Supabase Storage

## PHASE 1 — Standardize filenames

In Supabase Dashboard → Storage → bucket **`company-logos`**:

1. Ensure the bucket is **PUBLIC** (so header `<img src="...">` can load without auth).
2. Use these exact filenames (all lowercase, no spaces, no special characters):

| Company           | Filename          |
|-------------------|-------------------|
| Congruent Solutions | `congruent.png`   |
| John Hancock      | `john-hancock.png`|
| Lincoln / Lincoln Group | `lincoln.png` |
| Transamerica      | `transamerica.png`|

Rename any existing files (e.g. `Congruent Logo.png` → `congruent.png`).

## URL format

Public URL pattern:

```
https://<project-ref>.supabase.co/storage/v1/object/public/company-logos/<filename>
```

Example: `https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/congruent.png`

## After running the SQL (Phase 2)

- `public.companies.logo_url` will point to these URLs.
- Header reads `currentColors.logo` and renders `<img src={companyLogo} />`.
- No fallback text unless `logo_url` is null or the image fails to load.
