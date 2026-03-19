import { NextRequest, NextResponse } from 'next/server';
import { getGitHubUser, getGitHubRepos, getGitHubStats } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';

    switch (type) {
      case 'user':
        const user = await getGitHubUser();
        return NextResponse.json({ data: user });

      case 'repos':
        const limit = parseInt(searchParams.get('limit') || '10');
        const repos = await getGitHubRepos('stars', limit);
        return NextResponse.json({ data: repos });

      case 'stats':
      default:
        const stats = await getGitHubStats();
        return NextResponse.json({ data: stats });
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
