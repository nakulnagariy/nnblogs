# Bridging This Chat → Claude Code

## The Reality

Claude.ai (this chat) and Claude Code (terminal agent) are **completely separate**.
- They share NO conversation history
- They share NO memory
- Claude Code cannot "see" what we discussed here

Claude Code's ONLY context comes from:
1. `CLAUDE.md` in your project root (auto-loaded every session)
2. `.claude/` folder (skills, agents, rules — loaded on demand)
3. Files you explicitly tell it to read during a session
4. What it discovers by reading your codebase

**This is actually a good thing** — it forces you to capture all decisions as files,
which is exactly how proper agentic SDLC works. No tribal knowledge, everything documented.

---

## Step-by-Step: From This Chat to Your First Claude Code Session

### Step 0 — Install Claude Code (if not already)

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

Requires Claude Pro ($20/month) or higher. Verify with:
```bash
claude --version
```

### Step 1 — Download the 3 files from this chat

Save these to your Next.js project root temporarily:
- `improved-prompt-v3-final.md`
- `usage-guide.md`
- `file-strategy-and-models.md`

### Step 2 — Set up the file structure

Run these commands from your Next.js project root:

```powershell
# Create directories
mkdir -p docs/reports/session-reports
mkdir -p docs/adr
mkdir -p .claude/skills/content-analyzer
mkdir -p .claude/skills/content-generator
mkdir -p .claude/skills/migration-loader
mkdir -p .claude/skills/qa-validator
mkdir -p .claude/skills/design-system
mkdir -p .claude/agents
mkdir -p .claude/rules
mkdir -p scripts/migration

# Move the main spec
Move-Item improved-prompt-v3-final.md docs/migration-prompt-full.md
Move-Item usage-guide.md docs/usage-guide.md
Move-Item file-strategy-and-models.md docs/file-strategy-and-models.md
```

### Step 3 — Update your existing CLAUDE.md

