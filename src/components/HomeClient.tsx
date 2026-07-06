'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp, Sparkles, Heart, BookOpen, Eye, Star, List,
  Search, Ghost, Swords, Atom, Laugh, Scroll, Zap, GraduationCap,
  Crown, Sliders, RefreshCw,
} from 'lucide-react';

interface Story {
  id: number;
  title: string;
  description: string;
  cover: string;
  url: string;
  completed: boolean;
  mature: boolean;
  voteCount: number;
  readCount: number;
  numParts: number;
  mainCategory?: string;
  user: { name: string; avatar: string };
}

interface Shelves {
  originals: Story[];
  topPicks: Story[];
  romance: Story[];
  teenfiction: Story[];
  fantasy: Story[];
  mystery: Story[];
  werewolf: Story[];
  vampire: Story[];
  action: Story[];
  scifi: Story[];
  horror: Story[];
  humor: Story[];
  historical: Story[];
  lgbtq: Story[];
  newadult: Story[];
}

function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-36 sm:w-40 space-y-2 animate-pulse">
      <div className="w-full h-[216px] sm:h-[240px] bg-zinc-800 rounded-xl" />
      <div className="h-3 bg-zinc-800 rounded w-4/5" />
      <div className="h-2.5 bg-zinc-800/60 rounded w-3/5" />
    </div>
  );
}

