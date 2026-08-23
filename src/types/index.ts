// Content Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category: string;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
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
  type: 'post' | 'video' | 'project' | 'topic';
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  created_at: string;
}

// Interview Prep Types
export interface TopicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  topic_count?: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ContentType = 'notes' | 'example' | 'assessment' | 'flashcards';
export type TopicStatus = 'draft' | 'published' | 'archived';
export type AccessLevel = 'free' | 'premium';

export interface Topic {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  category?: TopicCategory;
  sort_order: number;
  difficulty: Difficulty;
  estimated_minutes: number;
  status: TopicStatus;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface InterviewQuestion {
  id: string;
  topic_id: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  source: 'ai_generated' | 'community' | 'curated';
}

export interface TopicDetail extends Topic {
  notes: string | null;
  example: string | null;
  assessment: string | null;
  flashcards: Flashcard[];
  questions: InterviewQuestion[];
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
