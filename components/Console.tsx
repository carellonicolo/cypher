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
  
  // States for window behavior
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  // Handler for Red button: Clear + Minimize
  const handleRedClick = () => {
    onClear();
    setIsMinimized(true);
    setIsFullScreen(false);
  };

  // Handler for Yellow button: Minimize
  const handleYellowClick = () => {
    setIsMinimized(!isMinimized);
    setIsFullScreen(false);
  };

  // Handler for Green button: Full Screen
  const handleGreenClick = () => {
    setIsFullScreen(!isFullScreen);
    setIsMinimized(false);
  };

  const getContainerClasses = () => {
    let base = "fixed glass-panel rounded-2xl flex flex-col shadow-2xl z-50 transition-all duration-500 ease-in-out border border-white/20 dark:border-white/10 ";
    
    if (isFullScreen) {
      return base + "inset-10 w-auto h-auto";
    }
    
    if (isMinimized) {
      return base + "bottom-6 right-6 w-14 h-14 overflow-hidden rounded-full cursor-pointer hover:scale-110 active:scale-95";
    }
    
    return base + "bottom-6 right-6 w-[450px] h-[300px]";
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className={getContainerClasses()}
        title="Riapri Console"
      >
        <div className="w-full h-full flex items-center justify-center text-blue-500">
           <Terminal size={24} strokeWidth={2.5} />
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      
      {/* Header with Mac-style controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-white/5 bg-slate-50/40 dark:bg-black/20 rounded-t-2xl">
        <div className="flex gap-2">
           {/* RED: Clear + Minimize */}
           <button 
             onClick={handleRedClick}
             className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 shadow-inner group flex items-center justify-center transition-all hover:brightness-90 active:scale-90"
             title="Svuota e Minimizza"
           >
             <X size={8} strokeWidth={3} className="text-black/30 opacity-0 group-hover:opacity-100" />
           </button>
           
           {/* YELLOW: Minimize */}
           <button 
             onClick={handleYellowClick}
             className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 shadow-inner group flex items-center justify-center transition-all hover:brightness-90 active:scale-90"
             title="Minimizza"
           >
             <Minus size={8} strokeWidth={3} className="text-black/30 opacity-0 group-hover:opacity-100" />
           </button>

           {/* GREEN: Full Screen */}
           <button 
             onClick={handleGreenClick}
             className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 shadow-inner group flex items-center justify-center transition-all hover:brightness-90 active:scale-90"
             title={isFullScreen ? "Riduci" : "Tutto Schermo"}
           >
             <Maximize2 size={7} strokeWidth={3} className="text-black/30 opacity-0 group-hover:opacity-100" />
           </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pr-1">
          <Terminal size={12} className="text-blue-500" />
          <span>{LABELS[lang].console}</span>
        </div>
        
        <div className="w-12"></div> {/* Spacer to center title if needed */}
      </div>
      
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2.5 custom-scrollbar bg-white/30 dark:bg-black/30">
        {logs.length === 0 && (
          <div className="text-slate-400 dark:text-slate-500 italic text-center mt-12 opacity-50 font-sans tracking-tight">
            {LABELS[lang].consolePlaceholder}
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-400 dark:text-slate-600 shrink-0 mt-0.5 select-none font-medium tabular-nums">
              {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </span>
            <div className="break-all selection:bg-blue-500/30 flex-1 leading-relaxed">
              {log.type === 'info' && <span className="text-blue-500 mr-2"><Info size={12} className="inline align-middle"/></span>}
              {log.type === 'error' && <span className="text-red-500 mr-2"><AlertCircle size={12} className="inline align-middle"/></span>}
              {log.type === 'success' && <span className="text-emerald-500 mr-2"><CheckCircle size={12} className="inline align-middle"/></span>}
              {log.type === 'process' && <span className="text-amber-500 mr-2">➜</span>}
              <span className={
                log.type === 'error' ? 'text-red-600 dark:text-red-400' :
                log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                'text-slate-700 dark:text-slate-300'
              }>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Footer Minimalist */}
      <div className="px-4 py-2 bg-slate-50/40 dark:bg-black/20 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between shrink-0 rounded-b-2xl">
         <div className="flex items-center gap-2">
           <div className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </div>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-70">Live Status</span>
         </div>
         <span className="text-[9px] text-slate-400 font-mono opacity-50">{logs.length} operations logged</span>
      </div>
    </div>
  );
};

export default Console;