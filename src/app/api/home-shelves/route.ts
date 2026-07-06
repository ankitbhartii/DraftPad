import { NextResponse } from 'next/server';
import { getHomeShelves } from '@/lib/wattpad-client';

export const dynamic = 'force-dynamic';

// Race fetching against a hard 20-second timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
  ]);
}

const EMPTY = {
  originals: [], topPicks: [], romance: [], teenfiction: [],
  fantasy: [], mystery: [], scifi: [], horror: [], werewolf: [],
  action: [], humor: [], historical: [], vampire: [], lgbtq: [], newadult: [],
};

export async function GET() {
  try {
    const shelves = await withTimeout(getHomeShelves(), 20_000, EMPTY);
    return NextResponse.json(shelves, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('[home-shelves API]', err);
    return NextResponse.json(EMPTY, { status: 200 }); // always 200 so client shows retry
  }
}
