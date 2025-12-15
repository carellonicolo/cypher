import React from 'react';
import { Github, Moon, Sun, Globe, ShieldCheck, Cpu } from 'lucide-react';
import { Language, Theme, LABELS } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b-0 border-b-white/5 z-40 flex items-center justify-between px-6 md:px-10 transition-colors duration-300">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        {/* Dynamic Logo Container */}
        <div className="relative flex items-center justify-center w-11 h-11 group cursor-default">
            {/* Glowing Blur Behind */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            {/* Main Logo Box */}
            <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm">
                
                {/* Rotating Ring Effect */}
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(99,102,241,0.5)_360deg)] animate-spin-slow opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
                
                {/* Inner Mask for Ring */}
                <div className="absolute inset-[2px] bg-white dark:bg-slate-900 rounded-[10px] z-0"></div>

                {/* Grid Pattern Background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

                {/* Icon Layer */}
                <div className="relative z-10 text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck strokeWidth={2.5} size={22} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                </div>
            </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                {LABELS[lang].title}
              </h1>
              {/* Animated Beta Badge */}
              <span className="relative flex h-5 w-auto items-center justify-center overflow-hidden rounded bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 animate-pulse tracking-wide">BETA</span>
              </span>
          </div>
          <p className="text-xs font-medium bg-gradient-to-r from-slate-500 to-slate-400 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent mt-1">
            {LABELS[lang].subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
          className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-2 group"
          title="Switch Language"
        >
          <Globe size={18} />
          <span className="text-xs font-mono font-bold uppercase">{lang}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700/50 mx-1"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-yellow-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* GitHub Link */}
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="View Source"
        >
          <Github size={18} />
        </a>

      </div>
    </header>
  );
};

export default Header;