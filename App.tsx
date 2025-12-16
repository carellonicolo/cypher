import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Console from './components/Console';
import InfoModal from './components/InfoModal';
import Tooltip from './components/Tooltip';
import { 
  AlgorithmType, Language, Theme, LABELS, LogEntry, SectionState, 
  VigenereMode, AesMode, AlgorithmCategory, ALGO_CATEGORIES, Sha3Length, LegacyKeyMode, DhGroup, DhBitLength
} from './types';
import { 
  caesarCipher, vigenereCipher, aesEncrypt, aesDecrypt, 
  playfairCipher, substitutionCipher, computeHash,
  legacySimulationEncrypt, legacySimulationDecrypt,
  generateRSAKeys, rsaEncrypt, rsaDecrypt,
  dhGenerateParams, dhGeneratePrivateKey, dhCalculate
} from './utils/cryptoEngine';
import { 
  Lock, Unlock, Copy, Trash2, ArrowRight, ArrowLeft,
  ShieldCheck, Hash, Key, BookOpen, RefreshCw, Zap, HelpCircle, Sparkles
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
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  // Animation States for DH
  const [transferAnim, setTransferAnim] = useState<'toBob' | 'toAlice' | null>(null);
  const [highlightBobInput, setHighlightBobInput] = useState(false);
  const [highlightAliceInput, setHighlightAliceInput] = useState(false);
  const [highlightDhParams, setHighlightDhParams] = useState(false);

  // Independent States
  const [encState, setEncState] = useState<SectionState>({
    input: '', output: '', key: '', shift: 3, vigenereMode: VigenereMode.REPEATING, aesMode: AesMode.GCM, sha3Length: Sha3Length.L512, legacyKeyMode: LegacyKeyMode.DES56,
    dhGroup: DhGroup.TOY, dhBitLength: DhBitLength.NATIVE, dhP: '', dhG: '', dhOtherPub: ''
  });
  
  const [decState, setDecState] = useState<SectionState>({
    input: '', output: '', key: '', shift: 3, vigenereMode: VigenereMode.REPEATING, aesMode: AesMode.GCM, sha3Length: Sha3Length.L512, legacyKeyMode: LegacyKeyMode.DES56,
    dhGroup: DhGroup.TOY, dhBitLength: DhBitLength.NATIVE, dhP: '', dhG: '', dhOtherPub: ''
  });

  const category = ALGO_CATEGORIES[algorithm];
  const isHashing = category === AlgorithmCategory.HASHING;
  const isDiffieHellman = algorithm === AlgorithmType.DIFFIE_HELLMAN;

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

  // --- Diffie-Hellman Initial Params Effect ---
  useEffect(() => {
    if (algorithm === AlgorithmType.DIFFIE_HELLMAN && !encState.dhP) {
      const params = dhGenerateParams(encState.dhGroup);
      const privKeyA = dhGeneratePrivateKey(params.p, encState.dhGroup, encState.dhBitLength);
      const privKeyB = dhGeneratePrivateKey(params.p, encState.dhGroup, decState.dhBitLength);
      
      setEncState(s => ({ ...s, dhP: params.p, dhG: params.g, key: privKeyA }));
      setDecState(s => ({ ...s, dhP: params.p, dhG: params.g, key: privKeyB }));
      
      addLog(`Diffie-Hellman Parameters Generated (${encState.dhGroup})`, 'info');
    }
  }, [algorithm]); // Only run once on mount/algo change, handle group change separately

  // Handle DH Group Change
  const changeDhGroup = (group: DhGroup) => {
      const params = dhGenerateParams(group);
      const privKeyA = dhGeneratePrivateKey(params.p, group, encState.dhBitLength);
      const privKeyB = dhGeneratePrivateKey(params.p, group, decState.dhBitLength);
      
      setEncState(s => ({ ...s, dhGroup: group, dhP: params.p, dhG: params.g, key: privKeyA, output: '', dhOtherPub: '' }));
      setDecState(s => ({ ...s, dhGroup: group, dhP: params.p, dhG: params.g, key: privKeyB, output: '', dhOtherPub: '' }));
      
      addLog(`Switched to DH Group: ${group}`, 'info');
  };

  // --- Encryption/Alice/Process Effect ---
  useEffect(() => {
    const runEncrypt = async () => {
      // For DH, we don't need 'input' in the traditional sense, so we skip that check
      if (!isDiffieHellman && !encState.input) {
        setEncState(s => ({ ...s, output: '' }));
        return;
      }
      
      let result = '';
      if(!isDiffieHellman) addLog(`Processing ${algorithm}...`, 'process');

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
            result = legacySimulationEncrypt(encState.input, algorithm === AlgorithmType.DES ? 'DES' : '3DES', encState.legacyKeyMode);
            break;
          case AlgorithmType.RSA:
            if (encState.rsaKeyPair) {
              result = await rsaEncrypt(encState.input, encState.rsaKeyPair.publicKey);
            } else {
              result = "Generating Keys...";
            }
            break;
          case AlgorithmType.DIFFIE_HELLMAN:
            if(encState.dhP && encState.dhG && encState.key) {
               const dhRes = dhCalculate(encState.dhP, encState.dhG, encState.key, encState.dhOtherPub);
               result = dhRes.pub; // Just Public Key for now
               if (dhRes.shared) {
                 result += `\n\n--- SHARED SECRET ESTABLISHED ---\nSecret: ${dhRes.shared}`;
               }
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
        else if (!isDiffieHellman) addLog(`${isHashing ? 'Hashing' : 'Encryption'} successful.`, 'success');
      } catch (err) {
        addLog(`Error: ${err}`, 'error');
      }
    };
    const timeout = setTimeout(runEncrypt, 500);
    return () => clearTimeout(timeout);
  }, [encState.input, encState.key, encState.shift, encState.vigenereMode, encState.aesMode, encState.sha3Length, encState.legacyKeyMode, encState.dhP, encState.dhG, encState.dhOtherPub, algorithm, encState.rsaKeyPair]);

  // --- Decryption/Bob Effect ---
  useEffect(() => {
    if (isHashing) return; 

    const runDecrypt = async () => {
      // For DH, skip input check
      if (!isDiffieHellman && !decState.input) {
        setDecState(s => ({ ...s, output: '' }));
        return;
      }
      
      let result = '';
      if(!isDiffieHellman) addLog(`Decrypting with ${algorithm}...`, 'process');

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
            result = legacySimulationDecrypt(decState.input, algorithm === AlgorithmType.DES ? 'DES' : '3DES', decState.legacyKeyMode);
            break;
          case AlgorithmType.RSA:
            if (decState.rsaKeyPair) {
              result = await rsaDecrypt(decState.input, decState.rsaKeyPair.privateKey);
            }
            break;
          case AlgorithmType.DIFFIE_HELLMAN:
            if(decState.dhP && decState.dhG && decState.key) {
               const dhRes = dhCalculate(decState.dhP, decState.dhG, decState.key, decState.dhOtherPub);
               result = dhRes.pub;
               if (dhRes.shared) {
                 result += `\n\n--- SHARED SECRET ESTABLISHED ---\nSecret: ${dhRes.shared}`;
               }
            }
            break;
        }
        
        setDecState(s => ({ ...s, output: result }));
        if (result.startsWith('Error:')) addLog(result, 'error');
        else if (!isDiffieHellman) addLog(`Decryption successful.`, 'success');
      } catch (err) {
        addLog(`Decryption Error: ${err}`, 'error');
      }
    };
    const timeout = setTimeout(runDecrypt, 500);
    return () => clearTimeout(timeout);
  }, [decState.input, decState.key, decState.shift, decState.vigenereMode, decState.aesMode, decState.legacyKeyMode, decState.dhP, decState.dhG, decState.dhOtherPub, algorithm, decState.rsaKeyPair]);


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
      vigenereMode: encState.vigenereMode,
      legacyKeyMode: encState.legacyKeyMode
    }));
    addLog('Transferred ciphertext to decryption module', 'info');
  };

  // Helper for DH Param Sync
  const syncDhParams = () => {
    setDecState(s => ({ ...s, dhGroup: encState.dhGroup, dhP: encState.dhP, dhG: encState.dhG }));
    setHighlightDhParams(true);
    setTimeout(() => setHighlightDhParams(false), 500);
    addLog('Parameters synced from Alice to Bob', 'info');
  };

  const generateNewDhParams = () => {
    // If using TOY group, actually regenerate randoms. If fixed groups, just reload default (no change visible except key reset)
    const params = dhGenerateParams(encState.dhGroup);
    setEncState(s => ({ ...s, dhP: params.p, dhG: params.g }));
    addLog('DH Parameters Reset', 'success');
  };
  
  const generateNewDhKey = (party: 'alice' | 'bob') => {
    if (party === 'alice') {
        setEncState(s => ({ ...s, key: dhGeneratePrivateKey(s.dhP || '1000', s.dhGroup, s.dhBitLength) }));
    } else {
        setDecState(s => ({ ...s, key: dhGeneratePrivateKey(s.dhP || '1000', s.dhGroup, s.dhBitLength) }));
    }
    addLog(`New Private Key generated for ${party}`, 'info');
  }

  const sendPubToBob = () => {
    const pubKey = encState.output.split('\n')[0];
    if (!pubKey || pubKey.startsWith('Error')) return;
    
    setTransferAnim('toBob');
    setTimeout(() => {
        setDecState(s => ({...s, dhOtherPub: pubKey}));
        setTransferAnim(null);
        setHighlightBobInput(true);
        setTimeout(() => setHighlightBobInput(false), 500);
        addLog('Alice sent Public Key to Bob', 'info');
    }, 800);
  };

  const sendPubToAlice = () => {
    const pubKey = decState.output.split('\n')[0];
    if (!pubKey || pubKey.startsWith('Error')) return;
    
    setTransferAnim('toAlice');
    setTimeout(() => {
        setEncState(s => ({...s, dhOtherPub: pubKey}));
        setTransferAnim(null);
        setHighlightAliceInput(true);
        setTimeout(() => setHighlightAliceInput(false), 500);
        addLog('Bob sent Public Key to Alice', 'info');
    }, 800);
  };

  const getCategoryIcon = (cat: AlgorithmCategory) => {
    switch(cat) {
      case AlgorithmCategory.CLASSICAL: return <BookOpen size={14}/>;
      case AlgorithmCategory.SYMMETRIC: return <ShieldCheck size={14}/>;
      case AlgorithmCategory.ASYMMETRIC: return <Key size={14}/>;
      case AlgorithmCategory.HASHING: return <Hash size={14}/>;
    }
  };

  const getCategoryTooltip = (cat: AlgorithmCategory) => {
    switch(cat) {
      case AlgorithmCategory.CLASSICAL: return labels.tooltips.catClassical;
      case AlgorithmCategory.SYMMETRIC: return labels.tooltips.catSymmetric;
      case AlgorithmCategory.ASYMMETRIC: return labels.tooltips.catAsymmetric;
      case AlgorithmCategory.HASHING: return labels.tooltips.catHashing;
    }
  }

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1280;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-60 dark:opacity-40 pointer-events-none transition-opacity duration-300" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-100/0 via-slate-100/80 to-slate-200 dark:from-slate-900/0 dark:via-slate-900/50 dark:to-slate-950 pointer-events-none transition-colors duration-300" />
      
      {/* Dynamic Keyframes for DH Animation */}
      <style>{`
        @keyframes fly-right { 0% { left: 20%; opacity: 0; transform: scale(0.5); } 20% { opacity: 1; transform: scale(1.2); } 80% { opacity: 1; transform: scale(1.2); } 100% { left: 80%; opacity: 0; transform: scale(0.5); } }
        @keyframes fly-left { 0% { left: 80%; opacity: 0; transform: scale(0.5); } 20% { opacity: 1; transform: scale(1.2); } 80% { opacity: 1; transform: scale(1.2); } 100% { left: 20%; opacity: 0; transform: scale(0.5); } }
        @keyframes fly-down { 0% { top: 20%; opacity: 0; transform: scale(0.5); } 20% { opacity: 1; transform: scale(1.2); } 80% { opacity: 1; transform: scale(1.2); } 100% { top: 80%; opacity: 0; transform: scale(0.5); } }
        @keyframes fly-up { 0% { top: 80%; opacity: 0; transform: scale(0.5); } 20% { opacity: 1; transform: scale(1.2); } 80% { opacity: 1; transform: scale(1.2); } 100% { top: 20%; opacity: 0; transform: scale(0.5); } }
      `}</style>

      <Header 
        lang={lang} 
        setLang={setLang} 
        theme={theme} 
        setTheme={setTheme} 
      />
      
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
        algorithm={algorithm} 
        lang={lang}
      />

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
                    {/* UPDATED HEADER STYLE */}
                    <Tooltip content={getCategoryTooltip(cat)} position="right">
                      <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-widest mb-2 px-3 py-1.5 bg-indigo-50/80 dark:bg-indigo-500/20 rounded-lg border border-indigo-100 dark:border-indigo-500/30 flex items-center gap-2 shadow-sm w-full">
                        {getCategoryIcon(cat)} {labels.categories[cat]}
                      </h3>
                    </Tooltip>
                    <div className="space-y-1">
                      {algos.map((algo) => (
                        <button
                          key={algo}
                          onClick={() => {
                             setAlgorithm(algo as AlgorithmType);
                             if (algo === AlgorithmType.DES) {
                               setEncState(s => ({...s, legacyKeyMode: LegacyKeyMode.DES56}));
                               setDecState(s => ({...s, legacyKeyMode: LegacyKeyMode.DES56}));
                             } else if (algo === AlgorithmType.TRIPLE_DES) {
                               setEncState(s => ({...s, legacyKeyMode: LegacyKeyMode.TDES168}));
                               setDecState(s => ({...s, legacyKeyMode: LegacyKeyMode.TDES168}));
                             }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 truncate hover:scale-105 ${
                            algorithm === algo
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
        </aside>

        {/* Main Content Area - Flex Column */}
        <div className="flex-1 flex flex-col gap-6 w-full relative">
          
          {/* New Central Description Header */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 animate-in slide-in-from-top-4 fade-in duration-500 relative overflow-hidden">
             {/* Decorative Background Blur */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="flex items-start justify-between relative z-10">
               <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {labels.algorithms[algorithm]}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono border border-indigo-500/20 uppercase tracking-wide">
                       {labels.categories[ALGO_CATEGORIES[algorithm]]}
                    </span>
                  </h2>
               </div>
               
               <div className="flex items-center gap-3">
                  <Tooltip content={labels.tooltips.openGuide} position="left">
                    <button 
                      onClick={() => setIsInfoModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-wider border border-indigo-500/20"
                    >
                      <HelpCircle size={16} />
                      <span>{lang === 'it' ? 'Guida' : 'Guide'}</span>
                    </button>
                  </Tooltip>
                  <div className="hidden sm:block">
                    <Sparkles className="text-indigo-400 dark:text-indigo-500 opacity-50" size={24} />
                  </div>
               </div>
             </div>
             
             <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
               {labels.descriptions[algorithm]}
             </p>
          </div>

          {/* Grid for Panels */}
          <div className={`grid grid-cols-1 ${isHashing ? 'xl:grid-cols-1' : 'xl:grid-cols-2'} gap-6 w-full relative`}>
            
            {/* ANIMATION OVERLAY - Positioned relative to this grid now */}
            {transferAnim && (
              <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
                  <div 
                    className="absolute bg-white dark:bg-slate-800 p-3 rounded-full shadow-2xl border-2 border-indigo-500 text-indigo-500 z-50 flex items-center justify-center"
                    style={{
                      // Simple positioning relative to container center
                      // Desktop: move horizontally. Mobile: move vertically.
                      top: isDesktop ? '30%' : '50%', 
                      left: isDesktop ? '50%' : '50%',
                      animation: `${
                          transferAnim === 'toBob' 
                            ? (isDesktop ? 'fly-right' : 'fly-down')
                            : (isDesktop ? 'fly-left' : 'fly-up')
                      } 0.8s ease-in-out forwards`
                    }}
                  >
                    <Key size={24} />
                  </div>
              </div>
            )}
            
            {/* ================= ENCRYPTION / ALICE PANEL ================= */}
            <div className={`glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl dark:shadow-2xl ring-1 ring-indigo-500/20 animate-in zoom-in-95 duration-500 h-fit ${isHashing ? 'max-w-3xl mx-auto w-full' : ''}`}>
              <div className="h-14 border-b border-slate-200/50 dark:border-white/5 bg-indigo-50/50 dark:bg-indigo-950/20 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                  <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                    {isHashing ? 'Input & Hash' : isDiffieHellman ? 'Party A (Alice)' : labels.encrypt}
                  </span>
                </div>
                <Lock size={16} className="text-indigo-400" />
              </div>

              <div className="p-5 flex flex-col gap-5">
                {/* Controls */}
                <div className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 space-y-4">
                  
                  {/* DH CONTROLS */}
                  {isDiffieHellman && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Parameters Group</label>
                            <SegmentedControl 
                              options={Object.keys(DhGroup)} 
                              value={encState.dhGroup} 
                              onChange={(v) => changeDhGroup(v as DhGroup)} 
                              labelMap={labels.modes.dh} 
                              color="indigo" 
                            />
                        </div>

                        <div className="flex items-end gap-3">
                            <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Prime (p)</label>
                              <input type="text" readOnly={encState.dhGroup !== DhGroup.TOY} value={encState.dhP} onChange={(e) => setEncState(s => ({...s, dhP: e.target.value}))} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono text-indigo-600 dark:text-indigo-400 truncate focus:truncate-none" title={encState.dhP}/>
                            </div>
                            <div className="w-20 space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Gen (g)</label>
                              <input type="text" readOnly={encState.dhGroup !== DhGroup.TOY} value={encState.dhG} onChange={(e) => setEncState(s => ({...s, dhG: e.target.value}))} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono text-indigo-600 dark:text-indigo-400"/>
                            </div>
                            {encState.dhGroup === DhGroup.TOY && (
                              <Tooltip content={labels.tooltips.newParams}>
                                <button onClick={generateNewDhParams} className="h-[34px] px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors" title="Generate New Params"><RefreshCw size={14}/></button>
                              </Tooltip>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Private Key (a)</label>
                              <Tooltip content={labels.tooltips.randomize}>
                                <button onClick={() => generateNewDhKey('alice')} className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1"><Zap size={10}/> Randomize</button>
                              </Tooltip>
                            </div>
                            <input type="text" value={encState.key} onChange={(e) => setEncState(s => ({...s, key: e.target.value}))} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono truncate focus:truncate-none"/>
                        </div>

                        {/* New: Key Bit Length Selector */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Key Bit Length (Demo)</label>
                            <SegmentedControl 
                              options={Object.values(DhBitLength)} 
                              value={encState.dhBitLength} 
                              onChange={(v) => {
                                  const newLen = v as DhBitLength;
                                  setEncState(s => ({
                                      ...s, 
                                      dhBitLength: newLen,
                                      key: dhGeneratePrivateKey(s.dhP || '', s.dhGroup, newLen)
                                  }));
                              }} 
                              labelMap={labels.modes.dhBitLength} 
                              color="indigo" 
                            />
                        </div>
                      </div>
                  )}

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
                      {algorithm === AlgorithmType.DES && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Key Length</label>
                            <SegmentedControl options={[LegacyKeyMode.DES56]} value={encState.legacyKeyMode} onChange={(v) => setEncState(s => ({...s, legacyKeyMode: v as LegacyKeyMode}))} labelMap={labels.modes.legacy} color="indigo" />
                        </div>
                      )}
                      {algorithm === AlgorithmType.TRIPLE_DES && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Key Length</label>
                            <SegmentedControl options={[LegacyKeyMode.TDES112, LegacyKeyMode.TDES168]} value={encState.legacyKeyMode} onChange={(v) => setEncState(s => ({...s, legacyKeyMode: v as LegacyKeyMode}))} labelMap={labels.modes.legacy} color="indigo" />
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

                {/* Input - Hidden for DH */}
                {!isDiffieHellman && (
                  <div>
                      <div className="flex justify-between px-1 mb-1">
                        <label className="text-xs font-bold text-slate-500">{labels.cipherInput}</label>
                        <Tooltip content={labels.tooltips.clearInput}>
                          <button onClick={() => setEncState(s => ({...s, input: ''}))}><Trash2 size={12} className="text-slate-400 hover:text-red-500"/></button>
                        </Tooltip>
                      </div>
                      <textarea value={encState.input} onChange={(e) => setEncState(s => ({ ...s, input: e.target.value }))} placeholder={labels.inputPlaceholder} className="w-full h-32 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-mono focus:ring-1 focus:ring-indigo-500/50 outline-none resize-none"/>
                  </div>
                )}
                
                {/* Output (Public Key for DH) */}
                <div>
                    <div className="flex justify-between px-1 mb-1">
                      <label className="text-xs font-bold text-slate-500">{isDiffieHellman ? 'Public Key (A) & Secret' : labels.cipherOutput}</label>
                      <div className="flex gap-2">
                        {encState.output && !isHashing && !isDiffieHellman && (
                          <Tooltip content={labels.tooltips.transfer}>
                            <button onClick={transferToDecrypt} className="flex items-center gap-1 text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded transition-colors uppercase font-bold tracking-wider" title={labels.transfer}>{labels.transfer} <ArrowRight size={10}/></button>
                          </Tooltip>
                        )}
                        
                        {/* New: Send to Bob */}
                        {isDiffieHellman && encState.output && (
                            <Tooltip content={labels.tooltips.sendKey}>
                              <button onClick={sendPubToBob} disabled={!!transferAnim} className="flex items-center gap-1 text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 disabled:opacity-50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded transition-colors uppercase font-bold tracking-wider" title="Send Public Key to Bob">
                                  Send to Bob <ArrowRight size={10}/>
                              </button>
                            </Tooltip>
                        )}

                        <Tooltip content={labels.tooltips.copyOutput}>
                          <button onClick={() => copyToClipboard(encState.output)}><Copy size={12} className="text-slate-400 hover:text-emerald-500"/></button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea readOnly value={encState.output} placeholder={labels.outputPlaceholder} className="w-full h-32 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-sm font-mono text-indigo-600 dark:text-indigo-300 outline-none resize-none"/>
                      {!encState.output && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><Lock size={32}/></div>}
                    </div>
                </div>

                {/* DH Exchange Slot */}
                {isDiffieHellman && (
                  <div className={`p-3 rounded-lg border transition-all duration-300 ${highlightAliceInput ? 'ring-2 ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] bg-rose-50 dark:bg-rose-900/20' : 'bg-indigo-500/5 border-indigo-500/10'}`}>
                      <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1 block">Receive Bob's Public Key (B)</label>
                      <div className="flex gap-2">
                        <input type="number" placeholder="Enter B" value={encState.dhOtherPub} onChange={(e) => setEncState(s => ({...s, dhOtherPub: e.target.value}))} className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono"/>
                        <Tooltip content={labels.tooltips.getKey}>
                          <button onClick={() => setEncState(s => ({...s, dhOtherPub: decState.output.split('\n')[0]}))} className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors" title="Get from Bob"><ArrowLeft size={16}/></button>
                        </Tooltip>
                      </div>
                  </div>
                )}
              </div>
            </div>


            {/* ================= DECRYPTION / BOB PANEL ================= */}
            {!isHashing && (
              <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl dark:shadow-2xl ring-1 ring-rose-500/20 animate-in zoom-in-95 duration-500 delay-75 h-fit">
              <div className="h-14 border-b border-slate-200/50 dark:border-white/5 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                  <span className="text-sm font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                    {isDiffieHellman ? 'Party B (Bob)' : labels.decrypt}
                  </span>
                </div>
                <Unlock size={16} className="text-rose-400" />
              </div>

              <div className="p-5 flex flex-col gap-5">
                {/* Controls */}
                <div className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 space-y-4">
                  
                  {/* DH CONTROLS */}
                  {isDiffieHellman && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Parameters Group (View Only)</label>
                            <SegmentedControl 
                              options={Object.keys(DhGroup)} 
                              value={decState.dhGroup} 
                              onChange={(v) => {/* Bob follows Alice's group in this simulation */}} 
                              labelMap={labels.modes.dh} 
                              color="rose" 
                            />
                        </div>

                        <div className="flex items-end gap-3">
                            <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Prime (p)</label>
                              <input type="text" readOnly value={decState.dhP} onChange={(e) => setDecState(s => ({...s, dhP: e.target.value}))} className={`w-full rounded-md px-3 py-1.5 text-sm font-mono text-rose-600 dark:text-rose-400 truncate focus:truncate-none transition-all duration-500 ${highlightDhParams ? 'bg-rose-100 dark:bg-rose-900/30 border-rose-500 ring-2 ring-rose-500/50' : 'bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700'}`} title={decState.dhP}/>
                            </div>
                            <div className="w-20 space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Gen (g)</label>
                              <input type="text" readOnly value={decState.dhG} onChange={(e) => setDecState(s => ({...s, dhG: e.target.value}))} className={`w-full rounded-md px-3 py-1.5 text-sm font-mono text-rose-600 dark:text-rose-400 transition-all duration-500 ${highlightDhParams ? 'bg-rose-100 dark:bg-rose-900/30 border-rose-500 ring-2 ring-rose-500/50' : 'bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700'}`}/>
                            </div>
                            <Tooltip content="Sync parameters from Alice">
                              <button onClick={syncDhParams} className="h-[34px] px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors flex items-center gap-2 text-[10px] font-bold uppercase" title="Sync Params from Alice"><ArrowLeft size={14}/> Sync</button>
                            </Tooltip>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Private Key (b)</label>
                              <Tooltip content={labels.tooltips.randomize}>
                                <button onClick={() => generateNewDhKey('bob')} className="text-[10px] text-rose-500 hover:underline flex items-center gap-1"><Zap size={10}/> Randomize</button>
                              </Tooltip>
                            </div>
                            <input type="text" value={decState.key} onChange={(e) => setDecState(s => ({...s, key: e.target.value}))} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono truncate focus:truncate-none"/>
                        </div>

                          {/* New: Key Bit Length Selector */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Key Bit Length (Demo)</label>
                            <SegmentedControl 
                              options={Object.values(DhBitLength)} 
                              value={decState.dhBitLength} 
                              onChange={(v) => {
                                  const newLen = v as DhBitLength;
                                  setDecState(s => ({
                                      ...s, 
                                      dhBitLength: newLen,
                                      key: dhGeneratePrivateKey(s.dhP || '', s.dhGroup, newLen)
                                  }));
                              }} 
                              labelMap={labels.modes.dhBitLength} 
                              color="rose" 
                            />
                        </div>
                      </div>
                  )}
                  
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
                        {algorithm === AlgorithmType.DES && (
                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase">Key Length</label>
                              <SegmentedControl options={[LegacyKeyMode.DES56]} value={decState.legacyKeyMode} onChange={(v) => setDecState(s => ({...s, legacyKeyMode: v as LegacyKeyMode}))} labelMap={labels.modes.legacy} color="rose" />
                          </div>
                        )}
                        {algorithm === AlgorithmType.TRIPLE_DES && (
                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase">Key Length</label>
                              <SegmentedControl options={[LegacyKeyMode.TDES112, LegacyKeyMode.TDES168]} value={decState.legacyKeyMode} onChange={(v) => setDecState(s => ({...s, legacyKeyMode: v as LegacyKeyMode}))} labelMap={labels.modes.legacy} color="rose" />
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

                {/* Input - Hidden for DH */}
                {!isDiffieHellman && (
                  <div>
                      <div className="flex justify-between px-1 mb-1">
                        <label className="text-xs font-bold text-slate-500">{labels.decipherInput}</label>
                        <Tooltip content={labels.tooltips.clearInput}>
                          <button onClick={() => setDecState(s => ({...s, input: ''}))}><Trash2 size={12} className="text-slate-400 hover:text-red-500"/></button>
                        </Tooltip>
                      </div>
                      <textarea value={decState.input} onChange={(e) => setDecState(s => ({ ...s, input: e.target.value }))} placeholder={labels.inputPlaceholder} className="w-full h-32 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-mono focus:ring-1 focus:ring-rose-500/50 outline-none resize-none"/>
                  </div>
                )}

                {/* Output */}
                <div>
                    <div className="flex justify-between px-1 mb-1">
                      <label className="text-xs font-bold text-slate-500">{isDiffieHellman ? 'Public Key (B) & Secret' : labels.decipherOutput}</label>
                      <div className="flex gap-2">
                        {/* New: Send to Alice */}
                        {isDiffieHellman && decState.output && (
                            <Tooltip content={labels.tooltips.sendKey}>
                              <button onClick={sendPubToAlice} disabled={!!transferAnim} className="flex items-center gap-1 text-[10px] bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-50 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded transition-colors uppercase font-bold tracking-wider" title="Send Public Key to Alice">
                                  <ArrowLeft size={10}/> Send to Alice
                              </button>
                            </Tooltip>
                        )}
                        <Tooltip content={labels.tooltips.copyOutput}>
                          <button onClick={() => copyToClipboard(decState.output)}><Copy size={12} className="text-slate-400 hover:text-emerald-500"/></button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea readOnly value={decState.output} placeholder={labels.outputPlaceholder} className="w-full h-32 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-sm font-mono text-rose-600 dark:text-rose-300 outline-none resize-none"/>
                      {!decState.output && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><Unlock size={32}/></div>}
                    </div>
                </div>

                {/* DH Exchange Slot for Bob */}
                {isDiffieHellman && (
                  <div className={`p-3 rounded-lg border transition-all duration-300 ${highlightBobInput ? 'ring-2 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] bg-indigo-50 dark:bg-indigo-900/20' : 'bg-rose-500/5 border-rose-500/10'}`}>
                      <label className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1 block">Receive Alice's Public Key (A)</label>
                      <div className="flex gap-2">
                        <input type="number" placeholder="Enter A" value={decState.dhOtherPub} onChange={(e) => setDecState(s => ({...s, dhOtherPub: e.target.value}))} className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono"/>
                        <Tooltip content={labels.tooltips.getKey}>
                          <button onClick={() => setDecState(s => ({...s, dhOtherPub: encState.output.split('\n')[0]}))} className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors" title="Get from Alice"><ArrowRight size={16}/></button>
                        </Tooltip>
                      </div>
                  </div>
                )}
              </div>
            </div>
            )}

          </div>
        </div>
      </main>

      <Console logs={logs} lang={lang} />
    </div>
  );
};

export default App;