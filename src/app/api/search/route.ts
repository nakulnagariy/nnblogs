import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/supabase/queries';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // 30 requests per minute per IP
    const ip = getClientIp(request);
    const { success } = rateLimit(`search:${ip}`, 30, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 },
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const results = await searchContent(query);
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
