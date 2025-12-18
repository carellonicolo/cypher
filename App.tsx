import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Copy, Trash2, 
  Shield, Key, Play, HelpCircle, Send, Zap, ChevronRight
} from 'lucide-react';

import Header from './components/Header';
import Console from './components/Console';
import InfoModal from './components/InfoModal';

import { 
  AlgorithmType, AlgorithmCategory, ALGO_CATEGORIES, CATEGORY_ORDER,
  SectionState, LogEntry, Language, Theme, ThemeProfile,
  VigenereMode, AesMode, LegacyKeyMode, DhGroup, DhBitLength, 
  Sha3Length, CmacKeyLength, EccCurve, RsaModulusLength, LABELS, AesKeyLength 
} from './types';

import { 
  caesarCipher, vigenereCipher, playfairCipher, substitutionCipher,
  rc4Cipher, rc4Decrypt, chachaEncrypt, chachaDecrypt, aesEncrypt, aesDecrypt, 
  legacySimulationEncrypt, legacySimulationDecrypt,
  rsaEncrypt, rsaDecrypt, generateRSAKeys,
  dhGenerateParams, dhGeneratePrivateKey, dhCalculate, generateECCKeys, eccCalculate,
  computeHash, getPlayfairMatrix, getSubstitutionAlphabet
} from './utils/cryptoEngine';

import { applyTheme } from './utils/themeEngine';

const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_SECTION_STATE: SectionState = {
  input: '',
  output: '',
  key: '',
  shift: 3,
  vigenereMode: VigenereMode.REPEATING,
  aesMode: AesMode.GCM,
  aesKeyLength: AesKeyLength.L256,
  legacyKeyMode: LegacyKeyMode.DES56,
  sha3Length: Sha3Length.L512,
  cmacKeyLength: CmacKeyLength.L128,
  eccCurve: EccCurve.P256,
  rsaModulusLength: RsaModulusLength.L2048,
  dhGroup: DhGroup.TOY,
  dhBitLength: DhBitLength.NATIVE,
};

const SegmentedControl = ({ 
  options, value, onChange, labelMap 
}: { 
  options: string[], value: string, onChange: (val: string) => void, labelMap: Record<string, string> 
}) => (
  <div className="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-2xl w-full border border-black/5 dark:border-white/5">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 ${
          value === opt 
            ? 'bg-white dark:bg-white/10 shadow-lg text-blue-600 dark:text-white scale-[1.02]' 
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        {labelMap[opt] || opt}
      </button>
    ))}
  </div>
);

