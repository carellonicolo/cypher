import React from 'react';
import { Github, Moon, Sun, Globe, ShieldCheck } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b-0 border-b-white/10 z-50 flex items-center justify-between px-6 md:px-10 transition-colors duration-300">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        {/* Dynamic Logo Container */}
        <div className="relative flex items-center justify-center w-10 h-10 group cursor-default">
            {/* Glowing Blur Behind */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            {/* Main Logo Box */}
            <div className="relative w-full h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                
                {/* Rotating Ring Effect */}
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(99,102,241,0.5)_360deg)] animate-spin-slow opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
                
                {/* Inner Mask for Ring */}
                <div className="absolute inset-[2px] bg-white dark:bg-slate-900 rounded-[8px] z-0"></div>

                {/* Icon Layer */}
                <div className="relative z-10 text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck strokeWidth={2.5} size={20} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                </div>
            </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none font-display">
                {LABELS[lang].title}
              </h1>
              {/* Refined Badge */}
              <span className="relative flex items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20">
                  <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">BETA</span>
              </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3 bg-white/20 dark:bg-black/20 p-1.5 rounded-2xl backdrop-blur-sm border border-white/10">
        
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
          className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 group active:scale-95"
          title="Switch Language"
        >
          <Globe size={16} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase hidden md:inline">{lang}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-400/20 dark:bg-white/10 mx-1"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
        </button>

        {/* GitHub Link */}
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
          title="View Source"
        >
          <Github size={16} strokeWidth={2} />
        </a>

      </div>
    </header>
  );
};

export default Header;