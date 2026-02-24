-- =============================================================================
-- Ensure companies.logo_url exists for multi-tenant logo display
-- Run in Supabase SQL Editor if needed. Safe to run multiple times.
-- =============================================================================

-- Add logo_url if the column does not exist (e.g. public storage URL or path)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN logo_url text;
    COMMENT ON COLUMN public.companies.logo_url IS 'Company logo: Supabase storage public URL or app path e.g. /logos/company.png';
  END IF;
END $$;
