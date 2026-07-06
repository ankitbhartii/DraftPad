import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getStory } from '@/lib/wattpad-client';
import {
  BookOpen,
  Eye,
  Star,
  List,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// A Wattpad ID is purely numeric; Supabase IDs are UUIDs (contain hyphens)
function isWattpadId(id: string): boolean {
  return /^\d+$/.test(id);
}

export default async function StoryDetailsPage({ params }: PageProps) {
  const { id: storyId } = await params;

  /* ────────────────────────────────────
     WATTPAD STORY (numeric ID)
  ──────────────────────────────────── */
  if (isWattpadId(storyId)) {
    let wpStory: any = null;
    try {
      wpStory = await getStory(storyId);
    } catch (e) {
      console.error('Wattpad fetch error:', e);
      return notFound();
    }

    const parts: { id: number; title: string; url: string }[] = wpStory.parts ?? [];
    const totalChapters = parts.length;

    return (
      <div className="min-h-screen bg-[#0f0f12] text-white pb-16">
        {/* BLURRED BACKDROP */}
        <div className="relative w-full h-[300px] sm:h-[380px] overflow-hidden bg-[#18181c] border-b border-zinc-900">
          <div className="absolute inset-0 opacity-30 filter blur-3xl transform scale-110 pointer-events-none">
            {wpStory.cover && (
              <Image src={wpStory.cover} alt="" fill className="object-cover" priority unoptimized />
            )}
          </div>
          {/* Back */}
          <div className="absolute top-4 left-4 z-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur text-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* BOOK INFO */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-[190px] sm:-mt-[230px] relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Cover */}
            <div className="relative w-40 h-[240px] sm:w-44 sm:h-[264px] bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-700 shadow-2xl shadow-black/70 flex-shrink-0">
              {wpStory.cover ? (
                <Image src={wpStory.cover} alt={wpStory.title} fill className="object-cover" priority unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-zinc-600" />
                </div>
              )}
            </div>

            {/* Core Info */}
            <div className="space-y-3.5 pb-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {wpStory.completed && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest rounded">
                    <CheckCircle2 className="w-3 h-3" /> Complete
                  </span>
                )}
                {wpStory.mature && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] uppercase font-bold tracking-widest rounded">
                    Mature
                  </span>
                )}
                {wpStory.mainCategoryEnglish && (
                  <span className="px-2.5 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] uppercase font-bold tracking-widest rounded">
                    {wpStory.mainCategoryEnglish}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {wpStory.title}
              </h1>

              {/* Author */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-300">
                {wpStory.user?.avatar && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-700 border border-zinc-600 flex-shrink-0">
                    <Image
                      src={wpStory.user.avatar}
                      alt={wpStory.user.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                      unoptimized
                    />
                  </div>
                )}
                <span className="font-semibold text-white">{wpStory.user?.name ?? 'Unknown'}</span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-zinc-500" /> {formatCount(wpStory.readCount)} Reads
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" /> {formatCount(wpStory.voteCount)} Votes
                </span>
                <span className="flex items-center gap-1">
                  <List className="w-4 h-4 text-zinc-500" /> {totalChapters} Parts
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {totalChapters > 0 ? (
              <Link
                href={`/story/${storyId}/read/1`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-sm font-extrabold shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> READ
              </Link>
            ) : (
              <button disabled className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-800 text-zinc-500 rounded-full text-sm font-extrabold cursor-default">
                NO CHAPTERS
              </button>
            )}
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-[#ff6122] hover:bg-zinc-800/50 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-[#ff6122] hover:bg-zinc-800/50 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            {/* LEFT: Synopsis & Chapters */}
            <div className="md:col-span-8 space-y-8">
              {/* Synopsis */}
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">Synopsis</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {wpStory.description || 'No description provided.'}
                </p>
              </div>

              {/* Tags */}
              {wpStory.tags && wpStory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {wpStory.tags.slice(0, 12).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-wide">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Table of Contents */}
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span>Table of Contents</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{totalChapters} chapters</span>
                </h3>
                {totalChapters === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">No chapters available.</div>
                ) : (
                  <div className="divide-y divide-zinc-800/80 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                    {parts.map((part, idx) => (
                      <Link
                        key={part.id}
                        href={`/story/${storyId}/read/${idx + 1}`}
                        className="flex items-center justify-between py-3 hover:text-[#ff6122] transition-colors group text-sm font-medium"
                      >
                        <span className="truncate pr-4 text-zinc-300 group-hover:text-[#ff6122] transition-colors">
                          {idx + 1}. {part.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 group-hover:text-[#ff6122] transition-colors flex items-center gap-1 flex-shrink-0">
                          Read <BookOpen className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Author card */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">About the Author</h3>
                <div className="flex items-center gap-3.5">
                  {wpStory.user?.avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-700 border border-zinc-600 flex-shrink-0">
                      <Image
                        src={wpStory.user.avatar}
                        alt={wpStory.user.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{wpStory.user?.name?.[0] ?? '?'}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-extrabold text-white">{wpStory.user?.name ?? 'Unknown'}</p>
                    <p className="text-[10px] text-zinc-500">@{wpStory.user?.name?.toLowerCase().replace(/\s+/g, '_') ?? 'author'}</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors">
                  Follow Author
                </button>
              </div>

              {/* Story Details Card */}
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">Story Details</h3>
                <div className="space-y-2 text-xs text-zinc-400">
                  {wpStory.mainCategoryEnglish && (
                    <div className="flex justify-between">
                      <span>Genre</span>
                      <span className="text-zinc-200 font-medium">{wpStory.mainCategoryEnglish}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-medium ${wpStory.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {wpStory.completed ? 'Complete' : 'Ongoing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parts</span>
                    <span className="text-zinc-200 font-medium">{totalChapters}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────
     SUPABASE STORY (UUID)
  ──────────────────────────────────── */
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select(`
      id, title, description, cover_url, status, created_at,
      profiles ( id, username, display_name, avatar_url )
    `)
    .eq('id', storyId)
    .single();

  if (storyError || !story) {
    console.error('Error fetching story:', storyError);
    return notFound();
  }

  const { data: chaptersData } = await supabase
    .from('chapters')
    .select('id, title, sort_order')
    .eq('story_id', storyId)
    .order('sort_order', { ascending: true });

  const chapters = (chaptersData || []) as { id: string; title: string; sort_order: number }[];
  const multiplier = story.title.length * 3;
  const reads = multiplier > 100 ? `${(multiplier / 10).toFixed(1)}K` : `${multiplier * 12}`;
  const votes = Math.round(multiplier * 1.8);
  const totalChapters = chapters.length;
  const author = story.profiles as any;
  const authorName = author?.display_name || author?.username || 'Anonymous Writer';
  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=ff6122&color=fff`;
  const createdDate = new Date(story.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white pb-16">
      {/* BLURRED BACKDROP */}
      <div className="relative w-full h-[280px] sm:h-[350px] overflow-hidden bg-[#18181c] border-b border-zinc-900">
        <div className="absolute inset-0 opacity-30 filter blur-3xl transform scale-110 pointer-events-none">
          {story.cover_url && (
            <Image src={story.cover_url} alt="" fill className="object-cover" priority />
          )}
        </div>
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur text-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* BOOK INFO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-[180px] sm:-mt-[220px] relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
          <div className="relative w-40 h-[240px] sm:w-44 sm:h-[264px] bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-700 shadow-2xl shadow-black/60 flex-shrink-0">
            {story.cover_url ? (
              <Image src={story.cover_url} alt={story.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-zinc-600" />
              </div>
            )}
          </div>

          <div className="space-y-3.5 pb-2">
            <span className="inline-flex items-center px-3 py-0.5 bg-[#ff6122] text-white text-[10px] uppercase font-bold tracking-widest rounded">
              {story.status}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {story.title}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-300">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-700 border border-zinc-600">
                <Image src={authorAvatar} alt={authorName} fill className="object-cover" sizes="24px" unoptimized />
              </div>
              <span className="font-semibold text-white">{authorName}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-zinc-500" /> {reads} Reads</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-orange-400 fill-orange-400" /> {votes} Votes</span>
              <span className="flex items-center gap-1"><List className="w-4 h-4 text-zinc-500" /> {totalChapters} Parts</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {totalChapters > 0 ? (
            <Link
              href={`/story/${story.id}/read/1`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-sm font-extrabold shadow-lg shadow-orange-500/20 transition-all"
            >
              <BookOpen className="w-4 h-4" /> READ
            </Link>
          ) : (
            <button disabled className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-800 text-zinc-500 rounded-full text-sm font-extrabold cursor-default">
              NO CHAPTERS
            </button>
          )}
          <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-[#ff6122] transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-[#ff6122] transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-8 space-y-8">
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">Synopsis</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{story.description || 'No description provided.'}</p>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center justify-between">
                <span>Table of Contents</span>
                <span className="text-[10px] text-zinc-500 font-bold">{totalChapters} chapters</span>
              </h3>
              {totalChapters === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">No chapters available.</div>
              ) : (
                <div className="divide-y divide-zinc-800/80 max-h-[480px] overflow-y-auto custom-scrollbar">
                  {chapters.map((ch) => (
                    <Link
                      key={ch.id}
                      href={`/story/${storyId}/read/${ch.sort_order}`}
                      className="flex items-center justify-between py-3 hover:text-[#ff6122] transition-colors group text-sm font-medium"
                    >
                      <span className="truncate pr-4 text-zinc-300 group-hover:text-[#ff6122] transition-colors">
                        {ch.sort_order}. {ch.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 group-hover:text-[#ff6122] transition-colors flex items-center gap-1">
                        Read <BookOpen className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">About the Author</h3>
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-700 border border-zinc-600 flex-shrink-0">
                  <Image src={authorAvatar} alt={authorName} fill className="object-cover" sizes="48px" unoptimized />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">{authorName}</p>
                  <p className="text-[10px] text-zinc-500">@{author?.username ?? 'wattpad_curator'}</p>
                </div>
              </div>
              <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors">
                Follow Author
              </button>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">Story Details</h3>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-emerald-400 font-medium capitalize">{story.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parts</span>
                  <span className="text-zinc-200 font-medium">{totalChapters}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-zinc-200 font-medium">{createdDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
