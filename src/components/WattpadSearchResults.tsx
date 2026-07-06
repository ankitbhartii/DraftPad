'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, BookOpen, Eye, Star, List, AlertCircle } from 'lucide-react';

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
  tags: string[];
  user: { name: string; avatar: string };
  mainCategory?: string;
}

function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface WattpadSearchResultsProps {
  query: string;
}

export default function WattpadSearchResults({ query }: WattpadSearchResultsProps) {
  const [stories, setStories] = useState<WattpadStory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchResults = useCallback(async (searchQuery: string, offset: number) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/wattpad/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&offset=${offset}`
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? 'Search failed');
      }
      const data = await res.json();
      if (offset === 0) {
        setStories(data.stories ?? []);
      } else {
        setStories(prev => [...prev, ...(data.stories ?? [])]);
      }
      setTotal(data.total ?? 0);
    } catch (err: any) {
      setError(err.message ?? 'Failed to search Wattpad');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    setStories([]);
    fetchResults(query, 0);
  }, [query, fetchResults]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(query, nextPage * limit);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none flex items-center gap-2">
            <Search className="w-5 h-5 text-[#ff6122]" />
            Search Results
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {loading && stories.length === 0
              ? 'Searching Wattpad...'
              : total > 0
              ? `Found ${formatCount(total)} stories matching "${query}" on Wattpad`
              : `Showing results for "${query}"`}
          </p>
        </div>
        <Link href="/" className="text-xs font-semibold text-[#ff6122] hover:underline">
          Clear Search
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Could not connect to Wattpad</p>
            <p className="text-xs mt-0.5 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Initial loading */}
      {loading && stories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 text-[#ff6122] animate-spin" />
          <p className="text-sm text-gray-400">Searching Wattpad for &ldquo;{query}&rdquo;...</p>
        </div>
      )}

      {/* No results */}
      {!loading && !error && stories.length === 0 && (
        <div className="bg-white dark:bg-[#18181c] border border-gray-200 dark:border-zinc-800/50 rounded-2xl p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-sm font-bold text-gray-700 dark:text-zinc-300">No stories found</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No Wattpad stories match &ldquo;{query}&rdquo;. Try different keywords.
          </p>
        </div>
      )}

      {/* Results grid */}
      {stories.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="group space-y-2.5 transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Cover */}
                <div className="relative w-full aspect-[2/3] bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-150 dark:border-zinc-800/80 shadow-md group-hover:shadow-xl transition-all duration-300">
                  {story.cover ? (
                    <Image
                      src={story.cover}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}

                  {/* Overlay badges */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="flex items-center gap-1 flex-wrap">
                      {story.completed && (
                        <span className="text-[9px] font-bold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded">
                          COMPLETE
                        </span>
                      )}
                      {story.mature && (
                        <span className="text-[9px] font-bold bg-red-500/90 text-white px-1.5 py-0.5 rounded">
                          MATURE
                        </span>
                      )}
                    </div>
                  </div>


                </div>

                {/* Info */}
                <div className="space-y-0.5 px-0.5">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-[#ff6122] transition-colors">
                    {story.title}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-500 truncate">
                    {story.user?.name}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> {formatCount(story.readCount)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-orange-400" /> {formatCount(story.voteCount)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <List className="w-3 h-3" /> {story.numParts}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          {stories.length < total && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ff6122] hover:bg-[#e04f1a] disabled:bg-zinc-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</>
                ) : (
                  `Load More (${formatCount(total - stories.length)} remaining)`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
