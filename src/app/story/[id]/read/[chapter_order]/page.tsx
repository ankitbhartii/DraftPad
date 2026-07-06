import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getStory, getChapterText } from '@/lib/wattpad-client';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ListOrdered,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string; chapter_order: string }>;
}

function isWattpadId(id: string): boolean {
  return /^\d+$/.test(id);
}

function estimateReadTime(text: string): number {
  const words = text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ──────────────────────────────────── */

export default async function ChapterReaderPage({ params }: PageProps) {
  const { id: storyId, chapter_order } = await params;
  const chapterIndex = parseInt(chapter_order, 10);

  /* ─── WATTPAD STORY ─── */
  if (isWattpadId(storyId)) {
    let wpStory: any = null;
    try {
      wpStory = await getStory(storyId);
    } catch {
      return notFound();
    }

    const parts: { id: number; title: string }[] = wpStory?.parts ?? [];
    if (!parts.length) return notFound();

    const part = parts[chapterIndex - 1];
    if (!part) return notFound();

    // Fetch chapter text directly via wattpad-client
    let chapterContent = '<p>Chapter text unavailable.</p>';
    try {
      chapterContent = await getChapterText(part.id);
    } catch (e) {
      console.warn('Chapter fetch failed:', e);
    }

    const totalChapters = parts.length;
    const prevPart = chapterIndex > 1 ? parts[chapterIndex - 2] : null;
    const nextPart = chapterIndex < totalChapters ? parts[chapterIndex] : null;
    const progressPercentage = Math.round((chapterIndex / totalChapters) * 100);
    const readTime = estimateReadTime(chapterContent);

    return (
      <div className="min-h-screen bg-[#0f0f12] text-zinc-100">
        {/* TOP READER BAR */}
        <header className="sticky top-0 z-40 bg-[#0f0f12]/95 backdrop-blur border-b border-zinc-800/80 px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={`/story/${storyId}`}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-500 truncate">{wpStory.title}</p>
                <p className="text-xs font-bold text-white truncate">
                  Part {chapterIndex}: {part.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[10px] text-zinc-500 hidden sm:block">{readTime} min read</span>
              <div className="flex items-center gap-1.5">
                <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff6122] rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500">{progressPercentage}%</span>
              </div>
              <Link
                href={`/story/${storyId}`}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Table of Contents"
              >
                <ListOrdered className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* CHAPTER CONTENT */}
        <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-8 leading-tight">
            {part.title}
          </h2>

          <article
            id="chapter-top"
            className="prose prose-invert prose-sm sm:prose-base max-w-none 
              prose-p:text-zinc-300 prose-p:leading-[1.9] prose-p:mb-5
              prose-strong:text-white prose-em:text-zinc-200
              prose-h1:text-white prose-h2:text-white prose-h3:text-white
              prose-blockquote:border-[#ff6122] prose-blockquote:text-zinc-400
              font-serif text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: chapterContent }}
          />

          {/* CHAPTER NAVIGATION */}
          <div className="mt-14 pt-8 border-t border-zinc-800 flex items-center justify-between gap-4">
            {prevPart ? (
              <Link
                href={`/story/${storyId}/read/${chapterIndex - 1}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-full text-xs font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="truncate max-w-[120px]">Prev</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href={`/story/${storyId}`}
              className="text-xs text-zinc-500 hover:text-[#ff6122] transition-colors font-medium"
            >
              Contents
            </Link>

            {nextPart ? (
              <Link
                href={`/story/${storyId}/read/${chapterIndex + 1}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-xs font-bold transition-all"
              >
                <span className="truncate max-w-[120px]">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                ✓ Completed
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ─── SUPABASE STORY ─── */
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('id, title, cover_url, profiles (display_name, username)')
    .eq('id', storyId)
    .single();

  if (storyError || !story) return notFound();

  const { data: chaptersData } = await supabase
    .from('chapters')
    .select('id, title, sort_order')
    .eq('story_id', storyId)
    .order('sort_order', { ascending: true });

  const chapters = (chaptersData || []) as { id: string; title: string; sort_order: number }[];
  if (chapters.length === 0) return notFound();

  const activeChapter = chapters.find(c => c.sort_order === chapterIndex) || chapters[0];

  const { data: fullChapter } = await supabase
    .from('chapters')
    .select('content')
    .eq('id', activeChapter.id)
    .single();

  const totalChapters = chapters.length;
  const progressPercentage = Math.round((chapterIndex / totalChapters) * 100);
  const prevChapter = chapters.find(c => c.sort_order === chapterIndex - 1);
  const nextChapter = chapters.find(c => c.sort_order === chapterIndex + 1);
  const readTime = estimateReadTime(fullChapter?.content ?? '');

  return (
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100">
      {/* TOP READER BAR */}
      <header className="sticky top-0 z-40 bg-[#0f0f12]/95 backdrop-blur border-b border-zinc-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/story/${storyId}`}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] text-zinc-500 truncate">{story.title}</p>
              <p className="text-xs font-bold text-white truncate">
                Chapter {chapterIndex}: {activeChapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-zinc-500 hidden sm:block">{readTime} min read</span>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff6122] rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500">{progressPercentage}%</span>
            </div>
            <Link
              href={`/story/${storyId}`}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Table of Contents"
            >
              <ListOrdered className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* CHAPTER CONTENT */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-8 leading-tight">
          {activeChapter.title}
        </h2>

        <article
          id="chapter-top"
          className="prose prose-invert prose-sm sm:prose-base max-w-none
            prose-p:text-zinc-300 prose-p:leading-[1.9] prose-p:mb-5
            prose-strong:text-white prose-em:text-zinc-200
            prose-h1:text-white prose-h2:text-white prose-h3:text-white
            prose-blockquote:border-[#ff6122] prose-blockquote:text-zinc-400
            font-serif text-[17px] sm:text-[18px]"
          dangerouslySetInnerHTML={{ __html: fullChapter?.content ?? '<p>No content available.</p>' }}
        />

        {/* CHAPTER NAVIGATION */}
        <div className="mt-14 pt-8 border-t border-zinc-800 flex items-center justify-between gap-4">
          {prevChapter ? (
            <Link
              href={`/story/${storyId}/read/${prevChapter.sort_order}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-full text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Link>
          ) : (
            <div />
          )}

          <Link href={`/story/${storyId}`} className="text-xs text-zinc-500 hover:text-[#ff6122] transition-colors font-medium">
            Contents
          </Link>

          {nextChapter ? (
            <Link
              href={`/story/${storyId}/read/${nextChapter.sort_order}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-xs font-bold transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
              ✓ Completed
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
