'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Terminal, 
  BookOpen 
} from 'lucide-react';

export default function MigrationForm() {
  const router = useRouter();
  const [storyId, setStoryId] = useState('45239103');
  const [authorId, setAuthorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: storyId.trim(),
          authorId: authorId.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete migration');
      }

      setResult(data);
      router.refresh(); // Refresh the server component to list new stories
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <label htmlFor="storyId" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Target Platform Story ID
          </label>
          <input
            type="text"
            id="storyId"
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none placeholder-zinc-600"
            placeholder="e.g. 45239103"
            value={storyId}
            onChange={(e) => setStoryId(e.target.value)}
            disabled={isLoading}
            required
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Accepts any valid story ID. If the platform endpoint is unavailable, the pipeline falls back to simulated mock structures.
          </p>
        </div>

        <div>
          <label htmlFor="authorId" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Local Author UUID (Optional)
          </label>
          <input
            type="text"
            id="authorId"
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none placeholder-zinc-600 font-mono"
            placeholder="e.g. c3923dbe-2019-4824-..."
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            If omitted, the adapter will auto-map to an existing database profile or auto-generate a fresh test user profile.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !storyId}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              Processing Ingestion...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Ingest & Validate Schema
            </>
          )}
        </button>
      </form>

      {/* FEEDBACK STATE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 flex gap-3 items-start">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-300">Ingestion Error</h4>
            <p className="text-xs text-red-400/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-300">Ingestion Completed</h4>
              <p className="text-xs text-emerald-400/90 leading-relaxed">
                {result.message}
              </p>
              <div className="pt-2">
                <a
                  href={`/story/${result.story.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-zinc-950 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Read Ingested Story <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* PIPELINE OUTPUT LOGS */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden font-mono text-[11px]">
            <div className="bg-zinc-900/60 px-4 py-2 border-b border-zinc-900 text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[9px]">
                <Terminal className="w-3 h-3 text-emerald-400" /> Pipeline Console output
              </span>
              <span className="text-[10px] text-zinc-600 bg-zinc-950 px-2 py-0.5 rounded font-bold uppercase">
                {result.dataSource}
              </span>
            </div>
            <div className="p-4 max-h-[220px] overflow-auto text-zinc-300 space-y-2">
              <div>
                <span className="text-emerald-500">✔</span> Ingestion client initialized.
              </div>
              <div>
                <span className="text-emerald-500">✔</span> Story metadata resolved: <span className="text-cyan-400">"{result.story.title}"</span>
              </div>
              <div>
                <span className="text-emerald-500">✔</span> Cover URL: <span className="text-zinc-500 underline truncate max-w-xs inline-block align-bottom">{result.story.coverUrl}</span>
              </div>
              <div>
                <span className="text-emerald-500">✔</span> DOMPurify sanitization applied to content. Invalid tags stripped.
              </div>
              <div className="pl-4 border-l border-zinc-800 space-y-1">
                {result.chapters.map((ch: any) => (
                  <div key={ch.id} className="text-zinc-400">
                    • Ingested Chapter {ch.sort_order}: <span className="text-white">{ch.title}</span>
                  </div>
                ))}
              </div>
              <div className="text-emerald-400 font-semibold pt-1">
                🚀 Database tables populated successfully. Ready for reader render.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
