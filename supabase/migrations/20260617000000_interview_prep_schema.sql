-- ============================================================
-- Interview Prep Platform — Schema Migration (Phase 2)
-- Generated: 2026-06-17
-- Agent: Claude Code (Sonnet 4.6) — Phase 2 Architect
-- ============================================================
-- ADDITIVE ONLY — zero changes to existing tables:
--   posts, categories, videos, projects, profiles
-- Reuses existing update_updated_at_column() trigger function.
-- Run via: npx supabase db push  (or paste in Supabase SQL editor)
-- ============================================================

-- ── 0. Extensions ────────────────────────────────────────────
-- pgcrypto is already enabled in Supabase by default.
-- gen_random_uuid() is available natively in Postgres 13+.

-- ── 1. ENUM types ────────────────────────────────────────────

CREATE TYPE topic_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE topic_status     AS ENUM ('placeholder', 'draft', 'review', 'published');
CREATE TYPE access_level     AS ENUM ('free', 'premium');
CREATE TYPE content_type     AS ENUM ('notes', 'example', 'assessment', 'flashcards');
CREATE TYPE relation_type    AS ENUM ('prerequisite', 'related', 'see_also');
CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_source  AS ENUM ('ai_generated', 'community', 'curated');
CREATE TYPE progress_status  AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE agent_phase      AS ENUM ('analysis', 'generation', 'migration', 'qa', 'ui_build');
CREATE TYPE agent_status     AS ENUM ('running', 'paused', 'completed', 'failed');
CREATE TYPE topic_type       AS ENUM ('standard', 'exercise');
CREATE TYPE decision_type    AS ENUM ('classification', 'delegation', 'retry', 'escalate', 'quality_gate');

-- ── 2. topic_categories ──────────────────────────────────────

CREATE TABLE topic_categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  color       VARCHAR(7),                           -- hex e.g. '#4a86e8'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT topic_categories_name_key UNIQUE (name),
  CONSTRAINT topic_categories_slug_key UNIQUE (slug)
);

CREATE TRIGGER set_topic_categories_updated_at
  BEFORE UPDATE ON topic_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 3. topics ────────────────────────────────────────────────

CREATE TABLE topics (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  title             VARCHAR(255)    NOT NULL,
  slug              VARCHAR(255)    NOT NULL,
  category_id       UUID            NOT NULL REFERENCES topic_categories (id) ON DELETE RESTRICT,
  parent_topic_id   UUID            REFERENCES topics (id) ON DELETE SET NULL,
  sort_order        INTEGER         NOT NULL DEFAULT 0,
  difficulty        topic_difficulty NOT NULL DEFAULT 'intermediate',
  estimated_minutes INTEGER,
  topic_type        topic_type      NOT NULL DEFAULT 'standard',
  status            topic_status    NOT NULL DEFAULT 'placeholder',
  access_level      access_level    NOT NULL DEFAULT 'free',
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT topics_slug_key UNIQUE (slug)
);

CREATE INDEX idx_topics_category_id    ON topics (category_id);
CREATE INDEX idx_topics_status         ON topics (status);
CREATE INDEX idx_topics_access_level   ON topics (access_level);
CREATE INDEX idx_topics_slug           ON topics (slug);

CREATE TRIGGER set_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 4. topic_content ─────────────────────────────────────────

CREATE TABLE topic_content (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id            UUID         NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
  content_type        content_type NOT NULL,
  body                TEXT,
  is_ai_generated     BOOLEAN      NOT NULL DEFAULT false,
  generation_metadata JSONB,        -- { model, input_tokens, output_tokens, cost_usd, prompt_version, generated_at }
  source_file         VARCHAR(500), -- original relative path e.g. 'js-core/hoisting/notes.md'
  quality_score       FLOAT        CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 1)),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT topic_content_unique_type UNIQUE (topic_id, content_type)
);

CREATE INDEX idx_topic_content_topic_id      ON topic_content (topic_id);
CREATE INDEX idx_topic_content_type          ON topic_content (content_type);
CREATE INDEX idx_topic_content_ai_generated  ON topic_content (is_ai_generated);

CREATE TRIGGER set_topic_content_updated_at
  BEFORE UPDATE ON topic_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 5. learning_paths ────────────────────────────────────────

