# How to Use This Prompt — Practical Execution Guide

## The Tool: Claude Code (not claude.ai)

Your 800-line prompt is too large and too implementation-heavy for the chat interface. The right tool is **Claude Code** — Anthropic's terminal-based coding agent that can read your files, edit code, run commands, and manage git directly.

**Install:**

```bash
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Then in any terminal
claude
```

> Requires a Claude Pro ($20/month) or higher plan. Claude Code is not available on the free tier.

---

## Don't Paste the Full Prompt — Split It

The 800-line prompt is a **reference document**, not something you paste into a chat box. Claude Code uses a file hierarchy to load context automatically. Here's exactly how to set it up in your Next.js project:

### File Structure to Create

```
your-nextjs-blog/
├── CLAUDE.md                          ← Project context (loaded every session)
├── .claude/
│   ├── rules/
│   │   └── migration-rules.md         ← Constraints & principles
│   ├── skills/
│   │   ├── content-analyzer/
│   │   │   └── SKILL.md               ← Analyzer agent behavior
│   │   ├── content-generator/
│   │   │   └── SKILL.md               ← Generator agent behavior
│   │   ├── migration-loader/
│   │   │   └── SKILL.md               ← Transform & load behavior
│   │   ├── qa-validator/
│   │   │   └── SKILL.md               ← QA agent behavior
│   │   └── design-system/
│   │       └── SKILL.md               ← Design system agent behavior
│   └── agents/
│       ├── orchestrator.agent.md       ← Main orchestrator agent
│       ├── research.agent.md           ← Research phase agent
│       └── architect.agent.md          ← Architecture phase agent
├── docs/
│   ├── improved-prompt-v3-final.md        ← THE FULL 800-LINE PROMPT (reference)
│   ├── backlog.md                      ← Agile backlog (Epics, US, Tasks)
│   ├── schema-design.md               ← Target schema (from Part 2, Obj 1)
│   ├── adr/                            ← Architecture Decision Records
│   │   └── (generated during execution)
│   └── reports/
│       ├── research-report.md
│       ├── migration-manifest.json
│       └── session-reports/
├── scripts/
│   └── migration/
│       ├── orchestrator.ts             ← Main pipeline script
│       ├── analyzer.ts
│       ├── generator.ts
│       ├── loader.ts
│       └── cost-tracker.ts
└── ... (your existing Next.js files)
```

---

## What Goes Where — The Split

### 1. `CLAUDE.md` (Root — loaded every session, keep under 150 lines)

This is what Claude reads FIRST, every session. It should be concise project context, NOT the full prompt.

```markdown
# NNBlogs — Interview Prep Platform Migration

## Project Summary

Migrating a Svelte interview-prep app (~300-400 files, 13 categories) into this
existing Next.js 16.1.1 blog platform. The blog already works (auth, posts, Supabase).
We're ADDING a connected learning platform alongside it.

## Tech Stack

- Next.js 16.1.1, App Router, TypeScript
- Supabase (Auth + Postgres DB)
- Deploying to Vercel
- Styling: [your current setup — Tailwind, CSS modules, etc.]

## Source Project Location

The Svelte source files are at: C:\personal projects\Bench-interview-preparation\
Key content directory: app/static/content/ (13 category folders, ~80 topics)
Each topic has: notes.md, example.js, assessment.html, flashcards.csv

## Critical Rules

- NEVER modify existing blog functionality (posts, categories, auth, routes)
- All new tables are ADDITIVE to the existing schema
- All DB inserts must use ON CONFLICT / upserts (idempotent)
- Check docs/improved-prompt-v3-final.md for the complete project specification
- Check docs/backlog.md for the current agile backlog and task status
- Check docs/reports/ for research findings and session reports

## Current Phase

> UPDATE THIS AFTER EACH SESSION
> Phase: [Research / Architecture / Implementation / QA / Deployment]
> Current Epic: [e.g., "Epic 4 — Content Migration"]
> Current US: [e.g., "US-4.1 — Content Generation"]
> Last completed: [e.g., "Generated 47/82 placeholder topics"]
> Next action: [e.g., "Continue content generation from react-hooks/use-callback"]

## Key Commands

- `npm run dev` — Start dev server
- `npx supabase db push` — Push schema changes
- `npx ts-node scripts/migration/orchestrator.ts` — Run migration pipeline
```

