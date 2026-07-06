import { NextRequest, NextResponse } from 'next/server';
import { getStory } from '@/lib/wattpad-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const story = await getStory(id);
    return NextResponse.json(story);
  } catch (err: any) {
    console.error('[Wattpad Story API]', err.message);
    return NextResponse.json(
      { error: err.message ?? 'Failed to fetch story' },
      { status: 500 }
    );
  }
}
