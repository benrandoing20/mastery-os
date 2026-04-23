CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  target_roles jsonb DEFAULT '["general"]',
  preferences jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  domain text NOT NULL CHECK (domain IN ('algorithms','ml','deeplearning','systems','quant','biology')),
  tier integer NOT NULL CHECK (tier IN (1,2,3,4)),
  title text NOT NULL,
  description text DEFAULT '',
  confidence float DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 5),
  last_reviewed_at timestamptz,
  interview_frequency float DEFAULT 0.5 CHECK (interview_frequency >= 0 AND interview_frequency <= 1),
  prerequisites uuid[] DEFAULT '{}',
  unlocks uuid[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_seeded boolean DEFAULT false,
  embedding vector(1024),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_text text NOT NULL,
  extracted_concepts jsonb DEFAULT '[]',
  duration_minutes integer DEFAULT 0,
  session_type text DEFAULT 'journal' CHECK (session_type IN ('journal','problem','paper','interview','project')),
  linked_node_ids uuid[] DEFAULT '{}',
  ai_analysis jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS concept_updates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id uuid NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
  confidence_before float NOT NULL,
  confidence_after float NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenge_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_type text DEFAULT 'quiz' CHECK (challenge_type IN ('mock_interview','quiz','system_design','invariant_test')),
  target_role text DEFAULT 'general' CHECK (target_role IN ('quant_research','ai_lab','clinical_ai','general')),
  domain text CHECK (domain IN ('algorithms','ml','deeplearning','systems','quant','biology')),
  messages jsonb DEFAULT '[]',
  score jsonb DEFAULT '{"accuracy":0,"depth":0,"seniorThinking":0,"communication":0}',
  gaps_identified text[] DEFAULT '{}',
  nodes_tested uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_briefings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  nodes_due_for_review uuid[] DEFAULT '{}',
  challenge_questions jsonb DEFAULT '[]',
  recommendations jsonb DEFAULT '[]',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id uuid NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('paper','problem','video','repo','article')),
  title text NOT NULL,
  url text NOT NULL,
  notes text DEFAULT '',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_syncs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('leetcode','anki','browser','github')),
  raw_data jsonb DEFAULT '{}',
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