/* ── Book card ── */
function BookCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group flex-shrink-0 w-36 sm:w-40 space-y-2 transition-transform duration-300 hover:scale-[1.04]"
    >
      <div className="relative w-full h-[216px] sm:h-[240px] bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/30 shadow-md group-hover:shadow-2xl group-hover:shadow-black/60 transition-all duration-300">
        {story.cover ? (
          <Image
            src={story.cover}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 144px, 160px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1 flex-wrap">
          {story.completed && (
            <span className="text-[8px] font-extrabold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded tracking-wide">COMPLETE</span>
          )}
          {story.mature && (
            <span className="text-[8px] font-extrabold bg-red-500/80 text-white px-1.5 py-0.5 rounded">MATURE</span>
          )}
        </div>
      </div>
      <div className="space-y-0.5 px-0.5">
        <p className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-[#ff6122] transition-colors">{story.title}</p>
        <p className="text-[10px] text-zinc-500 truncate">{story.user?.name}</p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600 pt-0.5">
          <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{formatCount(story.readCount)}</span>
          <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-orange-400" />{formatCount(story.voteCount)}</span>
          <span className="flex items-center gap-0.5"><List className="w-2.5 h-2.5" />{story.numParts}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Shelf ── */
function Shelf({
  title, icon, stories, accentColor = 'text-[#ff6122]', badge, loading,
}: {
  title: string;
  icon: React.ReactNode;
  stories: Story[];
  accentColor?: string;
  badge?: string;
  loading: boolean;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-white uppercase tracking-widest">
          <span className={accentColor}>{icon}</span>
          {title}
          {badge && <span className="text-[9px] font-bold px-2 py-0.5 bg-[#ff6122] text-white rounded-full normal-case tracking-normal">{badge}</span>}
        </h2>
        {!loading && <span className="text-[10px] text-zinc-700 font-semibold">{stories.length} books</span>}
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : stories.map(story => <BookCard key={story.id} story={story} />)
          }
        </div>
      </div>
    </section>
  );
}

const EMPTY_SHELVES: Shelves = {
  originals: [], topPicks: [], romance: [], teenfiction: [], fantasy: [],
  mystery: [], werewolf: [], vampire: [], action: [], scifi: [],
  horror: [], humor: [], historical: [], lgbtq: [], newadult: [],
};

export default function HomeClient() {
  const [shelves, setShelves] = useState<Shelves>(EMPTY_SHELVES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/home-shelves', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setShelves(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const featured = shelves.originals[0] ?? shelves.topPicks[0] ?? null;

  return (
    <main className="min-h-screen bg-[#0f0f12] text-white pb-20">

      {/* ── HERO ── */}
      {featured && !loading && (
        <section className="relative overflow-hidden border-b border-zinc-900/80">
          <div className="absolute inset-0 pointer-events-none">
            {featured.cover && (
              <Image src={featured.cover} alt="" fill className="object-cover scale-110 blur-3xl opacity-25" priority unoptimized />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f12]/50 via-[#0f0f12]/70 to-[#0f0f12]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-1 md:col-span-3 flex justify-center">
              <Link href={`/story/${featured.id}`} className="relative block w-40 h-[240px] sm:w-44 sm:h-[264px] bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/80 hover:scale-105 transition-transform duration-300">
                {featured.cover && <Image src={featured.cover} alt={featured.title} fill className="object-cover" priority unoptimized />}
              </Link>
            </div>
            <div className="col-span-1 md:col-span-9 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff6122] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
                {featured.completed && <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest rounded-full">Complete</span>}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">{featured.title}</h1>
              <p className="text-sm text-zinc-400">by <span className="text-white font-semibold">{featured.user?.name}</span></p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-zinc-500" />{formatCount(featured.readCount)} Reads</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-orange-400 fill-orange-400" />{formatCount(featured.voteCount)} Votes</span>
                <span className="flex items-center gap-1.5"><List className="w-4 h-4 text-zinc-500" />{featured.numParts} Parts</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl line-clamp-3">{featured.description}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <Link href={`/story/${featured.id}`} className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-sm font-extrabold shadow-lg shadow-orange-500/20 transition-all">
                  <BookOpen className="w-4 h-4" /> Read Now
                </Link>
                <Link href={`/story/${featured.id}`} className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm font-bold transition-all">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ERROR STATE ── */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
          <BookOpen className="w-12 h-12 opacity-30" />
          <p className="text-sm">Could not load books. Check your connection.</p>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#ff6122] text-white rounded-full text-sm font-bold hover:bg-[#e04f1a] transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {/* ── SHELVES ── */}
      <div className="py-10 space-y-10">
        <Shelf title="Wattpad Originals" icon={<Crown className="w-4 h-4" />} stories={shelves.originals} accentColor="text-yellow-400" badge="Featured" loading={loading} />
        <Shelf title="Top Picks" icon={<TrendingUp className="w-4 h-4" />} stories={shelves.topPicks} accentColor="text-[#ff6122]" loading={loading} />
        <Shelf title="Romance" icon={<Heart className="w-4 h-4" />} stories={shelves.romance} accentColor="text-pink-400" loading={loading} />
        <Shelf title="Teen Fiction" icon={<GraduationCap className="w-4 h-4" />} stories={shelves.teenfiction} accentColor="text-emerald-400" loading={loading} />
        <Shelf title="Fantasy" icon={<Sparkles className="w-4 h-4" />} stories={shelves.fantasy} accentColor="text-purple-400" loading={loading} />
        <Shelf title="Mystery & Thriller" icon={<Search className="w-4 h-4" />} stories={shelves.mystery} accentColor="text-amber-400" loading={loading} />
        <Shelf title="Werewolf" icon={<Zap className="w-4 h-4" />} stories={shelves.werewolf} accentColor="text-indigo-400" loading={loading} />
        <Shelf title="Vampire" icon={<Ghost className="w-4 h-4" />} stories={shelves.vampire} accentColor="text-red-400" loading={loading} />
        <Shelf title="Action & Adventure" icon={<Swords className="w-4 h-4" />} stories={shelves.action} accentColor="text-orange-400" loading={loading} />
        <Shelf title="Science Fiction" icon={<Atom className="w-4 h-4" />} stories={shelves.scifi} accentColor="text-cyan-400" loading={loading} />
        <Shelf title="Horror" icon={<Ghost className="w-4 h-4" />} stories={shelves.horror} accentColor="text-rose-500" loading={loading} />
        <Shelf title="Humor & Comedy" icon={<Laugh className="w-4 h-4" />} stories={shelves.humor} accentColor="text-yellow-400" loading={loading} />
        <Shelf title="Historical Romance" icon={<Scroll className="w-4 h-4" />} stories={shelves.historical} accentColor="text-amber-300" loading={loading} />
        <Shelf title="LGBTQ+" icon={<Heart className="w-4 h-4" />} stories={shelves.lgbtq} accentColor="text-fuchsia-400" loading={loading} />
        <Shelf title="New Adult" icon={<GraduationCap className="w-4 h-4" />} stories={shelves.newadult} accentColor="text-teal-400" loading={loading} />
      </div>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50 pt-8 mt-12 text-center text-xs text-zinc-700">
        <p>© 2026 Wattpad Clone — Powered by live Wattpad API · Built with Next.js</p>
      </footer>
    </main>
  );
}
