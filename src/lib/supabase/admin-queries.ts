import { supabaseAdmin } from './server';
import type { BlogPost, Video, Project } from '@/types';

// Posts CRUD
export async function createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>) {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(id: string, post: Partial<BlogPost>) {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAllPosts() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Videos CRUD
export async function createVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'views'>) {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .insert(video)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVideo(id: string, video: Partial<Video>) {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .update(video)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVideo(id: string) {
  const { error } = await supabaseAdmin
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAllVideos() {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Projects CRUD
export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAllProjects() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
