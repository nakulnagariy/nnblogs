# Interview Prep Platform — Complete Migration & Agentic Build Plan

## ━━━ PART 1: PROJECT CONTEXT ━━━

### What Exists Today

**Source — Svelte Interview Prep App**
- ~300-400 files across 13 content categories
- Each topic folder follows a standard pattern:
  - `notes.md` / `notes-generated.md` (explanations)
  - `example.js` / `example-generated.js` (code demos)
  - `assessment.html` / `assessment-generated.html` (interactive quizzes)
  - `flashcards.csv` / `flashcards-generated.csv` (Q&A cards)
- Some topics have real content, others are placeholders
- Categories: `js-core` (18 topics), `react-angular` (14), `css-html` (12), `async-js` (10), `arrays-objects` (10), `react-hooks` (10), `react-patterns-architecture` (10), `system-design` (12), `performance-tooling` (9), `testing` (8), `react-fundamentals` (8), `typescript` (9), `practical-js` (4 files)
- Components: `Flashcard.svelte`, `TopicViewer.svelte`, `TopicSidebar.svelte`, `FiltersBar.svelte`, `StatsHero.svelte`, `ClientInterviews.svelte`
- Existing GitHub Copilot agents and scripts: `generate-topic-content.ts`, `coverage-report.ts`, `validate-manifest.ts`, `migrate-assessment-html.ts`

**Target — Next.js Personal Blog**
- Next.js 16.1.1, App Router, TypeScript
- Supabase Auth + Supabase DB (Postgres)
- Rich-text editor for blog writing (already integrated)
- Will be deployed on Vercel
- Current DB schema:
  - `categories` (id, name, slug, description)
  - `posts` (id, title, slug, content, excerpt, featured_image, category → categories.name, tags[], author_id, published, views)
  - `videos` (id, title, slug, description, video_url, thumbnail_url, duration, category, tags[], published, views)
  - `projects` (id, name, description, long_description, github_url, live_url, image_url, technologies[], featured)
  - RLS enabled: public reads published content, authenticated users have full CRUD
  - Functions: `increment_post_views()`, `increment_video_views()`, `update_updated_at_column()` trigger

### Developer Profile
- Solo developer
- Learning-first pace, no hard deadline
- AI provider: Claude (Anthropic)
- **No budget constraint** — use the right model for the right job. Optimize for quality, learning, and proper architecture over cost.

### Primary & Secondary Goals

**Primary:** Migrate the Svelte interview-prep platform into the existing Next.js blog as a connected, monetization-ready learning platform.

**Secondary (equally important):** Learn the agentic way of working across the complete SDLC. This project is a case study in how AI agents participate in every phase — from requirements gathering and architecture through implementation, testing, and deployment. The agentic system itself is a deliverable, not just a means to an end.

---

## ━━━ PART 2: WHAT TO BUILD ━━━

### Objective 1 — Schema Evolution (Don't Break What Works)

Extend the existing Supabase schema — don't replace it. The current `posts` and `categories` tables stay. Add new tables alongside them:

**New tables needed:**

