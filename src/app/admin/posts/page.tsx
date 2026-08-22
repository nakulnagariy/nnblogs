'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, Filter, CheckSquare, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

const ITEMS_PER_PAGE = 10;

export default function AdminPostsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Bulk selection state
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  
  // Dialog state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    action?: 'publish' | 'unpublish' | 'delete';
    postId?: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'single',
    title: '',
    description: '',
  });
  
  // Filter states from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/posts');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch posts (${response.status})`);
      }
      
      const { data } = await response.json();
      setPosts(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
      console.error('Error fetching posts:', error);
      setError(errorMessage);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update URL params when filters change
  const updateURLParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Get unique categories from posts
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category))).sort();
    return cats;
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.slug.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post =>
        statusFilter === 'published' ? post.published : !post.published
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [posts, searchTerm, statusFilter, categoryFilter, sortBy]);

  // Paginate
  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, currentPage]);

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURLParams({ search: value, page: '1' });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateURLParams({ status: value, page: '1' });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
    updateURLParams({ category: value, page: '1' });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    updateURLParams({ sort: value, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams({ page: page.toString() });
  };

  const handleDelete = async (id: string) => {
    setDialogState({
      isOpen: true,
      type: 'single',
      action: 'delete',
      postId: id,
      title: 'Delete Post',
      description: 'Are you sure you want to delete this post? This action cannot be undone.',
    });
  };

  const clearSelection = () => {
    setSelectedPostIds(new Set());
  };

  const executeDelete = async () => {
    if (!dialogState.postId) return;
    const id = dialogState.postId;

    try {
      const response = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(posts.filter((p) => p.id !== id));
      // Remove from selection if selected
      setSelectedPostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setDialogState({ ...dialogState, isOpen: false });
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete post');
      setDialogState({ ...dialogState, isOpen: false });
    }
  };

  // Bulk selection handlers
  const togglePostSelection = (postId: string) => {
    setSelectedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPostIds.size === paginatedPosts.length) {
      setSelectedPostIds(new Set());
    } else {
      setSelectedPostIds(new Set(paginatedPosts.map(p => p.id)));
    }
  };

  // Bulk action handlers
  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    const postIds = Array.from(selectedPostIds);
    
    let title = '';
    let description = '';
    
    switch (action) {
      case 'publish':
        title = 'Publish Posts';
        description = `Are you sure you want to publish ${postIds.length} post(s)?`;
        break;
      case 'unpublish':
        title = 'Unpublish Posts';
        description = `Are you sure you want to unpublish ${postIds.length} post(s)?`;
        break;
      case 'delete':
        title = 'Delete Posts';
        description = `Are you sure you want to delete ${postIds.length} post(s)? This action cannot be undone.`;
        break;
    }

    setDialogState({
      isOpen: true,
      type: 'bulk',
      action,
      title,
      description,
    });
  };

  const executeBulkAction = async () => {
    if (!dialogState.action) return;
    const action = dialogState.action;
    const postIds = Array.from(selectedPostIds);

    try {
      setIsBulkActionLoading(true);
      setError(null);

      const response = await fetch('/api/admin/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, postIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bulk action failed');
      }

      await response.json();
      
      // Refresh posts after successful action
      if (action === 'delete') {
        setPosts(posts.filter(p => !postIds.includes(p.id)));
      } else {
        // Update published status for affected posts
        setPosts(posts.map(p => {
          if (postIds.includes(p.id)) {
            return { ...p, published: action === 'publish' };
          }
          return p;
        }));
      }

      setSelectedPostIds(new Set());
      setDialogState({ ...dialogState, isOpen: false });
    } catch (error) {
      console.error('Bulk action failed:', error);
      setError(error instanceof Error ? error.message : 'Bulk action failed');
      setDialogState({ ...dialogState, isOpen: false });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">Content</p>
          <h1 className="text-2xl font-black tracking-tight">Posts</h1>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-xs mt-0.5 opacity-80">{error}</p>
          <p className="text-xs mt-1 opacity-60">Make sure you are signed in with an authorized account</p>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedPostIds.size > 0 && (
        <div className="mb-6 rounded-2xl border border-border/60 bg-muted/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="font-medium text-sm">
              {selectedPostIds.size} post{selectedPostIds.size !== 1 ? 's' : ''} selected
            </p>
            <button onClick={clearSelection} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')} disabled={isBulkActionLoading}>Publish</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('unpublish')} disabled={isBulkActionLoading}>Unpublish</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')} disabled={isBulkActionLoading} className="text-destructive border-destructive/30 hover:bg-destructive/10">Delete</Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {!isLoading && posts.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
            >
              {selectedPostIds.size === paginatedPosts.length ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
              Select all
            </button>
            <div className="w-px h-5 bg-border/60" />
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {[{val: statusFilter, fn: handleStatusChange, opts: [['all','All Status'],['published','Published'],['draft','Draft']]},
              {val: categoryFilter, fn: handleCategoryChange, opts: [['all','All Categories'], ...categories.map(c => [c,c])]},
              {val: sortBy, fn: handleSortChange, opts: [['newest','Newest'],['oldest','Oldest'],['views','Most Viewed'],['title','A–Z']]}
            ].map(({val, fn, opts}, i) => (
              <select key={i} value={val} onChange={e => fn(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {(opts as [string,string][]).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
            <span className="text-xs text-muted-foreground ml-auto font-mono">{filteredAndSortedPosts.length} posts</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
            <Link href="/admin/posts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>
        </Card>
      ) : filteredAndSortedPosts.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts match your filters.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setSortBy('newest');
                setCurrentPage(1);
                router.push(pathname);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedPosts.map((post) => (
              <Card key={post.id} className={selectedPostIds.has(post.id) ? 'ring-2 ring-ring' : ''}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => togglePostSelection(post.id)}
                      className="mt-0.5 shrink-0"
                    >
                      {selectedPostIds.has(post.id) ? (
                        <CheckSquare className="h-4 w-4 text-foreground" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>{formatDate(post.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span>{post.views} views</span>
                        <span className="mx-2">•</span>
                        <span className={post.published ? 'text-green-500' : 'text-yellow-500'}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/admin/posts/${post.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        onConfirm={dialogState.type === 'single' ? executeDelete : executeBulkAction}
        title={dialogState.title}
        description={dialogState.description}
        confirmText={dialogState.action === 'delete' ? 'Delete' : 'Confirm'}
        variant={dialogState.action === 'delete' ? 'danger' : 'warning'}
        isLoading={dialogState.type === 'bulk' && isBulkActionLoading}
      />
    </div>
  );
}
