'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Code2,
  Heading1,
  Heading2,
  List,
  Link2,
  Image,
} from 'lucide-react';
import { insertMarkdownSyntax, insertLink, insertImage } from '@/lib/markdown';

interface EditorToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onImageClick?: () => void;
}

export default function EditorToolbar({
  textareaRef,
  onImageClick,
}: EditorToolbarProps) {
  const handleBold = () => insertMarkdownSyntax(textareaRef, '**', '**', 'bold text');
  const handleItalic = () => insertMarkdownSyntax(textareaRef, '*', '*', 'italic text');
  const handleCode = () => insertMarkdownSyntax(textareaRef, '`', '`', 'code');
  const handleH1 = () => insertMarkdownSyntax(textareaRef, '# ', '', 'Heading 1');
  const handleH2 = () => insertMarkdownSyntax(textareaRef, '## ', '', 'Heading 2');
  const handleList = () => insertMarkdownSyntax(textareaRef, '- ', '', 'List item');
  const handleLink = () => insertLink(textareaRef);
  const handleImage = () => {
    if (onImageClick) {
      onImageClick();
    } else {
      insertImage(textareaRef, '', 'image alt text');
    }
  };

  const buttonClass =
    'p-2 hover:bg-muted/60 rounded transition-colors text-foreground';

  return (
    <div className="flex items-center gap-1 p-2 bg-muted/50 border-b border-border/40 rounded-t-lg flex-wrap">
      <button
        type="button"
        onClick={handleBold}
        className={buttonClass}
        title="Bold (Cmd/Ctrl+B)"
        aria-label="Bold"
      >
        <Bold size={20} />
      </button>

      <button
        type="button"
        onClick={handleItalic}
        className={buttonClass}
        title="Italic (Cmd/Ctrl+I)"
        aria-label="Italic"
      >
        <Italic size={20} />
      </button>

      <button
        type="button"
        onClick={handleCode}
        className={buttonClass}
        title="Inline code"
        aria-label="Code"
      >
        <Code2 size={20} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={handleH1}
        className={buttonClass}
        title="Heading 1"
        aria-label="Heading 1"
      >
        <Heading1 size={20} />
      </button>

      <button
        type="button"
        onClick={handleH2}
        className={buttonClass}
        title="Heading 2"
        aria-label="Heading 2"
      >
        <Heading2 size={20} />
      </button>

      <button
        type="button"
        onClick={handleList}
        className={buttonClass}
        title="Bullet list"
        aria-label="List"
      >
        <List size={20} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={handleLink}
        className={buttonClass}
        title="Insert link"
        aria-label="Link"
      >
        <Link2 size={20} />
      </button>

      <button
        type="button"
        onClick={handleImage}
        className={buttonClass}
        title="Insert image"
        aria-label="Image"
      >
        <Image size={20} />
      </button>
    </div>
  );
}
