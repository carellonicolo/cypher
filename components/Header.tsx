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
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b-0 border-b-white/5 z-40 flex items-center justify-between px-6 md:px-10">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-100 dark:text-white light:text-slate-900 leading-none">
            {LABELS[lang].title} <span className="text-[10px] ml-1 bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">BETA</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {LABELS[lang].subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-2 group"
          title="Switch Language"
        >
          <Globe size={18} />
          <span className="text-xs font-mono font-bold uppercase">{lang}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-700/50 mx-1"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-yellow-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* GitHub Link */}
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          title="View Source"
        >
          <Github size={18} />
        </a>

      </div>
    </header>
  );
};

export default Header;