# File Strategy, Model Selection & Discrepancy Fixes

---

## 1. Discrepancies Found — Resolve Before Starting

Reading your actual project files surfaced contradictions with what you told me earlier. These need to be settled first because they affect the entire prompt.

| Item | You Said Earlier | Your Actual Project Files Say | Impact |
|------|-----------------|-------------------------------|--------|
| **Auth provider** | Supabase Auth | **Clerk** (middleware.ts, env vars, CLAUDE.md all reference Clerk) | Schema migration changes — RLS policies need to work with Clerk user IDs, not Supabase Auth UIDs |
| **Next.js version** | 16.1.1 | **14** (copilot-instructions.md says "Next.js 14") | May affect which features are available (Server Actions, PPR, etc.) — check your `package.json` for the real version |
| **State management** | Not mentioned | **React Query / TanStack Query** (already set up with hooks pattern) | Good news — we build on this, not replace it |
| **Markdown rendering** | Not mentioned | **Marked + Highlight.js** (already in the project) | No need to add MDX from scratch — evaluate if Marked is sufficient for topic content |
| **OpenAI** | Claude only | **OPENAI_API_KEY in env** | You already have OpenAI wired up — could use for cheaper bulk tasks if needed |

**Action needed from you:**
1. Check `package.json` — what's the actual Next.js version?
2. Confirm: Auth is Clerk, right? (Your earlier answer said Supabase Auth)
3. Is the OpenAI integration active or just a leftover env var?

---

## 2. File Strategy — Merge, Don't Replace

You have 4 instruction files. Here's what to do with each:

### Files to KEEP and EVOLVE

**`CLAUDE.md`** — This is your primary file. It's already well-structured. We ADD migration context to it, not rewrite it.

**`AGENT_INSTRUCTIONS.md`** — Good general coding standards. Post-migration, we UPDATE it to include new patterns (topic queries, learning paths, content components). The existing patterns stay because the blog still exists.

### Files to DEPRECATE (after migration)

**`copilot-instructions.md`** — 90% overlaps with CLAUDE.md and AGENT_INSTRUCTIONS.md. After migration, consolidate into CLAUDE.md. No need for a separate Copilot file if you're using Claude Code as your primary agent.

**`AI_PROMPTS.md`** — These are prompt templates for manual use. Once you have proper `.claude/skills/` and `.claude/agents/`, the skills replace this file. The agent knows what to do from its skill definition, you don't need to copy-paste prompts.

### Files to CREATE (for the migration)

```
.claude/
├── skills/
│   ├── content-analyzer/SKILL.md
│   ├── content-generator/SKILL.md
│   ├── migration-loader/SKILL.md
│   ├── qa-validator/SKILL.md
│   └── design-system/SKILL.md
├── agents/
│   ├── orchestrator.agent.md
│   ├── research.agent.md
│   └── architect.agent.md
└── rules/
    └── migration-rules.md

docs/
├── migration-prompt-full.md        ← The v3 prompt (reference spec)
├── backlog.md
├── schema-migration.sql
├── adr/
└── reports/

scripts/
└── migration/
    ├── orchestrator.ts
    ├── analyzer.ts
    ├── generator.ts
    ├── loader.ts
    └── cost-tracker.ts
```

---

## 3. Updated CLAUDE.md — Before vs After

Here's how your CLAUDE.md should evolve. The key principle: **everything below the existing content is new, everything above stays.**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (also runs TypeScript check)
npm run type-check   # TypeScript only (tsc --noEmit)
npm run lint         # ESLint on src/
npm run lint:fix     # ESLint with auto-fix
npm run check        # type-check + lint together
npm test             # Run tests with Vitest
npm run test:watch   # Watch mode
npm run test:coverage