Open your current CLAUDE.md and **add this section at the bottom** (don't remove anything above it):

```markdown

## Interview Prep Platform Migration

### What This Is
We're migrating a Svelte interview-prep app (~300-400 files, 13 categories)
into this blog as a connected learning platform. The blog keeps working as-is.
All new functionality is additive.

### Source Project
Location: C:\personal projects\Bench-interview-preparation\
Key content: app/static/content/ (13 category folders, ~80 topics)
Each topic: notes.md, example.js, assessment.html, flashcards.csv

### Migration Specification
The COMPLETE project specification, agile backlog, agentic system design,
and model selection matrix are in: docs/migration-prompt-full.md

Read that file before starting any migration work. It contains:
- Part 1: Project context (source & target details)
- Part 2: What to build (schema, content pipeline, UI, design system)
- Part 3: Agentic system design (agents, skills, checkpoints, cost tracking)
- Part 4: Agile backlog (9 epics, 185 story points, MoSCoW prioritized)
- Part 5: Execution instructions (5 phases with human approval gates)
- Part 6: Constraints & principles

### Key Decisions Already Made
- Auth: Supabase Auth (migrated from Clerk — update middleware.ts references)
- DB: Supabase Postgres (extend existing schema, don't replace)
- Framework: Next.js 16.1.1, App Router, TypeScript
- Hosting: Vercel
- AI Models: Opus for reasoning/quality, Sonnet for code/content, Haiku for classification
- All migration work must be idempotent (ON CONFLICT / upserts)
- All generated content marked is_ai_generated: true
- All LLM calls logged with cost tracking

### Outstanding Fix
The existing project files (AGENT_INSTRUCTIONS.md, copilot-instructions.md)
still reference Clerk for auth. These are OUTDATED. Auth is Supabase Auth.
Update these files when working on auth-related features.

### Current Phase
> UPDATE THIS AFTER EVERY SESSION
Phase: NOT STARTED
Current Epic: —
Current US: —
Last completed: —
Next action: Read docs/migration-prompt-full.md, then start Epic 1 (Research & Discovery)
```

### Step 4 — Also fix the outdated auth references in existing files

In `AGENT_INSTRUCTIONS.md`, the auth section still shows Clerk:
```markdown
# OLD (wrong)
import { auth } from '@clerk/nextjs/server';

# Replace with your current Supabase Auth pattern
```

Same for `copilot-instructions.md` — update or just add a note at the top:
```markdown
> ⚠️ AUTH SECTION OUTDATED: This file references Clerk. We now use Supabase Auth.
> See CLAUDE.md for current auth patterns.
```

### Step 5 — Create the bootstrap agent file

Create `.claude/agents/orchestrator.agent.md`:

```markdown
---
name: orchestrator
description: >
  Main migration orchestrator for the interview-prep platform migration.
  Manages the full SDLC pipeline. Start here for any migration work.
model: claude-opus-4-6
---

# Orchestrator Agent

## First Session Instructions
If this is the first migration session (CLAUDE.md shows "Phase: NOT STARTED"):

1. Read the complete specification: docs/migration-prompt-full.md
2. Read the model selection guide: docs/file-strategy-and-models.md
3. Read the Svelte source structure at: C:\personal projects\Bench-interview-preparation\
4. Begin with Epic 1, US-1.1: Inventory all source files
5. Update CLAUDE.md "Current Phase" when done

## Returning Session Instructions
If resuming (CLAUDE.md shows a phase in progress):

1. Read CLAUDE.md "Current Phase" section
2. Read the latest session report in docs/reports/session-reports/
3. Continue from where the last session left off
4. Update CLAUDE.md "Current Phase" when done

## Human Gates (MUST STOP and ask for approval)
1. After CMS recommendation
2. After schema design
3. After first 3 generated topics (quality check)
4. After full migration QA report
5. After design system tokens review

## Session End Checklist
1. Update CLAUDE.md "Current Phase"
2. Write session report to docs/reports/session-reports/YYYY-MM-DD.md
3. Update docs/backlog.md with progress
```

### Step 6 — Launch Claude Code

```powershell
cd "C:\path\to\your-nextjs-blog"
claude
```

Claude Code auto-reads your CLAUDE.md. Then say:

```
Read docs/migration-prompt-full.md — that's the complete specification for a
major migration we're doing. Read the full file, understand the scope, then
start with Epic 1 (Research & Discovery).

The Svelte source project is at: C:\personal projects\Bench-interview-preparation\

Begin by inventorying the source files under app/static/content/. Classify each
as complete content vs placeholder. Output the results to docs/reports/migration-manifest.json.

Before you start, confirm you understand:
1. The project scope
2. The 5 human approval gates where you must stop
3. The model selection strategy (Opus for reasoning, Sonnet for production, Haiku for classification)
```

That's it. Claude Code now has everything from this conversation — not as memory,
but as files it reads from your project.

---

## How Every Future Session Works

### Day 2, Day 3, Day N...

```powershell
cd "C:\path\to\your-nextjs-blog"
claude
```

Claude reads CLAUDE.md automatically. It sees the "Current Phase" section
you updated at the end of yesterday's session. Then say:

```
Continue the migration from where we left off. Check the Current Phase
in CLAUDE.md and the latest session report in docs/reports/session-reports/.
```

That's the entire prompt. The files carry all the context.

### If context window fills up mid-session

```
/clear
```

This resets the conversation but CLAUDE.md is re-loaded automatically.
Then say: "Re-read CLAUDE.md and the latest session report, then continue."

### If you want to change the plan

Edit `docs/backlog.md` or `docs/migration-prompt-full.md` directly,
then tell Claude Code: "Re-read docs/backlog.md, the priorities have changed."

### If quality is bad

Add a constraint to `.claude/rules/migration-rules.md`:
```markdown
- Generated notes.md must include at least 2 real-world code examples
- Never use the phrase "in conclusion" in generated content
```

Claude Code reads rules automatically. The fix applies to all future generations.

---

## What You're Learning Here

The pattern you just did — **transferring decisions from a planning session into
structured files that an execution agent reads** — is the core agentic SDLC pattern:

1. **Planning agent** (this Claude.ai chat) → produces specs, decisions, backlog
2. **Execution agent** (Claude Code) → reads specs, executes tasks, reports progress
3. **Human** (you) → reviews at gates, approves, course-corrects

The planning agent and execution agent don't need shared memory.
They communicate through **files** — specs, checkpoints, reports.
This is how real multi-agent systems work in production.

You are the orchestrator. The files are the message bus.
