import { NextRequest, NextResponse } from 'next/server';
import { searchByCategory } from '@/lib/wattpad-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'best stories';
  const limit = Number(searchParams.get('limit') ?? 16);

  try {
    const stories = await searchByCategory(category, limit);
    return NextResponse.json({ stories });
  } catch (err: any) {
    console.error('[Wattpad Trending API]', err.message);
    return NextResponse.json(
      { error: err.message ?? 'Failed to fetch', stories: [] },
      { status: 500 }
    );
  }
}
