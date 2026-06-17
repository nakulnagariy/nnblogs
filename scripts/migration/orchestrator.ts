#!/usr/bin/env node
/**
 * Orchestrator — runs the full migration pipeline with checkpoint/resume.
 *
 * Usage:
 *   npx tsx scripts/migration/orchestrator.ts [options]
 *
 * Options:
 *   --categories js-core,react-hooks    Categories to process (default: js-core)
 *   --limit 3                           Max topics to process (default: 3 for quality gate)
 *   --approve-gate                      Skip the 3-topic human quality gate
 *   --resume                            Resume from existing checkpoint
 *   --dry-run                           Analyze and show plan without generating/loading
 *
 * Environment:
 *   ANTHROPIC_API_KEY      Required for generation
 *   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY  Required for loading
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env.local') });
dotenv.config(); // fallback to .env

import fs from 'fs';

import { analyzeManifest, readSourceFile, sourceFileExists } from './analyzer.js';
import { ContentGenerator } from './generator.js';
import { loadTopic, validateTopicInDb } from './loader.js';
import { CostTracker, makeSessionId } from './cost-tracker.js';
import type {
  Checkpoint,
  TopicAnalysis,
  TopicContentMap,
  ContentType,
} from './types.js';

const CHECKPOINT_PATH = path.resolve('docs/reports/checkpoint.json');

// ── CLI arg parsing ────────────────────────────────────────────────────────

function parseArgs(): {
  categories: string[];
  limit: number;
  approveGate: boolean;
  resume: boolean;
  dryRun: boolean;
} {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };
  const has = (flag: string) => args.includes(flag);

  return {
    categories: (get('--categories') ?? 'js-core').split(',').map(s => s.trim()),
    limit: parseInt(get('--limit') ?? '3', 10),
    approveGate: has('--approve-gate'),
    resume: has('--resume'),
    dryRun: has('--dry-run'),
  };
}

// ── Checkpoint helpers ─────────────────────────────────────────────────────

function loadCheckpoint(): Checkpoint | null {
  if (!fs.existsSync(CHECKPOINT_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'));
  } catch {
    console.warn('⚠  checkpoint.json is corrupted, starting fresh');
    return null;
  }
}

function saveCheckpoint(cp: Checkpoint): void {
  cp.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(CHECKPOINT_PATH), { recursive: true });
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2), 'utf8');
}

function makeCheckpoint(sessionId: string, categories: string[], qualityGateAt: number): Checkpoint {
  return {
    version: '1.0',
    sessionId,
    startedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    targetCategories: categories,
    qualityGate: { enabled: true, gateAt: qualityGateAt, completedCount: 0, approved: false },
    topics: {},
    cost: { totalUsd: 0, byAgent: {} },
  };
}

// ── Source file reader ─────────────────────────────────────────────────────

function readContent(relativePath: string | undefined): string | undefined {
  if (!relativePath) return undefined;
  // Handle multi-file case (pipe-delimited paths from analyzer)
  if (relativePath.includes('|')) {
    const paths = relativePath.split('|');
    const parts = paths
      .filter(p => sourceFileExists(p))
      .map(p => {
        const fname = path.basename(p);
        const body = readSourceFile(p);
        return `// ── ${fname} ${'─'.repeat(Math.max(0, 52 - fname.length))}\n${body}`;
      });
    return parts.join('\n\n');
  }
  if (!sourceFileExists(relativePath)) return undefined;
  return readSourceFile(relativePath);
}

// ── Per-topic pipeline ─────────────────────────────────────────────────────

async function processTopic(
  analysis: TopicAnalysis,
  generator: ContentGenerator,
  opts: { dryRun: boolean },
): Promise<TopicContentMap> {
  const contentMap: TopicContentMap = {};

  // ── Notes ──────────────────────────────────────────────────────────────
  if (analysis.canLoadDirect.includes('notes') && analysis.contentStatus.notes.file) {
    const body = readContent(analysis.contentStatus.notes.file);
    if (body) {
      contentMap.notes = { body, isAiGenerated: false, sourceFile: analysis.contentStatus.notes.file, metadata: null };
    }
  } else if (!opts.dryRun) {
    const base = analysis.contentStatus.notes.file ? readContent(analysis.contentStatus.notes.file) : undefined;
    contentMap.notes = await generator.generateNotes(analysis, base);
  }

  // ── Example ────────────────────────────────────────────────────────────
  if (analysis.canLoadDirect.includes('example') && analysis.contentStatus.example.file) {
    const body = readContent(analysis.contentStatus.example.file);
    if (body) {
      contentMap.example = { body, isAiGenerated: false, sourceFile: analysis.contentStatus.example.file, metadata: null };
    }
  } else if (!opts.dryRun) {
    contentMap.example = await generator.generateExample(analysis, contentMap.notes?.body);
  }

  // ── Assessment ─────────────────────────────────────────────────────────
  if (analysis.canLoadDirect.includes('assessment') && analysis.contentStatus.assessment.file) {
    const body = readContent(analysis.contentStatus.assessment.file);
    if (body) {
      contentMap.assessment = { body, isAiGenerated: false, sourceFile: analysis.contentStatus.assessment.file, metadata: null };
    }
  } else if (!opts.dryRun) {
    contentMap.assessment = await generator.generateAssessment(analysis, contentMap.notes?.body);
  }

  // ── Flashcards ─────────────────────────────────────────────────────────
  if (analysis.canLoadDirect.includes('flashcards') && analysis.contentStatus.flashcards.file) {
    const body = readContent(analysis.contentStatus.flashcards.file);
    if (body) {
      contentMap.flashcards = { body, isAiGenerated: false, sourceFile: analysis.contentStatus.flashcards.file, metadata: null };
    }
  } else if (!opts.dryRun) {
    contentMap.flashcards = await generator.generateFlashcards(analysis, contentMap.notes?.body);
  }

  // ── Interview Questions (always generated from notes) ──────────────────
  if (!opts.dryRun && contentMap.notes?.body) {
    contentMap.interviewQuestions = await generator.generateInterviewQuestions(
      analysis,
      contentMap.notes.body,
    );
  }

  return contentMap;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();
  const sessionId = makeSessionId();
  const tracker = new CostTracker('orchestrator', sessionId);

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  INTERVIEW PREP MIGRATION — CONTENT PIPELINE');
  console.log(`  Session: ${sessionId.slice(0, 8)}`);
  console.log(`  Categories: ${opts.categories.join(', ')}`);
  console.log(`  Limit: ${opts.limit} topics`);
  console.log(`  Mode: ${opts.dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('════════════════════════════════════════════════════════\n');

  // ── Load or create checkpoint ──────────────────────────────────────────
  let cp: Checkpoint;
  if (opts.resume && loadCheckpoint()) {
    cp = loadCheckpoint()!;
    console.log(`▶  Resuming from checkpoint (${Object.values(cp.topics).filter(t => t.status === 'completed').length} topics already done)\n`);
  } else {
    cp = makeCheckpoint(sessionId, opts.categories, opts.limit);
    saveCheckpoint(cp);
  }

  // ── Analyze manifest ───────────────────────────────────────────────────
  console.log('📋  Analyzing manifest...');
  const allTopics = analyzeManifest(opts.categories);
  console.log(`    Found ${allTopics.length} topics in [${opts.categories.join(', ')}]\n`);

  if (opts.dryRun) {
    console.log('DRY RUN — Generation plan:\n');
    for (const t of allTopics.slice(0, opts.limit)) {
      const key = `${t.category}/${t.topic}`;
      const gen = t.needsGeneration.length > 0 ? `generate: [${t.needsGeneration.join(', ')}]` : 'load direct';
      console.log(`  • ${key}  (${gen})`);
    }
    console.log(`\n  Total: ${allTopics.slice(0, opts.limit).length} topics to process`);
    console.log(`  Topics needing generation: ${allTopics.slice(0, opts.limit).filter(t => t.needsGeneration.length > 0).length}`);
    return;
  }

  // ── Validate env ───────────────────────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('✗  ANTHROPIC_API_KEY not set in .env.local');
    process.exit(1);
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('✗  Supabase credentials not set in .env.local');
    process.exit(1);
  }

  const generator = new ContentGenerator(tracker);

  // ── Process topics ─────────────────────────────────────────────────────
  const topicsToProcess = allTopics
    .filter(t => {
      const key = `${t.category}/${t.topic}`;
      const existing = cp.topics[key];
      return !existing || existing.status === 'pending' || existing.status === 'failed';
    })
    .slice(0, opts.limit);

  let processedCount = 0;

  for (const analysis of topicsToProcess) {
    const key = `${analysis.category}/${analysis.topic}`;

    // Quality gate: pause after N topics for human review
    if (
      cp.qualityGate.enabled &&
      !cp.qualityGate.approved &&
      !opts.approveGate &&
      cp.qualityGate.completedCount >= cp.qualityGate.gateAt
    ) {
      cp.qualityGate.pausedAt = new Date().toISOString();
      saveCheckpoint(cp);
      console.log('\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('  ✋  QUALITY GATE — Human review required');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n  ${cp.qualityGate.completedCount} topics have been generated and loaded.`);
      console.log('  Please review the generated content in Supabase before continuing.\n');
      for (const [k, v] of Object.entries(cp.topics)) {
        if (v.status === 'completed') {
          console.log(`  → ${k} (${v.generated.join(', ')} generated)`);
        }
      }
      console.log('\n  To continue: npx tsx scripts/migration/orchestrator.ts --resume --approve-gate');
      console.log('  Cost so far: $' + tracker.getSessionCostUsd().toFixed(4));
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      break;
    }

    // Mark in-progress
    cp.topics[key] = {
      status: 'generating',
      startedAt: new Date().toISOString(),
      generated: [],
      loaded: false,
    };
    saveCheckpoint(cp);

    console.log(`\n[${processedCount + 1}/${topicsToProcess.length}] ${key}`);
    console.log(`  Content needed: ${analysis.needsGeneration.length > 0 ? analysis.needsGeneration.join(', ') : 'none (load direct)'}`);

    try {
      // Generate or read content
      const contentMap = await processTopic(analysis, generator, { dryRun: false });

      // Load into Supabase
      console.log(`  ⬆  Loading into Supabase...`);
      cp.topics[key]!.status = 'loading';
      saveCheckpoint(cp);

      const result = await loadTopic(analysis, contentMap);

      if (result.errors.length > 0) {
        console.warn(`  ⚠  Load errors: ${result.errors.join('; ')}`);
      }

      // Mark complete
      const contentTypeKeys: ContentType[] = ['notes', 'example', 'assessment', 'flashcards'];
      const generatedTypes = contentTypeKeys.filter(k => contentMap[k]?.isAiGenerated);

      cp.topics[key] = {
        status: 'completed',
        startedAt: cp.topics[key]!.startedAt,
        completedAt: new Date().toISOString(),
        generated: generatedTypes,
        loaded: true,
      };
      cp.qualityGate.completedCount++;
      cp.cost.totalUsd = tracker.getSessionCostUsd();
      saveCheckpoint(cp);

      // Quick validation
      const validation = await validateTopicInDb(analysis.topic);
      console.log(`  ✓  ${result.contentTypesLoaded.length} content types loaded (${result.contentTypesLoaded.join(', ')})`);
      console.log(`  ✓  ${result.interviewQuestionsLoaded} interview questions`);
      console.log(`  ✓  DB validation: ${validation.contentTypes.join(', ')}`);

      processedCount++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗  Failed: ${msg}`);
      cp.topics[key]!.status = 'failed';
      cp.topics[key]!.error = msg;
      saveCheckpoint(cp);
    }
  }

  // ── Session report ─────────────────────────────────────────────────────
  const summary = tracker.getSummary();
  const completed = Object.values(cp.topics).filter(t => t.status === 'completed').length;
  const failed = Object.values(cp.topics).filter(t => t.status === 'failed').length;

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  SESSION COMPLETE');
  console.log('════════════════════════════════════════════════════════');
  console.log(`  Topics processed this run : ${processedCount}`);
  console.log(`  Topics completed (total)  : ${completed}`);
  console.log(`  Topics failed             : ${failed}`);
  console.log(`  LLM calls                 : ${summary.calls}`);
  console.log(`  Session cost              : $${summary.totalUsd.toFixed(4)}`);
  if (Object.keys(summary.byModel).length > 0) {
    for (const [model, cost] of Object.entries(summary.byModel)) {
      console.log(`    ${model}: $${cost.toFixed(4)}`);
    }
  }
  console.log(`  Checkpoint                : ${CHECKPOINT_PATH}`);
  console.log(`  Cost log                  : docs/reports/cost-log.jsonl`);
  console.log('════════════════════════════════════════════════════════\n');

  if (cp.qualityGate.enabled && !cp.qualityGate.approved && cp.qualityGate.completedCount >= cp.qualityGate.gateAt) {
    process.exit(0); // clean exit at quality gate
  }
}

main().catch(err => {
  console.error('\n✗  Fatal error:', err);
  process.exit(1);
});
