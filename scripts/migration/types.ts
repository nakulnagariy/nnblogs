// Shared types for the migration pipeline

export type FileType = 'notes' | 'example' | 'assessment' | 'flashcards' | 'other';
export type FileStatus = 'complete' | 'placeholder';
export type ContentType = 'notes' | 'example' | 'assessment' | 'flashcards';
export type TopicType = 'standard' | 'exercise';

export interface ManifestFile {
  path: string;
  category: string;
  topic: string;
  filename: string;
  file_type: FileType;
  status: FileStatus;
  word_count?: number;
  has_todo?: boolean;
  function_count?: number;
  row_count?: number;
  question_count?: number;
  size_bytes: number;
  reason: string;
}

export interface Manifest {
  generated_at: string;
  source_path: string;
  files: ManifestFile[];
  summary: {
    total_files: number;
    complete: number;
    placeholder: number;
    completion_rate_pct: number;
    by_category: Record<string, { total: number; complete: number; placeholder: number }>;
  };
}

export interface ContentFileStatus {
  status: 'complete' | 'placeholder' | 'missing';
  file?: string;      // relative path e.g. "js-core/closure/notes.md"
  wordCount?: number;
  functionCount?: number;
  rowCount?: number;
  sizeBytes?: number;
  hasTodo?: boolean;
}

export interface TopicAnalysis {
  category: string;
  topic: string;
  topicType: TopicType;
  sortOrder: number;
  contentStatus: {
    notes: ContentFileStatus;
    example: ContentFileStatus;
    assessment: ContentFileStatus;
    flashcards: ContentFileStatus;
  };
  // Content types that require AI generation
  needsGeneration: ContentType[];
  // Content types that can be loaded as-is from source
  canLoadDirect: ContentType[];
}

export interface GenerationMetadata {
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  prompt_version: string;
  generated_at: string;
}

export interface GeneratedContent {
  body: string;
  isAiGenerated: true;
  metadata: GenerationMetadata;
}

export interface DirectContent {
  body: string;
  isAiGenerated: false;
  sourceFile: string;
  metadata: null;
}

export type ContentResult = GeneratedContent | DirectContent;

export interface TopicContentMap {
  notes?: ContentResult;
  example?: ContentResult;
  assessment?: ContentResult;
  flashcards?: ContentResult;
  interviewQuestions?: Array<{ question: string; answer: string; difficulty: 'easy' | 'medium' | 'hard' }>;
}

export interface CostEntry {
  timestamp: string;
  session_id: string;
  agent_name: string;
  task_id: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  metadata?: Record<string, unknown>;
}

// Model pricing per 1M tokens (USD)
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 0.80, output: 4.00 },
  'claude-sonnet-4-6':         { input: 3.00, output: 15.00 },
  'claude-opus-4-7':           { input: 15.00, output: 75.00 },
};

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model] ?? { input: 3.00, output: 15.00 };
  return (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
}

export interface CheckpointTopicState {
  status: 'pending' | 'analyzing' | 'generating' | 'loading' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  generated: ContentType[];
  loaded: boolean;
  qualityScore?: number;
}

export interface Checkpoint {
  version: string;
  sessionId: string;
  startedAt: string;
  lastUpdated: string;
  targetCategories: string[];
  qualityGate: {
    enabled: boolean;
    gateAt: number;        // pause after N topics for human review
    completedCount: number;
    approved: boolean;
    pausedAt?: string;
  };
  topics: Record<string, CheckpointTopicState>; // key = "category/topic"
  cost: {
    totalUsd: number;
    byAgent: Record<string, number>;
  };
}
