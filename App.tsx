import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Console from './components/Console';
import { AlgorithmType, Language, Theme, LABELS, LogEntry, CryptoState } from './types';
import { caesarCipher, vigenereCipher, aesEncrypt, aesDecrypt } from './utils/cryptoEngine';
import { 
  ArrowRightLeft, 
  Lock, 
  Unlock, 
  Copy, 
  Trash2, 
  Settings2, 
  RefreshCcw,
  Binary,
  KeyRound
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('it');
  const [theme, setTheme] = useState<Theme>('dark');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [state, setState] = useState<CryptoState>({
    input: '',
    output: '',
    key: '',
    shift: 3,
    isEncrypting: true,
    algorithm: AlgorithmType.CAESAR,
  });

  // Add a log entry
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message,
    };
    setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50 logs
  };

  // Run encryption/decryption when inputs change
  useEffect(() => {
    const runCrypto = async () => {
      let result = '';
      const { input, key, shift, algorithm, isEncrypting } = state;

      if (!input) {
        setState(s => ({ ...s, output: '' }));
        return;
      }

      addLog(`Starting ${algorithm} ${isEncrypting ? 'Encryption' : 'Decryption'}...`, 'process');

      try {
        if (algorithm === AlgorithmType.CAESAR) {
          result = caesarCipher(input, shift, !isEncrypting);
        } else if (algorithm === AlgorithmType.VIGENERE) {
          result = vigenereCipher(input, key || 'KEY', !isEncrypting);
        } else if (algorithm === AlgorithmType.AES) {
           // AES is async
           if (isEncrypting) {
             result = await aesEncrypt(input, key || 'secret');
           } else {
             result = await aesDecrypt(input, key || 'secret');
           }
        }
        
        setState(s => ({ ...s, output: result }));
        addLog(`Operation successful. Output length: ${result.length}`, 'success');
      } catch (err) {
        addLog(`Error: ${err}`, 'error');
      }
    };

    const timeoutId = setTimeout(runCrypto, 500); // Debounce
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.input, state.key, state.shift, state.algorithm, state.isEncrypting]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Copied to clipboard', 'info');
  };

  const labels = LABELS[lang];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-950 pointer-events-none" />
      
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main className="relative z-10 pt-24 px-4 pb-20 max-w-7xl mx-auto h-screen flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar: Controls (Simulated as a panel) */}
        <aside className="hidden lg:flex flex-col w-64 gap-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-100">
           {/* Algorithm Selector Card */}
           <div className="glass-panel p-4 rounded-xl flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Algorithm</h3>
              {(Object.keys(AlgorithmType) as Array<keyof typeof AlgorithmType>).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setState(s => ({ ...s, algorithm: AlgorithmType[algo] }))}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    state.algorithm === AlgorithmType[algo]
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {algo === 'CAESAR' && <RefreshCcw size={16} />}
                  {algo === 'VIGENERE' && <Binary size={16} />}
                  {algo === 'AES' && <Lock size={16} />}
                  <span>{AlgorithmType[algo]}</span>
                </button>
              ))}
           </div>

           {/* Info Card */}
           <div className="glass-panel p-5 rounded-xl flex-1 flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 mb-1">
               <Settings2 size={20} />
             </div>
             <h3 className="font-semibold text-slate-200">{labels.algorithms[state.algorithm]}</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               {labels.descriptions[state.algorithm]}
             </p>
           </div>
        </aside>

        {/* Center: Main Work Area */}
        <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          
          {/* Top Control Bar (Mobile Algo selector visible only on small screens) */}
          <div className="lg:hidden glass-panel p-3 rounded-xl flex items-center justify-between">
            <select 
              value={state.algorithm}
              onChange={(e) => setState(s => ({...s, algorithm: e.target.value as AlgorithmType}))}
              className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none w-full"
            >
              {(Object.keys(AlgorithmType) as Array<keyof typeof AlgorithmType>).map((algo) => (
                <option key={algo} value={AlgorithmType[algo]} className="bg-slate-900 text-slate-200">
                  {labels.algorithms[AlgorithmType[algo]]}
                </option>
              ))}
            </select>
          </div>

          {/* Central Card: The Machine */}
          <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-500">
            
            {/* Toolbar */}
            <div className="h-14 border-b border-white/5 bg-white/5 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${state.isEncrypting ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`}></div>
                <span className="text-sm font-medium text-slate-300">
                  {state.isEncrypting ? labels.encrypt : labels.decrypt} Mode
                </span>
              </div>
              <button 
                onClick={() => setState(s => ({ ...s, isEncrypting: !s.isEncrypting }))}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Switch Mode"
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-8">
              
              {/* Parameter Configuration Area */}
              <div className="flex flex-wrap gap-6 items-end p-4 rounded-xl bg-slate-900/50 border border-white/5">
                {state.algorithm === AlgorithmType.CAESAR && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{labels.shift}</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="1" 
                        max="25" 
                        value={state.shift}
                        onChange={(e) => setState(s => ({ ...s, shift: parseInt(e.target.value) }))}
                        className="w-40 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <span className="w-10 text-center font-mono text-indigo-400 font-bold text-lg">{state.shift}</span>
                    </div>
                  </div>
                )}

                {(state.algorithm === AlgorithmType.VIGENERE || state.algorithm === AlgorithmType.AES) && (
                  <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{labels.key}</label>
                    <div className="relative group">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="text" 
                        value={state.key}
                        onChange={(e) => setState(s => ({ ...s, key: e.target.value }))}
                        placeholder={state.algorithm === AlgorithmType.AES ? "Enter passphrase..." : "KEYWORD"}
                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 transition-all outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Input / Output Grid */}
              <div className="grid md:grid-cols-2 gap-6 relative">
                 {/* Decorative Arrow */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex w-8 h-8 bg-slate-800 border border-slate-600 rounded-full items-center justify-center text-slate-400">
                    <ArrowRightLeft size={14} className={state.isEncrypting ? "" : "rotate-180"} />
                 </div>

                 {/* Input */}
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        {state.isEncrypting ? 'Plaintext' : 'Ciphertext'}
                      </label>
                      <button onClick={() => setState(s => ({...s, input: ''}))} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea 
                      value={state.input}
                      onChange={(e) => setState(s => ({ ...s, input: e.target.value }))}
                      placeholder={labels.inputPlaceholder}
                      className="w-full h-64 bg-slate-950/30 border border-white/10 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none resize-none font-mono text-sm leading-relaxed"
                    />
                 </div>

                 {/* Output */}
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        {state.isEncrypting ? 'Ciphertext' : 'Plaintext'}
                      </label>
                      <button onClick={() => copyToClipboard(state.output)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="relative group w-full h-64">
                       <textarea 
                        readOnly
                        value={state.output}
                        placeholder={labels.outputPlaceholder}
                        className="w-full h-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-indigo-200 placeholder:text-slate-700 focus:border-indigo-500/30 transition-all outline-none resize-none font-mono text-sm leading-relaxed cursor-text"
                      />
                      {/* Visual Lock Icon Overlay if empty */}
                      {!state.output && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                           {state.isEncrypting ? <Lock size={48} /> : <Unlock size={48} />}
                        </div>
                      )}
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Floating Console */}
      <Console logs={logs} lang={lang} />
    </div>
  );
};

export default App;