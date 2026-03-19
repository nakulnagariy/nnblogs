-- NNBlogs Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category VARCHAR(100) REFERENCES categories(name) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  author_id VARCHAR(255) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration VARCHAR(20),
  category VARCHAR(100) REFERENCES categories(name) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  author_id VARCHAR(255) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_slug VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET views = views + 1 
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_slug VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET views = views + 1 
  WHERE slug = video_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view published videos" ON videos
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view all projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public can view all categories" ON categories
  FOR SELECT USING (true);

-- Authenticated user write access (admin operations)
-- Posts: Allow authenticated users to create their own posts
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (true);

-- Posts: Allow authenticated users to view all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts" ON posts
  FOR SELECT USING (true);

-- Posts: Allow authenticated users to update posts
CREATE POLICY "Authenticated users can update posts" ON posts
  FOR UPDATE USING (true);

-- Posts: Allow authenticated users to delete posts
CREATE POLICY "Authenticated users can delete posts" ON posts
  FOR DELETE USING (true);

-- Videos: Allow authenticated users to create videos
CREATE POLICY "Authenticated users can create videos" ON videos
  FOR INSERT WITH CHECK (true);

-- Videos: Allow authenticated users to view all videos (including drafts)
CREATE POLICY "Authenticated users can view all videos" ON videos
  FOR SELECT USING (true);

-- Videos: Allow authenticated users to update videos
CREATE POLICY "Authenticated users can update videos" ON videos
  FOR UPDATE USING (true);

-- Videos: Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete videos" ON videos
  FOR DELETE USING (true);

-- Projects: Allow authenticated users to create projects
CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (true);

-- Projects: Allow authenticated users to update projects
CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE USING (true);

-- Projects: Allow authenticated users to delete projects
CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE USING (true);

-- Insert some default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Posts about technology and software'),
  ('Web Development', 'web-development', 'Web development tutorials and tips'),
  ('Programming', 'programming', 'General programming topics'),
  ('DevOps', 'devops', 'DevOps and infrastructure'),
  ('Career', 'career', 'Career advice and experiences'),
  ('Tutorials', 'tutorials', 'Step-by-step tutorials')
ON CONFLICT (slug) DO NOTHING;