```
topics
  id UUID PK
  title VARCHAR(255)
  slug VARCHAR(255) UNIQUE
  category_id UUID → topic_categories.id
  parent_topic_id UUID → topics.id (nullable, for subtopics)
  sort_order INTEGER (position within category)
  difficulty ENUM('beginner', 'intermediate', 'advanced')
  estimated_minutes INTEGER
  status ENUM('placeholder', 'draft', 'review', 'published')
  access_level ENUM('free', 'premium') DEFAULT 'free'
  created_at, updated_at TIMESTAMPTZ

topic_categories
  id UUID PK
  name VARCHAR(100) UNIQUE  -- "Core JavaScript", "React Hooks", etc.
  slug VARCHAR(100) UNIQUE
  description TEXT
  icon VARCHAR(50)          -- for UI (emoji or icon name)
  sort_order INTEGER
  color VARCHAR(7)          -- hex color for UI theming

topic_content
  id UUID PK
  topic_id UUID → topics.id
  content_type ENUM('notes', 'example', 'assessment', 'flashcards')
  body TEXT                 -- markdown/HTML/JSON depending on type
  is_ai_generated BOOLEAN DEFAULT false
  generation_metadata JSONB  -- model used, tokens, prompt version, timestamp
  source_file VARCHAR(500)   -- original file path for traceability
  quality_score FLOAT        -- QA agent's assessment (0-1)
  created_at, updated_at TIMESTAMPTZ
  UNIQUE(topic_id, content_type)

learning_paths
  id UUID PK
  name VARCHAR(255)
  slug VARCHAR(255) UNIQUE
  description TEXT
  sort_order INTEGER

learning_path_topics
  id UUID PK
  learning_path_id UUID → learning_paths.id
  topic_id UUID → topics.id
  position INTEGER
  UNIQUE(learning_path_id, topic_id)

topic_relations
  id UUID PK
  source_topic_id UUID → topics.id
  target_topic_id UUID → topics.id
  relation_type ENUM('prerequisite', 'related', 'see_also')
  UNIQUE(source_topic_id, target_topic_id)

interview_questions
  id UUID PK
  topic_id UUID → topics.id
  question TEXT
  answer TEXT
  difficulty ENUM('easy', 'medium', 'hard')
  source ENUM('ai_generated', 'community', 'curated')
  created_at TIMESTAMPTZ

company_questions
  id UUID PK
  company_name VARCHAR(255)
  question_id UUID → interview_questions.id
  reported_count INTEGER DEFAULT 1
  last_reported_at TIMESTAMPTZ
  UNIQUE(company_name, question_id)

user_topic_progress
  id UUID PK
  user_id UUID
  topic_id UUID → topics.id
  status ENUM('not_started', 'in_progress', 'completed')
  completed_at TIMESTAMPTZ
  UNIQUE(user_id, topic_id)

-- Agentic system tracking (the system observes itself)
agent_sessions
  id UUID PK
  session_name VARCHAR(255)
  started_at TIMESTAMPTZ
  ended_at TIMESTAMPTZ
  phase VARCHAR(50)          -- 'analysis', 'generation', 'migration', 'qa', 'ui_build'
  status VARCHAR(20)         -- 'running', 'paused', 'completed', 'failed'
  checkpoint JSONB           -- full resumable state
  summary TEXT               -- what was accomplished

agent_cost_log
  id UUID PK
  session_id UUID → agent_sessions.id
  agent_name VARCHAR(100)    -- 'orchestrator', 'analyzer', 'generator', etc.
  task_id VARCHAR(100)       -- maps to agile backlog item
  model VARCHAR(50)          -- 'claude-opus-4-6', 'claude-sonnet-4-6', etc.
  input_tokens INTEGER
  output_tokens INTEGER
  estimated_cost_usd DECIMAL(10,4)
  metadata JSONB             -- prompt version, file being processed, etc.
  created_at TIMESTAMPTZ

agent_decisions
  id UUID PK
  session_id UUID → agent_sessions.id
  agent_name VARCHAR(100)
  decision_type VARCHAR(50)  -- 'classification', 'delegation', 'retry', 'escalate', 'quality_gate'
  input_summary TEXT         -- what the agent was looking at
  decision TEXT              -- what it decided
  reasoning TEXT             -- why (chain of thought summary)
  created_at TIMESTAMPTZ
```

### Objective 2 — Content Migration Pipeline

Process every file from the Svelte `static/content/` directory:

**Step 1 — Inventory & Classify**
- Walk the file tree under `static/content/`
- For each topic folder, read all files
- Classify each file: `complete` (has real content, >200 words for .md, >5 functions for .js, >3 cards for .csv) vs `placeholder` (template text, TODO markers, <100 words)
- Output: `migration-manifest.json` with every file, its classification, and target mapping

**Step 2 — Content Generation (Placeholders Only)**
- For every file classified as `placeholder`:
  - Use 2-3 `complete` files from the same category as style/depth reference
  - Generate production-quality replacement content:
    - `notes.md`: Concept explanation, real-world use cases, gotchas, 800–1500 words
    - `example.js`: 3-5 runnable code examples with comments
    - `assessment.html`: 5-8 interactive multiple-choice questions using the shared assessment.css/js
    - `flashcards.csv`: 10-15 Q&A pairs covering the topic
  - Also generate 3-5 interview questions per topic for the `interview_questions` table
  - Mark all generated content with `is_ai_generated: true` and store full generation metadata

**Step 3 — Transform & Load**
- Parse each file into the target schema format
- Convert markdown → stored as markdown (render client-side with MDX or similar)
- Convert flashcards.csv → JSON array in `topic_content.body`
- Convert assessment.html → stored as HTML string (or extract questions into structured JSON)
- Insert into Supabase via API or SQL
- Populate `topic_relations` by analyzing content overlap across topics
- Build default `learning_paths` based on category ordering

**Step 4 — Quality Assurance**
- Every topic has all 4 content types populated
- No broken references or empty bodies
- Flashcard CSVs parse correctly
- Category assignments match source folder structure
- Generated content quality scored by a QA agent (checks accuracy, depth, code correctness)
- QA report with pass/fail per topic and flagged items for human review

### Objective 3 — Connected Content UI

Build these Next.js pages/components:

