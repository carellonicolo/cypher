import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Info, AlertCircle, CheckCircle, Minus, Maximize2, X } from 'lucide-react';
import { LogEntry, LABELS, Language } from '../types';

interface ConsoleProps {
  logs: LogEntry[];
  lang: Language;
  onClear: () => void;
}

const Console: React.FC<ConsoleProps> = ({ logs, lang, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  const handleRedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleYellowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleGreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  // Dynamic positioning logic based on state
  const getDynamicStyles = (): React.CSSProperties => {
    if (isMinimized) {
      return {
        bottom: '1.5rem',
        right: '1.5rem',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '9999px',
      };
    }

    if (isMaximized) {
      return {
        top: '7rem', // Header (6rem) + Gap (1rem)
        left: 'calc(25% + 2.5rem)', // Sidebar Width + Gap (Approximate to match main layout)
        right: '2rem',
        bottom: '2rem',
        width: 'auto',
        height: 'auto',
      };
    }

    // Default Floating State
    return {
      bottom: '2rem',
      right: '2rem',
      width: '450px',
      height: '320px',
      resize: 'both',
      overflow: 'hidden',
    };
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        style={getDynamicStyles()}
        className="fixed glass-panel shadow-2xl z-40 flex items-center justify-center text-blue-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20 dark:border-white/10"
        title="Riapri Console"
      >
        <Terminal size={22} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div 
      style={getDynamicStyles()}
      className="fixed glass-panel rounded-[1.5rem] flex flex-col shadow-[0_30px_90px_-15px_rgba(0,0,0,0.4)] z-40 transition-all duration-500 border border-white/30 dark:border-white/10"
    >
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/40 dark:border-white/5 bg-white/30 dark:bg-black/20 rounded-t-[1.5rem] shrink-0 select-none">
        <div className="flex gap-2">
           {/* RED: Clear + Minimize */}
           <button 
             onClick={handleRedClick}
             className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/5 flex items-center justify-center transition-all hover:brightness-90 active:scale-90 group"
           >
             <X size={8} strokeWidth={3} className="text-black/40 opacity-0 group-hover:opacity-100" />
           </button>
           
           {/* YELLOW: Minimize */}
           <button 
             onClick={handleYellowClick}
             className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/5 flex items-center justify-center transition-all hover:brightness-90 active:scale-90 group"
           >
             <Minus size={8} strokeWidth={3} className="text-black/40 opacity-0 group-hover:opacity-100" />
           </button>

           {/* GREEN: Workspace Maximize */}
           <button 
             onClick={handleGreenClick}
             className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/5 flex items-center justify-center transition-all hover:brightness-90 active:scale-90 group"
           >
             <Maximize2 size={7} strokeWidth={3} className="text-black/40 opacity-0 group-hover:opacity-100" />
           </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          <Terminal size={12} className="text-blue-500" />
          <span>{LABELS[lang].console}</span>
        </div>
        
        <div className="w-10"></div>
      </div>
      
      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-5 font-mono text-[11px] space-y-3 custom-scrollbar bg-white/20 dark:bg-black/10">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400/50 italic opacity-50 space-y-2">
            <Terminal size={32} strokeWidth={1} className="mb-2" />
            <p className="font-sans text-xs tracking-wide uppercase font-bold">{LABELS[lang].consolePlaceholder}</p>
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-400 dark:text-slate-600 shrink-0 mt-0.5 select-none font-bold tabular-nums">
              {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </span>
            <div className="break-all selection:bg-blue-500/30 flex-1 leading-relaxed">
              <span className={
                log.type === 'error' ? 'text-red-500' :
                log.type === 'success' ? 'text-emerald-500' :
                log.type === 'process' ? 'text-amber-500' :
                'text-blue-500'
              }>
                {log.type === 'process' ? '➜' : '●'}
              </span>
              <span className={`ml-2 ${
                log.type === 'error' ? 'text-red-600 dark:text-red-400 font-bold' :
                log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                'text-slate-700 dark:text-slate-300'
              }`}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Footer Details */}
      <div className="px-5 py-2.5 bg-slate-50/30 dark:bg-black/20 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between shrink-0 rounded-b-[1.5rem]">
         <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
           <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Link</span>
         </div>
         <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 opacity-60 tabular-nums">
           {logs.length} OPS SECURED
         </span>
      </div>
    </div>
  );
};

export default Console;