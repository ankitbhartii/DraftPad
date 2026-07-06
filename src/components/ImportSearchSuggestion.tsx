'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, Loader2, Sparkles, BookOpen } from 'lucide-react';

export default function ImportSearchSuggestion() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: '80428185', // Our designated mock ID for "Through My Window"
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to import story');
      }

      // Redirect to the newly created story details page
      router.push(`/story/${data.story.id}`);
      router.refresh();
    } catch (error: any) {
      console.error('Import error:', error);
      alert(`Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-orange-500/10 to-[#ff6122]/5 border border-[#ff6122]/20 rounded-2xl p-6 max-w-xl mx-auto space-y-4 shadow-lg text-left">
      <div className="flex gap-2 text-[#ff6122] items-center">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <h4 className="text-sm font-extrabold uppercase tracking-wide">Available on Wattpad</h4>
      </div>
      
      <div className="flex gap-4 items-start bg-zinc-950/40 dark:bg-black/30 p-4 rounded-xl border border-zinc-200/5 dark:border-zinc-800/40">
        <div className="relative w-16 h-24 bg-zinc-800 rounded overflow-hidden flex-shrink-0 border border-zinc-700">
          <Image 
            src="https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=200" 
            alt="Through My Window Cover"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1.5 min-w-0 flex-1">
          <h5 className="text-sm font-extrabold text-gray-900 dark:text-white truncate">
            Through My Window
          </h5>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-3 leading-relaxed font-light">
            Original Wattpad Trilogy of "Hidalgo brothers" that inspired the Netflix movies! Read the story of Raquel and her neighbor Ares, dealing with attraction, secrets, and Wi-Fi codes.
          </p>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 leading-normal">
        This book is available on the official Wattpad catalog. You can use your custom ingestion adapter to import it directly into your local database.
      </p>

      <button
        onClick={handleImport}
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff6122] hover:bg-[#e04f1a] disabled:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Ingesting & Syncing Chapters...
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" /> Ingest & Read "Through My Window"
          </>
        )}
      </button>
    </div>
  );
}