- `/topics` — Grid of all topic categories with icons, topic counts, progress bars
- `/topics/[category-slug]` — Ordered list of topics in a category with status indicators
- `/topics/[category-slug]/[topic-slug]` — Topic detail page with tabbed content: Notes | Examples | Assessment | Flashcards
- Sidebar navigation showing current category's topics with "next/previous" navigation
- Breadcrumbs: Home → Category → Topic
- "Related Topics" section at the bottom of each topic page (using `topic_relations`)
- Learning path pages: `/paths/[path-slug]` — sequential view with progress
- Interview questions section per topic with company tags and frequency badges

### Objective 4 — Design System

**Research targets** (analyze these for patterns, not copy):
- roadmap.sh (topic organization, progress tracking)
- web.dev (content cards, code examples)
- Josh W. Comeau's blog (animations, code blocks)
- Kent C. Dodds' site (learning path structure)
- FreeCodeCamp (curriculum layout)

**Deliverables:**
- Typography scale (headings, body, code, captions)
- Color tokens (light/dark mode ready, category-specific accent colors)
- Spacing system (4px base grid)
- Component library:
  - `TopicCard` — preview card for topic grids
  - `CodeBlock` — syntax-highlighted with copy button
  - `Flashcard` — flip animation (recreate from Svelte with Framer Motion or CSS)
  - `AssessmentQuiz` — interactive quiz renderer
  - `CategoryNav` / `TopicSidebar` — navigation
  - `ProgressBar` — visual progress indicator
  - `Breadcrumbs`
  - `ContentTabs` — Notes/Examples/Assessment/Flashcards switcher

### Objective 5 — CMS Decision

**Evaluate and recommend ONE option before building anything:**

| Option | Pros | Cons |
|--------|------|------|
| Keep rich-text editor + Supabase | Already built, zero cost, full control | Markdown/code editing is clunky in rich-text |
| MDX in repo (Contentlayer/Velite) | Best DX for code-heavy content, type-safe, Git-versioned | Build-time only, harder to edit via UI |
| Hybrid: MDX for topics, Supabase for blog posts | Best of both worlds | Two content systems to maintain |
| Sanity (free tier) | Great editing UX, structured content | External dependency, free tier limits |

**Decision criteria (weighted):**
1. Code block / markdown editing quality — weight: HIGH
2. AI pipeline compatibility (can agents read/write to it programmatically?) — weight: HIGH
3. Scale to 500+ articles — weight: HIGH
4. Developer experience — weight: HIGH
5. Non-technical editor friendliness — weight: LOW (solo dev)
6. Cost — weight: LOW (no budget constraint)

**Provide the recommendation with rationale before implementation begins.**

### Objective 6 — Monetization Readiness

- Schema already includes `access_level` ENUM('free', 'premium') on topics
- SEO: meta tags, OG images, structured data (FAQ schema for interview questions), sitemap.xml
- Performance: Static generation where possible, ISR for dynamic content
- Analytics-ready: view counts already exist, extend to track topic engagement

---

## ━━━ PART 3: AGENTIC SYSTEM DESIGN ━━━

> **This section is both the "how" for the migration AND a learning artifact.** The agentic system should be well-architected, documented, and observable so it serves as a reference implementation for agentic SDLC.

### Philosophy: Agentic SDLC — How Agents Map to the Software Lifecycle

This project demonstrates AI agents participating in every SDLC phase. Each phase has a lead agent, a specific mandate, and clear handoff to the next phase. The human developer operates as **Product Owner + Final Approver** — agents propose, humans approve at gates.

```
SDLC Phase          │ Lead Agent          │ What It Does                              │ SDLC Learning
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Requirements         │ Research Agent      │ Analyzes source repo, audits target,      │ How AI does discovery:
                     │                     │ inventories content, identifies gaps,      │ structured exploration,
                     │                     │ produces research report                  │ not assumptions
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Architecture         │ Architect Agent     │ Designs schema, evaluates CMS options,    │ How AI makes design
                     │                     │ proposes design system, produces ADRs     │ decisions: trade-off
                     │                     │ (Architecture Decision Records)           │ analysis, not guessing
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Planning             │ Planner Agent       │ Breaks architecture into epics/stories/   │ How AI decomposes work:
                     │                     │ tasks, estimates, sequences, identifies   │ dependency-aware planning
                     │                     │ dependencies and critical path            │
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Implementation       │ Builder Agents      │ Multiple specialized agents execute       │ How AI writes code:
                     │ (Generator,         │ tasks: generate content, build            │ context management,
                     │  Migrator,          │ components, write migrations, set up      │ style consistency,
                     │  UI Builder)        │ routes                                    │ incremental delivery
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Testing & QA         │ QA Agent            │ Validates content quality, checks         │ How AI tests its own
                     │                     │ code correctness, runs integration        │ output: self-critique,
                     │                     │ checks, scores generated content          │ structured validation
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Review & Iterate     │ Reviewer Agent      │ Reviews generated code/content against    │ How AI does code review:
                     │                     │ standards, suggests improvements,         │ pattern matching against
                     │                     │ enforces design system compliance         │ established standards
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Deployment           │ Deploy Agent        │ Prepares Vercel config, env vars,         │ How AI handles ops:
                     │                     │ runs pre-deploy checks, validates         │ checklists, verification,
                     │                     │ production readiness                      │ rollback awareness
─────────────────────┼─────────────────────┼───────────────────────────────────────────┼──────────────────────────
Observability        │ Cost & Metrics      │ Tracks every LLM call, produces cost      │ How AI observes itself:
                     │ Agent               │ reports, monitors quality trends,         │ meta-cognition, budget
                     │                     │ flags anomalies                           │ awareness, transparency
```

