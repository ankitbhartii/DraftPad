'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, ListOrdered, ChevronLeft, ChevronRight,
  Settings, Type, Check, Moon, Sun, HelpCircle
} from 'lucide-react';

interface ReaderClientProps {
  storyId: string;
  storyTitle: string;
  chapterIndex: number;
  chapterTitle: string;
  chapterContent: string;
  totalChapters: number;
  progressPercentage: number;
  readTime: number;
  prevLink: string | null;
  nextLink: string | null;
  contentsLink: string;
  isCompleted?: boolean;
}

type ReaderTheme = 'black' | 'dark' | 'sepia' | 'light';
type FontStyle = 'serif' | 'sans';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export default function ReaderClient({
  storyId,
  storyTitle,
  chapterIndex,
  chapterTitle,
  chapterContent,
  totalChapters,
  progressPercentage,
  readTime,
  prevLink,
  nextLink,
  contentsLink,
  isCompleted = false,
}: ReaderClientProps) {
  // Reader Settings
  const [theme, setTheme] = useState<ReaderTheme>('black');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [showSettings, setShowSettings] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('reader-theme') as ReaderTheme;
    const savedFontSize = localStorage.getItem('reader-fontsize') as FontSize;
    const savedFontStyle = localStorage.getItem('reader-fontstyle') as FontStyle;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontStyle) setFontStyle(savedFontStyle);

    // Scroll back to top on chapter change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [chapterIndex]);

  const updateTheme = (newTheme: ReaderTheme) => {
    setTheme(newTheme);
    localStorage.setItem('reader-theme', newTheme);
  };

  const updateFontSize = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem('reader-fontsize', newSize);
  };

  const updateFontStyle = (newStyle: FontStyle) => {
    setFontStyle(newStyle);
    localStorage.setItem('reader-fontstyle', newStyle);
  };

  // Class mapping for themes
  const themeClasses = {
    black: 'bg-black text-zinc-300',
    dark: 'bg-[#121214] text-zinc-300',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    light: 'bg-[#fafafa] text-zinc-800',
  };

  const themeHeadingClasses = {
    black: 'text-white',
    dark: 'text-white',
    sepia: 'text-[#433225]',
    light: 'text-zinc-900',
  };

  const themeBorderClasses = {
    black: 'border-zinc-800/80',
    dark: 'border-zinc-800/80',
    sepia: 'border-[#e4dac3]',
    light: 'border-zinc-200',
  };

  const themeHeaderBg = {
    black: 'bg-black/95',
    dark: 'bg-[#121214]/95',
    sepia: 'bg-[#f4ecd8]/95',
    light: 'bg-[#fafafa]/95',
  };

  const themeSettingsBg = {
    black: 'bg-[#18181c] border-zinc-850',
    dark: 'bg-[#1a1a1e] border-zinc-800',
    sepia: 'bg-[#eadecc] border-[#d8cbb8]',
    light: 'bg-white border-zinc-250',
  };

  // Class mapping for sizes
  const sizeClasses = {
    sm: 'text-base sm:text-base leading-[1.8]',
    md: 'text-[17px] sm:text-[18px] leading-[1.95]',
    lg: 'text-[19px] sm:text-[20px] leading-[2.0]',
    xl: 'text-[22px] sm:text-[23px] leading-[2.1]',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses[theme]}`}>
      
      {/* ── TOP READER BAR ── */}
      <header className={`sticky top-0 z-40 backdrop-blur border-b ${themeHeaderBg[theme]} ${themeBorderClasses[theme]} px-4 sm:px-6 py-3 transition-colors duration-200`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          
          {/* Back button + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/story/${storyId}`}
              className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] opacity-60 truncate">{storyTitle}</p>
              <p className={`text-xs font-bold truncate ${themeHeadingClasses[theme]}`}>
                Part {chapterIndex}: {chapterTitle}
              </p>
            </div>
          </div>

          {/* Reader Preferences & Progress */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] opacity-60 hidden sm:block">{readTime} min read</span>
            
            {/* Progress bar */}
            <div className="flex items-center gap-1.5">
              <div className="w-16 sm:w-20 h-1 bg-black/10 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff6122] rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[10px] opacity-60">{progressPercentage}%</span>
            </div>

            {/* Contents index icon */}
            <Link
              href={contentsLink}
              className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Table of Contents"
            >
              <ListOrdered className="w-4 h-4" />
            </Link>

            {/* Quick settings icon */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${showSettings ? 'bg-[#ff6122]/10 text-[#ff6122]' : ''}`}
                title="Reader Preferences"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Preferences Modal dropdown */}
              {showSettings && (
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl p-4 z-50 border ${themeSettingsBg[theme]} animate-fadeIn`}>
                  <div className="space-y-4">
                    
                    {/* Theme selector */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Background</p>
                      <div className="grid grid-cols-4 gap-2">
                        {(['black', 'dark', 'sepia', 'light'] as const).map(t => {
                          const bg = t === 'black' ? 'bg-black border-zinc-800' :
                                     t === 'dark' ? 'bg-[#121214] border-zinc-700' :
                                     t === 'sepia' ? 'bg-[#f4ecd8] border-[#dfd4be]' : 'bg-white border-zinc-200';
                          return (
                            <button
                              key={t}
                              onClick={() => updateTheme(t)}
                              className={`w-full h-8 rounded-lg border-2 flex items-center justify-center transition-all ${bg} ${theme === t ? 'border-[#ff6122] scale-105' : 'hover:scale-102'}`}
                            >
                              {theme === t && (
                                <Check className={`w-3.5 h-3.5 ${t === 'light' ? 'text-zinc-900' : t === 'sepia' ? 'text-[#5b4636]' : 'text-white'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font size selector */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Font Size</p>
                      <div className="flex items-center justify-between gap-1 p-1 bg-black/5 dark:bg-black/20 rounded-xl">
                        {(['sm', 'md', 'lg', 'xl'] as const).map(s => {
                          const labels = { sm: 'A-', md: 'A', lg: 'A+', xl: 'A++' };
                          return (
                            <button
                              key={s}
                              onClick={() => updateFontSize(s)}
                              className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-[#ff6122] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              {labels[s]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font type selector */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Typography</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(['serif', 'sans'] as const).map(f => {
                          const fontLabel = f === 'serif' ? 'Book Serif' : 'Modern Sans';
                          const fontF = f === 'serif' ? 'font-serif' : 'font-sans';
                          return (
                            <button
                              key={f}
                              onClick={() => updateFontStyle(f)}
                              className={`py-1.5 px-3 rounded-lg border text-xs font-semibold ${fontF} ${fontStyle === f ? 'border-[#ff6122] bg-[#ff6122]/5 text-[#ff6122] font-bold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                              {fontLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ── CHAPTER CONTENT ── */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10 md:py-16">
        <h2 className={`text-2xl sm:text-3xl font-extrabold leading-tight mb-8 ${themeHeadingClasses[theme]}`}>
          {chapterTitle}
        </h2>

        <article
          id="chapter-top"
          className={`prose ${theme === 'light' ? 'prose-zinc' : 'prose-invert'} max-w-none 
            prose-p:leading-[1.95] prose-p:mb-6
            prose-strong:font-bold prose-em:italic
            prose-blockquote:border-l-4 prose-blockquote:border-[#ff6122] prose-blockquote:pl-4 prose-blockquote:italic
            ${fontStyle === 'serif' ? 'font-serif' : 'font-sans'} 
            ${sizeClasses[fontSize]}`}
          style={{
            // Keep styling clean across light and sepia themes
            color: theme === 'sepia' ? '#5b4636' : theme === 'light' ? '#27272a' : '#d4d4d8',
          }}
          dangerouslySetInnerHTML={{ __html: chapterContent }}
        />

        {/* ── CHAPTER NAVIGATION ── */}
        <div className={`mt-16 pt-8 border-t ${themeBorderClasses[theme]} flex items-center justify-between gap-4`}>
          {prevLink ? (
            <Link
              href={prevLink}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                theme === 'light'
                  ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  : theme === 'sepia'
                  ? 'bg-[#eadecc] border-[#d8cbb8] text-[#5b4636] hover:bg-[#ebdcc7]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href={`/story/${storyId}`}
            className="text-xs opacity-65 hover:text-[#ff6122] hover:opacity-100 transition-all font-semibold uppercase tracking-wider"
          >
            Contents
          </Link>

          {nextLink ? (
            <Link
              href={nextLink}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#ff6122] hover:bg-[#e04f1a] text-white rounded-full text-xs font-extrabold shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full text-xs font-extrabold">
              ✓ Completed
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