### 2. `.claude/rules/migration-rules.md` (Auto-loaded constraints)

```markdown
# Migration Constraints

- Every LLM call must be logged with: agent name, task ID, model, tokens, estimated cost
- Every agent decision must be logged with reasoning
- Checkpoint state after every completed task
- Generated content must be marked with is_ai_generated: true
- Quality score every generated file (0-1 scale)
- Stop and ask for human approval at these gates:
  1. After CMS recommendation
  2. After schema design
  3. After first 3 generated topics (quality check)
  4. After full migration validation
  5. After design system tokens
```

### 3. `.claude/skills/content-generator/SKILL.md` (Example skill)

```markdown
---
name: content-generator
description: >
  Generate production-quality educational content for interview prep topics.
  Use when filling placeholder files with real content: notes, code examples,
  assessments, and flashcards.
---

# Content Generator

## When to Use

- Processing placeholder files from the Svelte migration
- Generating notes.md, example.js, assessment.html, or flashcards.csv

## Process

1. Load 2-3 COMPLETE reference files of the same type from the same category
2. Read the topic name and category context
3. Generate content matching the reference style and depth
4. Store generation metadata (model, tokens, prompt hash)

## Output Standards

- notes.md: 800-1500 words, real-world examples, gotchas, code snippets
- example.js: 3-5 runnable, commented code examples
- assessment.html: 5-8 MCQs using shared assessment.css/js patterns
- flashcards.csv: 10-15 Q&A pairs, varying difficulty
- Also generate 3-5 interview questions per topic

## Quality Bar

- No hallucinated APIs or methods
- Code must be syntactically correct and runnable
- Explanations must be technically accurate
- Flashcard answers must be complete (not just "yes/no")
```

### 4. `.claude/agents/orchestrator.agent.md` (Example agent)

```markdown
---
name: orchestrator
description: >
  Main migration orchestrator. Manages the full pipeline: reads the backlog,
  delegates to skills, tracks progress, produces cost reports.
---

# Orchestrator Agent

## Your Role

You are the migration orchestrator. You manage the full SDLC pipeline for
migrating the Svelte interview-prep app into this Next.js blog.

## Before Each Session

1. Read docs/improved-prompt-v3-final.md for the full specification
2. Read docs/backlog.md for the current backlog state
3. Read the CLAUDE.md "Current Phase" section
4. Read the latest checkpoint from docs/reports/

## Decision Framework

- Pick the next highest-priority unblocked task from the backlog
- Choose the right skill/approach for the task
- If a human gate is reached, STOP and present findings for review
- Log every decision with reasoning

## After Each Session

1. Update CLAUDE.md "Current Phase" section
2. Write a session report to docs/reports/session-reports/
3. Update docs/backlog.md with completed items
```

---

## Session-by-Session Workflow

### Session 1 — Setup & Research

**What to do:**

```bash
cd "C:\path\to\your-nextjs-blog"
claude
```

**What to say:**

```
Read docs/improved-prompt-v3-final.md — that's the complete project specification.

Then read the Svelte source at C:\personal projects\Bench-interview-preparation\
Focus on app/static/content/ — inventory every folder and file.

For each topic folder, classify the files as complete (real content) or
placeholder (template/TODO). Use these heuristics:
- .md: complete if >200 words with no TODO markers
- .js: complete if >5 functions with real logic
- .csv: complete if >3 rows with non-empty answers
- .html: complete if >3 questions with actual content

Output:
1. docs/reports/migration-manifest.json — every file with classification
2. docs/reports/research-report.md — findings, gap analysis, risks
3. Update CLAUDE.md "Current Phase" section
```

**Why this works:** You're giving Claude Code a specific, bounded task. It reads the full spec from disk (not your context window), does the file analysis, and produces traceable outputs.

### Session 2 — Architecture Decisions

```
Read the research report from yesterday: docs/reports/research-report.md
Read the full spec: docs/improved-prompt-v3-final.md (Part 2, Objectives 1 and 5)

Now:
1. Evaluate the CMS options from the spec. Recommend one. Write the ADR to docs/adr/001-cms-decision.md
2. Finalize the Supabase schema. Write the migration SQL to docs/schema-migration.sql
3. Define design tokens based on competitor research. Write to docs/design-tokens.json

I need to review and approve all three before we proceed to implementation.
```