const KeyStrengthMeter = ({ value, algorithm }: { value: string, algorithm: AlgorithmType }) => {
  if (!value && algorithm !== AlgorithmType.CAESAR) return null;
  let score = 0;
  if (algorithm === AlgorithmType.CAESAR) score = 1; 
  else {
      if (value.length > 5) score++;
      if (value.length > 10) score++;
      if (value.length > 15 && /[0-9!@#$%]/.test(value)) score++;
      if (value.length > 32) score = 4;
  }
  
  const colors = ['bg-rose-400', 'bg-amber-400', 'bg-lime-400', 'bg-blue-400'];
  return (
    <div className="flex gap-1.5 h-1 mt-3 px-1">
       {[1,2,3,4].map(i => (
           <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${i <= score ? colors[score-1] : 'bg-slate-200 dark:bg-white/5'}`} />
       ))}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('it');
  const [theme, setTheme] = useState<Theme>('dark');
  const [themeProfile, setThemeProfile] = useState<ThemeProfile>(ThemeProfile.DEFAULT);
  const [scale, setScale] = useState(100);

  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.CAESAR);
  const [category, setCategory] = useState<AlgorithmCategory>(AlgorithmCategory.CLASSICAL);

  const [encState, setEncState] = useState<SectionState>({ ...INITIAL_SECTION_STATE });
  const [decState, setDecState] = useState<SectionState>({ ...INITIAL_SECTION_STATE });

  const [highlightDhParams, setHighlightDhParams] = useState(false);
  const [highlightAliceInput, setHighlightAliceInput] = useState(false);
  const [highlightBobInput, setHighlightBobInput] = useState(false);
  const [transferAnim, setTransferAnim] = useState<'toAlice' | 'toBob' | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<{algo?: AlgorithmType, cat?: AlgorithmCategory}>({});

  useEffect(() => {
    applyTheme(themeProfile);
  }, [themeProfile]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (scale / 100)}px`;
  }, [scale]);

  useEffect(() => {
    setCategory(ALGO_CATEGORIES[algorithm]);
    setEncState(prev => ({ ...INITIAL_SECTION_STATE, dhP: prev.dhP, dhG: prev.dhG }));
    setDecState(prev => ({ ...INITIAL_SECTION_STATE, dhP: prev.dhP, dhG: prev.dhG }));
  }, [algorithm]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'process') => {
    setLogs(prev => [...prev, { id: generateId(), timestamp: new Date(), type, message }]);
  };

  const copyToClipboard = (text: string) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    addLog(LABELS[lang].tooltips.copyOutput, 'info');
  };

  const generateRandomKey = (target: 'ENC' | 'DEC') => {
      let bits = 256;
      if (algorithm === AlgorithmType.CMAC) {
          const state = target === 'ENC' ? encState : decState;
          bits = parseInt(state.cmacKeyLength);
      }
      const bytes = bits / 8;
      const array = new Uint8Array(bytes);
      window.crypto.getRandomValues(array);
      const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
      if (target === 'ENC') setEncState(s => ({...s, key: hex}));
      else setDecState(s => ({...s, key: hex}));
      addLog(`Generated ${bits}-bit Random Key`, 'success');
  };

  const handleRun = async (mode: 'ENCRYPT' | 'DECRYPT') => {
     const state = mode === 'ENCRYPT' ? encState : decState;
     const setState = mode === 'ENCRYPT' ? setEncState : setDecState;
     const input = state.input;
     const key = state.key;
     let output = '';
     let logMsg = '';

     try {
       switch(algorithm) {
         case AlgorithmType.CAESAR:
            output = caesarCipher(input, state.shift, mode === 'DECRYPT');
            break;
         case AlgorithmType.VIGENERE:
            output = vigenereCipher(input, key, mode === 'DECRYPT', state.vigenereMode);
            break;
         case AlgorithmType.PLAYFAIR:
            output = playfairCipher(input, key, mode === 'DECRYPT');
            break;
         case AlgorithmType.MONOALPHABETIC:
            output = substitutionCipher(input, key, mode === 'DECRYPT');
            break;
         case AlgorithmType.AES:
            if (mode === 'ENCRYPT') output = await aesEncrypt(input, key, state.aesMode, state.aesKeyLength);
            else output = await aesDecrypt(input, key, state.aesMode, state.aesKeyLength);
            break;
         case AlgorithmType.RC4:
             if (mode === 'ENCRYPT') output = rc4Cipher(input, key);
             else output = rc4Decrypt(input, key);
             break;
         case AlgorithmType.CHACHA20:
             if (mode === 'ENCRYPT') output = await chachaEncrypt(input, key);
             else output = await chachaDecrypt(input, key);
             break;
         case AlgorithmType.DES:
         case AlgorithmType.TRIPLE_DES:
             const legType = algorithm === AlgorithmType.DES ? 'DES' : '3DES';
             if (mode === 'ENCRYPT') output = legacySimulationEncrypt(input, legType, state.legacyKeyMode, state.aesMode);
             else output = legacySimulationDecrypt(input, legType, state.legacyKeyMode, state.aesMode);
             break;
         case AlgorithmType.MD5:
         case AlgorithmType.SHA1:
         case AlgorithmType.SHA256:
         case AlgorithmType.SHA512:
         case AlgorithmType.SHA3:
         case AlgorithmType.BLAKE2:
         case AlgorithmType.BLAKE3:
         case AlgorithmType.HMAC:
         case AlgorithmType.CMAC:
             if (mode === 'DECRYPT') {
               addLog("Hashing is irreversible", 'error');
               return;
             }
             output = await computeHash(input, algorithm, 
               algorithm === AlgorithmType.SHA3 ? state.sha3Length : 
               algorithm === AlgorithmType.CMAC ? state.cmacKeyLength : undefined, 
               key
             );
             break;
          case AlgorithmType.RSA:
            if (mode === 'ENCRYPT') {
                const keyToUse = state.rsaPubPem || key;
                if (!keyToUse) throw new Error("Public Key Required");
                output = await rsaEncrypt(input, keyToUse);
            } else {
                const keyToUse = state.rsaPrivPem || key;
                if (!keyToUse) throw new Error("Private Key Required");
                output = await rsaDecrypt(input, keyToUse);
            }
            break;
          case AlgorithmType.ECC:
          case AlgorithmType.DIFFIE_HELLMAN:
             if (algorithm === AlgorithmType.DIFFIE_HELLMAN) {
                 const res = dhCalculate(state.dhP || "", state.dhG || "", state.key, state.dhOtherPub);
                 output = res.shared || res.pub; 
                 logMsg = res.shared ? "Shared Secret Calculated" : "Public Key Calculated";
             }
             if (algorithm === AlgorithmType.ECC) {
                 if (state.key && state.dhOtherPub) { 
                     if (state.rsaKeyPair && state.rsaKeyPair.privateKey) {
                         const res = await eccCalculate(state.rsaKeyPair.privateKey, state.dhOtherPub, state.eccCurve);
                         output = res.shared;
                     }
                 }
             }
             break;
       }
       setState(s => ({ ...s, output }));
       addLog(logMsg || `${mode === 'ENCRYPT' ? 'Encryption' : 'Decryption'} completed`, 'success');
     } catch (e) {
       addLog(`Error: ${e}`, 'error');
     }
  };

  const handleDhNewParams = () => {
    const params = dhGenerateParams(encState.dhGroup);
    setEncState(s => ({ ...s, dhP: params.p, dhG: params.g }));
    setDecState(s => ({ ...s, dhP: params.p, dhG: params.g }));
    setHighlightDhParams(true);
    setTimeout(() => setHighlightDhParams(false), 800);
    addLog(`New DH Group Parameters (p, g) Generated`, 'process');
  };

  const handleGenerateRSA = async () => {
      const bits = parseInt(encState.rsaModulusLength);
      addLog(`Generating RSA-${bits} Keypair...`, 'process');
      const { kp, pubPem, privPem } = await generateRSAKeys(bits);
      setEncState(s => ({ ...s, rsaKeyPair: kp, rsaPubPem: pubPem }));
      setDecState(s => ({ ...s, rsaKeyPair: kp, rsaPrivPem: privPem }));
      addLog(`RSA Keys Generated`, 'success');
  }

  useEffect(() => {
      if (algorithm === AlgorithmType.DIFFIE_HELLMAN && !encState.dhP) {
          const timer = setTimeout(() => handleDhNewParams(), 50);
          return () => clearTimeout(timer);
      }
      if (algorithm === AlgorithmType.DES) {
          setEncState(s => ({...s, legacyKeyMode: LegacyKeyMode.DES56, aesMode: AesMode.CBC }));
          setDecState(s => ({...s, legacyKeyMode: LegacyKeyMode.DES56, aesMode: AesMode.CBC }));
      }
      if (algorithm === AlgorithmType.TRIPLE_DES) {
          setEncState(s => ({...s, legacyKeyMode: LegacyKeyMode.TDES168, aesMode: AesMode.CBC }));
          setDecState(s => ({...s, legacyKeyMode: LegacyKeyMode.TDES168, aesMode: AesMode.CBC }));
      }
  }, [algorithm]);

  const handleDhGenKey = (side: 'A' | 'B') => {
      if (algorithm === AlgorithmType.ECC) {
          const runEccGen = async () => {
              const { kp, pubHex, privHex } = await generateECCKeys(encState.eccCurve);
              if (side === 'A') {
                  setEncState(s => ({ ...s, key: privHex, rsaPubPem: pubHex, rsaKeyPair: kp })); 
              } else {
                  setDecState(s => ({ ...s, key: privHex, rsaPubPem: pubHex, rsaKeyPair: kp }));
              }
              addLog(`${side === 'A' ? 'Alice' : 'Bob'} generated ECC Pair`, 'info');
          }
          runEccGen();
          return;
      }
      const p = encState.dhP || "";
      const priv = dhGeneratePrivateKey(p, encState.dhGroup, encState.dhBitLength);
      const calc = dhCalculate(p, encState.dhG || "", priv);
      if (side === 'A') setEncState(s => ({ ...s, key: priv, input: calc.pub }));
      else setDecState(s => ({ ...s, key: priv, input: calc.pub }));
      addLog(`${side === 'A' ? 'Alice' : 'Bob'} generated Keys`, 'info');
  };

  const handleDhExchange = (from: 'A' | 'B') => {
      const isECC = algorithm === AlgorithmType.ECC;
      const valToSend = from === 'A' 
          ? (isECC ? encState.rsaPubPem : encState.input)
          : (isECC ? decState.rsaPubPem : decState.input);
      if (!valToSend) {
          addLog(`Key missing from ${from === 'A' ? 'Alice' : 'Bob'}`, 'error');
          return;
      }
      if (from === 'A') {
          setTransferAnim('toBob');
          setTimeout(() => {
              setDecState(s => ({ ...s, dhOtherPub: valToSend }));
              setHighlightBobInput(true);
              setTransferAnim(null);
              addLog(`Bob received Alice's Key`, 'success');
              setTimeout(() => setHighlightBobInput(false), 1000);
          }, 800);
      } else {
          setTransferAnim('toAlice');
          setTimeout(() => {
              setEncState(s => ({ ...s, dhOtherPub: valToSend }));
              setHighlightAliceInput(true);
              setTransferAnim(null);
              addLog(`Alice received Bob's Key`, 'success');
              setTimeout(() => setHighlightAliceInput(false), 1000);
          }, 800);
      }
  };

  const renderVisualizations = (state: SectionState) => {
      if (algorithm === AlgorithmType.PLAYFAIR && state.key) {
          const matrix = getPlayfairMatrix(state.key);
          return (
              <div className="mt-4 bg-slate-100/50 dark:bg-white/5 p-4 rounded-apple border border-slate-200/30 dark:border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-3 tracking-widest">Visual Matrix 5x5</span>
                  <div className="grid grid-cols-5 gap-2">
                      {matrix.map((char, i) => (
                          <div key={i} className="aspect-square flex items-center justify-center bg-white dark:bg-white/10 rounded-xl text-sm font-mono font-bold text-slate-700 dark:text-white shadow-sm border border-slate-100 dark:border-white/5 transition-transform hover:scale-110">
                              {char}
                          </div>
                      ))}
                  </div>
              </div>
          )
      }
      if (algorithm === AlgorithmType.MONOALPHABETIC && state.key) {
          const map = getSubstitutionAlphabet(state.key);
          const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
          return (
              <div className="mt-4 bg-slate-100/50 dark:bg-white/5 p-4 rounded-apple overflow-x-auto custom-scrollbar border border-slate-200/30 dark:border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-3 tracking-widest">Substitution Map</span>
                  <div className="flex gap-1.5 pb-2">
                      {alphabet.map((char, i) => (
                          <div key={i} className="flex flex-col items-center">
                              <div className="w-7 h-7 flex items-center justify-center bg-slate-200/50 dark:bg-white/10 rounded-t-lg text-[10px] font-mono text-slate-500">{char}</div>
                              <div className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-b-lg text-[10px] font-bold font-mono shadow-md">{map[char]}</div>
                          </div>
                      ))}
                  </div>
              </div>
          )
      }
      return null;
  }

  const renderKeySection = (mode: 'ENC' | 'DEC') => {
      const state = mode === 'ENC' ? encState : decState;
      const setState = mode === 'ENC' ? setEncState : setDecState;
      const isHash = category === AlgorithmCategory.HASHING;
      const isMac = category === AlgorithmCategory.MAC;
      if (isHash && !isMac) return null; 
      if (algorithm === AlgorithmType.DIFFIE_HELLMAN || algorithm === AlgorithmType.ECC) return null;

      return (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{LABELS[lang].key}</label>
                {(algorithm === AlgorithmType.HMAC || algorithm === AlgorithmType.CMAC) && (
                    <button 
                       onClick={() => generateRandomKey(mode)}
                       className="text-[9px] font-black flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition-all active:scale-95 tracking-widest"
                    >
                       <Zap size={10} fill="currentColor" /> RANDOM
                    </button>
                )}
             </div>

             {algorithm === AlgorithmType.CAESAR ? (
                 <div className="flex items-center gap-6 bg-slate-100/40 dark:bg-white/5 p-4 rounded-apple border border-slate-200/30 dark:border-white/5">
                    <input 
                       type="range" min="1" max="25" 
                       value={state.shift}
                       onChange={(e) => setState(s => ({...s, shift: parseInt(e.target.value)}))}
                       className={`flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500`}
                    />
                    <span className={`w-8 text-base font-mono font-black text-blue-500 text-center`}>{state.shift}</span>
                 </div>
             ) : algorithm === AlgorithmType.RSA ? (
                 mode === 'ENC' ? (
                     <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            <SegmentedControl 
                                options={[RsaModulusLength.L2048, RsaModulusLength.L4096]}
                                value={encState.rsaModulusLength}
                                onChange={(v) => { setEncState(s => ({...s, rsaModulusLength: v as RsaModulusLength})); setDecState(s => ({...s, rsaModulusLength: v as RsaModulusLength})); }}
                                labelMap={LABELS[lang].modes.rsa}
                            />
                            <button onClick={handleGenerateRSA} className="bg-blue-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30 btn-apple"><RefreshCw size={12}/> Generate</button>
                        </div>
                        <textarea 
                           value={state.rsaPubPem || ''}
                           onChange={(e) => setState(s => ({...s, rsaPubPem: e.target.value}))}
                           placeholder="Public Key (PEM)"
                           className="bg-slate-100/40 dark:bg-black/30 rounded-2xl p-5 text-[11px] font-mono h-28 resize-none border border-slate-200/30 dark:border-white/5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        />
                     </div>
                 ) : (
                     <textarea 
                        value={state.rsaPrivPem || ''}
                        onChange={(e) => setState(s => ({...s, rsaPrivPem: e.target.value}))}
                        placeholder="Private Key (PEM)"
                        className="bg-slate-100/40 dark:bg-black/30 rounded-2xl p-5 text-[11px] font-mono h-28 resize-none border border-slate-200/30 dark:border-white/5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                     />
                 )
             ) : (
                 <input 
                    type="text" 
                    value={state.key}
                    onChange={(e) => setState(s => ({...s, key: e.target.value}))}
                    placeholder={LABELS[lang].key}
                    className={`bg-slate-100/40 dark:bg-black/30 rounded-apple p-4 border border-slate-200/30 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono text-sm tracking-tight transition-all`}
                 />
             )}

             <div className="grid grid-cols-1 gap-3">
                 {algorithm === AlgorithmType.VIGENERE && (
                     <SegmentedControl options={[VigenereMode.REPEATING, VigenereMode.AUTOKEY]} value={state.vigenereMode} onChange={v => setState(s => ({...s, vigenereMode: v as VigenereMode}))} labelMap={LABELS[lang].modes.vigenere} />
                 )}
                 {algorithm === AlgorithmType.AES && (
                     <>
                        <SegmentedControl options={[AesMode.GCM, AesMode.CBC, AesMode.CTR]} value={state.aesMode} onChange={v => setState(s => ({...s, aesMode: v as AesMode}))} labelMap={LABELS[lang].modes.aes} />
                        <SegmentedControl options={[AesKeyLength.L128, AesKeyLength.L192, AesKeyLength.L256]} value={state.aesKeyLength} onChange={v => setState(s => ({...s, aesKeyLength: v as AesKeyLength}))} labelMap={LABELS[lang].modes.aesKey} />
                     </>
                 )}
                 {(algorithm === AlgorithmType.DES || algorithm === AlgorithmType.TRIPLE_DES) && (
                     <>
                         {algorithm === AlgorithmType.TRIPLE_DES && (
                             <SegmentedControl options={[LegacyKeyMode.TDES112, LegacyKeyMode.TDES168]} value={state.legacyKeyMode} onChange={v => setState(s => ({...s, legacyKeyMode: v as LegacyKeyMode}))} labelMap={LABELS[lang].modes.legacy} />
                         )}
                         <SegmentedControl options={[AesMode.CBC, AesMode.ECB]} value={state.aesMode === AesMode.ECB ? AesMode.ECB : AesMode.CBC} onChange={v => setState(s => ({...s, aesMode: v as AesMode}))} labelMap={LABELS[lang].modes.aes} />
                     </>
                 )}
                 {algorithm === AlgorithmType.SHA3 && (
                     <SegmentedControl options={[Sha3Length.L224, Sha3Length.L256, Sha3Length.L384, Sha3Length.L512]} value={state.sha3Length} onChange={v => setState(s => ({...s, sha3Length: v as Sha3Length}))} labelMap={LABELS[lang].modes.sha3} />
                 )}
                 {algorithm === AlgorithmType.CMAC && (
                     <SegmentedControl options={[CmacKeyLength.L128, CmacKeyLength.L256]} value={state.cmacKeyLength} onChange={v => setState(s => ({...s, cmacKeyLength: v as CmacKeyLength}))} labelMap={LABELS[lang].modes.cmac} />
                 )}
             </div>
             
             {renderVisualizations(state)}
             {algorithm !== AlgorithmType.RSA && <KeyStrengthMeter value={state.key} algorithm={algorithm} />}
          </div>
      );
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${theme}`}>
       
       {/* Background Animated Blobs */}
       <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] animate-blob [animation-delay:4s]"></div>
          <div className="absolute top-[40%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-rose-500/5 dark:bg-rose-600/5 blur-[100px] animate-blob [animation-delay:8s]"></div>
       </div>

       <Header 
         lang={lang} setLang={setLang}
         theme={theme} setTheme={setTheme}
         themeProfile={themeProfile} setThemeProfile={setThemeProfile}
         scale={scale} setScale={setScale}
       />
       
       <div className="relative z-10 pt-28 px-8 pb-12 max-w-[1600px] mx-auto grid grid-cols-12 gap-10 h-[calc(100vh-20px)]">
          <aside className="col-span-3 lg:col-span-2 glass-panel rounded-apple overflow-y-auto custom-scrollbar p-4 flex flex-col gap-8 shadow-2xl">
             {CATEGORY_ORDER.map(cat => (
                <div key={cat} className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex items-center justify-between px-3 py-2.5 sticky top-0 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-3xl z-10 rounded-2xl mb-3 border border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      {LABELS[lang].categories[cat]}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setModalTarget({ cat }); setIsModalOpen(true); }}
                      className="text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <HelpCircle size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 px-1">
                    {Object.values(AlgorithmType)
                      .filter(algo => ALGO_CATEGORIES[algo] === cat)
                      .map(algo => (
                        <button
                          key={algo}
                          onClick={() => setAlgorithm(algo)}
                          className={`text-left px-5 py-3 rounded-2xl text-[11px] font-bold tracking-tight transition-all duration-300 ${
                            algorithm === algo 
                            ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/40 scale-[1.03]' 
                            : 'hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {LABELS[lang].algorithms[algo]}
                        </button>
                    ))}
                  </div>
                </div>
             ))}
          </aside>

          <main className="col-span-9 lg:col-span-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar pr-4">
             <div className="flex items-center justify-between glass-panel px-8 py-5 rounded-apple shadow-xl border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-6">
                   <div className="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(0,122,255,0.5)] animate-pulse-soft"></div>
                   <h2 className="text-2xl font-black font-display tracking-tight text-slate-800 dark:text-white uppercase">
                      {LABELS[lang].algorithms[algorithm]}
                   </h2>
                   <button onClick={() => { setModalTarget({ algo: algorithm }); setIsModalOpen(true); }} className="p-2.5 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full transition-colors group">
                     <HelpCircle size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                   </button>
                </div>
             </div>

             <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-10 relative">
                {transferAnim && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none transition-all duration-700 ${transferAnim === 'toBob' ? 'animate-fly-right' : 'animate-fly-left'}`}>
                       <div className="bg-blue-500 text-white p-4 rounded-full shadow-2xl shadow-blue-500/50">
                          <Key size={28} />
                       </div>
                    </div>
                )}

                {/* Left Panel */}
                <div className={`glass-panel rounded-apple-lg p-10 flex flex-col gap-8 transition-all duration-500 border-2 ${highlightAliceInput ? 'border-blue-500/50 scale-[1.01]' : 'border-transparent'}`}>
                    <div className="flex items-center justify-between">
                       <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-4">
                          <Shield size={20} className="text-blue-500" />
                          {algorithm === AlgorithmType.DIFFIE_HELLMAN || algorithm === AlgorithmType.ECC ? 'Alice Node' : LABELS[lang].encrypt}
                       </h3>
                       {(algorithm === AlgorithmType.DIFFIE_HELLMAN || algorithm === AlgorithmType.ECC) && (
                         <div className="flex gap-3">
                           <button onClick={() => handleDhGenKey('A')} className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500/20 transition-all">Generate</button>
                           <button onClick={() => handleDhExchange('A')} className="text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white px-4 py-2 rounded-full shadow-xl shadow-blue-500/20 btn-apple flex items-center gap-2"><Send size={12}/> SEND KEY</button>
                         </div>
                       )}
                    </div>
                    
                    {renderKeySection('ENC')}

                    <div className="flex flex-col gap-4 flex-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{algorithm === AlgorithmType.DIFFIE_HELLMAN ? "Shared Parameters" : LABELS[lang].cipherInput}</label>
                        <textarea 
                           value={encState.input}
                           onChange={(e) => setEncState(s => ({...s, input: e.target.value}))}
                           placeholder={LABELS[lang].inputPlaceholder}
                           readOnly={algorithm === AlgorithmType.DIFFIE_HELLMAN}
                           className="flex-1 bg-slate-100/40 dark:bg-black/30 rounded-apple p-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono text-sm leading-relaxed border border-slate-200/30 dark:border-white/5 transition-all"
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <button onClick={() => handleRun('ENCRYPT')} className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-apple font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-4 shadow-2xl shadow-blue-500/30 btn-apple group">
                           {algorithm === AlgorithmType.DIFFIE_HELLMAN ? 'CALCULATE' : 'EXECUTE'} <Play size={16} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex gap-4">
                           <button onClick={() => setEncState(s => ({...s, input: ''}))} className="p-4 hover:bg-rose-500/10 rounded-full text-slate-400 hover:text-rose-500 transition-all active:scale-90"><Trash2 size={22} /></button>
                           <button onClick={() => copyToClipboard(encState.output)} className="p-4 hover:bg-blue-500/10 rounded-full text-slate-400 hover:text-blue-500 transition-all active:scale-90"><Copy size={22} /></button>
                        </div>
                    </div>
                    
                    <div className={`rounded-apple-lg p-7 min-h-[140px] flex items-center justify-center border border-slate-200/30 dark:border-white/5 shadow-inner leading-relaxed transition-all ${category === AlgorithmCategory.HASHING ? 'hash-output-box ring-1 ring-blue-500/10' : 'bg-slate-50/50 dark:bg-black/40 font-mono text-sm'}`}>
                       {encState.output ? (
                         <div className="w-full text-left break-all">
                            {encState.output}
                         </div>
                       ) : (
                         <span className="text-slate-400/50 italic font-sans">{LABELS[lang].outputPlaceholder}</span>
                       )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className={`glass-panel rounded-apple-lg p-10 flex flex-col gap-8 transition-all duration-500 border-2 ${highlightBobInput ? 'border-blue-500/50 scale-[1.01]' : 'border-transparent'}`}>
                    <div className="flex items-center justify-between">
                       <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-4">
                          <Key size={20} className="text-blue-500" />
                          {algorithm === AlgorithmType.DIFFIE_HELLMAN || algorithm === AlgorithmType.ECC ? 'Bob Node' : LABELS[lang].decrypt}
                       </h3>
                       {(algorithm === AlgorithmType.DIFFIE_HELLMAN || algorithm === AlgorithmType.ECC) && (
                         <div className="flex gap-3">
                           <button onClick={() => handleDhGenKey('B')} className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500/20 transition-all">Generate</button>
                           <button onClick={() => handleDhExchange('B')} className="text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white px-4 py-2 rounded-full shadow-xl shadow-blue-500/20 btn-apple flex items-center gap-2"><Send size={12}/> SEND KEY</button>
                         </div>
                       )}
                    </div>

                    {renderKeySection('DEC')}

                    <div className="flex flex-col gap-4 flex-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{algorithm === AlgorithmType.DIFFIE_HELLMAN ? "Peer Public Key" : LABELS[lang].decipherInput}</label>
                        <textarea 
                           value={decState.input}
                           onChange={(e) => setDecState(s => ({...s, input: e.target.value}))}
                           placeholder={LABELS[lang].inputPlaceholder}
                           readOnly={algorithm === AlgorithmType.DIFFIE_HELLMAN}
                           className="flex-1 bg-slate-100/40 dark:bg-black/30 rounded-apple p-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono text-sm leading-relaxed border border-slate-200/30 dark:border-white/5 transition-all"
                        />
                    </div>
                    
                     <div className="flex justify-between items-center pt-2">
                        <button onClick={() => handleRun('DECRYPT')} className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-apple font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-4 shadow-2xl shadow-blue-500/30 btn-apple group">
                           {algorithm === AlgorithmType.DIFFIE_HELLMAN ? 'CALCULATE' : 'EXECUTE'} <Play size={16} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex gap-4">
                           <button onClick={() => setDecState(s => ({...s, input: ''}))} className="p-4 hover:bg-rose-500/10 rounded-full text-slate-400 hover:text-rose-500 transition-all active:scale-90"><Trash2 size={22} /></button>
                           <button onClick={() => copyToClipboard(decState.output)} className="p-4 hover:bg-blue-500/10 rounded-full text-slate-400 hover:text-blue-500 transition-all active:scale-90"><Copy size={22} /></button>
                        </div>
                    </div>

                    <div className={`bg-slate-50/50 dark:bg-black/40 rounded-apple-lg p-7 min-h-[140px] flex items-center justify-center font-mono text-sm border border-slate-200/30 dark:border-white/5 shadow-inner leading-relaxed`}>
                       {decState.output ? (
                         <div className="w-full text-left break-all">
                            {decState.output}
                         </div>
                       ) : (
                         <span className="text-slate-400/50 italic font-sans">{LABELS[lang].outputPlaceholder}</span>
                       )}
                    </div>
                </div>
             </div>

             {algorithm === AlgorithmType.DIFFIE_HELLMAN && (
                 <div className={`glass-panel p-8 rounded-apple-lg flex flex-col gap-6 transition-all duration-700 shadow-2xl ${highlightDhParams ? 'ring-4 ring-blue-400/30 scale-[1.02]' : ''}`}>
                    <div className="flex justify-between items-center border-b border-slate-200/30 dark:border-white/5 pb-5">
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Global System Parameters</span>
                        <button onClick={handleDhNewParams} className="text-[10px] font-black uppercase bg-slate-200 dark:bg-white/10 px-5 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-3 tracking-widest shadow-sm"><RefreshCw size={14} /> Regenerate</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/60 dark:bg-black/40 p-6 rounded-apple border border-slate-200/30 dark:border-white/5 shadow-inner">
                            <span className="block text-[9px] font-black text-blue-500 mb-3 tracking-[0.25em] flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> PRIME MODULUS (P)
                            </span>
                            <div className="font-mono text-[12px] break-all text-slate-600 dark:text-slate-300 leading-relaxed font-bold">{encState.dhP || '---'}</div>
                        </div>
                        <div className="bg-white/60 dark:bg-black/40 p-6 rounded-apple border border-slate-200/30 dark:border-white/5 shadow-inner">
                            <span className="block text-[9px] font-black text-emerald-500 mb-3 tracking-[0.25em] flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> GENERATOR BASE (G)
                            </span>
                            <div className="font-mono text-[12px] break-all text-slate-600 dark:text-slate-300 leading-relaxed font-bold">{encState.dhG || '---'}</div>
                        </div>
                    </div>
                 </div>
             )}

          </main>
       </div>

       <Console logs={logs} lang={lang} />
       <InfoModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          algorithm={modalTarget.algo} 
          category={modalTarget.cat} 
          lang={lang} 
       />
    </div>
  );
}