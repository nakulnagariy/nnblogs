// Database Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category: string;
  tags: string[];
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: string;
  category: string;
  tags: string[];
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  views: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  technologies: string[];
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
  type: 'post' | 'video' | 'project';
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
