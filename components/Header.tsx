import React from 'react';
import { Github, Moon, Sun, Globe, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';
import { Language, Theme, LABELS, ThemeProfile } from '../types';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  themeProfile: ThemeProfile;
  setThemeProfile: (p: ThemeProfile) => void;
  scale: number;
  setScale: (s: number) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, theme, setTheme, themeProfile, setThemeProfile, scale, setScale 
}) => {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const adjustScale = (delta: number) => {
    const newScale = Math.min(Math.max(scale + delta, 80), 150);
    setScale(newScale);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-24 glass-panel border-b-0 z-[60] flex items-center justify-between px-10 transition-all duration-500">
      
      {/* Branding */}
      <div className="flex items-center gap-8">
        <div className="relative w-14 h-14 group">
            <div className="absolute inset-0 rounded-[1.2rem] bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="relative w-full h-full bg-white dark:bg-[#2c2c2e] backdrop-blur-3xl rounded-[1.2rem] border border-white/40 dark:border-white/10 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                <ShieldCheck strokeWidth={2.5} size={28} className="text-blue-500 drop-shadow-[0_0_12px_rgba(0,122,255,0.4)]" />
            </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white leading-none font-display uppercase italic">
            {LABELS[lang].title}
          </h1>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2 opacity-90">
            {LABELS[lang].subtitle}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white/40 dark:bg-black/20 p-2 rounded-3xl border border-white/20 dark:border-white/5 backdrop-blur-3xl shadow-xl">
        
        <div className="hidden sm:flex items-center gap-2 px-3">
           <button onClick={() => adjustScale(-10)} className="p-2.5 rounded-2xl hover:bg-white dark:hover:bg-white/10 text-slate-500 transition-all active:scale-90 hover:shadow-lg"><ZoomOut size={18} /></button>
           <button onClick={() => adjustScale(10)} className="p-2.5 rounded-2xl hover:bg-white dark:hover:bg-white/10 text-slate-500 transition-all active:scale-90 hover:shadow-lg"><ZoomIn size={18} /></button>
        </div>

        <div className="h-8 w-[1.5px] bg-slate-400/20 mx-1"></div>

        <ThemeSelector currentProfile={themeProfile} setProfile={setThemeProfile} />

        <button 
          onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
          className="p-3 rounded-2xl hover:bg-white dark:hover:bg-white/10 text-slate-500 transition-all flex items-center gap-3 group active:scale-90 hover:shadow-lg"
        >
          <Globe size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase hidden md:inline tracking-widest">{lang}</span>
        </button>

        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl hover:bg-white dark:hover:bg-white/10 text-slate-500 transition-all active:scale-90 hover:shadow-lg"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <a href="https://github.com" target="_blank" className="p-3 rounded-2xl hover:bg-white dark:hover:bg-white/10 text-slate-500 transition-all active:scale-90 hover:shadow-lg">
          <Github size={20} />
        </a>
      </div>
    </header>
  );
};

export default Header;