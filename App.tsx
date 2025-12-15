import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Console from './components/Console';
import { 
  AlgorithmType, Language, Theme, LABELS, LogEntry, SectionState, 
  VigenereMode, AesMode, AlgorithmCategory, ALGO_CATEGORIES, Sha3Length 
} from './types';
import { 
  caesarCipher, vigenereCipher, aesEncrypt, aesDecrypt, 
  playfairCipher, substitutionCipher, computeHash,
  legacySimulationEncrypt, legacySimulationDecrypt,
  generateRSAKeys, rsaEncrypt, rsaDecrypt
} from './utils/cryptoEngine';
import { 
  Lock, Unlock, Copy, Trash2, Settings2, ArrowRight,
  ShieldCheck, Hash, Key, BookOpen
} from 'lucide-react';

// Reusable Segmented Control
const SegmentedControl = ({ 
  options, value, onChange, labelMap, color = 'indigo'
}: { 
  options: string[], value: string, onChange: (val: string) => void, labelMap: Record<string, string>, color?: 'indigo' | 'rose'
}) => {
  return (
    <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg w-full">
      {options.map((opt) => {
        const isActive = value === opt;
        const activeClass = color === 'indigo' 
          ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm ring-1 ring-black/5' 
          : 'bg-white dark:bg-slate-600 text-rose-600 dark:text-rose-300 shadow-sm ring-1 ring-black/5';
        
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 px-2 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-200 uppercase tracking-tight ${
              isActive 
                ? activeClass
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {labelMap[opt] || opt}
          </button>
        );
      })}
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('it');
  const [theme, setTheme] = useState<Theme>('dark');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.CAESAR);
  
  // Independent States
  const [encState, setEncState] = useState<SectionState>({
    input: '', output: '', key: '', shift: 3, vigenereMode: VigenereMode.REPEATING, aesMode: AesMode.GCM, sha3Length: Sha3Length.L512
  });
  
  const [decState, setDecState] = useState<SectionState>({
    input: '', output: '', key: '', shift: 3, vigenereMode: VigenereMode.REPEATING, aesMode: AesMode.GCM, sha3Length: Sha3Length.L512
  });

  const category = ALGO_CATEGORIES[algorithm];
  const isHashing = category === AlgorithmCategory.HASHING;
  const isAsymmetric = category === AlgorithmCategory.ASYMMETRIC;

  const labels = LABELS[lang];

  // Add a log entry
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message,
    };
    setLogs(prev => [...prev.slice(-50), newLog]);
  };

  // --- RSA Key Gen Effect ---
  useEffect(() => {
    if (algorithm === AlgorithmType.RSA && !encState.rsaKeyPair) {
      addLog('Generating RSA Key Pair (2048-bit)...', 'process');
      generateRSAKeys().then((keys) => {
        setEncState(s => ({ ...s, rsaKeyPair: keys.kp, rsaPubPem: keys.pubPem, rsaPrivPem: keys.privPem }));
        setDecState(s => ({ ...s, rsaKeyPair: keys.kp, rsaPubPem: keys.pubPem, rsaPrivPem: keys.privPem }));
        addLog('RSA Keys Generated successfully.', 'success');
      });
    }
  }, [algorithm]);

  // --- Encryption Effect ---
  useEffect(() => {
    const runEncrypt = async () => {
      if (!encState.input) {
        setEncState(s => ({ ...s, output: '' }));
        return;
      }
      
      let result = '';
      addLog(`Processing ${algorithm}...`, 'process');

      try {
        switch(algorithm) {
          case AlgorithmType.CAESAR:
            result = caesarCipher(encState.input, encState.shift, false);
            break;
          case AlgorithmType.VIGENERE:
            result = vigenereCipher(encState.input, encState.key || 'KEY', false, encState.vigenereMode);
            break;
          case AlgorithmType.PLAYFAIR:
            result = playfairCipher(encState.input, encState.key || 'KEY', false);
            break;
          case AlgorithmType.MONOALPHABETIC:
            result = substitutionCipher(encState.input, encState.key || 'KEY', false);
            break;
          case AlgorithmType.AES:
            result = await aesEncrypt(encState.input, encState.key || 'secret', encState.aesMode);
            break;
          case AlgorithmType.DES:
          case AlgorithmType.TRIPLE_DES:
            result = legacySimulationEncrypt(encState.input, algorithm === AlgorithmType.DES ? 'DES' : '3DES');
            break;
          case AlgorithmType.RSA:
            if (encState.rsaKeyPair) {
              result = await rsaEncrypt(encState.input, encState.rsaKeyPair.publicKey);
            } else {
              result = "Generating Keys...";
            }
            break;
          case AlgorithmType.MD5:
          case AlgorithmType.SHA1:
          case AlgorithmType.SHA256:
          case AlgorithmType.SHA512:
            result = await computeHash(encState.input, algorithm);
            break;
          case AlgorithmType.SHA3:
            result = await computeHash(encState.input, algorithm, encState.sha3Length);
            break;
        }
        
        setEncState(s => ({ ...s, output: result }));
        if (result.startsWith('Error:')) addLog(result, 'error');
        else addLog(`${isHashing ? 'Hashing' : 'Encryption'} successful.`, 'success');
      } catch (err) {
        addLog(`Error: ${err}`, 'error');
      }
    };
    const timeout = setTimeout(runEncrypt, 500);
    return () => clearTimeout(timeout);
  }, [encState.input, encState.key, encState.shift, encState.vigenereMode, encState.aesMode, encState.sha3Length, algorithm, encState.rsaKeyPair]);

  // --- Decryption Effect ---
  useEffect(() => {
    if (isHashing) return; // Skip for hashing

    const runDecrypt = async () => {
      if (!decState.input) {
        setDecState(s => ({ ...s, output: '' }));
        return;
      }
      
      let result = '';
      addLog(`Decrypting with ${algorithm}...`, 'process');

      try {
        switch(algorithm) {
          case AlgorithmType.CAESAR:
            result = caesarCipher(decState.input, decState.shift, true);
            break;
          case AlgorithmType.VIGENERE:
            result = vigenereCipher(decState.input, decState.key || 'KEY', true, decState.vigenereMode);
            break;
          case AlgorithmType.PLAYFAIR:
            result = playfairCipher(decState.input, decState.key || 'KEY', true);
            break;
          case AlgorithmType.MONOALPHABETIC:
            result = substitutionCipher(decState.input, decState.key || 'KEY', true);
            break;
          case AlgorithmType.AES:
            result = await aesDecrypt(decState.input, decState.key || 'secret', decState.aesMode);
            break;
          case AlgorithmType.DES:
          case AlgorithmType.TRIPLE_DES:
            result = legacySimulationDecrypt(decState.input, algorithm === AlgorithmType.DES ? 'DES' : '3DES');
            break;
          case AlgorithmType.RSA:
            if (decState.rsaKeyPair) {
              result = await rsaDecrypt(decState.input, decState.rsaKeyPair.privateKey);
            }
            break;
        }
        
        setDecState(s => ({ ...s, output: result }));
        if (result.startsWith('Error:')) addLog(result, 'error');
        else addLog(`Decryption successful.`, 'success');
      } catch (err) {
        addLog(`Decryption Error: ${err}`, 'error');
      }
    };
    const timeout = setTimeout(runDecrypt, 500);
    return () => clearTimeout(timeout);
  }, [decState.input, decState.key, decState.shift, decState.vigenereMode, decState.aesMode, algorithm, decState.rsaKeyPair]);


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Copied to clipboard', 'info');
  };

  const transferToDecrypt = () => {
    setDecState(s => ({
      ...s,
      input: encState.output,
      key: encState.key,
      shift: encState.shift,
      aesMode: encState.aesMode,
      vigenereMode: encState.vigenereMode
    }));
    addLog('Transferred ciphertext to decryption module', 'info');
  };

  const getCategoryIcon = (cat: AlgorithmCategory) => {
    switch(cat) {
      case AlgorithmCategory.CLASSICAL: return <BookOpen size={14}/>;
      case AlgorithmCategory.SYMMETRIC: return <ShieldCheck size={14}/>;
      case AlgorithmCategory.ASYMMETRIC: return <Key size={14}/>;
      case AlgorithmCategory.HASHING: return <Hash size={14}/>;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-60 dark:opacity-40 pointer-events-none transition-opacity duration-300" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-100/0 via-slate-100/80 to-slate-200 dark:from-slate-900/0 dark:via-slate-900/50 dark:to-slate-950 pointer-events-none transition-colors duration-300" />
      
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main className="relative z-10 pt-24 px-4 pb-20 max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar: Global Settings */}
        <aside className="lg:w-64 flex flex-col gap-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-100 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pb-10">
           
           {/* Algorithm Selector Grouped */}
           <div className="glass-panel p-3 rounded-xl flex flex-col gap-4">
              {Object.keys(labels.categories).map((catKey) => {
                const cat = catKey as AlgorithmCategory;
                const algos = Object.keys(ALGO_CATEGORIES).filter(a => ALGO_CATEGORIES[a as AlgorithmType] === cat);
                if (algos.length === 0) return null;

                return (
                  <div key={cat} className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 px-2 flex items-center gap-2">
                       {getCategoryIcon(cat)} {labels.categories[cat]}
                    </h3>
                    <div className="space-y-1">
                      {algos.map((algo) => (
                        <button
                          key={algo}
                          onClick={() => setAlgorithm(algo as AlgorithmType)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 truncate ${
                            algorithm === algo
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          {labels.algorithms[algo as AlgorithmType]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>

           {/* Info Card */}
           <div className="glass-panel p-5 rounded-xl hidden lg:flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-1">
               <Settings2 size={20} />
             </div>
             <h3 className="font-semibold text-slate-800 dark:text-slate-200">{labels.algorithms[algorithm]}</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
               {labels.descriptions[algorithm]}
             </p>
           </div>
        </aside>

        {/* Main Grid */}
        <div className={`flex-1 grid grid-cols-1 ${isHashing ? 'xl:grid-cols-1' : 'xl:grid-cols-2'} gap-6 w-full`}>
          
          {/* ================= ENCRYPTION PANEL ================= */}
          <div className={`glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl dark:shadow-2xl ring-1 ring-indigo-500/20 animate-in zoom-in-95 duration-500 h-fit ${isHashing ? 'max-w-3xl mx-auto w-full' : ''}`}>
            <div className="h-14 border-b border-slate-200/50 dark:border-white/5 bg-indigo-50/50 dark:bg-indigo-950/20 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                  {isHashing ? 'Input & Hash' : labels.encrypt}
                </span>
              </div>
              <Lock size={16} className="text-indigo-400" />
            </div>

            <div className="p-5 flex flex-col gap-5">
               {/* Controls */}
               <div className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 space-y-4">
                
                {/* CAESAR */}
                {algorithm === AlgorithmType.CAESAR && (
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-semibold text-slate-500 uppercase">{labels.shift}</label>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <input type="range" min="1" max="25" value={encState.shift} onChange={(e) => setEncState(s => ({ ...s, shift: parseInt(e.target.value) }))} className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                        <span className="w-6 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">{encState.shift}</span>
                      </div>
                    </div>
                )}
                
                {/* KEY INPUT (Vigenere, Playfair, Mono, AES, DES) */}
                {(category === AlgorithmCategory.CLASSICAL || category === AlgorithmCategory.SYMMETRIC) && algorithm !== AlgorithmType.CAESAR && (
                  <div className="flex flex-col gap-3">
                     <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">{labels.key}</label>
                        <input type="text" value={encState.key} onChange={(e) => setEncState(s => ({ ...s, key: e.target.value }))} placeholder="KEY / PASSWORD" className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors"/>
                     </div>
                     {algorithm === AlgorithmType.VIGENERE && (
                       <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Mode</label>
                          <SegmentedControl options={Object.keys(VigenereMode)} value={encState.vigenereMode} onChange={(v) => setEncState(s => ({...s, vigenereMode: v as VigenereMode}))} labelMap={labels.modes.vigenere} color="indigo" />
                       </div>
                     )}
                     {algorithm === AlgorithmType.AES && (
                       <div className="flex gap-4">
                         <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Mode</label>
                            <SegmentedControl options={Object.keys(AesMode)} value={encState.aesMode} onChange={(v) => setEncState(s => ({...s, aesMode: v as AesMode}))} labelMap={labels.modes.aes} color="indigo" />
                         </div>
                       </div>
                     )}
                  </div>
                )}
                
                {/* SHA-3 Length Selector */}
                {algorithm === AlgorithmType.SHA3 && (
                   <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Bit Length</label>
                      <SegmentedControl options={Object.values(Sha3Length)} value={encState.sha3Length} onChange={(v) => setEncState(s => ({...s, sha3Length: v as Sha3Length}))} labelMap={labels.modes.sha3} color="indigo" />
                   </div>
                )}

                {/* RSA KEYS */}
                {algorithm === AlgorithmType.RSA && (
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Public Key (Auto-Generated)</label>
                      <textarea readOnly value={encState.rsaPubPem || 'Generating...'} className="w-full h-16 bg-slate-200/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-[10px] font-mono text-slate-500"/>
                   </div>
                )}
               </div>

               {/* Input */}
               <div>
                  <div className="flex justify-between px-1 mb-1">
                    <label className="text-xs font-bold text-slate-500">{labels.cipherInput}</label>
                    <button onClick={() => setEncState(s => ({...s, input: ''}))}><Trash2 size={12} className="text-slate-400 hover:text-red-500"/></button>
                  </div>
                  <textarea value={encState.input} onChange={(e) => setEncState(s => ({ ...s, input: e.target.value }))} placeholder={labels.inputPlaceholder} className="w-full h-32 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-mono focus:ring-1 focus:ring-indigo-500/50 outline-none resize-none"/>
               </div>
               
               {/* Output */}
               <div>
                  <div className="flex justify-between px-1 mb-1">
                    <label className="text-xs font-bold text-slate-500">{labels.cipherOutput}</label>
                    <div className="flex gap-2">
                       {encState.output && !isHashing && <button onClick={transferToDecrypt} className="flex items-center gap-1 text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded transition-colors uppercase font-bold tracking-wider" title={labels.transfer}>{labels.transfer} <ArrowRight size={10}/></button>}
                       <button onClick={() => copyToClipboard(encState.output)}><Copy size={12} className="text-slate-400 hover:text-emerald-500"/></button>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea readOnly value={encState.output} placeholder={labels.outputPlaceholder} className="w-full h-32 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-sm font-mono text-indigo-600 dark:text-indigo-300 outline-none resize-none"/>
                    {!encState.output && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><Lock size={32}/></div>}
                  </div>
               </div>
            </div>
          </div>


          {/* ================= DECRYPTION PANEL ================= */}
          {!isHashing && (
            <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl dark:shadow-2xl ring-1 ring-rose-500/20 animate-in zoom-in-95 duration-500 delay-75 h-fit">
            <div className="h-14 border-b border-slate-200/50 dark:border-white/5 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                <span className="text-sm font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                  {labels.decrypt}
                </span>
              </div>
              <Unlock size={16} className="text-rose-400" />
            </div>

            <div className="p-5 flex flex-col gap-5">
               {/* Controls */}
               <div className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 space-y-4">
                {algorithm === AlgorithmType.CAESAR && (
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-semibold text-slate-500 uppercase">{labels.shift}</label>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <input type="range" min="1" max="25" value={decState.shift} onChange={(e) => setDecState(s => ({ ...s, shift: parseInt(e.target.value) }))} className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
                        <span className="w-6 text-center font-mono font-bold text-rose-600 dark:text-rose-400">{decState.shift}</span>
                      </div>
                    </div>
                ) }

                {(category === AlgorithmCategory.CLASSICAL || category === AlgorithmCategory.SYMMETRIC) && algorithm !== AlgorithmType.CAESAR && (
                    <div className="flex flex-col gap-3">
                       <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">{labels.key}</label>
                          <input type="text" value={decState.key} onChange={(e) => setDecState(s => ({ ...s, key: e.target.value }))} placeholder="KEY / PASSWORD" className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm outline-none focus:border-rose-500 transition-colors"/>
                       </div>
                       {algorithm === AlgorithmType.VIGENERE && (
                         <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Mode</label>
                            <SegmentedControl options={Object.keys(VigenereMode)} value={decState.vigenereMode} onChange={(v) => setDecState(s => ({...s, vigenereMode: v as VigenereMode}))} labelMap={labels.modes.vigenere} color="rose" />
                         </div>
                       )}
                       {algorithm === AlgorithmType.AES && (
                         <div className="flex gap-4">
                           <div className="flex flex-col gap-1 flex-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase">Mode</label>
                              <SegmentedControl options={Object.keys(AesMode)} value={decState.aesMode} onChange={(v) => setDecState(s => ({...s, aesMode: v as AesMode}))} labelMap={labels.modes.aes} color="rose" />
                           </div>
                         </div>
                       )}
                    </div>
                )}

                {algorithm === AlgorithmType.RSA && (
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Private Key (Internal)</label>
                      <div className="relative">
                        <textarea readOnly value={decState.rsaPrivPem || 'Generating...'} className="w-full h-16 bg-slate-200/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-[10px] font-mono text-slate-500 blur-[2px] hover:blur-none transition-all"/>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-rose-500 font-bold opacity-0 hover:opacity-0">HIDDEN</div>
                      </div>
                   </div>
                )}
               </div>

               {/* Input */}
               <div>
                  <div className="flex justify-between px-1 mb-1">
                    <label className="text-xs font-bold text-slate-500">{labels.decipherInput}</label>
                    <button onClick={() => setDecState(s => ({...s, input: ''}))}><Trash2 size={12} className="text-slate-400 hover:text-red-500"/></button>
                  </div>
                  <textarea value={decState.input} onChange={(e) => setDecState(s => ({ ...s, input: e.target.value }))} placeholder={labels.inputPlaceholder} className="w-full h-32 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-mono focus:ring-1 focus:ring-rose-500/50 outline-none resize-none"/>
               </div>
               
               {/* Output */}
               <div>
                  <div className="flex justify-between px-1 mb-1">
                    <label className="text-xs font-bold text-slate-500">{labels.decipherOutput}</label>
                    <button onClick={() => copyToClipboard(decState.output)}><Copy size={12} className="text-slate-400 hover:text-emerald-500"/></button>
                  </div>
                  <div className="relative">
                    <textarea readOnly value={decState.output} placeholder={labels.outputPlaceholder} className="w-full h-32 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-sm font-mono text-rose-600 dark:text-rose-300 outline-none resize-none"/>
                    {!decState.output && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><Unlock size={32}/></div>}
                  </div>
               </div>
            </div>
            </div>
          )}

        </div>

      </main>

      <Console logs={logs} lang={lang} />
    </div>
  );
};

export default App;