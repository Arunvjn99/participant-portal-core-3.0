-- =============================================================================
-- PHASE 2: Set companies.logo_url to Supabase Storage public URLs
-- Bucket: company-logos (must be PUBLIC)
-- Filenames: congruent.png, john-hancock.png, lincoln.png, transamerica.png
-- Run in Supabase SQL Editor, then: SELECT name, logo_url FROM public.companies;
-- =============================================================================

UPDATE public.companies
SET logo_url = CASE lower(name)
  WHEN 'congruent solutions' THEN 'https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/congruent.png'
  WHEN 'john hancock' THEN 'https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/john-hancock.png'
  WHEN 'lincoln' THEN 'https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/lincoln.png'
  WHEN 'lincoln group' THEN 'https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/lincoln.png'
  WHEN 'transamerica' THEN 'https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/transamerica.png'
END;

-- Verify: all rows should have full URLs
-- SELECT name, logo_url FROM public.companies;
