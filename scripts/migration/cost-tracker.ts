/**
 * CostTracker — wraps every LLM API call with token/cost logging.
 * Appends to docs/reports/cost-log.jsonl after each call.
 * Optionally writes to agent_cost_log table in Supabase.
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { CostEntry } from './types.js';
import { estimateCost } from './types.js';

const LOG_PATH = path.resolve('docs/reports/cost-log.jsonl');

export class CostTracker {
  private sessionId: string;
  private agentName: string;
  private entries: CostEntry[] = [];
  private sessionCostUsd = 0;

  constructor(agentName: string, sessionId: string) {
    this.agentName = agentName;
    this.sessionId = sessionId;
  }

  /** Record a single LLM call. Call this after you have the usage object. */
  record(opts: {
    taskId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    metadata?: Record<string, unknown>;
  }): CostEntry {
    const cost = estimateCost(opts.model, opts.inputTokens, opts.outputTokens);
    const entry: CostEntry = {
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      agent_name: this.agentName,
      task_id: opts.taskId,
      model: opts.model,
      input_tokens: opts.inputTokens,
      output_tokens: opts.outputTokens,
      estimated_cost_usd: cost,
      metadata: opts.metadata,
    };
    this.entries.push(entry);
    this.sessionCostUsd += cost;
    this.appendToLog(entry);
    return entry;
  }

  /** Wrap an async fn that calls the LLM; records usage automatically. */
  async wrap<T>(
    taskId: string,
    model: string,
    fn: () => Promise<{ result: T; inputTokens: number; outputTokens: number }>,
    metadata?: Record<string, unknown>,
  ): Promise<T> {
    const { result, inputTokens, outputTokens } = await fn();
    this.record({ taskId, model, inputTokens, outputTokens, metadata });
    return result;
  }

  getSessionCostUsd(): number {
    return this.sessionCostUsd;
  }

  getEntries(): CostEntry[] {
    return [...this.entries];
  }

  getSummary(): { totalUsd: number; calls: number; byModel: Record<string, number> } {
    const byModel: Record<string, number> = {};
    for (const e of this.entries) {
      byModel[e.model] = (byModel[e.model] ?? 0) + e.estimated_cost_usd;
    }
    return { totalUsd: this.sessionCostUsd, calls: this.entries.length, byModel };
  }

  private appendToLog(entry: CostEntry): void {
    try {
      fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
      fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');
    } catch {
      // Non-fatal: don't crash the pipeline over logging
    }
  }
}

export function makeSessionId(): string {
  return randomUUID();
}
