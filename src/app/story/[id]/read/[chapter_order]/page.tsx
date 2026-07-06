import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getStory, getChapterText } from '@/lib/wattpad-client';
import ReaderClient from '@/components/ReaderClient';

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

export default async function ChapterReaderPage({ params }: PageProps) {
  const { id: storyId, chapter_order } = await params;
  const chapterIndex = parseInt(chapter_order, 10);

  /* ────────────────────────────────────
     WATTPAD STORY
  ──────────────────────────────────── */
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

    let chapterContent = '<p>Chapter text unavailable.</p>';
    try {
      chapterContent = await getChapterText(part.id);
    } catch (e) {
      console.warn('Chapter fetch failed:', e);
    }

    const totalChapters = parts.length;
    const progressPercentage = Math.round((chapterIndex / totalChapters) * 100);
    const readTime = estimateReadTime(chapterContent);

    const prevLink = chapterIndex > 1 ? `/story/${storyId}/read/${chapterIndex - 1}` : null;
    const nextLink = chapterIndex < totalChapters ? `/story/${storyId}/read/${chapterIndex + 1}` : null;

    return (
      <ReaderClient
        storyId={storyId}
        storyTitle={wpStory.title}
        chapterIndex={chapterIndex}
        chapterTitle={part.title}
        chapterContent={chapterContent}
        totalChapters={totalChapters}
        progressPercentage={progressPercentage}
        readTime={readTime}
        prevLink={prevLink}
        nextLink={nextLink}
        contentsLink={`/story/${storyId}`}
      />
    );
  }

  /* ────────────────────────────────────
     SUPABASE STORY
  ──────────────────────────────────── */
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
  const readTime = estimateReadTime(fullChapter?.content ?? '');

  const prevChapter = chapters.find(c => c.sort_order === chapterIndex - 1);
  const nextChapter = chapters.find(c => c.sort_order === chapterIndex + 1);

  const prevLink = prevChapter ? `/story/${storyId}/read/${prevChapter.sort_order}` : null;
  const nextLink = nextChapter ? `/story/${storyId}/read/${nextChapter.sort_order}` : null;

  return (
    <ReaderClient
      storyId={storyId}
      storyTitle={story.title}
      chapterIndex={chapterIndex}
      chapterTitle={activeChapter.title}
      chapterContent={fullChapter?.content ?? '<p>No content available.</p>'}
      totalChapters={totalChapters}
      progressPercentage={progressPercentage}
      readTime={readTime}
      prevLink={prevLink}
      nextLink={nextLink}
      contentsLink={`/story/${storyId}`}
    />
  );
}