# Migration pipeline (added for interview-prep migration)
npx ts-node scripts/migration/orchestrator.ts       # Run full pipeline
npx ts-node scripts/migration/orchestrator.ts --dry  # Dry run (no writes)
```              ↑ NEW

... [ALL EXISTING SECTIONS STAY AS-IS] ...

## Key Files

| Path | Purpose |
|------|---------|
| `src/lib/supabase/queries.ts` | All public read queries |
| `src/lib/supabase/admin-queries.ts` | All admin write operations |
| `src/types/index.ts` | All TypeScript types |
| `src/middleware.ts` | Clerk route protection config |
| `src/components/dynamic/index.tsx` | Lazily loaded heavy components |
| `tests/setup.ts` | Vitest global setup |
| `src/lib/supabase/topic-queries.ts` | Topic/learning path queries |        ← NEW
| `src/hooks/useTopics.ts` | React Query hooks for topics |                   ← NEW
| `src/components/topics/` | Topic UI components |                             ← NEW
| `scripts/migration/` | Migration pipeline scripts |                          ← NEW
| `docs/migration-prompt-full.md` | Complete migration specification |         ← NEW

## Interview Prep Platform (Migration Context)                                 ← NEW SECTION

### What This Is
We're migrating a Svelte interview-prep app (~300-400 files, 13 categories)
into this blog as a connected learning platform. The blog keeps working as-is.
All new functionality is additive.

### Source Project
Location: C:\personal projects\Bench-interview-preparation\
Key content: app/static/content/ (13 category folders, ~80 topics)
Each topic: notes.md, example.js, assessment.html, flashcards.csv

### New Tables (alongside existing posts/videos/projects)
- `topic_categories` — category groupings (js-core, react-hooks, etc.)
- `topics` — individual topics with ordering and difficulty
- `topic_content` — content bodies (notes, examples, assessments, flashcards)
- `learning_paths` + `learning_path_topics` — ordered study sequences
- `topic_relations` — prerequisite/related links between topics
- `interview_questions` + `company_questions` — interview intelligence
- `user_topic_progress` — per-user progress tracking
- `agent_sessions` + `agent_cost_log` + `agent_decisions` — agentic system observability

### New Routes
- `/topics` — category grid
- `/topics/[category-slug]` — topics in a category
- `/topics/[category-slug]/[topic-slug]` — topic detail with tabbed content
- `/paths/[path-slug]` — learning path view

### New Query Pattern
Topic reads follow the same pattern as blog reads:
- `lib/supabase/topic-queries.ts` for all topic data fetching
- `hooks/useTopics.ts` wraps with React Query
- Server components call topic-queries directly
- Keys: `['topics', ...params]`, `['topic-content', topicId, type]`

### Critical Migration Rules
- NEVER modify existing blog functionality
- All inserts use ON CONFLICT / upserts
- All generated content marked with is_ai_generated: true
- Every LLM call logged to agent_cost_log table
- Read docs/migration-prompt-full.md for the complete specification

### Current Phase
> UPDATE THIS AFTER EVERY SESSION
Phase: NOT STARTED
Current Epic: —
Current US: —
Last completed: —
Next action: Set up .claude/ skills and agents, then start Research phase
```

### Post-Migration CLAUDE.md

