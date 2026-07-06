'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, BookMarked, PenTool, ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (cleanQuery) {
      router.push(`/?search=${encodeURIComponent(cleanQuery)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="sticky top-0 bg-white dark:bg-[#18181c] border-b border-gray-100 dark:border-zinc-800/80 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* LEFT: LOGO & LINKS */}
          <div className="flex items-center gap-6 flex-1">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#ff6122] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-extrabold text-lg select-none">w</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-[#ff6122] select-none hidden sm:inline-block">
                wattpad
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-zinc-300">
              <div className="relative group cursor-pointer py-2 flex items-center gap-1 hover:text-[#ff6122] dark:hover:text-[#ff6122] transition-colors">
                Browse <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff6122]" />
              </div>
              <div className="relative group cursor-pointer py-2 flex items-center gap-1 hover:text-[#ff6122] dark:hover:text-[#ff6122] transition-colors">
                Write <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff6122]" />
              </div>
              <Link href="/" className="hover:text-[#ff6122] dark:hover:text-[#ff6122] transition-colors flex items-center gap-1.5">
                <BookMarked className="w-4 h-4" /> Library
              </Link>
            </div>
          </div>

          {/* MIDDLE: SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 bg-gray-100 hover:bg-gray-200/70 focus:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-800/60 dark:focus:bg-zinc-950 border border-transparent focus:border-gray-250 dark:focus:border-zinc-800 text-sm placeholder-gray-500 dark:placeholder-zinc-500 text-gray-900 dark:text-zinc-100 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-zinc-800 transition-all"
                placeholder="Search stories, authors, or genres..."
              />
            </form>
          </div>

          {/* RIGHT: NOTIFICATIONS, AVATAR, WRITE */}
          <div className="flex items-center gap-4">
            <Link 
              href="/?openIngest=true"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-transparent hover:border-[#ff6122]/30 bg-[#ff6122]/10 hover:bg-[#ff6122]/20 text-[#ff6122] rounded-full text-xs font-bold transition-all"
            >
              <PenTool className="w-3.5 h-3.5" /> Ingest Story
            </Link>

            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 cursor-pointer hover:ring-2 hover:ring-[#ff6122] transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://api.dicebear.com/7.x/initials/svg?seed=Reader" 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-500 dark:text-zinc-400 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800/50"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#18181c] border-b border-gray-100 dark:border-zinc-800 py-3 px-4 space-y-2.5 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:hidden">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 bg-gray-100 dark:bg-zinc-900 border-none text-sm placeholder-gray-400 rounded-full focus:outline-none"
              placeholder="Search..."
            />
          </form>
          <Link href="/" className="block py-2 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-[#ff6122]" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/" className="block py-2 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-[#ff6122]" onClick={() => setIsMobileMenuOpen(false)}>
            Library
          </Link>
          <Link href="/?openIngest=true" className="block py-2 text-sm font-bold text-[#ff6122]" onClick={() => setIsMobileMenuOpen(false)}>
            Ingest Story Pipeline
          </Link>
        </div>
      )}
    </nav>
  );
}
