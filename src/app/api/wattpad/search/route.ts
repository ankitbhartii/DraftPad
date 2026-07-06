import { NextRequest, NextResponse } from 'next/server';
import { searchStories } from '@/lib/wattpad-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const limit = Number(searchParams.get('limit') ?? 20);
  const offset = Number(searchParams.get('offset') ?? 0);

  if (!query.trim()) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const results = await searchStories(query, limit, offset, false);
    return NextResponse.json(results);
  } catch (err: any) {
    console.error('[Wattpad Search API]', err.message);
    return NextResponse.json(
      { error: err.message ?? 'Search failed' },
      { status: 500 }
    );
  }
}
