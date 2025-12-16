import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Info, AlertCircle, CheckCircle, Grip, Minus, ChevronUp, X, Maximize2 } from 'lucide-react';
import { LogEntry, LABELS, Language } from '../types';

interface ConsoleProps {
  logs: LogEntry[];
  lang: Language;
}

const Console: React.FC<ConsoleProps> = ({ logs, lang }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // State for minimization and dimensions
  const [isMinimized, setIsMinimized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 384, height: 250 }); // Default w-96 (384px), h-60ish
  const [isResizing, setIsResizing] = useState(false);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  // Handle Resizing Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // Calculate new dimensions based on mouse position relative to window edges
      // Since anchored bottom-right:
      const newWidth = window.innerWidth - e.clientX - 16;
      const newHeight = window.innerHeight - e.clientY - 16;

      setDimensions({
        width: Math.max(300, Math.min(newWidth, 800)), // Clamp width
        height: Math.max(150, Math.min(newHeight, 600)) // Clamp height
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'nw-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  return (
    <div 
      ref={consoleRef}
      style={{ 
        width: isMinimized ? 'auto' : `${dimensions.width}px`,
        height: isMinimized ? 'auto' : `${dimensions.height}px`,
        transition: isResizing ? 'none' : 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className={`fixed bottom-4 right-4 glass-panel rounded-xl flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 ${isMinimized ? 'w-auto' : ''}`}
    >
      
      {/* Resize Handle (Top-Left) - Prominent Floating Bubble */}
      {!isMinimized && (
        <div 
          onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
          className="absolute -top-3 -left-3 w-8 h-8 cursor-nw-resize z-50 group"
          title="Drag to resize"
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95 text-slate-400 group-hover:text-indigo-500">
             <Grip size={16} strokeWidth={2.5} />
          </div>
        </div>
      )}

      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/50 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md cursor-default select-none rounded-t-xl"
        onDoubleClick={() => setIsMinimized(!isMinimized)} // Double click header to toggle
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 pl-1">
          <Terminal size={14} className="text-indigo-500" strokeWidth={2.5} />
          <span>{LABELS[lang].console}</span>
        </div>
        
        {/* Window Controls */}
        <div className="flex gap-2 items-center">
          
          {/* Close Button (Visual - Red) */}
          <button 
            className="w-3.5 h-3.5 rounded-full bg-rose-400 hover:bg-rose-500 shadow-sm flex items-center justify-center group transition-all duration-200 active:scale-90 cursor-default"
            title="System Console (Active)"
          >
             <X size={8} strokeWidth={3} className="text-rose-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {/* Minimize/Expand Button (Yellow/Green) */}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 group ${isMinimized ? 'bg-emerald-400 hover:bg-emerald-500' : 'bg-amber-400 hover:bg-amber-500'}`}
            title={isMinimized ? "Restore" : "Minimize"}
          >
             {isMinimized ? (
               <Maximize2 size={8} strokeWidth={3} className="text-emerald-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
             ) : (
               <Minus size={8} strokeWidth={3} className="text-amber-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
             )}
          </button>
        </div>
      </div>
      
      {/* Body - Hidden if minimized */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-2 custom-scrollbar bg-white/40 dark:bg-black/40">
            {logs.length === 0 && (
              <div className="text-slate-400 dark:text-slate-500 italic text-center mt-10">
                {LABELS[lang].consolePlaceholder}
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 select-none text-[10px]">
                  {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <div className="break-all selection:bg-indigo-500/30">
                  {log.type === 'info' && <span className="text-blue-600 dark:text-blue-400 mr-1.5"><Info size={12} className="inline"/></span>}
                  {log.type === 'error' && <span className="text-red-600 dark:text-red-400 mr-1.5"><AlertCircle size={12} className="inline"/></span>}
                  {log.type === 'success' && <span className="text-emerald-600 dark:text-emerald-400 mr-1.5"><CheckCircle size={12} className="inline"/></span>}
                  {log.type === 'process' && <span className="text-amber-600 dark:text-yellow-400 mr-1.5">➜</span>}
                  <span className={
                    log.type === 'error' ? 'text-red-700 dark:text-red-300' :
                    log.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' :
                    'text-slate-700 dark:text-slate-300'
                  }>
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="p-2 bg-slate-100/50 dark:bg-black/20 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between shrink-0 rounded-b-xl">
             <div className="flex items-center gap-1.5 pl-1">
               <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
               <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Ready</span>
             </div>
             <span className="text-[9px] text-slate-400 font-mono">{Math.round(dimensions.width)}px × {Math.round(dimensions.height)}px</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Console;