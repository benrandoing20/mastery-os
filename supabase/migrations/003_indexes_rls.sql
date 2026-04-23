-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_user_id ON knowledge_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_domain ON knowledge_nodes(domain);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_tier ON knowledge_nodes(tier);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON study_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_concept_updates_node_id ON concept_updates(node_id);
CREATE INDEX IF NOT EXISTS idx_concept_updates_session_id ON concept_updates(session_id);
CREATE INDEX IF NOT EXISTS idx_challenge_sessions_user_id ON challenge_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_briefings_user_date ON daily_briefings(user_id, date);

-- Full-text search on study sessions
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', raw_text)) STORED;
CREATE INDEX IF NOT EXISTS idx_study_sessions_search ON study_sessions USING GIN(search_vector);

-- Row Level Security
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_syncs ENABLE ROW LEVEL SECURITY;

-- knowledge_nodes: seeded nodes (user_id NULL) visible to all; user nodes visible to owner
CREATE POLICY "knowledge_nodes_select" ON knowledge_nodes
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "knowledge_nodes_insert" ON knowledge_nodes
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "knowledge_nodes_update" ON knowledge_nodes
  FOR UPDATE USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "knowledge_nodes_delete" ON knowledge_nodes
  FOR DELETE USING (user_id = auth.uid());

-- User-owned tables
CREATE POLICY "study_sessions_select" ON study_sessions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "study_sessions_insert" ON study_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "study_sessions_delete" ON study_sessions
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "concept_updates_select" ON concept_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM study_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "concept_updates_insert" ON concept_updates
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM study_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

CREATE POLICY "challenge_sessions_all" ON challenge_sessions
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "daily_briefings_all" ON daily_briefings
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "resources_select" ON resources
  FOR SELECT USING (true);

CREATE POLICY "integration_syncs_all" ON integration_syncs
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