### Agent Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Main Agent)                      │
│                                                                  │
│  Responsibilities:                                               │
│  • Owns the backlog — reads from agile plan                     │
│  • Delegates tasks to the right sub-agent                       │
│  • Manages phase transitions and human approval gates           │
│  • Maintains checkpoint state for resumability                  │
│  • Tracks all costs and produces session reports                │
│  • Logs every decision with reasoning (agent_decisions table)   │
│                                                                  │
│  Decision-making:                                                │
│  • Picks next task based on priority + dependency resolution    │
│  • Chooses which sub-agent handles each task                    │
│  • Decides when to escalate to human (ambiguity, quality fail)  │
│  • Decides when to retry vs skip vs flag                        │
│                                                                  │
│  Model: Claude Opus (complex reasoning, planning, coordination) │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │          │
  ┌────▼───┐ ┌───▼────┐ ┌──▼───┐ ┌───▼───┐ ┌───▼────┐
  │RESEARCH│ │ARCHITECT│ │BUILD │ │  QA   │ │METRICS │
  │ AGENT  │ │ AGENT   │ │AGENTS│ │ AGENT │ │ AGENT  │
  └────────┘ └────────┘ └──────┘ └───────┘ └────────┘
```

### Sub-Agent Specifications

**1. Research Agent**
- **Mandate:** Understand both codebases completely before any decisions are made.
- **Inputs:** Svelte repo file tree + file contents, Next.js project structure + schema
- **Process:**
  - Inventory every file in `static/content/`, classify as complete vs placeholder
  - Analyze Svelte components to understand rendering logic and data flow
  - Audit the Next.js project: current routes, components, utilities, Supabase client setup
  - Research competitor platforms for design/UX patterns (web search)
  - Identify risks, unknowns, and dependencies
- **Outputs:**
  - `migration-manifest.json` — every source file with classification and metadata
  - `research-report.md` — findings, gap analysis, risk register
  - `competitor-analysis.md` — UX patterns from top educational sites
- **Model:** Sonnet for file scanning/classification, Opus for synthesis and report writing

**2. Architect Agent**
- **Mandate:** Make all technical design decisions with documented reasoning.
- **Inputs:** Research report, migration manifest, existing schema
- **Process:**
  - Design the extended schema (using the template in Objective 1 as a starting point)
  - Evaluate CMS options and produce a recommendation
  - Define the design system tokens based on competitor research
  - Write ADRs (Architecture Decision Records) for each significant choice
  - Define the content transformation rules (source format → target format)
- **Outputs:**
  - `schema-migration.sql` — ready to run
  - `cms-decision.md` — ADR with recommendation and rationale
  - `design-tokens.json` — typography, colors, spacing
  - `transformation-rules.md` — how each file type maps to the target schema
  - `adr/` folder — one ADR per major decision
- **Model:** Opus (architecture decisions need deep reasoning)
- **Human Gate:** ✋ All outputs reviewed and approved before implementation begins

**3. Content Analyzer (sub-agent of Research)**
- **Mandate:** Classify every source file and extract metadata.
- **Process:**
  - For each file, apply heuristic rules first:
    - `.md` files: word count, presence of TODO/placeholder markers, heading structure
    - `.js` files: function count, presence of actual logic vs skeleton code
    - `.csv` files: row count, non-empty answer fields
    - `.html` files: question count, actual content vs template
  - For ambiguous cases: send to Sonnet for classification
  - Extract metadata: topic name, category, subtopic relationships, difficulty estimate
- **Output:** Enriched `migration-manifest.json`
- **Model:** Heuristics first, Sonnet for ambiguous cases only

**4. Content Generator**
- **Mandate:** Produce high-quality educational content for every placeholder.
- **Process:**
  - For each placeholder file:
    - Load 2-3 reference files of the same type from the same category (complete ones)
    - Construct a prompt that includes: topic name, category context, reference content for style/depth, specific output format requirements
    - Generate content:
      - `notes.md`: 800-1500 word explanation with real-world examples, gotchas, code snippets
      - `example.js`: 3-5 runnable, commented code examples
      - `assessment.html`: 5-8 interactive MCQs using shared assessment.css/js patterns
      - `flashcards.csv`: 10-15 Q&A pairs with varying difficulty
    - Also generate 3-5 interview questions per topic
    - Store generation metadata: model, tokens, prompt hash, timestamp
  - After generating, immediately run through QA Agent for quality scoring
- **Model:** Opus for notes/explanations (quality matters most here), Sonnet for code examples and flashcards
- **Human Gate:** ✋ First 3 generated topics reviewed by human before batch processing rest

**5. Migration Agent (Transform & Load)**
- **Mandate:** Transform all content into the target schema and load into Supabase.
- **Process:**
  - Read the manifest (all files now have content — original or generated)
  - For each topic:
    - Create `topic_categories` entry (if not exists)
    - Create `topics` entry with metadata
    - For each content file, create `topic_content` entry
    - Parse and store flashcards as JSON
    - Insert interview questions into `interview_questions`
  - Build `topic_relations` by:
    - Analyzing cross-references in notes (links, "see also" mentions)
    - Using Sonnet to identify conceptual prerequisites across topics
  - Build default `learning_paths` based on category ordering and prerequisite chains
  - All inserts use `ON CONFLICT` / upserts — fully idempotent
- **Model:** Sonnet for relationship inference, no LLM needed for data transformation

**6. UI Builder Agent**
- **Mandate:** Build the Next.js components and pages following the design system.
- **Process:**
  - Implement design tokens as CSS variables / Tailwind config
  - Build each component from the design system spec
  - Build the route structure: `/topics`, `/topics/[category]`, `/topics/[category]/[topic]`
  - Implement tabbed content viewer, sidebar nav, breadcrumbs
  - Recreate flashcard flip animation using Framer Motion
  - Wire up Supabase queries via server components
  - Ensure existing blog routes and functionality are untouched
- **Model:** Opus for complex component architecture, Sonnet for boilerplate/repetitive code

**7. QA Agent**
- **Mandate:** Validate everything before it ships.
- **Process:**
  - **Content QA:**
    - Check every generated notes.md for: factual accuracy, sufficient depth, code correctness, no hallucinated APIs
    - Verify flashcard Q&A pairs are accurate and non-trivial
    - Verify assessment questions have correct answers marked
    - Score each piece of content 0-1, flag anything below 0.7 for human review
  - **Integration QA:**
    - Every topic has all 4 content types in DB
    - No empty bodies, no malformed JSON, no broken HTML
    - Category counts match source
    - Learning paths have no orphaned or circular references
    - Existing blog routes still work (regression check)
  - **UI QA:**
    - All routes render without errors
    - Navigation flows work (next/previous, breadcrumbs, sidebar)
    - Mobile responsiveness spot check
- **Output:** `qa-report.md` with pass/fail per topic, flagged items, and overall health score
- **Model:** Opus for content accuracy checking, heuristic scripts for structural validation

**8. Reviewer Agent**
- **Mandate:** Code review and standards enforcement.
- **Process:**
  - Review generated React components against design system compliance
  - Check TypeScript types are properly defined
  - Verify Supabase queries use proper typing and error handling
  - Ensure consistent code style across all generated files
  - Suggest improvements and refactors
- **Model:** Opus

**9. Cost & Metrics Agent**
- **Mandate:** Observe and report on the agentic system itself.
- **Process:**
  - Wrap every LLM API call to log: agent, task, model, tokens, cost, latency
  - After each session produce a cost report:
    - Total cost, cost per agent, cost per SDLC phase, cost per epic
    - Token efficiency trends
    - Quality score distribution
  - Track decisions made by orchestrator (logged in `agent_decisions` table)
  - Produce a final retrospective report for leadership presentation
- **Output:**
  - Real-time: `cost-log.jsonl` (append after every call)
  - Per-session: `session-report-{date}.md`
  - Final: `migration-retrospective.md` with full cost breakdown, quality metrics, timeline, and learnings

### Shared Utilities & Hooks

```typescript
// Core infrastructure every agent uses

