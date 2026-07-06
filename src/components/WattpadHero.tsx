'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, Star, List, Sparkles, Loader2, BookOpen, ExternalLink } from 'lucide-react';

interface WattpadStory {
  id: number;
  title: string;
  description: string;
  cover: string;
  url: string;
  completed: boolean;
  voteCount: number;
  readCount: number;
  numParts: number;
  user: { name: string; avatar: string };
  mainCategory?: string;
}

function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function WattpadHero() {
  const [story, setStory] = useState<WattpadStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wattpad/trending?limit=1')
      .then(r => r.json())
      .then(data => {
        const stories = data.stories ?? [];
        if (stories.length > 0) setStory(stories[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative w-full bg-[#18181c] py-20 flex items-center justify-center border-b border-zinc-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#ff6122] animate-spin" />
          <p className="text-xs text-zinc-500">Loading featured story from Wattpad...</p>
        </div>
      </section>
    );
  }

  if (!story) {
    return (
      <section className="relative w-full bg-[#18181c] py-16 text-center border-b border-zinc-900">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <BookOpen className="w-12 h-12 text-[#ff6122] mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">Welcome to Wattpad Clone</h2>
          <p className="text-xs text-zinc-400">Could not load trending stories. Check your internet connection.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#18181c] text-white py-16 sm:py-20 lg:py-24 border-b border-zinc-900">
      {/* Blurred backdrop */}
      {story.cover && (
        <div className="absolute inset-0 opacity-25 pointer-events-none filter blur-3xl transform scale-110">
          <Image
            src={story.cover}
            alt=""
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Cover */}
        <div className="col-span-1 md:col-span-4 flex justify-center">
          <div className="relative w-44 h-64 sm:w-52 sm:h-76 md:w-56 md:h-80 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 shadow-2xl shadow-black/80 hover:scale-105 transition-transform duration-300">
            {story.cover ? (
              <Image
                src={story.cover}
                alt={story.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-zinc-600" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="col-span-1 md:col-span-8 space-y-5 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff6122] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
            <Sparkles className="w-3 h-3" /> Trending on Wattpad
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {story.title}
          </h2>

          <p className="text-zinc-400 text-sm font-medium">
            by <span className="text-white font-semibold">{story.user?.name}</span>
            {story.mainCategory && (
              <span className="ml-2 px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px] font-bold uppercase tracking-wide">
                {story.mainCategory}
              </span>
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-zinc-300">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-zinc-400" /> {formatCount(story.readCount)} Reads
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> {formatCount(story.voteCount)} Votes
            </span>
            <span className="flex items-center gap-1">
              <List className="w-3.5 h-3.5 text-zinc-400" /> {story.numParts} Parts
            </span>
            {story.completed && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold uppercase tracking-wide">
                COMPLETE
              </span>
            )}
          </div>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light max-w-xl line-clamp-4">
            {story.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <a
              href={`https://www.wattpad.com/story/${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-sm font-bold shadow-md shadow-orange-500/20 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Read on Wattpad
            </a>
            <a
              href={`https://www.wattpad.com/story/${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Details
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