CREATE TABLE learning_paths (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT learning_paths_slug_key UNIQUE (slug)
);

CREATE TRIGGER set_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 6. learning_path_topics ──────────────────────────────────

CREATE TABLE learning_path_topics (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID    NOT NULL REFERENCES learning_paths (id) ON DELETE CASCADE,
  topic_id         UUID    NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
  position         INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT learning_path_topics_unique UNIQUE (learning_path_id, topic_id)
);

CREATE INDEX idx_lpt_learning_path_id ON learning_path_topics (learning_path_id);
CREATE INDEX idx_lpt_topic_id         ON learning_path_topics (topic_id);

-- ── 7. topic_relations ───────────────────────────────────────

CREATE TABLE topic_relations (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  source_topic_id  UUID          NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
  target_topic_id  UUID          NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
  relation_type    relation_type NOT NULL DEFAULT 'related',

  CONSTRAINT topic_relations_unique UNIQUE (source_topic_id, target_topic_id),
  CONSTRAINT topic_relations_no_self_loop CHECK (source_topic_id <> target_topic_id)
);

CREATE INDEX idx_topic_relations_source ON topic_relations (source_topic_id);
CREATE INDEX idx_topic_relations_target ON topic_relations (target_topic_id);

-- ── 8. interview_questions ───────────────────────────────────

CREATE TABLE interview_questions (
  id         UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id   UUID                NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
  question   TEXT                NOT NULL,
  answer     TEXT,
  difficulty question_difficulty NOT NULL DEFAULT 'medium',
  source     question_source     NOT NULL DEFAULT 'ai_generated',
  created_at TIMESTAMPTZ         NOT NULL DEFAULT now()
);

CREATE INDEX idx_interview_questions_topic_id   ON interview_questions (topic_id);
CREATE INDEX idx_interview_questions_difficulty ON interview_questions (difficulty);

-- ── 9. company_questions ─────────────────────────────────────

CREATE TABLE company_questions (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name     VARCHAR(255) NOT NULL,
  question_id      UUID         NOT NULL REFERENCES interview_questions (id) ON DELETE CASCADE,
  reported_count   INTEGER      NOT NULL DEFAULT 1,
  last_reported_at TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT company_questions_unique UNIQUE (company_name, question_id)
);

CREATE INDEX idx_company_questions_question_id ON company_questions (question_id);

-- ── 10. user_topic_progress ──────────────────────────────────

CREATE TABLE user_topic_progress (
  id           UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID            NOT NULL,           -- Supabase Auth uid
  topic_id     UUID            NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
  status       progress_status NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT user_topic_progress_unique UNIQUE (user_id, topic_id)
);

CREATE INDEX idx_utp_user_id  ON user_topic_progress (user_id);
CREATE INDEX idx_utp_topic_id ON user_topic_progress (topic_id);
CREATE INDEX idx_utp_status   ON user_topic_progress (status);

CREATE TRIGGER set_utp_updated_at
  BEFORE UPDATE ON user_topic_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 11. agent_sessions ───────────────────────────────────────

CREATE TABLE agent_sessions (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name VARCHAR(255) NOT NULL,
  started_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  ended_at     TIMESTAMPTZ,
  phase        agent_phase  NOT NULL,
  status       agent_status NOT NULL DEFAULT 'running',
  checkpoint   JSONB,       -- full resumable state snapshot
  summary      TEXT
);

CREATE INDEX idx_agent_sessions_phase  ON agent_sessions (phase);
CREATE INDEX idx_agent_sessions_status ON agent_sessions (status);

-- ── 12. agent_cost_log ───────────────────────────────────────