// State persistence — enables resume across sessions
useAgentState(agentId: string): {
  load(): Promise<AgentCheckpoint>
  save(state: AgentCheckpoint): Promise<void>
  getLastProcessedItem(): string | null
  markComplete(itemId: string): Promise<void>
}

// Token tracking — wraps every LLM call
useTokenTracker(): {
  wrap<T>(agentName: string, taskId: string, fn: () => Promise<T>): Promise<T>
  getSessionCost(): CostSummary
  exportLog(): CostEntry[]
}

// Batch processing — handles file-level parallelism with rate limiting
useBatchProcessor<T>(items: T[], options: {
  concurrency: number
  onProgress: (completed: number, total: number) => void
  onError: (item: T, error: Error) => 'retry' | 'skip' | 'abort'
}): Promise<BatchResult<T>>

// Content validation — schema-aware validation for generated content
useContentValidator(): {
  validateNotes(content: string): ValidationResult
  validateFlashcards(csv: string): ValidationResult
  validateAssessment(html: string): ValidationResult
  validateExample(js: string): ValidationResult
  scoreQuality(content: string, type: ContentType): number
}

// Decision logging — records every agent decision with reasoning
useDecisionLogger(agentName: string): {
  log(type: string, input: string, decision: string, reasoning: string): Promise<void>
  getHistory(): Promise<AgentDecision[]>
}

