'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  PenLine,
  Search,
  Tags,
  FileText,
  Lightbulb,
  Loader2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AIAction = 'improve' | 'continue' | 'find-gaps' | 'tags' | 'excerpt' | 'suggest-title';

interface AIAssistantPanelProps {
  /** Current markdown content in the editor */
  content: string;
  /** Current post title */
  title: string;
  /** Replace the entire editor content */
  onApplyContent: (content: string) => void;
  /** Append text to the end of editor content */
  onAppendContent: (text: string) => void;
  /** Replace the tags list */
  onSetTags: (tags: string[]) => void;
  /** Replace the meta description / excerpt */
  onSetExcerpt: (excerpt: string) => void;
  /** Replace the title */
  onSetTitle: (title: string) => void;
}

interface ActionConfig {
  action: AIAction;
  label: string;
  description: string;
  icon: React.ReactNode;
  requiresMinLength?: number;
}

const ACTIONS: ActionConfig[] = [
  {
    action: 'improve',
    label: 'Polish Writing',
    description: 'Fix grammar, improve clarity and engagement',
    icon: <PenLine className="w-3.5 h-3.5" />,
    requiresMinLength: 50,
  },
  {
    action: 'continue',
    label: 'Continue Writing',
    description: 'AI picks up where your draft left off',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    requiresMinLength: 100,
  },
  {
    action: 'find-gaps',
    label: 'Find Gaps',
    description: 'Spot missing sections and weak spots',
    icon: <Search className="w-3.5 h-3.5" />,
    requiresMinLength: 100,
  },
  {
    action: 'tags',
    label: 'Auto Tags',
    description: 'Generate relevant tags from content',
    icon: <Tags className="w-3.5 h-3.5" />,
    requiresMinLength: 50,
  },
  {
    action: 'excerpt',
    label: 'Auto Excerpt',
    description: 'Generate SEO meta description',
    icon: <FileText className="w-3.5 h-3.5" />,
    requiresMinLength: 50,
  },
  {
    action: 'suggest-title',
    label: 'Title Ideas',
    description: 'Get 3 alternative title suggestions',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    requiresMinLength: 50,
  },
];

type ResultPayload =
  | { type: 'text'; value: string }
  | { type: 'bullets'; value: string[] }
  | { type: 'tags'; value: string[] }
  | { type: 'titles'; value: string[] };

/**
 * AI Writing Assistant panel for the admin blog editor.
 * Provides one-click AI tools: polish, continue, gap analysis, tags, excerpt, title ideas.
 */
