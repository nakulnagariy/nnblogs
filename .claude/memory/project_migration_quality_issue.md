---
name: Migration Quality Issue — Generic Notes Content
description: Some "complete" source files in the Svelte project contain generic placeholder text that passed the analyzer's shallow checks but aren't topic-specific
type: project
---

The analyzer marks files as `complete` (load direct, skip AI generation) using shallow signals: word count > threshold and no `TODO` keyword. But some Svelte source files like `css-html/accessibility-aria-roles-focus-management/notes.md` contain generic template text that passed those checks and were loaded verbatim into Supabase as-is.

**Example:** `topic_content` for topic_id `67b7a6fc-38dc-4a94-9b6b-25e28c3e56d5` (Accessibility - ARIA Roles, Focus Management) has notes that are generic, not topic-specific.

**Why:** The Svelte source project had partially-authored stubs that looked "complete" by word count but were actually boilerplate.

**How to apply:** In the refinement phase (after initial migration completes), we need a second-pass pipeline that:
- Re-generates notes for all topics where `is_ai_generated = false` (i.e., loaded from source)
- OR re-generates all notes unconditionally regardless of source
- May need to update the orchestrator or add a `--force-regenerate-notes` flag
- The generator already supports this — just remove the `canLoadDirect` shortcut for notes