### Session 3 — Build the Pipeline

```
Read the approved schema from docs/schema-migration.sql
Read docs/improved-prompt-v3-final.md Part 3 (Agentic System Design)

Build the migration pipeline scripts:
1. scripts/migration/cost-tracker.ts — wraps Anthropic API calls, logs to cost-log.jsonl
2. scripts/migration/analyzer.ts — reads manifest, prepares batches
3. scripts/migration/generator.ts — generates content for placeholders using Claude API
4. scripts/migration/loader.ts — transforms and inserts into Supabase
5. scripts/migration/orchestrator.ts — runs the full pipeline with checkpointing

Test on 3 topics from js-core category. I'll review the output quality.
```

### Session 4+ — Batch Execution

```
Read the checkpoint from the last session.
Continue the content generation pipeline from where we left off.
Process the next batch of placeholder topics.
Write a session report when done.
```

**This is where resumability matters.** Because the orchestrator writes checkpoints, and CLAUDE.md has the "Current Phase" section, Claude Code picks up exactly where you left off even if it's a completely new session the next day.

---

## Key Principles for Effective Prompting Across Sessions

### 1. Always point to files, don't re-explain

```
# BAD — wastes context, risks drift from the spec
"Remember, we're migrating a Svelte app with 13 categories and each topic
has notes.md, example.js, assessment.html..."

# GOOD — Claude reads the source of truth
"Read docs/improved-prompt-v3-final.md for context, then continue from
the checkpoint."
```

### 2. One bounded task per session

Don't say "do the whole migration." Say "generate content for the async-js category" or "build the TopicCard and CodeBlock components." Bounded tasks produce better output and cleaner checkpoints.

### 3. Update CLAUDE.md after every session

The "Current Phase" section in CLAUDE.md is your handoff note to tomorrow's session. Spend 30 seconds updating it. This is the single biggest thing that makes multi-day agentic work actually work.

### 4. Review at gates, not constantly

The prompt has 5 human gates. Between gates, let the agent run. Don't micromanage every file — review the QA report instead. That's the agentic pattern: delegate with clear criteria, verify at checkpoints.

### 5. Use sub-agents for isolated work

When Claude Code spawns a sub-agent (e.g., for generating a single topic), it gets its own context window. This prevents your main session from bloating. Especially useful during the batch content generation phase.

---

## Quick Reference: What to Do When

| Situation                          | Action                                                          |
| ---------------------------------- | --------------------------------------------------------------- |
| Starting a brand new session       | `claude` → it auto-reads CLAUDE.md → point it to the checkpoint |
| Context window getting full        | `/clear` to reset, then re-read CLAUDE.md + checkpoint          |
| Need to change the plan            | Edit docs/backlog.md and CLAUDE.md, then tell Claude to re-read |
| Agent makes a bad decision         | Edit the relevant skill/agent .md to add a constraint           |
| Quality issue in generated content | Add the failing pattern to `.claude/rules/migration-rules.md`   |
| Want to re-run a specific topic    | Edit the checkpoint JSON to mark that topic as incomplete       |
| Session ended unexpectedly         | Just start a new session — checkpoint has the state             |
| Ready for the next phase           | Update CLAUDE.md "Current Phase", start new session             |

---

## The Learning Framing

As you go through each session, you're learning these agentic patterns:

- **Session 1-2 (Research/Architecture):** How agents do discovery — structured exploration, not assumptions. The agent reads the full codebase before making any decisions.
- **Session 3 (Pipeline Build):** How to build infrastructure that makes agents reliable — checkpointing, cost tracking, decision logging. The boring plumbing that separates production agents from demos.
- **Session 4+ (Batch Execution):** How agents handle repetitive work at scale — batching, quality scoring, error recovery. And how humans supervise: reviewing reports, not watching every keystroke.
- **Final sessions (QA/Deploy):** How agents validate their own output — self-critique, structured testing, regression checks.

By the end, you'll have both the migrated platform AND a documented case study of agentic SDLC that you can present.
