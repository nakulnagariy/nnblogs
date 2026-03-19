'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import type { ICommand } from '@uiw/react-md-editor';
import { Maximize2, Minimize2 } from 'lucide-react';

// Dynamically import to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => void;
  isDirty?: boolean;
  placeholder?: string;
  /** Post title shown in the fullscreen header */
  postTitle?: string;
  /** Called when Save draft is clicked in fullscreen header */
  onSaveDraft?: () => void;
  /** Called when Publish is clicked in fullscreen header */
  onPublish?: () => void;
}

export default function MarkdownEditor({
  value,
  onChange,
  onImageUpload,
  isDirty = false,
  placeholder = 'Write your markdown here...',
  postTitle,
  onSaveDraft,
  onPublish,
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Compute height at render time — avoids setState-in-effect lint warning
  const fullscreenHeight = isFullscreen && typeof window !== 'undefined'
    ? window.innerHeight - 49
    : 800;

  const stats = useMemo(() => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    const characters = value.length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, characters, readTime };
  }, [value]);

  // ESC exits fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  // Lock body scroll while in fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Custom image-upload toolbar command
  const imageUploadCommand: ICommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: { 'aria-label': 'Upload image', title: 'Upload image' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        <path
          fillRule="evenodd"
          d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-9a9 9 0 100 18A9 9 0 0010 1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    execute: () => fileInputRef.current?.click(),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) onImageUpload(file);
    e.target.value = '';
  };

  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const extraCmds = onImageUpload ? [imageUploadCommand] : [];

  // FULLSCREEN OVERLAY - Ghost/Notion-style distraction-free writing
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden="true"
        />

        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 h-12 shrink-0 border-b border-border/40">
          <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground truncate max-w-xs">
            {postTitle || 'Writing'}
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {isDirty && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse inline-block" />
                Unsaved
              </span>
            )}
            <span className="hidden sm:inline tabular-nums">{stats.words.toLocaleString()} words</span>
            <span className="hidden sm:inline tabular-nums">{stats.readTime} min read</span>
          </div>
          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              className="px-3 py-1.5 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-xs font-medium transition-colors"
            >
              Save draft
            </button>
          )}
          {onPublish && (
            <button
              type="button"
              onClick={onPublish}
              className="px-3 py-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-xs font-medium transition-colors"
            >
              Publish
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="p-1.5 hover:bg-muted/60 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Exit focus mode (Esc)"
            title="Exit focus mode (Esc)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Editor fills remaining viewport */}
        <div className="flex-1 overflow-hidden" data-color-mode={colorMode}>
          <MDEditor
            value={value}
            onChange={(val) => onChange(val ?? '')}
            height={fullscreenHeight}
            preview="live"
            textareaProps={{ placeholder }}
            extraCommands={extraCmds}
          />
        </div>
      </div>
    );
  }

  // NORMAL EMBEDDED MODE
  return (
    <div className="flex flex-col gap-2">
      {/* Stats + Focus mode button */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {isDirty && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse inline-block" />
            <span>Unsaved</span>
          </div>
        )}
        <span className="tabular-nums">{stats.words} words</span>
        <span className="tabular-nums">{stats.characters} chars</span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground border border-border/60"
          aria-label="Open focus mode"
          title="Focus mode - full screen writing"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Focus mode</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Editor */}
      <div data-color-mode={colorMode}>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val ?? '')}
          height={600}
          preview="live"
          textareaProps={{ placeholder }}
          extraCommands={extraCmds}
        />
      </div>
    </div>
  );
}
