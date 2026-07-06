'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Library } from 'lucide-react';

export default function SeedButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to seed books');
      }
      setSeeded(true);
      router.refresh(); // Refresh page to display loaded books
    } catch (error) {
      console.error('Error seeding library:', error);
      alert('Failed to seed books. Please verify database connection configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <button
        onClick={handleSeed}
        disabled={isLoading || seeded}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#ff6122] to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-white rounded-full text-xs font-extrabold shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Seeding library...
          </>
        ) : seeded ? (
          <>
            <Library className="w-3.5 h-3.5 text-emerald-400" /> Library populated!
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" /> Seed Library with Wattpad picks
          </>
        )}
      </button>
    </div>
  );
}
