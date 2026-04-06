-- =============================================================================
-- Participant feedback (global in-app widget)
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  page text NOT NULL,
  scenario text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_user_id_created_at_idx ON feedback (user_id, created_at DESC);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Authenticated users may insert only their own row (user_id must match JWT).
CREATE POLICY "feedback_insert_authenticated"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NOT NULL AND user_id = auth.uid());

-- Anonymous (e.g. demo / pre-auth) may insert with no user link.
CREATE POLICY "feedback_insert_anon"
  ON feedback
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

GRANT INSERT ON feedback TO anon;
GRANT INSERT ON feedback TO authenticated;