// Supabase helpers — typed client for the extended schema
useSupabaseAdmin(): {
  upsertTopic(topic: TopicInput): Promise<Topic>
  upsertContent(content: ContentInput): Promise<TopicContent>
  upsertInterviewQuestion(q: QuestionInput): Promise<InterviewQuestion>
  getTopicsByCategory(categorySlug: string): Promise<Topic[]>
  // ... typed wrappers for all new tables
}

// File I/O — read source, write target
useFileSystem(): {
  readSvelteContent(relativePath: string): Promise<string>
  writeToNextJs(path: string, content: string): Promise<void>
  listDirectory(path: string): Promise<FileEntry[]>
}
```

### Checkpoint & Resumability

```typescript
// checkpoint.json — full system state, survives restarts
{
  "version": "1.0",
  "last_updated": "2025-01-15T18:30:00Z",
  "current_phase": "implementation",
  "phases": {
    "research": {
      "status": "complete",
      "completed_at": "2025-01-14T12:00:00Z",
      "outputs": ["migration-manifest.json", "research-report.md", "competitor-analysis.md"],
      "decisions_made": 3
    },
    "architecture": {
      "status": "complete",
      "completed_at": "2025-01-14T16:00:00Z",
      "outputs": ["schema-migration.sql", "cms-decision.md", "design-tokens.json"],
      "human_approved": true,
      "approved_at": "2025-01-14T20:00:00Z"
    },
    "implementation": {
      "status": "in_progress",
      "sub_phases": {
        "schema_migration": { "status": "complete" },
        "content_generation": {
          "status": "in_progress",
          "processed": 47,
          "total": 82,
          "last_processed": "react-hooks/use-callback",
          "errors": [],
          "quality_scores": { "avg": 0.84, "min": 0.72, "flagged": 2 }
        },
        "content_loading": { "status": "not_started" },
        "ui_components": { "status": "not_started" },
        "ui_pages": { "status": "not_started" }
      }
    },
    "qa": { "status": "not_started" },
    "deployment": { "status": "not_started" }
  },
  "cost": {
    "total_usd": 12.47,
    "by_agent": {
      "research": 1.20,
      "architect": 2.85,
      "analyzer": 0.45,
      "generator": 6.92,
      "migrator": 0.15,
      "qa": 0.90
    },
    "by_phase": {
      "research": 1.65,
      "architecture": 2.85,
      "implementation": 7.07,
      "qa": 0.90
    }
  }
}
```

**Resumability contract:**
- `Ctrl+C` at any point loses at most 1 in-progress item
- Next run reads checkpoint, skips completed items, continues from `last_processed`
- Orchestrator validates checkpoint integrity on startup (detects corruption)
- Human can manually edit checkpoint to re-run specific items or skip ahead

### Session Cost Report Template (for leadership)

```
═══════════════════════════════════════════════════════════
  AGENTIC MIGRATION — SESSION REPORT
  Date: 2025-01-15 | Duration: 3h 22m | Phase: Implementation
═══════════════════════════════════════════════════════════

  WORK COMPLETED
  ─────────────
  • Content generated for 35 topics (react-hooks, async-js categories)
  • QA scored all 35 — avg quality: 0.86, 2 flagged for human review
  • Design tokens finalized, 4 core components built

  COST BREAKDOWN
  ─────────────
  Agent              Model          Calls    Tokens      Cost
  ─────────────────────────────────────────────────────────
  Generator          Opus            35      280K in     $8.40
                                             420K out
  QA                 Opus            35      175K in     $3.50
                                             52K out
  UI Builder         Sonnet          12      48K in      $0.72
                                             96K out
  Orchestrator       Opus             8      12K in      $0.48
                                             8K out
  ─────────────────────────────────────────────────────────
  SESSION TOTAL                      90      515K        $13.10

  RUNNING TOTALS
  ─────────────
  Total project cost:    $28.42
  Budget remaining:      No cap
  Quality avg:           0.84 across 47 topics
  Items flagged:         4 (2 resolved, 2 pending human review)

  REMAINING WORK
  ─────────────
  • 35 more topics to generate (estimate: ~$10.50)
  • Content loading into Supabase (estimate: ~$0.50)
  • 8 UI components remaining (estimate: ~$2.00)
  • QA pass on loaded content (estimate: ~$3.00)

