import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal, Info, AlertCircle, CheckCircle, Minus, Maximize2, X } from 'lucide-react';
import { LogEntry, LABELS, Language } from '../types';

interface ConsoleProps {
  logs: LogEntry[];
  lang: Language;
  onClear: () => void;
}

const Console: React.FC<ConsoleProps> = ({ logs, lang, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // States
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 450, height: 320 });
  const [isResizing, setIsResizing] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  // Manual Resize Logic
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX - 24;
      const newHeight = window.innerHeight - e.clientY - 24;
      setSize({
        width: Math.max(320, newWidth),
        height: Math.max(200, newHeight)
      });
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

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

  // Dynamic CSS Logic for Transitions
  const getDynamicStyles = (): React.CSSProperties => {
    const margin = 24; // 1.5rem

    if (isMinimized) {
      return {
        top: `calc(100% - 3.5rem - ${margin}px)`,
        left: `calc(100% - 3.5rem - ${margin}px)`,
        right: `${margin}px`,
        bottom: `${margin}px`,
        borderRadius: '9999px',
        pointerEvents: 'auto',
      };
    }

    if (isMaximized) {
      return {
        top: '7rem',
        left: 'calc(16.6% + 3rem)', // Approximated sidebar width + gap
        right: '2rem',
        bottom: '2rem',
        borderRadius: '1.5rem',
        pointerEvents: 'auto',
      };
    }

    // Floating State (Calculated from bottom-right)
    return {
      top: `calc(100% - ${size.height}px - ${margin}px)`,
      left: `calc(100% - ${size.width}px - ${margin}px)`,
      right: `${margin}px`,
      bottom: `${margin}px`,
      borderRadius: '1.5rem',
      pointerEvents: 'auto',
    };
  };

  return (
    <div 
      ref={containerRef}
      style={getDynamicStyles()}
      className={`fixed glass-panel flex flex-col shadow-[0_30px_90px_-15px_rgba(0,0,0,0.4)] z-40 border border-white/30 dark:border-white/10 overflow-hidden
        ${isResizing ? '' : 'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)'}
        ${isMinimized ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
      `}
      onClick={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      {/* MINIMIZED ICON VIEW */}
      <div className={`absolute inset-0 flex items-center justify-center text-blue-500 transition-opacity duration-300 ${isMinimized ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
        <Terminal size={22} strokeWidth={2.5} />
      </div>

      {/* FULL CONSOLE CONTENT */}
      <div className={`flex flex-col h-full w-full transition-all duration-300 ${isMinimized ? 'opacity-0 scale-90 pointer-events-none blur-md' : 'opacity-100 scale-100'}`}>
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/40 dark:border-white/5 bg-white/40 dark:bg-black/40 rounded-t-[1.5rem] shrink-0 select-none">
          <div className="flex gap-2.5">
             <button onClick={handleRedClick} className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black/10 flex items-center justify-center transition-all hover:brightness-90 active:scale-90 group">
               <X size={8} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
             <button onClick={handleYellowClick} className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/10 flex items-center justify-center transition-all hover:brightness-90 active:scale-90 group">
               <Minus size={8} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
             <button onClick={handleGreenClick} className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black/10 flex items-center justify-center transition-all hover:brightness-90 active:scale-90 group">
               <Maximize2 size={7} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            <Terminal size={12} className="text-blue-500" />
            <span>{LABELS[lang].console}</span>
          </div>
          <div className="w-12"></div>
        </div>
        
        {/* Log Feed */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-4 custom-scrollbar bg-white/10 dark:bg-black/10 backdrop-blur-md">
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400/30 italic space-y-3">
              <Terminal size={40} strokeWidth={0.5} className="mb-2 opacity-20" />
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase font-black">{LABELS[lang].consolePlaceholder}</p>
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="text-slate-400 dark:text-slate-600 shrink-0 mt-0.5 select-none font-bold tabular-nums opacity-60">
                {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
              </span>
              <div className="break-all selection:bg-blue-500/30 flex-1 leading-relaxed">
                <span className={log.type === 'error' ? 'text-rose-500' : log.type === 'success' ? 'text-emerald-500' : log.type === 'process' ? 'text-amber-500' : 'text-blue-500'}>
                  {log.type === 'process' ? '➜' : '●'}
                </span>
                <span className={`ml-2.5 ${log.type === 'error' ? 'text-rose-600 dark:text-rose-400 font-bold' : log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50/20 dark:bg-black/30 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between shrink-0 rounded-b-[1.5rem]">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
             <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] opacity-80">System Secure</span>
           </div>
           <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 opacity-60 tracking-[0.1em] tabular-nums">
             {logs.length} OPS LOGGED
           </span>
        </div>

        {/* Resize Handle */}
        {!isMaximized && (
          <div 
            onMouseDown={startResizing}
            className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-50 group flex items-end justify-end p-1.5"
          >
            <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400/20 group-hover:border-blue-500/50 rounded-br-sm transition-colors"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;