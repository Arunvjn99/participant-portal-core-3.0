-- =============================================================================
-- Add data_sources to ai_logs for Phase 4A answer quality audit
-- =============================================================================

ALTER TABLE ai_logs
ADD COLUMN IF NOT EXISTS data_sources text[] DEFAULT NULL;

COMMENT ON COLUMN ai_logs.data_sources IS 'List of table names that contributed data for this response (e.g. retirement_accounts, plan_rules)';
