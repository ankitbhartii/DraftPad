import Link from 'next/link';
import Image from 'next/image';
import {
  Sliders, TrendingUp, Sparkles, Heart, BookOpen, Eye, Star,
  List, Search, Ghost, Swords, Atom, Laugh, Scroll, Zap, GraduationCap, Crown
} from 'lucide-react';
import MigrationForm from '@/components/MigrationForm';
import WattpadSearchResults from '@/components/WattpadSearchResults';
import { getHomeShelves, type WattpadStory as Story } from '@/lib/wattpad-client';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ openIngest?: string; search?: string }>;
}

function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function BookCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group flex-shrink-0 w-36 sm:w-40 space-y-2 transition-transform duration-300 hover:scale-[1.04]"
    >
      {/* Cover */}
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
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Badges */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1 flex-wrap">
          {story.completed && (
            <span className="text-[8px] font-extrabold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded tracking-wide">COMPLETE</span>
          )}
          {story.mature && (
            <span className="text-[8px] font-extrabold bg-red-500/80 text-white px-1.5 py-0.5 rounded">MATURE</span>
          )}
        </div>
      </div>
      {/* Meta */}
      <div className="space-y-0.5 px-0.5">
        <p className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-[#ff6122] transition-colors">
          {story.title}
        </p>
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

function Shelf({
  title, icon, stories, accentColor = 'text-[#ff6122]', badge,
}: {
  title: string;
  icon: React.ReactNode;
  stories: Story[];
  accentColor?: string;
  badge?: string;
}) {
  if (!stories.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-white uppercase tracking-widest">
          <span className={accentColor}>{icon}</span>
          {title}
          {badge && (
            <span className="text-[9px] font-bold px-2 py-0.5 bg-[#ff6122] text-white rounded-full normal-case tracking-normal">
              {badge}
            </span>
          )}
        </h2>
        <span className="text-[10px] text-zinc-700 font-semibold">{stories.length} books</span>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-3">
          {stories.map(story => <BookCard key={story.id} story={story} />)}
        </div>
      </div>
    </section>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const { openIngest, search: searchQuery = '' } = await searchParams;
  const showIngestModal = openIngest === 'true';

  // Fetch all shelves server-side in parallel
  const shelves = await getHomeShelves();

  // Hero: prefer "Through My Window" (first original), else fallback to topPicks[0]
  const featured = shelves.originals[0] ?? shelves.topPicks[0] ?? null;

  return (
    <main className="min-h-screen bg-[#0f0f12] text-white pb-20">

      {searchQuery ? (
        /* ─── SEARCH MODE ─── */
        <WattpadSearchResults query={searchQuery} />
      ) : (
        <>
          {/* ══════════════════════════════
              HERO BANNER
          ══════════════════════════════ */}
          {featured && (
            <section className="relative overflow-hidden border-b border-zinc-900/80">
              <div className="absolute inset-0 pointer-events-none">
                {featured.cover && (
                  <Image src={featured.cover} alt="" fill className="object-cover scale-110 blur-3xl opacity-25" priority unoptimized />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f12]/50 via-[#0f0f12]/70 to-[#0f0f12]" />
              </div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Cover */}
                <div className="col-span-1 md:col-span-3 flex justify-center">
                  <Link href={`/story/${featured.id}`}
                    className="relative block w-44 h-[264px] sm:w-48 sm:h-[288px] bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/80 hover:scale-105 transition-transform duration-300">
                    {featured.cover && <Image src={featured.cover} alt={featured.title} fill className="object-cover" priority unoptimized />}
                  </Link>
                </div>
                {/* Details */}
                <div className="col-span-1 md:col-span-9 space-y-4 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff6122] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                    {featured.completed && (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest rounded-full">Complete</span>
                    )}
                    {(featured as any).mainCategoryEnglish || featured.mainCategory ? (
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-widest rounded-full">
                        {(featured as any).mainCategoryEnglish || featured.mainCategory}
                      </span>
                    ) : null}
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
                    <Link href={`/story/${featured.id}`}
                      className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-sm font-extrabold shadow-lg shadow-orange-500/20 transition-all">
                      <BookOpen className="w-4 h-4" /> Read Now
                    </Link>
                    <Link href={`/story/${featured.id}`}
                      className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm font-bold transition-all">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════
              ALL SHELVES (15 categories)
          ══════════════════════════════ */}
          <div className="py-10 space-y-10">

            <Shelf
              title="Wattpad Originals"
              icon={<Crown className="w-4 h-4" />}
              stories={shelves.originals}
              accentColor="text-yellow-400"
              badge="Featured"
            />

            <Shelf
              title="Top Picks"
              icon={<TrendingUp className="w-4 h-4" />}
              stories={shelves.topPicks}
              accentColor="text-[#ff6122]"
            />

            <Shelf
              title="Romance"
              icon={<Heart className="w-4 h-4" />}
              stories={shelves.romance}
              accentColor="text-pink-400"
            />

            <Shelf
              title="Teen Fiction"
              icon={<GraduationCap className="w-4 h-4" />}
              stories={shelves.teenfiction}
              accentColor="text-emerald-400"
            />

            <Shelf
              title="Fantasy"
              icon={<Sparkles className="w-4 h-4" />}
              stories={shelves.fantasy}
              accentColor="text-purple-400"
            />

            <Shelf
              title="Mystery & Thriller"
              icon={<Search className="w-4 h-4" />}
              stories={shelves.mystery}
              accentColor="text-amber-400"
            />

            <Shelf
              title="Werewolf"
              icon={<Zap className="w-4 h-4" />}
              stories={shelves.werewolf}
              accentColor="text-indigo-400"
            />

            <Shelf
              title="Vampire"
              icon={<Ghost className="w-4 h-4" />}
              stories={shelves.vampire}
              accentColor="text-red-400"
            />

            <Shelf
              title="Action & Adventure"
              icon={<Swords className="w-4 h-4" />}
              stories={shelves.action}
              accentColor="text-orange-400"
            />

            <Shelf
              title="Science Fiction"
              icon={<Atom className="w-4 h-4" />}
              stories={shelves.scifi}
              accentColor="text-cyan-400"
            />

            <Shelf
              title="Horror"
              icon={<Ghost className="w-4 h-4" />}
              stories={shelves.horror}
              accentColor="text-rose-500"
            />

            <Shelf
              title="Humor & Comedy"
              icon={<Laugh className="w-4 h-4" />}
              stories={shelves.humor}
              accentColor="text-yellow-400"
            />

            <Shelf
              title="Historical Romance"
              icon={<Scroll className="w-4 h-4" />}
              stories={shelves.historical}
              accentColor="text-amber-300"
            />

            <Shelf
              title="LGBTQ+"
              icon={<Heart className="w-4 h-4" />}
              stories={shelves.lgbtq}
              accentColor="text-fuchsia-400"
            />

            <Shelf
              title="New Adult"
              icon={<GraduationCap className="w-4 h-4" />}
              stories={shelves.newadult}
              accentColor="text-teal-400"
            />

          </div>
        </>
      )}

      {/* INGEST MODAL */}
      {showIngestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-1.5">
                <Sliders className="w-5 h-5 text-[#ff6122]" /> Ingestion Console
              </h3>
              <Link href="/" className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">✕</Link>
            </div>
            <MigrationForm />
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50 pt-8 mt-12 text-center text-xs text-zinc-700">
        <p>© 2026 Wattpad Clone — Powered by live Wattpad API · Built with Next.js</p>
      </footer>
    </main>
  );
}
