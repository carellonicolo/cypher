

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { ThemeProfile } from '../types';
import { getThemeName } from '../utils/themeEngine';

interface ThemeSelectorProps {
  currentProfile: ThemeProfile;
  setProfile: (p: ThemeProfile) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentProfile, setProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    { id: ThemeProfile.DEFAULT, color: 'bg-indigo-500' },
    { id: ThemeProfile.NERD, color: 'bg-lime-500' },
    { id: ThemeProfile.YOUTH, color: 'bg-violet-500' },
    { id: ThemeProfile.NATURE, color: 'bg-emerald-500' },
    { id: ThemeProfile.OCEAN, color: 'bg-cyan-500' },
    { id: ThemeProfile.SUNSET, color: 'bg-orange-500' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 group active:scale-95 ${isOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}
        title="Change Theme"
      >
        <Palette size={16} strokeWidth={2} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] p-1.5 animate-in fade-in zoom-in-95 duration-200 z-[60] border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1 uppercase tracking-wider">Select Style</span>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setProfile(theme.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-2 py-2 rounded-lg text-sm transition-colors ${
                  currentProfile === theme.id
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Color Dot */}
                  <div className={`w-3 h-3 rounded-full ${theme.color} ring-1 ring-inset ring-black/5`}></div>
                  <span>{getThemeName(theme.id)}</span>
                </div>
                {currentProfile === theme.id && <Check size={12} className="text-indigo-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;