Once migration is complete, you:
1. Remove the "Current Phase" tracking section (no longer needed)
2. Keep the "Interview Prep Platform" section (it's now permanent architecture docs)
3. Update AGENT_INSTRUCTIONS.md to include new patterns:
   - How to add a new topic
   - How to add interview questions
   - How to create a new learning path
   - Topic component patterns
4. Delete AI_PROMPTS.md (replaced by .claude/skills/)
5. Delete copilot-instructions.md (consolidated into CLAUDE.md)

---

## 4. Model Selection Matrix — Right Model for Right Job

### The Decision Framework

```
Is it THINKING work (planning, architecture, quality judgment, complex reasoning)?
  → Use Opus

Is it PRODUCING work (generating content, writing code, transforming data)?
  → Use Sonnet

Is it CLASSIFYING work (sorting files, extracting metadata, pattern matching)?
  → Use Haiku first. If accuracy drops, upgrade to Sonnet.

Is it MECHANICAL work (parsing, validating, formatting)?
  → Use code/heuristics. No LLM needed.
```

### Complete Task-to-Model Mapping

#### Research & Discovery Phase

| Task | Model | Why | Est. Cost |
|------|-------|-----|-----------|
| Inventory Svelte files (read & list) | **No LLM** — script | File walking is I/O, not intelligence | $0 |
| Classify files as complete vs placeholder | **Haiku** for ambiguous cases, heuristics for obvious ones | 80% of files can be classified by word count / TODO markers alone. Haiku handles the 20% edge cases. | ~$0.15 |
| Analyze Svelte component logic | **Sonnet** | Needs to understand code patterns but not make architectural decisions | ~$0.50 |
| Research competitor UX (web search + synthesis) | **Opus** | Synthesis of multiple sources into actionable patterns requires deep reasoning | ~$2.00 |
| Write research report | **Opus** | Report needs to be comprehensive and well-structured | ~$1.50 |

#### Architecture & Decisions Phase

| Task | Model | Why | Est. Cost |
|------|-------|-----|-----------|
| CMS evaluation & recommendation | **Opus** | Trade-off analysis with multiple competing criteria | ~$2.00 |
| Schema design | **Opus** | Relational modeling needs careful reasoning about joins, constraints, future needs | ~$1.50 |
| Design token definition | **Sonnet** | Creative but bounded — typography/color/spacing within known patterns | ~$0.75 |
| Write ADRs | **Opus** | Decision records need rigorous reasoning documentation | ~$1.00 |
| Define transformation rules | **Sonnet** | Pattern matching: source format → target format | ~$0.50 |

#### Content Generation Phase (the big spend)

| Task | Model | Why | Est. Cost |
|------|-------|-----|-----------|
| Generate `notes.md` (explanations) | **Opus** | Technical accuracy and depth matter most here. This is what users read and pay for. Wrong info = unusable product. | ~$0.40/topic |
| Generate `example.js` (code) | **Sonnet** | Code generation is Sonnet's sweet spot. Opus is overkill for writing 3-5 JS functions. | ~$0.15/topic |
| Generate `assessment.html` (quizzes) | **Sonnet** | Structured output (MCQs in HTML format). Sonnet handles templates well. | ~$0.12/topic |
| Generate `flashcards.csv` (Q&A) | **Sonnet** | Factual Q&A pairs. Straightforward generation. | ~$0.08/topic |
| Generate interview questions | **Opus** | Interview questions need nuance — not just "what is X?" but scenario-based, debugging, system design. | ~$0.20/topic |
| Detect topic relationships | **Sonnet** | Cross-referencing content to find prerequisites/related. Pattern matching across known topics. | ~$0.30 total |

**Content generation cost estimate for ~80 placeholder topics:**
- Notes (Opus): 80 × $0.40 = ~$32
- Examples (Sonnet): 80 × $0.15 = ~$12
- Assessments (Sonnet): 80 × $0.12 = ~$10
- Flashcards (Sonnet): 80 × $0.08 = ~$6
- Interview Qs (Opus): 80 × $0.20 = ~$16
- **Subtotal: ~$76**

#### QA Phase

| Task | Model | Why | Est. Cost |
|------|-------|-----|-----------|
| Validate data integrity | **No LLM** — script | Check for null fields, valid JSON, row counts. Pure code. | $0 |
| Score content quality | **Opus** | Needs to judge: is this technically accurate? Is it deep enough? Is the code correct? Judgment task = Opus. | ~$0.25/topic |
| Review generated code for patterns | **Sonnet** | Pattern compliance checking. "Does this follow our query pattern?" | ~$0.10/topic |

**QA cost for ~80 topics:**
- Quality scoring (Opus): 80 × $0.25 = ~$20
- Code review (Sonnet): 80 × $0.10 = ~$8
- **Subtotal: ~$28**

#### UI Build Phase

| Task | Model | Why | Est. Cost |
|------|-------|-----|-----------|
| Build design system components | **Sonnet** | React component generation. Well-trodden territory for Sonnet. | ~$3.00 |
| Build page routes & layouts | **Sonnet** | Server component + data fetching patterns. Sonnet's bread and butter. | ~$2.00 |
| Flashcard animation component | **Opus** | Animation logic with Framer Motion needs careful state management. One complex component. | ~$1.00 |
| Wire up Supabase queries | **Sonnet** | Following the existing query pattern in the project. Repetitive. | ~$1.50 |
| Build learning path UI | **Sonnet** | Component composition, not novel architecture. | ~$1.00 |

**UI build subtotal: ~$8.50**

#### Deployment Phase

| Task | Model | Why | Est. Cost |
|------|-------|-----|-----------|
| Vercel config + env setup | **No LLM** — manual | Copy env vars, set build command. 2 minutes of human work. | $0 |
| Pre-deploy validation | **Sonnet** | Run through a checklist. Structured verification. | ~$0.50 |
| SEO setup (meta, sitemap, OG) | **Sonnet** | Template-based. Follow Next.js metadata API patterns. | ~$1.00 |

### Cost Summary by Phase

| Phase | Opus | Sonnet | Haiku | No LLM | Total |
|-------|------|--------|-------|--------|-------|
| Research & Discovery | $3.50 | $0.50 | $0.15 | $0 | ~$4.15 |
| Architecture | $4.50 | $1.25 | — | — | ~$5.75 |
| Content Generation | $48.00 | $28.00 | — | — | ~$76.00 |
| QA | $20.00 | $8.00 | — | $0 | ~$28.00 |
| UI Build | $1.00 | $7.50 | — | — | ~$8.50 |
| Deployment | — | $1.50 | — | $0 | ~$1.50 |
| Orchestration overhead | $5.00 | — | — | — | ~$5.00 |
| **TOTAL** | **$82.00** | **$46.75** | **$0.15** | **$0** | **~$129** |

### Cost-Saving Options (if you want to optimize)

| Optimization | Savings | Trade-off |
|-------------|---------|-----------|
| Use Sonnet for notes.md instead of Opus | ~$20 saved | Slightly less nuanced explanations. Still good, not great. |
| Use Anthropic Batch API (50% discount on all calls) | ~$64 saved | Async processing — results in hours, not real-time. Perfect for content generation. |
| Use Haiku for flashcard generation | ~$4 saved | Minimal quality difference for simple Q&A pairs. |
| Skip QA quality scoring (manual spot-check instead) | ~$20 saved | More human review time, less systematic coverage. |
| **If you apply Batch API to content gen + QA** | **~$52 saved** | **Total drops to ~$77.** Best bang for buck. |

### How to Specify Models in Agent/Skill Files

In your `.claude/skills/` and `.claude/agents/`, specify the model in the YAML frontmatter:

```markdown
---
name: content-generator-notes
description: Generate topic explanation notes (notes.md) for interview prep topics
model: claude-opus-4-6
---
```

```markdown
---
name: content-generator-examples
description: Generate code examples (example.js) for interview prep topics
model: claude-sonnet-4-6
---
```

For the orchestrator script that calls the Anthropic API directly:

```typescript
// scripts/migration/generator.ts
const MODEL_MAP = {
  notes: 'claude-opus-4-6',        // Technical accuracy matters most
  examples: 'claude-sonnet-4-6',   // Code gen is Sonnet's sweet spot
  assessments: 'claude-sonnet-4-6',// Structured output
  flashcards: 'claude-sonnet-4-6', // Simple Q&A
  interviewQs: 'claude-opus-4-6',  // Nuanced scenario questions
  quality: 'claude-opus-4-6',      // Judgment calls need Opus
  classify: 'claude-haiku-4-5-20251001', // Simple classification
} as const;
```

---

## 5. Revised Agent Skill Files (with model specified)

### `.claude/skills/content-analyzer/SKILL.md`

```markdown
---
name: content-analyzer
description: >
  Analyze and classify source files from the Svelte interview-prep project.
  Determines if files contain real content or are placeholders.
  Use when inventorying the source project or checking migration readiness.
model: claude-haiku-4-5-20251001
---

# Content Analyzer

## When to Use
- Inventorying the Svelte source project
- Classifying files as complete vs placeholder
- Extracting topic metadata

## Process

### Step 1: Heuristic Classification (no LLM)
Apply these rules FIRST. Only call LLM for ambiguous cases.

| File Type | Complete If | Placeholder If |
|-----------|-----------|----------------|
| `.md` | >200 words AND no TODO/placeholder markers AND has ≥2 headings | <100 words OR contains "TODO", "PLACEHOLDER", "TBD", "Coming soon" |
| `.js` | >5 function/const declarations with actual logic | Only skeleton/empty functions, <20 lines |
| `.csv` | >3 data rows with non-empty answer column | ≤2 rows OR empty answer fields |
| `.html` | >3 question elements with actual content | Template-only, <50 lines, no real questions |

### Step 2: LLM Classification (ambiguous only)
Files between the clear thresholds (e.g., 100-200 words for .md) get sent
to Haiku with this prompt:

"Classify this file as COMPLETE or PLACEHOLDER. A complete file has real,
useful educational content. A placeholder has template text, TODOs, or
minimal content that needs to be replaced. Respond with only: COMPLETE or PLACEHOLDER"

### Output Format
Append to migration-manifest.json:
{
  "path": "static/content/js-core/closures/notes.md",
  "category": "js-core",
  "topic": "closures",
  "fileType": "notes",
  "classification": "complete",
  "classifiedBy": "heuristic",  // or "haiku"
  "wordCount": 847,
  "metadata": { "headings": 5, "codeBlocks": 3 }
}
```

### `.claude/skills/content-generator/SKILL.md`

```markdown
---
name: content-generator
description: >
  Generate production-quality educational content for interview prep topics.
  Handles notes, code examples, assessments, flashcards, and interview questions.
  Use when filling placeholder files with real content during migration.
model: claude-opus-4-6
---

# Content Generator

## Model Selection Per Content Type
- notes.md → claude-opus-4-6 (accuracy and depth critical)
- example.js → claude-sonnet-4-6 (code gen sweet spot)
- assessment.html → claude-sonnet-4-6 (structured output)
- flashcards.csv → claude-sonnet-4-6 (simple Q&A)
- interview questions → claude-opus-4-6 (nuanced scenarios)

## When to Use
- Processing placeholder files from the migration manifest
- Generating any of the 5 content types for a topic

## Process
1. Load 2-3 COMPLETE reference files of the SAME TYPE from the SAME CATEGORY
   (these are the style/depth exemplars)
2. Read the topic name, category context, and any partial content that exists
3. Generate content matching the reference style and depth
4. Store generation metadata: { model, inputTokens, outputTokens, promptVersion, timestamp }

## Output Standards

### notes.md (use Opus)
- 800-1500 words
- Structure: Introduction → Core Concept → How It Works → Code Examples → Common Pitfalls → Interview Angle → Key Takeaways
- Include 2-3 inline code snippets
- Real-world use cases, not just theory
- Mention edge cases and gotchas interviewers love to ask about

### example.js (use Sonnet)
- 3-5 standalone, runnable code examples
- Each example has a comment header explaining what it demonstrates
- Progress from basic to advanced
- Include console.log outputs so the reader can predict results
- No external dependencies

### assessment.html (use Sonnet)
- 5-8 multiple-choice questions
- Use the shared assessment.css and assessment.js from static/content/shared/
- Each question has 4 options, 1 correct
- Include an explanation for the correct answer
- Mix difficulty: 2 easy, 3-4 medium, 1-2 hard

### flashcards.csv (use Sonnet)
- Format: question,answer
- 10-15 Q&A pairs
- Mix of definition, concept, code-output, and scenario questions
- Answers should be 1-3 sentences (not just "yes/no")

### Interview Questions (use Opus)
- 3-5 questions per topic
- Mix of types: conceptual, code-based, scenario, debugging
- Include expected answer points (not full answers)
- Tag difficulty: easy, medium, hard

## Quality Checks (self-validate before output)
- [ ] No hallucinated APIs, methods, or browser features
- [ ] Code is syntactically correct (would not throw on parse)
- [ ] Explanations are technically accurate for the topic
- [ ] Flashcard answers are complete (never just "True" or "Yes")
- [ ] Assessment correct answers are actually correct
```

### `.claude/agents/orchestrator.agent.md`

```markdown
---
name: orchestrator
description: >
  Main migration orchestrator. Manages the full SDLC pipeline: reads the backlog,
  delegates to appropriate skills, tracks progress via checkpoints, and produces
  cost reports. Use when running or continuing the migration pipeline.
model: claude-opus-4-6
---

# Orchestrator Agent

## Your Role
You are the migration orchestrator for the NNBlogs interview-prep platform.
You manage the full pipeline from research through deployment.

## Before Every Session
1. Read CLAUDE.md for project context and current phase
2. Read docs/migration-prompt-full.md for the complete specification
3. Read docs/backlog.md for task status
4. Read the latest file in docs/reports/session-reports/ for continuity
5. If scripts/migration/ exists, check the checkpoint state

## Decision Framework
1. Identify current phase from CLAUDE.md
2. Find the next highest-priority unblocked task in docs/backlog.md
3. Choose the right skill for the task
4. If a human gate is reached → STOP, present findings, ask for approval
5. Log every decision to docs/reports/decisions.jsonl

## Human Gates (MUST STOP)
These are non-negotiable pause points:
1. ✋ After CMS recommendation (docs/adr/001-cms-decision.md)
2. ✋ After schema design (docs/schema-migration.sql)
3. ✋ After first 3 generated topics (quality gate)
4. ✋ After full migration QA report
5. ✋ After design system tokens review

## Session End Checklist
Before ending any session:
1. Update CLAUDE.md "Current Phase" section with what was done and what's next
2. Write session report to docs/reports/session-reports/YYYY-MM-DD.md
3. Update docs/backlog.md — mark completed items, add notes to in-progress
4. If running the pipeline script, ensure checkpoint is saved
5. Summarize cost for the session

## Error Handling
- If a content generation fails → log the error, skip the file, continue
- If a Supabase insert fails → check constraint violation, fix, retry once
- If quality score < 0.7 → flag for human review, don't auto-publish
- If budget concern → report to human, suggest Batch API or model downgrade
```

---

## 6. The Complete File Lifecycle

### Phase: BEFORE Migration (now)

```
KEEP AS-IS:
  CLAUDE.md                      ← Add migration section at the bottom
  AGENT_INSTRUCTIONS.md          ← No changes yet

CREATE NEW:
  .claude/skills/                ← 5 skill files
  .claude/agents/                ← 3 agent files
  .claude/rules/migration-rules.md
  docs/migration-prompt-full.md  ← The full v3 prompt
  docs/backlog.md                ← Agile backlog from the prompt

NO LONGER NEEDED (but don't delete yet):
  AI_PROMPTS.md                  ← Skills replace this
  copilot-instructions.md        ← CLAUDE.md supersedes this
```

### Phase: DURING Migration

```
ACTIVELY UPDATED EVERY SESSION:
  CLAUDE.md                      ← "Current Phase" section
  docs/backlog.md                ← Task completion tracking
  docs/reports/session-reports/  ← New report each session
  docs/reports/decisions.jsonl   ← Agent decision log
```

### Phase: AFTER Migration (done)

```
UPDATE:
  CLAUDE.md                      ← Remove "Current Phase" tracking
                                   Keep "Interview Prep Platform" section permanently
                                   Add new routes, query patterns, component patterns

  AGENT_INSTRUCTIONS.md          ← Add sections:
                                   - "Adding a New Topic"
                                   - "Adding Interview Questions"
                                   - "Creating a Learning Path"
                                   - "Topic Component Patterns"
                                   - "Topic Query Patterns"

DELETE:
  AI_PROMPTS.md                  ← Replaced by .claude/skills/
  copilot-instructions.md        ← Consolidated into CLAUDE.md

ARCHIVE (move to docs/archive/):
  docs/migration-prompt-full.md  ← Historical reference
  docs/reports/                  ← Historical reference
  .claude/skills/content-*       ← Migration-specific skills no longer needed
  .claude/agents/orchestrator.*  ← Migration orchestrator no longer needed
  scripts/migration/             ← Pipeline scripts no longer needed

KEEP:
  .claude/skills/design-system/  ← Still useful for future UI work
  .claude/skills/qa-validator/   ← Adapt for ongoing content QA
  .claude/rules/migration-rules.md → rename to content-rules.md (general content standards)
  docs/adr/                      ← Architecture decisions are permanent documentation
```