═══════════════════════════════════════════════════════════
```

---

## ━━━ PART 4: AGILE BACKLOG ━━━

### Epic 1 — Research & Discovery (18 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-1.1 | As a developer, I want a complete inventory of all Svelte source files classified as complete vs placeholder so I know the exact migration scope | 5 | Must |
| US-1.2 | As a developer, I want a competitor UX analysis (roadmap.sh, web.dev, etc.) so design decisions are informed, not arbitrary | 5 | Must |
| US-1.3 | As a developer, I want a research report covering the source app's architecture, data flow, and component patterns so migration doesn't miss hidden complexity | 5 | Must |
| US-1.4 | As a developer, I want a risk register identifying blockers and unknowns so I can plan around them | 3 | Must |

### Epic 2 — Architecture & Decisions (21 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-2.1 | As a developer, I want a CMS recommendation with a written ADR so I understand the trade-offs and can defend the choice | 5 | Must |
| US-2.2 | As a developer, I want the extended Supabase schema designed and reviewed so new tables exist alongside current ones without breaking the blog | 8 | Must |
| US-2.3 | As a developer, I want design system tokens (typography, colors, spacing) defined based on competitor research | 5 | Must |
| US-2.4 | As a developer, I want content transformation rules documented (source format → target format for each file type) | 3 | Must |

### Epic 3 — Agentic Infrastructure (21 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-3.1 | As a developer, I want the orchestrator with checkpoint/resume so I can run the migration across multiple days without losing progress | 8 | Must |
| US-3.2 | As a developer, I want a token tracking wrapper so every LLM call is logged with cost, agent, and task | 5 | Must |
| US-3.3 | As a developer, I want a decision logging system so I can review why each agent made each choice | 5 | Must |
| US-3.4 | As a developer, I want a session report generator so I can produce leadership-ready cost reports | 3 | Must |

### Epic 4 — Content Migration (34 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-4.1 | As a developer, I want every placeholder file replaced with AI-generated production-quality content matching the style/depth of existing complete files | 13 | Must |
| US-4.2 | As a developer, I want all content (original + generated) transformed and loaded into Supabase in the new schema | 8 | Must |
| US-4.3 | As a developer, I want topic relationships (prerequisites, related) auto-detected and stored so the connected experience works | 5 | Must |
| US-4.4 | As a developer, I want default learning paths generated based on category structure and prerequisite chains | 5 | Must |
| US-4.5 | As a developer, I want a QA validation report confirming every topic has all 4 content types, no broken data, and quality scores above threshold | 3 | Must |

### Epic 5 — Design System & Components (26 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-5.1 | As a user, I want a consistent, polished visual experience across all topic pages so the platform feels professional | 8 | Must |
| US-5.2 | As a user, I want an animated Flashcard component with flip interaction so I can study effectively | 5 | Must |
| US-5.3 | As a user, I want a syntax-highlighted CodeBlock component with copy button so code examples are readable and usable | 5 | Must |
| US-5.4 | As a user, I want an interactive AssessmentQuiz component so I can test my knowledge with immediate feedback | 5 | Should |
| US-5.5 | As a user, I want dark mode support so I can study comfortably at night | 3 | Should |

### Epic 6 — Connected Content UI (26 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-6.1 | As a user, I want a `/topics` page showing all categories as a visual grid so I can browse by subject | 5 | Must |
| US-6.2 | As a user, I want a topic detail page with tabbed content (Notes/Examples/Assessment/Flashcards) | 8 | Must |
| US-6.3 | As a user, I want sidebar navigation with next/previous links so I always know what to study next | 5 | Must |
| US-6.4 | As a user, I want breadcrumbs and "Related Topics" links so I can navigate naturally between connected concepts | 3 | Should |
| US-6.5 | As a user, I want learning path pages showing sequential progress through a curated topic order | 5 | Should |

### Epic 7 — Interview Intelligence (18 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-7.1 | As a user, I want interview questions displayed per topic so I can prepare for specific areas | 5 | Should |
| US-7.2 | As a user, I want to filter interview questions by company name so I can prepare for specific interviews | 5 | Could |
| US-7.3 | As a user, I want to see how many times a question was reported across companies so I know what's commonly asked | 3 | Could |
| US-7.4 | As an admin, I want to add/edit interview questions and company associations | 5 | Could |

### Epic 8 — SEO & Monetization Prep (13 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-8.1 | As the site owner, I want proper meta tags, OG images, and structured data so content ranks in search | 5 | Should |
| US-8.2 | As the site owner, I want a generated sitemap.xml covering all topic pages | 3 | Should |
| US-8.3 | As the site owner, I want free/premium gating infrastructure ready so I can monetize without re-architecture | 5 | Could |

### Epic 9 — Deployment & Go-Live (8 pts)

| ID | User Story | Points | Priority |
|----|-----------|--------|----------|
| US-9.1 | As a developer, I want the Vercel deployment configured with proper env vars and build settings | 3 | Must |
| US-9.2 | As a developer, I want a pre-deploy checklist validated by the QA agent (routes, data, performance) | 5 | Must |

**BACKLOG SUMMARY**

| Epic | Points | Must | Should | Could |
|------|--------|------|--------|-------|
| 1. Research & Discovery | 18 | 18 | 0 | 0 |
| 2. Architecture & Decisions | 21 | 21 | 0 | 0 |
| 3. Agentic Infrastructure | 21 | 21 | 0 | 0 |
| 4. Content Migration | 34 | 34 | 0 | 0 |
| 5. Design System | 26 | 18 | 8 | 0 |
| 6. Connected Content UI | 26 | 18 | 8 | 0 |
| 7. Interview Intelligence | 18 | 0 | 5 | 13 |
| 8. SEO & Monetization | 13 | 0 | 8 | 5 |
| 9. Deployment | 8 | 8 | 0 | 0 |
| **TOTAL** | **185** | **138** | **29** | **18** |

---

## ━━━ PART 5: EXECUTION INSTRUCTIONS ━━━

### Phase 1 — Research & Architecture (Epics 1-2)

**Execute:** Run Research Agent and Architect Agent.
**Deliver:** Research report, migration manifest, schema SQL, CMS decision ADR, design tokens, transformation rules.
**✋ HUMAN GATE:** Review all outputs. Approve schema and CMS decision before proceeding. This is the most important gate — everything downstream depends on these decisions being right.

### Phase 2 — Build the Agentic Pipeline (Epic 3)

**Execute:** Build the orchestrator, token tracker, decision logger, and checkpoint system.
**Deliver:** Working orchestrator script that can be started, stopped, and resumed.
**Test:** Run orchestrator on 3 sample topics end-to-end (analyze → generate → load → validate).
**✋ HUMAN GATE:** Review the 3 sample topics for quality. Review the cost report. Approve before batch run.

### Phase 3 — Content Migration (Epic 4)

**Execute:** Run the full content pipeline via the orchestrator.
**Deliver:** All content in Supabase, QA report, cost report.
**✋ HUMAN GATE:** Review QA report. Spot-check 5-10 generated topics. Approve before UI build.

### Phase 4 — Design System & UI (Epics 5-6)

**Execute:** Build design system components, then wire up pages and routes.
**Deliver:** Functional topic browsing, reading, and navigation in the Next.js app.
**Test:** All routes render, navigation works, existing blog still functions.
**✋ HUMAN GATE:** Visual review of the UI. Approve before deployment prep.

### Phase 5 — Polish & Deploy (Epics 7-9)

**Execute:** Interview questions UI, SEO setup, Vercel deployment.
**Deliver:** Production-ready platform.
**Final Output:** Complete migration retrospective with cost breakdown, quality metrics, and learnings document for the agentic SDLC case study.

---

## ━━━ PART 6: CONSTRAINTS & PRINCIPLES ━━━

1. **Idempotent.** Running any script/agent twice must not create duplicates. Use `ON CONFLICT` / upserts everywhere.
2. **Don't break the blog.** Existing posts, categories, auth, and routes must keep working. All changes are additive.
3. **Observable.** Every LLM call logged. Every decision logged with reasoning. Every file processing step in checkpoint. No black boxes.
4. **Resumable.** Stop at end-of-day, continue tomorrow with zero context loss. Checkpoint after every completed task.
5. **Human-in-the-loop.** Stop at marked gates. Agents propose, humans approve. No auto-proceeding past quality gates.
6. **Quality over speed.** Use the best model for each task. Spend more on content quality — this is a product users will pay for.
7. **Learning-first.** Every agent decision should be logged and reviewable so the developer learns the agentic patterns, not just gets the output.
8. **Self-documenting.** The agentic system produces its own documentation: ADRs, decision logs, cost reports, QA reports. At the end, the process itself is a presentable case study.
