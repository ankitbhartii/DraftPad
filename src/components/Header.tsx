'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Bell, BookMarked, PenTool, ChevronDown, Menu, X,
  Heart, Sparkles, BookOpen, Clock, Laugh, Globe2, Atom,
  FileText, Ghost, Eye, Swords, Feather, Star, Crown, Zap,
} from 'lucide-react';

/* ── Genre data matching wattpad.com/home Browse menu ── */
const BROWSE_COL1 = [
  { label: 'Romance',          query: 'romance',          icon: Heart },
  { label: 'Wattpad Originals', query: 'wattpadoriginals', icon: Crown },
  { label: 'Fantasy',          query: 'fantasy',          icon: Sparkles },
  { label: 'Historical Fiction', query: 'historical fiction', icon: Clock },
  { label: 'Humor',            query: 'humor funny',      icon: Laugh },
  { label: 'Diverse Lit',      query: 'diverse literature', icon: Globe2 },
  { label: 'Science Fiction',  query: 'science fiction',  icon: Atom },
  { label: 'Non-Fiction',      query: 'non fiction',      icon: FileText },
];
const BROWSE_COL2 = [
  { label: 'Fanfiction',   query: 'fanfiction',         icon: Feather },
  { label: 'Werewolf',     query: 'werewolf',           icon: Zap },
  { label: 'Short Story',  query: 'short story',        icon: BookOpen },
  { label: 'Paranormal',   query: 'paranormal',         icon: Ghost },
  { label: 'Horror',       query: 'horror scary',       icon: Ghost },
  { label: 'Mystery',      query: 'mystery thriller',   icon: Eye },
  { label: 'The Wattys',   query: 'wattys award winner', icon: Star },
  { label: 'Poetry',       query: 'poetry poem',        icon: Feather },
];
const BROWSE_COL3 = [
  { label: 'LGBTQ+',          query: 'lgbtq gay love',        icon: Heart },
  { label: 'New Adult',       query: 'new adult college',     icon: BookOpen },
  { label: 'Teen Fiction',    query: 'teen fiction high school', icon: Sparkles },
  { label: "Editor's Picks",  query: 'editors picks featured', icon: Star },
  { label: 'Contemporary Lit', query: 'contemporary fiction', icon: BookOpen },
  { label: 'Thriller',        query: 'thriller suspense',     icon: Eye },
  { label: 'Adventure',       query: 'adventure action',      icon: Swords },
];
const WATTPAD_PICKS = [
  { label: 'Winning Hearts 💕', query: 'winning hearts romance' },
  { label: 'Summer Flings 🌊',  query: 'summer romance flings' },
  { label: 'Reading Radar',    query: 'reading radar wattpad featured' },
  { label: 'WEBTOON Productions', query: 'webtoon wattpad original' },
  { label: 'Wattpad Contests',  query: 'wattpad contest winner' },
  { label: 'Premium Picks',    query: 'premium wattpad original' },
];

