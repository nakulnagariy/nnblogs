name: orchestrator
description: >
Main migration orchestrator for the interview-prep platform migration.
Manages the full SDLC pipeline. Start here for any migration work.
model: Claude Sonnet 4.6

# Orchestrator Agent

## First Session Instructions

If this is the first migration session (CLAUDE.md shows "Phase: NOT STARTED"):

1. Read the complete specification: docs/improved-prompt-v3-final.md
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
