import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Terminal, Heart, Leaf, Waves, Sunrise } from 'lucide-react';
import { ThemeProfile } from '../types';
import { getThemeName } from '../utils/themeEngine';

interface ThemeSelectorProps {
  currentProfile: ThemeProfile;
  setProfile: (p: ThemeProfile) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentProfile, setProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { id: ThemeProfile.DEFAULT, color: 'bg-indigo-500', icon: <Sparkles size={14} /> },
    { id: ThemeProfile.NERD, color: 'bg-lime-500', icon: <Terminal size={14} /> },
    { id: ThemeProfile.YOUTH, color: 'bg-violet-500', icon: <Heart size={14} /> },
    { id: ThemeProfile.NATURE, color: 'bg-emerald-500', icon: <Leaf size={14} /> },
    { id: ThemeProfile.OCEAN, color: 'bg-cyan-500', icon: <Waves size={14} /> },
    { id: ThemeProfile.SUNSET, color: 'bg-orange-500', icon: <Sunrise size={14} /> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl transition-all flex items-center gap-2 group active:scale-90 hover:shadow-lg ${
          isOpen 
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
          : 'hover:bg-white dark:hover:bg-white/10 text-slate-500'
        }`}
        title="Change Visual Style"
      >
        <Palette 
          size={20} 
          strokeWidth={isOpen ? 2.5 : 2} 
          className="group-hover:rotate-12 transition-transform"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-56 glass-panel rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-2 animate-in fade-in zoom-in-95 duration-300 z-[100] border border-white/40 dark:border-white/10">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 px-3 py-2 uppercase tracking-[0.2em]">Appearance</span>
            
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setProfile(theme.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-3 rounded-[1rem] text-sm transition-all duration-200 group/item ${
                  currentProfile === theme.id
                    ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover/item:scale-110 ${
                    currentProfile === theme.id 
                    ? 'bg-white/20 text-white' 
                    : `${theme.color} text-white`
                  }`}>
                    {theme.icon}
                  </div>
                  <span className="font-semibold tracking-tight">{getThemeName(theme.id)}</span>
                </div>
                {currentProfile === theme.id && <Check size={16} strokeWidth={3} className="mr-1" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;