export function AIAssistantPanel({
  content,
  title,
  onApplyContent,
  onAppendContent,
  onSetTags,
  onSetExcerpt,
  onSetTitle,
}: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [appliedAction, setAppliedAction] = useState<AIAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = async (cfg: ActionConfig) => {
    const minLen = cfg.requiresMinLength ?? 0;
    if (content.trim().length < minLen) {
      setError(`Write at least ${minLen} characters before using this tool.`);
      return;
    }

    setActiveAction(cfg.action);
    setIsLoading(true);
    setResult(null);
    setError(null);
    setAppliedAction(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: cfg.action,
          content,
          title,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'AI request failed');
      }

      const data = json.data;

      if (cfg.action === 'improve' || cfg.action === 'continue') {
        setResult({ type: 'text', value: typeof data === 'string' ? data : '' });
      } else if (cfg.action === 'find-gaps') {
        setResult({ type: 'bullets', value: Array.isArray(data) ? data : [] });
      } else if (cfg.action === 'tags') {
        setResult({ type: 'tags', value: Array.isArray(data) ? data : [] });
      } else if (cfg.action === 'excerpt') {
        setResult({ type: 'text', value: typeof data === 'string' ? data : '' });
      } else if (cfg.action === 'suggest-title') {
        setResult({ type: 'titles', value: Array.isArray(data) ? data : [] });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const dismiss = () => {
    setResult(null);
    setActiveAction(null);
    setError(null);
    setAppliedAction(null);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
        <span className="text-sm font-medium flex-1">AI Writing Assistant</span>
        <span className="text-xs text-muted-foreground mr-2">
          {ACTIONS.length} tools
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* Action buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACTIONS.map((cfg) => (
              <button
                key={cfg.action}
                type="button"
                disabled={isLoading}
                onClick={() => runAction(cfg)}
                title={cfg.description}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-colors',
                  activeAction === cfg.action && result
                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-700 dark:text-violet-300'
                    : 'border-border/60 bg-background hover:bg-muted/60 text-foreground',
                  isLoading && activeAction === cfg.action && 'opacity-70',
                )}
              >
                <span className="shrink-0 text-violet-500">
                  {isLoading && activeAction === cfg.action ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    cfg.icon
                  )}
                </span>
                <span className="truncate">{cfg.label}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Result area */}
          {result && !isLoading && (
            <div className="border border-border/60 rounded-lg overflow-hidden">
              {/* Result label */}
              <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border/40">
                <span className="text-xs font-medium text-muted-foreground">
                  AI Result — {ACTIONS.find((a) => a.action === activeAction)?.label}
                </span>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Dismiss result"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 space-y-3">
                {/* Text result (improve / continue / excerpt) */}
                {result.type === 'text' && (
                  <>
                    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground max-h-52 overflow-y-auto">
                      {result.value}
                    </pre>
                    <div className="flex gap-2 flex-wrap">
                      {activeAction === 'improve' && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyContent(result.value);
                            setAppliedAction('improve');
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            appliedAction === 'improve'
                              ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                              : 'bg-foreground text-background hover:bg-foreground/90',
                          )}
                        >
                          {appliedAction === 'improve' ? (
                            <><Check className="w-3 h-3" /> Applied</>
                          ) : (
                            'Replace Content'
                          )}
                        </button>
                      )}
                      {activeAction === 'continue' && (
                        <button
                          type="button"
                          onClick={() => {
                            onAppendContent('\n\n' + result.value);
                            setAppliedAction('continue');
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            appliedAction === 'continue'
                              ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                              : 'bg-foreground text-background hover:bg-foreground/90',
                          )}
                        >
                          {appliedAction === 'continue' ? (
                            <><Check className="w-3 h-3" /> Appended</>
                          ) : (
                            'Append to Draft'
                          )}
                        </button>
                      )}
                      {activeAction === 'excerpt' && (
                        <button
                          type="button"
                          onClick={() => {
                            onSetExcerpt(result.value);
                            setAppliedAction('excerpt');
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            appliedAction === 'excerpt'
                              ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                              : 'bg-foreground text-background hover:bg-foreground/90',
                          )}
                        >
                          {appliedAction === 'excerpt' ? (
                            <><Check className="w-3 h-3" /> Applied</>
                          ) : (
                            'Use as Excerpt'
                          )}
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Bullet list result (find-gaps) */}
                {result.type === 'bullets' && (
                  <ul className="space-y-1.5">
                    {result.value.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tags result */}
                {result.type === 'tags' && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {result.value.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-muted border border-border/60 text-xs font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSetTags(result.value);
                        setAppliedAction('tags');
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        appliedAction === 'tags'
                          ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                          : 'bg-foreground text-background hover:bg-foreground/90',
                      )}
                    >
                      {appliedAction === 'tags' ? (
                        <><Check className="w-3 h-3" /> Applied</>
                      ) : (
                        'Apply Tags'
                      )}
                    </button>
                  </>
                )}

                {/* Title suggestions */}
                {result.type === 'titles' && (
                  <div className="space-y-2">
                    {result.value.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onSetTitle(t);
                          setAppliedAction('suggest-title');
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors',
                          appliedAction === 'suggest-title'
                            ? 'border-border/40 text-muted-foreground cursor-default'
                            : 'border-border/60 hover:bg-muted/60 hover:border-violet-500/40',
                        )}
                      >
                        {t}
                      </button>
                    ))}
                    {appliedAction === 'suggest-title' && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Title updated
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
