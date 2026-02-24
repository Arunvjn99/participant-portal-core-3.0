-- =============================================================================
-- Company Branding Table (Supabase)
-- Run this in the Supabase SQL Editor. Do not execute from app.
-- =============================================================================

-- Table: company_branding
-- Stores serialized branding (light theme, experience, typography, meta).
-- Dark theme is auto-generated from light; not stored here.
CREATE TABLE IF NOT EXISTS company_branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branding_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id)
);

-- Trigger: keep updated_at in sync
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS company_branding_updated_at ON company_branding;
CREATE TRIGGER company_branding_updated_at
  BEFORE UPDATE ON company_branding
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE company_branding ENABLE ROW LEVEL SECURITY;

-- Policy: SELECT — authenticated users whose profile.company_id matches
CREATE POLICY "company_branding_select_own_company"
  ON company_branding FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: INSERT — only admin or super_admin
CREATE POLICY "company_branding_insert_admin"
  ON company_branding FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- Policy: UPDATE — only admin or super_admin
CREATE POLICY "company_branding_update_admin"
  ON company_branding FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- Optional: add role column to profiles if not present
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
