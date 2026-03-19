'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MarkdownEditor, ImageUpload, AIAssistantPanel } from '@/components/blog';
import { generateSlug, calculateReadTime, extractExcerpt } from '@/lib/markdown';

interface FormData {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  status: 'draft' | 'published';
}

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    category: '',
    tags: [],
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
    status: 'draft',
  });

  const handleTitleBlur = () => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
      metaDescription: extractExcerpt(content, 160),
    }));
    setIsDirty(true);
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: url,
    }));
    setIsDirty(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
      setIsDirty(true);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
    setIsDirty(true);
  };

  const handleSave = async (publishImmediately: boolean = false) => {
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: publishImmediately ? 'published' : 'draft',
          readTime: calculateReadTime(formData.content),
          excerpt: extractExcerpt(formData.content),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post');
      }

      // Success
      router.push('/admin/posts');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['Technology', 'Design', 'Business', 'Life', 'Other'];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight mb-2">
          Create New Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Write and publish a new blog post
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form className="space-y-8">
        {/* Left Column - Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  setIsDirty(true);
                }}
                onBlur={handleTitleBlur}
                placeholder="Your post title"
                className="w-full px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, category: e.target.value }));
                  setIsDirty(true);
                }}
                className="w-full px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tags (press Enter)"
                  className="flex-1 px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1 bg-muted text-foreground rounded-full flex items-center gap-2 text-sm border border-border/40"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Featured Image
              </label>
              <ImageUpload onUpload={handleImageUpload} />

              {formData.featuredImage && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Preview:
                  </p>
                  <Image
                    src={formData.featuredImage}
                    alt="Featured preview"
                    width={320}
                    height={180}
                    unoptimized
                    className="rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Markdown Editor */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Content *
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
                isDirty={isDirty}
                placeholder="Write your post in Markdown..."
                postTitle={formData.title || 'New post'}
                onSaveDraft={() => handleSave(false)}
                onPublish={() => handleSave(true)}
                onImageUpload={async (file) => {
                  const data = new FormData();
                  data.append('file', file);
                  const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
                  if (!res.ok) { setError('Image upload failed'); return; }
                  const { url } = await res.json();
                  setFormData((prev) => ({ ...prev, content: prev.content + `\n![image](${url})` }));
                }}
              />
            </div>

            {/* AI Writing Assistant */}
            <AIAssistantPanel
              content={formData.content}
              title={formData.title}
              onApplyContent={(content) => {
                setFormData((prev) => ({ ...prev, content }));
                setIsDirty(true);
              }}
              onAppendContent={(text) => {
                setFormData((prev) => ({ ...prev, content: prev.content + text }));
                setIsDirty(true);
              }}
              onSetTags={(tags) => {
                setFormData((prev) => ({ ...prev, tags }));
                setIsDirty(true);
              }}
              onSetExcerpt={(excerpt) => {
                setFormData((prev) => ({ ...prev, metaDescription: excerpt }));
                setIsDirty(true);
              }}
              onSetTitle={(newTitle) => {
                setFormData((prev) => ({
                  ...prev,
                  title: newTitle,
                  slug: prev.slug || generateSlug(newTitle),
                }));
                setIsDirty(true);
              }}
            />
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as 'draft' | 'published',
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Draft</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as 'draft' | 'published',
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">
                    Published
                  </span>
                </label>
              </div>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, metaTitle: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Page title for SEO"
                maxLength={60}
                className="w-full px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.metaTitle.length}/60
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, metaDescription: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Brief description for search engines"
                rows={3}
                maxLength={160}
                className="w-full px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.metaDescription.length}/160
              </p>
            </div>

            {/* Read Time */}
            {formData.content && (
              <div className="p-3 bg-muted/50 rounded-xl border border-border/40">
                <p className="text-xs text-muted-foreground font-medium">
                  Estimated Read Time
                </p>
                <p className="text-lg font-bold mt-1">
                  {calculateReadTime(formData.content)} min
                </p>
              </div>
            )}

            {/* Word Count */}
            {formData.content && (
              <div className="p-3 bg-muted/50 rounded-xl border border-border/40">
                <p className="text-xs text-muted-foreground font-medium">
                  Word Count
                </p>
                <p className="text-lg font-bold mt-1">
                  {formData.content.trim().split(/\s+/).length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6 border-t border-border/40">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="px-5 py-2 bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 rounded-xl text-sm font-medium transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="px-5 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 rounded-xl text-sm font-medium transition-colors"
          >
            {isLoading ? 'Publishing...' : 'Save & Publish'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 border border-border/60 hover:bg-muted/60 text-muted-foreground rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
