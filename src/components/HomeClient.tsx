'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import {
  TrendingUp, Sparkles, Heart, BookOpen, Eye, Star, List,
  Ghost, Swords, Atom, Laugh, Scroll, Zap, GraduationCap,
  Crown, RefreshCw, Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ──────────── Types ──────────── */
interface Story {
  id: number;
  title: string;
  description?: string;
  cover: string;
  url?: string;
  completed?: boolean;
  mature?: boolean;
  voteCount?: number;
  readCount?: number;
  numParts?: number;
  user: { name: string; avatar?: string };
}

function fmt(n?: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ──────────── Skeleton card ──────────── */
function Bone() {
  return (
    <div className="flex-shrink-0 w-36 sm:w-40 space-y-2 animate-pulse">
      <div className="w-full h-52 bg-zinc-800/80 rounded-xl" />
      <div className="h-3 bg-zinc-800 rounded w-4/5" />
      <div className="h-2.5 bg-zinc-800/60 rounded w-1/2" />
    </div>
  );
}

/* ──────────── Book card ──────────── */
function Card({ story }: { story: Story }) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group flex-shrink-0 w-36 sm:w-40 space-y-2 transition-transform duration-300 hover:scale-[1.04]"
    >
      <div className="relative w-full h-52 sm:h-56 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/30 shadow-md group-hover:shadow-xl group-hover:shadow-black/60 transition-all duration-300">
        {story.cover ? (
          <Image
            src={story.cover}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="160px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1 flex-wrap">
          {story.completed && (
            <span className="text-[8px] font-extrabold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded-full tracking-wide">COMPLETE</span>
          )}
          {story.mature && (
            <span className="text-[8px] font-extrabold bg-red-500/80 text-white px-1.5 py-0.5 rounded-full">MATURE</span>
          )}
        </div>
      </div>
      <div className="px-0.5 space-y-0.5">
        <p className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-[#ff6122] transition-colors">{story.title}</p>
        <p className="text-[10px] text-zinc-500 truncate">{story.user?.name}</p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600 pt-0.5">
          <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{fmt(story.readCount)}</span>
          <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-orange-400" />{fmt(story.voteCount)}</span>
          <span className="flex items-center gap-0.5"><List className="w-2.5 h-2.5" />{story.numParts}</span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────── Shelf ──────────── */
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    // A small timeout helps ensure the DOM has rendered completely before checking scrollWidth
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [stories, loading]);

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmt = clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="space-y-3 relative group">
      <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8">
        <span className={accentColor}>{icon}</span>
        <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">{title}</h2>
        {badge && <span className="text-[9px] font-bold px-2 py-0.5 bg-[#ff6122] text-white rounded-full">{badge}</span>}
        {loading && <Loader2 className="w-3 h-3 text-zinc-600 animate-spin ml-auto" />}
        {!loading && <span className="ml-auto text-[10px] text-zinc-700 font-semibold">{stories.length} books</span>}
      </div>
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Left Arrow Button */}
        {showLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-zinc-100 text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 border border-zinc-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Right Arrow Button */}
        {showRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-zinc-100 text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 border border-zinc-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-x-auto pb-3 hide-scrollbar scroll-smooth" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <Bone key={i} />)
              : stories.map(s => <Card key={s.id} story={s} />)
            }
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────── Originals IDs (top 20 verified) ──────────── */
const ORIGINALS_IDS = [
  80428185, 406237427, 18024139, 276397008, 17846448, 128716730,
  890487, 105872, 73995048, 24288443, 206445908, 206445142,
  206439698, 301996676, 406496461, 406497098, 406496269, 406496775,
  406497274, 406496912,
];

/* ──────────── Top 10 in India verified IDs & tags ──────────── */
const TOP_INDIA_IDS = [
  393176419, // Her cursed prince I Dhruv Taara
  373949638, // Broken Promises
  409747256, // seducing the senior
  378528365, // ISHQ : PROFESSOR'S DESTINY
  397310104, // Throne and Thread
  388459013, // May I Come In Sir
  262381160, // His Butterfly
  397631792, // RIYA: HIS REPLACED BRIDE
];

const TOP_INDIA_TAGS: Record<number, string> = {
  393176419: 'forcedmarriage',
  373949638: 'promise',
  409747256: 'desiromance',
  378528365: 'unique',
  397310104: 'indiandynasty',
  388459013: 'adultthemes',
  262381160: 'shy',
  397631792: 'past',
};

/* ──────────── Top India Card with stylized rank outline number ──────────── */
function TopIndiaCard({ story, rank, tag }: { story: Story; rank: number; tag: string }) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group flex-shrink-0 w-36 sm:w-40 space-y-2 transition-transform duration-300 hover:scale-[1.04] relative"
    >
      <div className="relative w-full h-52 sm:h-56 bg-zinc-800 rounded-xl border border-zinc-700/30 shadow-md group-hover:shadow-xl group-hover:shadow-black/60 transition-all duration-300">
        
        {/* Giant outline number sitting on top-left/bottom-left overlapping the cover */}
        <span 
          className="absolute -left-3 -bottom-5 text-[100px] font-black select-none z-30 font-sans tracking-tighter transition-transform duration-300 group-hover:scale-110"
          style={{ 
            WebkitTextStroke: '4px #0f0f12', 
            color: '#fff',
            paintOrder: 'stroke fill'
          }}
        >
          {rank}
        </span>

        <div className="relative w-full h-full rounded-xl overflow-hidden z-25">
          {story.cover ? (
            <Image
              src={story.cover}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="160px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        </div>
      </div>
      <div className="px-0.5 space-y-1.5 pt-1">
        {tag && (
          <span className="inline-block text-[9px] font-extrabold bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800 tracking-wider">
            {tag}
          </span>
        )}
        <p className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-[#ff6122] transition-colors">{story.title}</p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600 pt-0.5">
          <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{fmt(story.readCount)}</span>
          <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-orange-400" />{fmt(story.voteCount)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────── Fetch helpers ──────────── */
async function fetchSearch(q: string, limit = 20): Promise<Story[]> {
  try {
    const r = await fetch(`/api/wattpad/search?q=${encodeURIComponent(q)}&limit=${limit}`, { cache: 'no-store' });
    if (!r.ok) return [];
    const d = await r.json();
    return d.stories ?? [];
  } catch { return []; }
}

async function fetchStory(id: number): Promise<Story | null> {
  try {
    const r = await fetch(`/api/wattpad/story/${id}`, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

/* ──────────── HOME PAGE ──────────── */
interface ShelfState { stories: Story[]; loading: boolean; }
const mkShelf = (): ShelfState => ({ stories: [], loading: true });

export default function HomeClient() {
  const [originals, setOriginals] = useState<ShelfState>(mkShelf());
  const [topIndia,   setTopIndia]   = useState<ShelfState>(mkShelf());
  const [topPicks,  setTopPicks]  = useState<ShelfState>(mkShelf());
  const [romance,   setRomance]   = useState<ShelfState>(mkShelf());
  const [teenfic,   setTeenfic]   = useState<ShelfState>(mkShelf());
  const [fantasy,   setFantasy]   = useState<ShelfState>(mkShelf());
  const [mystery,   setMystery]   = useState<ShelfState>(mkShelf());
  const [werewolf,  setWerewolf]  = useState<ShelfState>(mkShelf());
  const [vampire,   setVampire]   = useState<ShelfState>(mkShelf());
  const [action,    setAction]    = useState<ShelfState>(mkShelf());
  const [scifi,     setScifi]     = useState<ShelfState>(mkShelf());
  const [horror,    setHorror]    = useState<ShelfState>(mkShelf());
  const [humor,     setHumor]     = useState<ShelfState>(mkShelf());
  const [historical, setHistorical] = useState<ShelfState>(mkShelf());
  const [lgbtq,     setLgbtq]    = useState<ShelfState>(mkShelf());
  const [newadult,  setNewadult]  = useState<ShelfState>(mkShelf());

  const loadShelf = async (
    setter: React.Dispatch<React.SetStateAction<ShelfState>>,
    query: string,
    limit = 20
  ) => {
    const stories = await fetchSearch(query, limit);
    setter({ stories, loading: false });
  };

  const loadOriginals = async () => {
    // 1. Fetch pinned high-quality originals
    const results = await Promise.allSettled(
      ORIGINALS_IDS.slice(0, 20).map(id => fetchStory(id))
    );
    const pinned = results
      .filter((r): r is PromiseFulfilledResult<Story> => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);

    // 2. Fetch live dynamic search results for newest Wattpad originals
    const live = await fetchSearch('wattpad originals complete', 15);

    // 3. Merge lists and filter out duplicates
    const seen = new Set(pinned.map(s => s.id));
    const merged = [...pinned, ...live.filter(s => !seen.has(s.id))];

    setOriginals({ stories: merged, loading: false });
  };

  const loadTopIndia = async () => {
    // 1. Fetch pinned curated Top India stories
    const results = await Promise.allSettled(
      TOP_INDIA_IDS.map(id => fetchStory(id))
    );
    const pinned = results
      .filter((r): r is PromiseFulfilledResult<Story> => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);

    // 2. Fetch live search results for trending Desi forced marriage/romance stories
    const live = await fetchSearch('desi romance forced marriage', 10);

    // 3. Merge lists and filter out duplicates
    const seen = new Set(pinned.map(s => s.id));
    const merged = [...pinned, ...live.filter(s => !seen.has(s.id))];

    setTopIndia({ stories: merged, loading: false });
  };

  useEffect(() => {
    // Fire all shelf fetches independently — each resolves when ready
    loadOriginals();
    loadTopIndia();
    loadShelf(setTopPicks,   'best wattpad stories', 20);
    loadShelf(setRomance,    'romance love story', 20);
    loadShelf(setTeenfic,    'teen fiction high school love', 20);
    loadShelf(setFantasy,    'fantasy magic adventure', 20);
    loadShelf(setMystery,    'mystery thriller suspense', 20);
    loadShelf(setWerewolf,   'werewolf wolf mate', 20);
    loadShelf(setVampire,    'vampire blood immortal', 20);
    loadShelf(setAction,     'action adventure hero', 20);
    loadShelf(setScifi,      'science fiction dystopia', 20);
    loadShelf(setHorror,     'horror scary paranormal', 20);
    loadShelf(setHumor,      'humor funny comedy', 20);
    loadShelf(setHistorical, 'historical romance regency', 20);
    loadShelf(setLgbtq,      'lgbtq gay love', 20);
    loadShelf(setNewadult,   'new adult college university', 20);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = originals.stories[0] ?? topPicks.stories[0] ?? null;
  const anyLoaded = !originals.loading || !topPicks.loading;

  const topIndiaScrollRef = useRef<HTMLDivElement>(null);
  const [showIndiaLeft, setShowIndiaLeft] = useState(false);
  const [showIndiaRight, setShowIndiaRight] = useState(false);

  const checkIndiaScroll = () => {
    if (topIndiaScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = topIndiaScrollRef.current;
      setShowIndiaLeft(scrollLeft > 5);
      setShowIndiaRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkIndiaScroll();
    const timer = setTimeout(checkIndiaScroll, 100);
    window.addEventListener('resize', checkIndiaScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkIndiaScroll);
    };
  }, [topIndia.stories, topIndia.loading]);

  const handleIndiaScroll = (dir: 'left' | 'right') => {
    if (topIndiaScrollRef.current) {
      const { clientWidth } = topIndiaScrollRef.current;
      const scrollAmt = clientWidth * 0.75;
      topIndiaScrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f12] text-white pb-20">

      {/* ── HERO ── */}
      {featured && (
        <section className="relative overflow-hidden border-b border-zinc-900/80">
          <div className="absolute inset-0 pointer-events-none">
            {featured.cover && (
              <Image src={featured.cover} alt="" fill className="object-cover scale-110 blur-3xl opacity-20" unoptimized priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f12]/60 via-[#0f0f12]/80 to-[#0f0f12]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-1 md:col-span-3 flex justify-center">
              <Link href={`/story/${featured.id}`} className="relative block w-40 h-56 sm:w-44 sm:h-60 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/80 hover:scale-105 transition-transform duration-300">
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
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-zinc-500" />{fmt(featured.readCount)} Reads</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-orange-400 fill-orange-400" />{fmt(featured.voteCount)} Votes</span>
                <span className="flex items-center gap-1.5"><List className="w-4 h-4 text-zinc-500" />{featured.numParts} Parts</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl line-clamp-3">{featured.description}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <Link href={`/story/${featured.id}`} className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-sm font-extrabold shadow-lg shadow-orange-500/20 transition-all">
                  <BookOpen className="w-4 h-4" /> Read Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HINT while first data arrives ── */}
      {!anyLoaded && (
        <div className="flex items-center justify-center gap-3 py-6 text-zinc-600 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading stories from Wattpad…
        </div>
      )}

      {/* ── SHELVES ── */}
      <div className="py-8 space-y-10">
        <Shelf title="Wattpad Originals" icon={<Crown className="w-4 h-4" />}      stories={originals.stories}  accentColor="text-yellow-400"   badge="Featured" loading={originals.loading} />
        
        {/* ── TOP 10 IN INDIA SHELF ── */}
        <section className="space-y-3 relative group">
          <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8">
            <span className="text-orange-500"><TrendingUp className="w-4 h-4" /></span>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">Top 10 in India</h2>
            {topIndia.loading && <Loader2 className="w-3 h-3 text-zinc-600 animate-spin ml-auto" />}
          </div>
          
          <div className="relative px-4 sm:px-6 lg:px-8">
            {/* Left Arrow Button */}
            {showIndiaLeft && (
              <button
                onClick={() => handleIndiaScroll('left')}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-zinc-100 text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 border border-zinc-200"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Right Arrow Button */}
            {showIndiaRight && (
              <button
                onClick={() => handleIndiaScroll('right')}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-zinc-100 text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 border border-zinc-200"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            <div 
              ref={topIndiaScrollRef}
              onScroll={checkIndiaScroll}
              className="overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-6 px-4">
                {topIndia.loading
                  ? Array.from({ length: 8 }).map((_, i) => <Bone key={i} />)
                  : topIndia.stories.map((s, idx) => (
                      <TopIndiaCard 
                        key={s.id} 
                        story={s} 
                        rank={idx + 1} 
                        tag={TOP_INDIA_TAGS[s.id] || ''} 
                      />
                    ))
                }
              </div>
            </div>
          </div>
        </section>

        <Shelf title="Top Picks"         icon={<TrendingUp className="w-4 h-4" />}  stories={topPicks.stories}   accentColor="text-[#ff6122]"               loading={topPicks.loading} />
        <Shelf title="Romance"           icon={<Heart className="w-4 h-4" />}       stories={romance.stories}    accentColor="text-pink-400"                loading={romance.loading} />
        <Shelf title="Teen Fiction"      icon={<GraduationCap className="w-4 h-4" />} stories={teenfic.stories}  accentColor="text-emerald-400"             loading={teenfic.loading} />
        <Shelf title="Fantasy"           icon={<Sparkles className="w-4 h-4" />}    stories={fantasy.stories}    accentColor="text-purple-400"              loading={fantasy.loading} />
        <Shelf title="Mystery & Thriller" icon={<Eye className="w-4 h-4" />}        stories={mystery.stories}    accentColor="text-amber-400"               loading={mystery.loading} />
        <Shelf title="Werewolf"          icon={<Zap className="w-4 h-4" />}         stories={werewolf.stories}   accentColor="text-indigo-400"              loading={werewolf.loading} />
        <Shelf title="Vampire"           icon={<Ghost className="w-4 h-4" />}       stories={vampire.stories}    accentColor="text-red-400"                 loading={vampire.loading} />
        <Shelf title="Action & Adventure" icon={<Swords className="w-4 h-4" />}     stories={action.stories}     accentColor="text-orange-400"              loading={action.loading} />
        <Shelf title="Science Fiction"   icon={<Atom className="w-4 h-4" />}        stories={scifi.stories}      accentColor="text-cyan-400"                loading={scifi.loading} />
        <Shelf title="Horror"            icon={<Ghost className="w-4 h-4" />}       stories={horror.stories}     accentColor="text-rose-500"                loading={horror.loading} />
        <Shelf title="Humor & Comedy"    icon={<Laugh className="w-4 h-4" />}       stories={humor.stories}      accentColor="text-yellow-400"              loading={humor.loading} />
        <Shelf title="Historical"        icon={<Scroll className="w-4 h-4" />}      stories={historical.stories} accentColor="text-amber-300"               loading={historical.loading} />
        <Shelf title="LGBTQ+"           icon={<Heart className="w-4 h-4" />}       stories={lgbtq.stories}      accentColor="text-fuchsia-400"             loading={lgbtq.loading} />
        <Shelf title="New Adult"         icon={<GraduationCap className="w-4 h-4" />} stories={newadult.stories} accentColor="text-teal-400"               loading={newadult.loading} />
      </div>

      <footer className="max-w-7xl mx-auto px-4 border-t border-zinc-800/50 pt-8 mt-8 text-center text-xs text-zinc-700">
        © 2026 Wattpad Clone — Powered by live Wattpad API · Built with Next.js
      </footer>
    </main>
  );
}
