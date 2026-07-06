import { NextRequest, NextResponse } from 'next/server';
import { getChapterText } from '@/lib/wattpad-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ partId: string }> }
) {
  const { partId } = await params;

  try {
    const content = await getChapterText(partId);
    return NextResponse.json({ id: partId, content });
  } catch (err: any) {
    console.error('[Wattpad Chapter API]', err.message);
    return NextResponse.json(
      { error: err.message ?? 'Failed to fetch chapter', content: '<p>Chapter text could not be loaded.</p>' },
      { status: 500 }
    );
  }
}
