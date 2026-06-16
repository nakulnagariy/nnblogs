import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient, supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSessionClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    const [topPostsResult, topVideosResult] = await Promise.all([
      supabaseAdmin
        .from('posts')
        .select('id, title, slug, views, category')
        .eq('published', true)
        .gte('created_at', sinceIso)
        .order('views', { ascending: false })
        .limit(10),
      supabaseAdmin
        .from('videos')
        .select('id, title, slug, views, category')
        .eq('published', true)
        .gte('created_at', sinceIso)
        .order('views', { ascending: false })
        .limit(10),
    ]);

    return NextResponse.json({
      topPosts: topPostsResult.data || [],
      topVideos: topVideosResult.data || [],
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
