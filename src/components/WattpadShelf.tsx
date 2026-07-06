'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Star, ChevronRight, Loader2, BookOpen } from 'lucide-react';

interface WattpadStory {
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

function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function StoryCard({ story }: { story: WattpadStory }) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group flex-shrink-0 w-36 sm:w-40 space-y-2 transition-transform duration-300 hover:scale-[1.03]"
    >
      <div className="relative w-full aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/50 shadow-md group-hover:shadow-xl transition-all duration-300">
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
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex gap-1 flex-wrap">
            {story.completed && (
              <span className="text-[9px] font-bold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded">COMPLETE</span>
            )}
            {story.mature && (
              <span className="text-[9px] font-bold bg-red-500/90 text-white px-1.5 py-0.5 rounded">MATURE</span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-0.5 px-0.5">
        <p className="text-xs font-bold text-white leading-tight line-clamp-2 group-hover:text-[#ff6122] transition-colors">
          {story.title}
        </p>
        <p className="text-[10px] text-zinc-500 truncate">{story.user?.name}</p>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pt-0.5">
          <span className="flex items-center gap-0.5">
            <Eye className="w-2.5 h-2.5" />{formatCount(story.readCount)}
          </span>
          <span className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-orange-400" />{formatCount(story.voteCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}

interface ShelfProps {
  title: string;
  icon: React.ReactNode;
  category?: string;
}

export function WattpadShelf({ title, icon, category }: ShelfProps) {
  const [stories, setStories] = useState<WattpadStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = category
      ? `/api/wattpad/trending?category=${encodeURIComponent(category)}&limit=12`
      : `/api/wattpad/trending?limit=16`;

    fetch(url)
      .then(r => r.json())
      .then(data => setStories(data.stories ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-white uppercase tracking-wide">
          {icon}
          {title}
        </h2>
        <Link
          href="/?search="
          className="flex items-center gap-0.5 text-[11px] font-semibold text-[#ff6122] hover:underline"
        >
          See all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-2">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36 sm:w-40 space-y-2 animate-pulse">
                  <div className="w-full aspect-[2/3] bg-zinc-800 rounded-lg" />
                  <div className="h-3 bg-zinc-800 rounded w-3/4" />
                  <div className="h-2 bg-zinc-800 rounded w-1/2" />
                </div>
              ))
            : stories.map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
        </div>
      </div>
    </section>
  );
}
