import type { Node as MarkdocAstNode } from '@markdoc/markdoc';

// Content Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  /** Markdoc AST — render with Markdoc.transform() + Markdoc.renderers.react() (see MarkdownRenderer). */
  content: MarkdocAstNode;
  /** Plain-text rendition of `content` via Markdoc.format() — for search, reading time, and heading extraction. */
  contentText: string;
  excerpt: string;
  featured_image?: string;
  category: string;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// GitHub Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company?: string;
  blog?: string;
  location?: string;
  email?: string;
  bio?: string;
  twitter_username?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  homepage?: string;
  language?: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'post';
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
