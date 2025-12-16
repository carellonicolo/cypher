import React from 'react';
import { X, BookOpen, Command } from 'lucide-react';
import { AlgorithmType, Language, LABELS } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm: AlgorithmType;
  lang: Language;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, algorithm, lang }) => {
  if (!isOpen) return null;

  const content = LABELS[lang].algoDetails[algorithm];
  const title = LABELS[lang].algorithms[algorithm];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-all"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BookOpen size={20} />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{title}</h2>
               <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Documentation</p>
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
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/50 dark:bg-transparent">
          
          {/* Theory Section */}
          <section className="space-y-3">
             <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
               <BookOpen size={14} /> {lang === 'it' ? 'Teoria & Concetti' : 'Theory & Concepts'}
             </h3>
             <div className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
               {content.theory.split('\n').map((line, i) => (
                 <p key={i} className="mb-2 last:mb-0">{line}</p>
               ))}
             </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent w-full my-4" />

          {/* Guide Section */}
          <section className="space-y-3">
             <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
               <Command size={14} /> {lang === 'it' ? 'Guida all\'uso' : 'How to use'}
             </h3>
             <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-white/5">
                <ul className="space-y-2">
                  {content.guide.split('\n').map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                       <span className="text-indigo-500 font-bold">•</span>
                       <span>{line}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex justify-end">
          <button 
             onClick={onClose}
             className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            {lang === 'it' ? 'Chiudi' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;