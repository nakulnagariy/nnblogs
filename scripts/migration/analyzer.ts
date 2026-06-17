/**
 * Analyzer — reads migration-manifest.json and produces a prioritized list of
 * TopicAnalysis objects describing what each topic needs (generation vs direct load).
 */

import fs from 'fs';
import path from 'path';
import type { Manifest, ManifestFile, TopicAnalysis, ContentFileStatus, ContentType, TopicType } from './types.js';

const MANIFEST_PATH = path.resolve('docs/reports/migration-manifest.json');
const CONTENT_BASE = 'C:/personal projects/Bench-interview-preparation/app/static/content';

// These 5 async-js topic folders use non-standard exercise structure
const EXERCISE_TOPICS = new Set([
  'async-microtask-prediction',
  'concurrency-limiter-n-at-a-time',
  'implement-retrywithbackoff',
  'microtask-queue-output-prediction',
  'promise-all-vs-allsettled-vs-race-vs-any',
]);

function bestNotesFile(files: ManifestFile[]): ContentFileStatus {
  const noteFiles = files.filter(f => f.file_type === 'notes');
  if (noteFiles.length === 0) return { status: 'missing' };

  // Priority: notes-generated.md first (always better base), then notes.md
  const generated = noteFiles.find(f => f.filename === 'notes-generated.md');
  const plain = noteFiles.find(f => f.filename === 'notes.md');

  const best = generated ?? plain;
  if (!best) return { status: 'missing' };

  return {
    status: best.status,
    file: best.path,
    wordCount: best.word_count,
    hasTodo: best.has_todo,
    sizeBytes: best.size_bytes,
  };
}

function bestExampleFile(files: ManifestFile[]): ContentFileStatus {
  const exFiles = files.filter(f => f.file_type === 'example');
  if (exFiles.length === 0) return { status: 'missing' };

  // Priority: example.js (hand-crafted) > example-generated.js
  const plain = exFiles.find(f => f.filename === 'example.js');
  const generated = exFiles.find(f => f.filename === 'example-generated.js');

  // For multi-file pattern (async-js), treat all .js files together
  const multiPattern = exFiles.filter(f => /\d{2}-/.test(f.filename));

  if (multiPattern.length > 1) {
    return {
      status: 'complete',
      file: multiPattern.map(f => f.path).join('|'), // pipe-delimited = concat signal
      functionCount: multiPattern.reduce((s, f) => s + (f.function_count ?? 0), 0),
      sizeBytes: multiPattern.reduce((s, f) => s + f.size_bytes, 0),
    };
  }

  const best = plain ?? generated;
  if (!best) return { status: 'missing' };

  return {
    status: best.status,
    file: best.path,
    functionCount: best.function_count,
    sizeBytes: best.size_bytes,
  };
}

function bestAssessmentFile(files: ManifestFile[]): ContentFileStatus {
  const htmlFiles = files.filter(f => f.file_type === 'assessment');
  if (htmlFiles.length === 0) return { status: 'missing' };

  const plain = htmlFiles.find(f => f.filename === 'assessment.html');
  const generated = htmlFiles.find(f => f.filename === 'assessment-generated.html');
  const best = plain ?? generated;
  if (!best) return { status: 'missing' };

  return {
    status: best.status,
    file: best.path,
    rowCount: best.question_count,
    sizeBytes: best.size_bytes,
  };
}

function bestFlashcardsFile(files: ManifestFile[]): ContentFileStatus {
  const csvFiles = files.filter(f => f.file_type === 'flashcards');
  if (csvFiles.length === 0) return { status: 'missing' };

  const plain = csvFiles.find(f => f.filename === 'flashcards.csv');
  const generated = csvFiles.find(f => f.filename === 'flashcards-generated.csv');
  const best = plain ?? generated;
  if (!best) return { status: 'missing' };

  return {
    status: best.status,
    file: best.path,
    rowCount: best.row_count,
    sizeBytes: best.size_bytes,
  };
}

export function analyzeManifest(filterCategories?: string[]): TopicAnalysis[] {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const manifest: Manifest = JSON.parse(raw);

  // Group files by "category/topic"
  const byTopic = new Map<string, ManifestFile[]>();
  for (const file of manifest.files) {
    if (file.topic === 'root' || file.file_type === 'other') continue;
    if (filterCategories && !filterCategories.includes(file.category)) continue;
    const key = `${file.category}/${file.topic}`;
    if (!byTopic.has(key)) byTopic.set(key, []);
    byTopic.get(key)!.push(file);
  }

  // Sort topics within each category by their folder sort order
  // We infer sort order from the manifest's natural listing order
  const topicList: Array<[string, ManifestFile[]]> = [];
  for (const [key, files] of byTopic.entries()) {
    topicList.push([key, files]);
  }
  // Stable sort: category alphabetical, then topic alphabetical (mirrors source directory sort)
  topicList.sort(([a], [b]) => a.localeCompare(b));

  const analyses: TopicAnalysis[] = [];
  let sortOrderWithinCategory: Record<string, number> = {};

  for (const [key, files] of topicList) {
    const slashIdx = key.indexOf('/');
    const category = key.slice(0, slashIdx);
    const topic = key.slice(slashIdx + 1);
    const topicType: TopicType = EXERCISE_TOPICS.has(topic) ? 'exercise' : 'standard';

    const sortOrder = (sortOrderWithinCategory[category] ?? 0);
    sortOrderWithinCategory[category] = sortOrder + 1;

    const notes = bestNotesFile(files);
    const example = bestExampleFile(files);
    const assessment = bestAssessmentFile(files);
    const flashcards = bestFlashcardsFile(files);

    const contentStatus = { notes, example, assessment, flashcards };

    const needsGeneration: ContentType[] = [];
    const canLoadDirect: ContentType[] = [];

    for (const [type, cs] of Object.entries(contentStatus) as Array<[ContentType, ContentFileStatus]>) {
      if (cs.status === 'complete') {
        canLoadDirect.push(type);
      } else {
        needsGeneration.push(type);
      }
    }

    analyses.push({
      category,
      topic,
      topicType,
      sortOrder,
      contentStatus,
      needsGeneration,
      canLoadDirect,
    });
  }

  return analyses;
}

/** Read the raw source file content from the Svelte content directory */
export function readSourceFile(relativePath: string): string {
  const fullPath = path.join(CONTENT_BASE, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

/** Check whether a source file exists */
export function sourceFileExists(relativePath: string): boolean {
  const fullPath = path.join(CONTENT_BASE, relativePath);
  return fs.existsSync(fullPath);
}
