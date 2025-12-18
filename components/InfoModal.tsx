import React, { useEffect, useState } from 'react';
import { X, BookOpen, Command, Grid, Shield, Key, Hash } from 'lucide-react';
import { AlgorithmType, Language, LABELS, AlgorithmCategory } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm?: AlgorithmType; // Optional, can be category
  category?: AlgorithmCategory; // Optional, used if algorithm is not set
  lang: Language;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, algorithm, category, lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Animation configuration
  const ANIMATION_DURATION = 400; // ms

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Slight delay to allow DOM render before applying active classes
      requestAnimationFrame(() => {
          // Double requestAnimationFrame to ensure browser has painted the initial state (opacity-0)
          requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  let title = "";
  let subTitle = "";
  let content = { theory: "", guide: "" };
  let isCategoryMode = false;

  if (category) {
    isCategoryMode = true;
    title = LABELS[lang].categories[category];
    subTitle = "Category Overview";
    content.theory = LABELS[lang].categoryDetails?.[category] || "Description unavailable.";
  } else if (algorithm) {
    title = LABELS[lang].algorithms[algorithm];
    subTitle = "Algorithm Documentation";
    content = LABELS[lang].algoDetails[algorithm];
  }

  // Determine icon based on category/type
  const getIcon = () => {
     if (category === AlgorithmCategory.GENERAL) return <Shield size={24} />;
     if (category === AlgorithmCategory.HASHING) return <Hash size={24} />;
     if (category === AlgorithmCategory.SYMMETRIC || category === AlgorithmCategory.MAC) return <Key size={24} />;
     if (isCategoryMode) return <Grid size={24} />;
     return <BookOpen size={24} />;
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-none`}>
      
      {/* Backdrop with simple fade */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Content with Custom Bezier Spring Animation */}
      <div 
        className={`relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-white/20 dark:border-white/10 transition-all transform-gpu ${
            isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{ 
            transitionDuration: `${ANIMATION_DURATION}ms`,
            // Custom spring-like bezier: starts fast, overshoots slightly, settles smoothly
            transitionTimingFunction: isVisible 
                ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring open
                : 'cubic-bezier(0.4, 0, 0.2, 1)'      // Standard ease close
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isCategoryMode ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' : 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white'}`}>
                {getIcon()}
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{title}</h2>
               <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-80">{subTitle}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/80 dark:bg-slate-950/40">
          
          {/* Theory Section */}
          <section className="space-y-4">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border-b border-indigo-200 dark:border-indigo-900/50 pb-2">
               <BookOpen size={14} /> {lang === 'it' ? 'Analisi Teorica' : 'Theoretical Analysis'}
             </h3>
             <div className="text-sm md:text-[15px] leading-7 text-slate-700 dark:text-slate-300 text-justify font-sans">
               {content.theory.split('\n').map((line, i) => (
                 <p key={i} className="mb-4 last:mb-0">
                   {line.includes('**') ? (
                     // Simple Markdown bold parser
                     line.split('**').map((part, index) => 
                       index % 2 === 1 ? <strong key={index} className="text-slate-900 dark:text-white font-bold">{part}</strong> : part
                     )
                   ) : line}
                 </p>
               ))}
               {/* MathJax placeholder could go here if we were using a math library */}
             </div>
          </section>

          {/* Divider (Only if guide exists) */}
          {content.guide && <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent w-full" />}

          {/* Guide Section (Only for Algorithms) */}
          {content.guide && (
            <section className="space-y-4">
               <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-900/50 pb-2">
                 <Command size={14} /> {lang === 'it' ? 'Manuale Operativo' : 'Operations Manual'}
               </h3>
               <div className="bg-white/80 dark:bg-black/20 rounded-xl p-5 border border-slate-200 dark:border-white/5 shadow-inner">
                  <ul className="space-y-3">
                    {content.guide.split('\n').map((line, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                         <span className="text-emerald-500 font-bold mt-0.5">➜</span>
                         <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
               </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md flex justify-end">
          <button 
             onClick={onClose}
             className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold transition-all transform active:scale-95 shadow-lg"
          >
            {lang === 'it' ? 'Chiudi Documentazione' : 'Close Documentation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;