CREATE TABLE agent_cost_log (
  id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id         UUID          NOT NULL REFERENCES agent_sessions (id) ON DELETE CASCADE,
  agent_name         VARCHAR(100)  NOT NULL,
  task_id            VARCHAR(100),
  model              VARCHAR(50)   NOT NULL,
  input_tokens       INTEGER       NOT NULL DEFAULT 0,
  output_tokens      INTEGER       NOT NULL DEFAULT 0,
  estimated_cost_usd DECIMAL(10,4) NOT NULL DEFAULT 0,
  metadata           JSONB,        -- { prompt_version, file_path, category, topic }
  created_at         TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_cost_log_session_id ON agent_cost_log (session_id);
CREATE INDEX idx_cost_log_agent_name ON agent_cost_log (agent_name);

-- ── 13. agent_decisions ──────────────────────────────────────

CREATE TABLE agent_decisions (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     UUID          NOT NULL REFERENCES agent_sessions (id) ON DELETE CASCADE,
  agent_name     VARCHAR(100)  NOT NULL,
  decision_type  decision_type NOT NULL,
  input_summary  TEXT,
  decision       TEXT          NOT NULL,
  reasoning      TEXT,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_decisions_session_id    ON agent_decisions (session_id);
CREATE INDEX idx_agent_decisions_type          ON agent_decisions (decision_type);

-- ── 14. Row Level Security ───────────────────────────────────

ALTER TABLE topic_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics               ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths       ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_relations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_questions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_cost_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_decisions      ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read topic_categories"
  ON topic_categories FOR SELECT USING (true);

CREATE POLICY "Public read published topics"
  ON topics FOR SELECT USING (status = 'published');

CREATE POLICY "Public read topic_content for published topics"
  ON topic_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM topics t
      WHERE t.id = topic_id AND t.status = 'published'
    )
  );

CREATE POLICY "Public read learning_paths"
  ON learning_paths FOR SELECT USING (true);

CREATE POLICY "Public read learning_path_topics"
  ON learning_path_topics FOR SELECT USING (true);

CREATE POLICY "Public read topic_relations"
  ON topic_relations FOR SELECT USING (true);

CREATE POLICY "Public read interview_questions"
  ON interview_questions FOR SELECT USING (true);

CREATE POLICY "Public read company_questions"
  ON company_questions FOR SELECT USING (true);

-- Authenticated users can read/write their own progress
CREATE POLICY "Users read own progress"
  ON user_topic_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
  ON user_topic_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
  ON user_topic_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Agent tables: service role only (accessed via supabaseAdmin in admin-queries.ts)
-- No public or anon policies — the service role bypasses RLS.

-- ── 15. Seed: topic_categories ───────────────────────────────
-- Maps directly to the 13 source content folders.
-- Slugs match folder names; sort_order reflects learning progression.

INSERT INTO topic_categories (name, slug, description, icon, sort_order, color) VALUES
  ('Core JavaScript',              'js-core',                    'Foundations: closures, event loop, prototypes, types', '⚙️',  1,  '#4a86e8'),
  ('Arrays & Objects',             'arrays-objects',             'Data structures, iteration, transformation patterns',  '📦',  2,  '#16a766'),
  ('Async JavaScript',             'async-js',                   'Promises, async/await, event loop, concurrency',       '⚡',  3,  '#ffad47'),
  ('TypeScript',                   'typescript',                 'Type system, generics, utility types, decorators',     '🔷',  4,  '#4986e7'),
  ('CSS & HTML',                   'css-html',                   'Layout, animations, accessibility, best practices',    '🎨',  5,  '#a479e2'),
  ('Performance & Tooling',        'performance-tooling',        'Bundlers, profiling, web vitals, optimization',        '🚀',  6,  '#fb4c2f'),
  ('React Fundamentals',           'react-fundamentals',         'JSX, components, props, state, lifecycle',             '⚛️',  7,  '#43d692'),
  ('React Hooks',                  'react-hooks',                'useState, useEffect, custom hooks, patterns',          '🪝',  8,  '#43d692'),
  ('React Patterns & Architecture','react-patterns-architecture','Context, HOCs, compound components, micro-frontends',  '🏗️',  9,  '#43d692'),
  ('React vs Angular',             'react-angular',              'Framework comparison, migration, tradeoffs',           '⚖️',  10, '#e07798'),
  ('System Design',                'system-design',              'Scalability, caching, databases, distributed systems', '🏛️',  11, '#cc3a21'),
  ('Testing',                      'testing',                    'Unit, integration, e2e, TDD, mocking strategies',      '🧪',  12, '#0b804b'),
  ('Practical JavaScript',         'practical-js',               'Real-world patterns, algorithms, problem solving',     '🛠️',  13, '#cf8933')
ON CONFLICT (slug) DO NOTHING;
