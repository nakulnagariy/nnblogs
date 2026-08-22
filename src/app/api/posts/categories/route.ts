import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('category')
      .eq('published', true);

    if (error) throw error;

    const categories = [...new Set(data?.map((r) => r.category).filter(Boolean) as string[])].sort();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
