-- =============================================================================
-- AI logs table — audit trail for Core AI requests
-- Run in Supabase SQL Editor or via migration.
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  question text NOT NULL,
  detected_intent text,
  response text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for querying by user and time
CREATE INDEX IF NOT EXISTS ai_logs_user_id_created_at_idx ON ai_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_logs_company_id_created_at_idx ON ai_logs(company_id, created_at DESC);

-- RLS: only service role (backend) can insert/select; no direct client access
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_logs_service_role_all"
  ON ai_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users cannot read ai_logs (audit is server-side only)
-- No policy for authenticated role = no access