export default function Header() {
  const router = useRouter();
  const [browseOpen, setBrowseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const browseRef = useRef<HTMLDivElement>(null);

  // Close browse dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/?search=${encodeURIComponent(q)}` : '/');
    setIsMobileMenuOpen(false);
  };

  const goSearch = (query: string) => {
    setBrowseOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="sticky top-0 bg-[#18181c] border-b border-zinc-800/80 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* ── LEFT: LOGO + NAV ── */}
          <div className="flex items-center gap-6 flex-1">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#ff6122] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-lg select-none">w</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-[#ff6122] hidden sm:block">wattpad</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-300">

              {/* BROWSE DROPDOWN */}
              <div ref={browseRef} className="relative">
                <button
                  onClick={() => setBrowseOpen(o => !o)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-zinc-800/60 hover:text-white transition-colors ${browseOpen ? 'text-white bg-zinc-800/60' : ''}`}
                >
                  Browse <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${browseOpen ? 'rotate-180' : ''}`} />
                </button>

                {browseOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[640px] bg-[#1e1e24] border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fadeIn">
                    <div className="flex">

                      {/* Genre columns */}
                      <div className="flex-1 p-5 border-r border-zinc-700/40">
                        <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3">Browse</p>
                        <div className="grid grid-cols-3 gap-x-4">

                          {/* Column 1 */}
                          <div className="space-y-0.5">
                            {BROWSE_COL1.map(({ label, query, icon: Icon }) => (
                              <button
                                key={label}
                                onClick={() => goSearch(query)}
                                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-700/50 hover:text-white text-zinc-300 text-xs font-medium transition-colors group"
                              >
                                <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#ff6122] flex-shrink-0 transition-colors" />
                                {label}
                              </button>
                            ))}
                          </div>

                          {/* Column 2 */}
                          <div className="space-y-0.5">
                            {BROWSE_COL2.map(({ label, query, icon: Icon }) => (
                              <button
                                key={label}
                                onClick={() => goSearch(query)}
                                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-700/50 hover:text-white text-zinc-300 text-xs font-medium transition-colors group"
                              >
                                <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#ff6122] flex-shrink-0 transition-colors" />
                                {label}
                              </button>
                            ))}
                          </div>

                          {/* Column 3 */}
                          <div className="space-y-0.5">
                            {BROWSE_COL3.map(({ label, query, icon: Icon }) => (
                              <button
                                key={label}
                                onClick={() => goSearch(query)}
                                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-700/50 hover:text-white text-zinc-300 text-xs font-medium transition-colors group"
                              >
                                <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#ff6122] flex-shrink-0 transition-colors" />
                                {label}
                              </button>
                            ))}
                          </div>

                        </div>
                      </div>

                      {/* Wattpad Picks panel */}
                      <div className="w-48 p-5 bg-zinc-900/50">
                        <p className="text-[10px] font-extrabold text-[#ff6122] uppercase tracking-widest mb-3">Wattpad Picks</p>
                        <div className="space-y-0.5">
                          {WATTPAD_PICKS.map(({ label, query }) => (
                            <button
                              key={label}
                              onClick={() => goSearch(query)}
                              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-700/50 hover:text-white text-zinc-300 text-xs font-medium transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Divider + See all */}
                        <div className="mt-4 pt-4 border-t border-zinc-700/40">
                          <button
                            onClick={() => goSearch('wattpad originals featured')}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-700/50 text-[#ff6122] text-xs font-bold transition-colors"
                          >
                            See all genres →
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Write */}
              <button
                onClick={() => router.push('/?openIngest=true')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-zinc-800/60 hover:text-white transition-colors"
              >
                Write <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Library */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/60 hover:text-white transition-colors"
              >
                <BookMarked className="w-4 h-4" /> Library
              </Link>
            </div>
          </div>

          {/* ── MIDDLE: SEARCH ── */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800/60 focus:bg-zinc-950 border border-transparent focus:border-zinc-700 text-sm placeholder-zinc-500 text-zinc-100 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                placeholder="Search stories, authors, or genres..."
              />
            </form>
          </div>

          {/* ── RIGHT: ACTIONS ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/?openIngest=true"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#ff6122]/10 hover:bg-[#ff6122]/20 border border-[#ff6122]/30 text-[#ff6122] rounded-full text-xs font-bold transition-all"
            >
              <PenTool className="w-3.5 h-3.5" /> Ingest Story
            </Link>

            <button className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-full hover:bg-zinc-800/50 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 cursor-pointer hover:ring-2 hover:ring-[#ff6122] transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=Reader" alt="Profile" className="h-full w-full object-cover" />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(o => !o)}
              className="lg:hidden p-1.5 text-zinc-400 rounded-lg hover:bg-zinc-800/50"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#18181c] border-b border-zinc-800 py-3 px-4 space-y-1 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:hidden mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 bg-zinc-900 border-none text-sm placeholder-zinc-500 text-zinc-100 rounded-full focus:outline-none"
              placeholder="Search..."
            />
          </form>

          <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest px-2 pt-1">Browse by genre</p>
          {[...BROWSE_COL1, ...BROWSE_COL2, ...BROWSE_COL3].map(({ label, query, icon: Icon }) => (
            <button
              key={label}
              onClick={() => goSearch(query)}
              className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
            >
              <Icon className="w-4 h-4 text-zinc-500" /> {label}
            </button>
          ))}

          <p className="text-[10px] font-extrabold text-[#ff6122] uppercase tracking-widest px-2 pt-3">Wattpad Picks</p>
          {WATTPAD_PICKS.map(({ label, query }) => (
            <button
              key={label}
              onClick={() => goSearch(query)}
              className="w-full text-left px-2 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
