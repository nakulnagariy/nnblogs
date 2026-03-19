'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Project } from '@/types';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    long_description: '',
    github_url: '',
    live_url: '',
    image_url: '',
    technologies: '',
    featured: false,
  });

  useEffect(() => {
    params.then((p) => {
      setProjectId(p.id);
      fetchProject(p.id);
    });
  }, [params]);

  const fetchProject = async (id: string) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/admin/projects/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load project');
      }

      const { data } = await response.json();
      const project: Project = data;

      setFormData({
        name: project.name,
        description: project.description,
        long_description: project.long_description || '',
        github_url: project.github_url || '',
        live_url: project.live_url || '',
        image_url: project.image_url || '',
        technologies: project.technologies.join(', '),
        featured: project.featured,
      });
    } catch (error) {
      console.error('Failed to load project:', error);
      setError(error instanceof Error ? error.message : 'Failed to load project');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const technologies = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech);

      const response = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: projectId,
          ...formData,
          technologies,
          long_description: formData.long_description || undefined,
          github_url: formData.github_url || undefined,
          live_url: formData.live_url || undefined,
          image_url: formData.image_url || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      router.push('/admin/projects');
    } catch (error) {
      console.error('Failed to update project:', error);
      setError(error instanceof Error ? error.message : 'Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">Edit Content</p>
        <h1 className="text-2xl font-black tracking-tight">Edit Project</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-xs mt-0.5 opacity-80">{error}</p>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Project Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Brief description of the project"
            />
          </div>

          {/* Long Description */}
          <div>
            <label htmlFor="long_description" className="block text-sm font-medium mb-2">
              Long Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="long_description"
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Detailed description with features, technologies used, etc."
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium mb-2">
              GitHub URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Live URL */}
          <div>
            <label htmlFor="live_url" className="block text-sm font-medium mb-2">
              Live URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="live_url"
              name="live_url"
              type="url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium mb-2">
              Image URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/project-image.jpg"
            />
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-medium mb-2">
              Technologies * <span className="text-muted-foreground">(comma-separated)</span>
            </label>
            <Input
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              required
              placeholder="React, TypeScript, Next.js, Tailwind CSS"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border/60"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured project
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Link href="/admin/projects">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
