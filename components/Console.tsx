import React, { useEffect, useRef } from 'react';
import { Terminal, Clock, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { LogEntry, LABELS, Language } from '../types';

interface ConsoleProps {
  logs: LogEntry[];
  lang: Language;
}

const Console: React.FC<ConsoleProps> = ({ logs, lang }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 glass-panel rounded-xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 z-50 animate-in slide-in-from-bottom-4 fade-in">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Terminal size={14} />
          <span>{LABELS[lang].console}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
        </div>
      </div>
      
      <div className="h-48 overflow-y-auto p-3 font-mono text-xs space-y-2 custom-scrollbar bg-black/40">
        {logs.length === 0 && (
          <div className="text-slate-500 italic text-center mt-10">
            {LABELS[lang].consolePlaceholder}
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-500 shrink-0 mt-0.5">
              [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
            </span>
            <div className="break-all">
              {log.type === 'info' && <span className="text-blue-400 mr-1"><Info size={12} className="inline"/></span>}
              {log.type === 'error' && <span className="text-red-400 mr-1"><AlertCircle size={12} className="inline"/></span>}
              {log.type === 'success' && <span className="text-emerald-400 mr-1"><CheckCircle size={12} className="inline"/></span>}
              {log.type === 'process' && <span className="text-yellow-400 mr-1">➜</span>}
              <span className={
                log.type === 'error' ? 'text-red-300' :
                log.type === 'success' ? 'text-emerald-300' :
                'text-slate-300'
              }>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-2 bg-black/20 border-t border-white/5 flex items-center">
         <span className="text-emerald-500 mr-2 animate-pulse">●</span>
         <span className="text-xs text-slate-400">System Ready</span>
      </div>
    </div>
  );
};

export default Console;