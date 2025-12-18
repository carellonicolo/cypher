export type Language = 'it' | 'en';
export type Theme = 'light' | 'dark';

export enum ThemeProfile {
  DEFAULT = 'DEFAULT',
  NERD = 'NERD',
  YOUTH = 'YOUTH',
  NATURE = 'NATURE',
  OCEAN = 'OCEAN',
  SUNSET = 'SUNSET',
}

export enum AlgorithmType {
  CAESAR = 'CAESAR',
  VIGENERE = 'VIGENERE',
  PLAYFAIR = 'PLAYFAIR',
  MONOALPHABETIC = 'MONOALPHABETIC',
  AES = 'AES',
  DES = 'DES',
  TRIPLE_DES = 'TRIPLE_DES',
  RC4 = 'RC4',
  CHACHA20 = 'CHACHA20',
  RSA = 'RSA',
  DIFFIE_HELLMAN = 'DIFFIE_HELLMAN',
  ECC = 'ECC',
  MD5 = 'MD5',
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
  SHA3 = 'SHA3',
  BLAKE2 = 'BLAKE2',
  BLAKE3 = 'BLAKE3',
  HMAC = 'HMAC',
  CMAC = 'CMAC',
}

export enum AlgorithmCategory {
  CLASSICAL = 'CLASSICAL',
  SYMMETRIC = 'SYMMETRIC',
  ASYMMETRIC = 'ASYMMETRIC',
  HASHING = 'HASHING',
  MAC = 'MAC',
  GENERAL = 'GENERAL'
}

export enum VigenereMode {
  REPEATING = 'REPEATING',
  AUTOKEY = 'AUTOKEY',
}

export enum AesMode {
  GCM = 'GCM',
  CBC = 'CBC',
  CTR = 'CTR',
  ECB = 'ECB', // Added for Legacy Support (DES/3DES)
}

export enum AesKeyLength {
  L128 = '128',
  L192 = '192',
  L256 = '256',
}

export enum LegacyKeyMode {
  DES56 = 'DES56',
  TDES112 = 'TDES112',
  TDES168 = 'TDES168',
}

export enum DhGroup {
  TOY = 'TOY',
  MODP_14 = 'MODP_14', // 2048-bit
  MODP_15 = 'MODP_15', // 3072-bit
}

export enum DhBitLength {
  NATIVE = 'NATIVE',
  L64 = '64',
  L128 = '128',
  L256 = '256',
  L512 = '512',
  L1024 = '1024'
}

export enum Sha3Length {
  L224 = '224',
  L256 = '256',
  L384 = '384',
  L512 = '512',
}

export enum CmacKeyLength {
  L128 = '128',
  L256 = '256',
}

export enum EccCurve {
  P256 = 'P-256',
  P384 = 'P-384',
  P521 = 'P-521',
}

export enum RsaModulusLength {
  L2048 = '2048',
  L4096 = '4096',
}

export const CATEGORY_ORDER: AlgorithmCategory[] = [
  AlgorithmCategory.CLASSICAL,
  AlgorithmCategory.SYMMETRIC,
  AlgorithmCategory.ASYMMETRIC,
  AlgorithmCategory.HASHING,
  AlgorithmCategory.MAC
];

export const ALGO_CATEGORIES: Record<AlgorithmType, AlgorithmCategory> = {
  [AlgorithmType.CAESAR]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.VIGENERE]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.PLAYFAIR]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.MONOALPHABETIC]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.AES]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.DES]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.TRIPLE_DES]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.RC4]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.CHACHA20]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.RSA]: AlgorithmCategory.ASYMMETRIC,
  [AlgorithmType.DIFFIE_HELLMAN]: AlgorithmCategory.ASYMMETRIC,
  [AlgorithmType.ECC]: AlgorithmCategory.ASYMMETRIC,
  [AlgorithmType.MD5]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA1]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA256]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA512]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA3]: AlgorithmCategory.HASHING,
  [AlgorithmType.BLAKE2]: AlgorithmCategory.HASHING,
  [AlgorithmType.BLAKE3]: AlgorithmCategory.HASHING,
  [AlgorithmType.HMAC]: AlgorithmCategory.MAC,
  [AlgorithmType.CMAC]: AlgorithmCategory.MAC,
};

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'process';
  message: string;
}

// Single section state (used for independent Encrypt/Decrypt panels)
export interface SectionState {
  input: string;
  output: string;
  key: string;
  shift: number;
  vigenereMode: VigenereMode;
  aesMode: AesMode;
  aesKeyLength: AesKeyLength; // Added
  legacyKeyMode: LegacyKeyMode;
  sha3Length: Sha3Length;
  cmacKeyLength: CmacKeyLength;
  eccCurve: EccCurve;
  // RSA specific
  rsaModulusLength: RsaModulusLength;
  rsaKeyPair?: CryptoKeyPair; 
  rsaPubPem?: string;
  rsaPrivPem?: string;
  // Diffie-Hellman specific
  dhGroup: DhGroup;
  dhBitLength: DhBitLength;
  dhP?: string;
  dhG?: string;
  dhOtherPub?: string;
}

export const LABELS = {
  it: {
    title: 'CryptoFlow',
    subtitle: 'Powered by Prof. Carello',
    inputPlaceholder: 'Inserisci il testo qui...',
    outputPlaceholder: 'Il risultato apparirà qui...',
    cipherInput: 'Testo in Chiaro',
    cipherOutput: 'Output',
    decipherInput: 'Input Cifrato',
    decipherOutput: 'Testo Decifrato',
    key: 'Chiave / Password',
    shift: 'Spostamento',
    encrypt: 'Modulo Cifratura',
    decrypt: 'Modulo Decifratura',
    copy: 'Copia',
    clear: 'Pulisci',
    transfer: 'Usa per Decifrare',
    console: 'Console di Sistema',
    consolePlaceholder: 'In attesa di operazioni...',
    sidebarTitle: 'Algoritmi',
    tooltips: {
        catClassical: 'Algoritmi storici basati su sostituzione',
        catSymmetric: 'Chiave singola per cifrare e decifrare',
        catAsymmetric: 'Coppia di chiavi (Pubblica/Privata)',
        catHashing: 'Impronte digitali irreversibili',
        catMac: 'Autenticazione del messaggio con chiave',
        clearInput: 'Cancella tutto il testo',
        copyOutput: 'Copia negli appunti',
        transfer: 'Sposta l\'output nel modulo di decifratura',
        randomize: 'Genera valore casuale',
        newParams: 'Genera nuovi parametri di gruppo',
        sendKey: 'Invia chiave pubblica',
        getKey: 'Ricevi chiave pubblica',
        openGuide: 'Apri documentazione'
    },
    categories: {
      CLASSICAL: 'Classici',
      SYMMETRIC: 'Simmetrici',
      ASYMMETRIC: 'Asimmetrici',
      HASHING: 'Funzioni Hash',
      MAC: 'MAC (Auth)',
      GENERAL: 'Crittografia Generale'
    },
    categoryDetails: {
      GENERAL: "La **Crittografia** (dal greco kruptós, \"nascosto\", e gráphein, \"scrivere\") è la disciplina che studia le tecniche per rendere un messaggio incomprensibile a chi non possiede la chiave per decifrarlo.\n\nStoricamente divisa in classica e moderna, oggi si basa su tre pilastri fondamentali, spesso riassunti nell'acronimo **CIA**:\n**Confidenzialità**: Solo l'autorizzato può leggere il dato.\n**Integrità**: Il dato non è stato alterato.\n**Autenticità**: La sorgente del dato è verificata.\n\nQuesta applicazione simula i meccanismi matematici sottostanti, dall'aritmetica modulare dei cifrari romani alle curve ellittiche utilizzate oggi per proteggere le comunicazioni TLS/SSL.",
      CLASSICAL: "I **Cifrari Classici** rappresentano l'era pre-computazionale della crittografia, operando tipicamente a livello di caratteri alfabetici piuttosto che di bit. \n\nSi dividono principalmente in:\n1. **Cifrari a Sostituzione**: Ogni unità del testo in chiaro è sostituita con un'altra secondo un sistema regolare (es. Cesare, Vigenère).\n2. **Cifrari a Trasposizione**: Le unità del testo in chiaro vengono riordinate secondo uno schema complesso, mantenendo l'identità dei caratteri ma oscurandone la posizione.\n\nSebbene oggi siano considerati insicuri a causa della loro vulnerabilità all'**analisi delle frequenze** e alla bassa entropia delle chiavi, lo studio di questi algoritmi è fondamentale per comprendere i concetti base di confusione e diffusione.",
      SYMMETRIC: "La **Crittografia Simmetrica** (o a chiave segreta) è una classe di algoritmi in cui la stessa chiave crittografica viene utilizzata sia per la cifratura del testo in chiaro che per la decifratura del testo cifrato.\n\n**Proprietà Fondamentali:**\n• **Efficienza**: Sono computazionalmente molto veloci, ideali per cifrare grandi volumi di dati (es. l'intero hard disk o streaming video).\n• **Primitive**: Si dividono in *Block Ciphers* (operano su blocchi di bit fissi, es. AES) e *Stream Ciphers* (operano su flussi continui di bit, es. ChaCha20).\n• **Problematiche**: Il principale svantaggio è il *Key Distribution Problem*: come scambiare la chiave segreta su un canale insicuro senza che venga intercettata?",
      ASYMMETRIC: "La **Crittografia Asimmetrica** (o a chiave pubblica), introdotta da Diffie e Hellman nel 1976, rivoluzionò il campo introducendo l'uso di una coppia di chiavi matematicamente correlate ma distinte:\n\n1. **Chiave Pubblica**: Nota a tutti, usata per cifrare o verificare una firma.\n2. **Chiave Privata**: Segreta, usata per decifrare o generare una firma.\n\nLa sicurezza di questi sistemi si basa su problemi matematici computazionalmente intrattabili, come la **fattorizzazione di grandi numeri interi** (RSA) o il **logaritmo discreto** (Diffie-Hellman, ECC). Sebbene risolva il problema dello scambio delle chiavi, è ordini di grandezza più lenta della crittografia simmetrica, motivo per cui viene usata principalmente per scambiare le chiavi simmetriche (sistemi ibridi).",
      HASHING: "Una **Funzione di Hash** crittografica è un algoritmo deterministico che mappa dati di lunghezza arbitraria (messaggio) in una stringa di bit di lunghezza fissa (digest o impronta digitale).\n\n**Proprietà di Sicurezza Richieste:**\n• **Resistenza alla Pre-immagine**: Dato un hash *h*, deve essere computazionalmente difficile trovare un messaggio *m* tale che *hash(m) = h* (unidirezionalità).\n• **Resistenza alla Seconda Pre-immagine**: Dato *m1*, è difficile trovare *m2* tale che *hash(m1) = hash(m2)*.\n• **Resistenza alle Collisioni**: È difficile trovare una qualsiasi coppia *(m1, m2)* tale che *hash(m1) = hash(m2)*.\n\nLe funzioni hash sono onnipresenti: verifica integrità file, storage sicuro delle password (con salt), e firme digitali.",
      MAC: "Il **Message Authentication Code (MAC)** è una tecnica crittografica che utilizza una chiave segreta per generare un tag di autenticazione per un messaggio. \n\nA differenza dell'Hash (che garantisce solo integrità contro errori accidentali), il MAC garantisce **autenticità** e **integrità** contro attacchi attivi. Un attaccante, non possedendo la chiave segreta, non può generare un MAC valido per un messaggio falsificato.\n\nEsistono diverse costruzioni:\n• **HMAC**: Basato su funzioni Hash (es. SHA-256).\n• **CMAC**: Basato su cifrari a blocchi (es. AES).\n• **Poly1305**: Basato su aritmetica modulare universale (usato con ChaCha20)."
    },
    algorithms: {
      CAESAR: 'Cifrario di Cesare',
      VIGENERE: 'Cifrario di Vigenère',
      PLAYFAIR: 'Cifrario Playfair',
      MONOALPHABETIC: 'Sostituzione Mono',
      AES: 'AES (Moderno)',
      DES: 'DES (Legacy Sim)',
      TRIPLE_DES: '3DES (Legacy Sim)',
      RC4: 'RC4 (Stream)',
      CHACHA20: 'ChaCha20-Poly1305',
      RSA: 'RSA (Public Key)',
      DIFFIE_HELLMAN: 'Diffie-Hellman',
      ECC: 'Elliptic Curve (ECC)',
      MD5: 'MD5',
      SHA1: 'SHA-1',
      SHA256: 'SHA-256',
      SHA512: 'SHA-512',
      SHA3: 'SHA-3 (Keccak)',
      BLAKE2: 'BLAKE2b',
      BLAKE3: 'BLAKE3',
      HMAC: 'HMAC (Hash MAC)',
      CMAC: 'CMAC (Cipher MAC)',
    },
    modes: {
      vigenere: { [VigenereMode.REPEATING]: 'Ripetuta', [VigenereMode.AUTOKEY]: 'Auto-Chiave' },
      aes: { [AesMode.GCM]: 'GCM (Auth)', [AesMode.CBC]: 'CBC', [AesMode.CTR]: 'CTR', [AesMode.ECB]: 'ECB (Insecure)' },
      aesKey: { [AesKeyLength.L128]: '128-bit', [AesKeyLength.L192]: '192-bit', [AesKeyLength.L256]: '256-bit' },
      sha3: { [Sha3Length.L224]: '224', [Sha3Length.L256]: '256', [Sha3Length.L384]: '384', [Sha3Length.L512]: '512' },
      cmac: { [CmacKeyLength.L128]: '128-bit', [CmacKeyLength.L256]: '256-bit' },
      ecc: { [EccCurve.P256]: 'P-256', [EccCurve.P384]: 'P-384', [EccCurve.P521]: 'P-521' },
      dh: { [DhGroup.TOY]: 'Toy (Didattico)', [DhGroup.MODP_14]: '2048-bit (Sicuro)' },
      rsa: { [RsaModulusLength.L2048]: '2048-bit', [RsaModulusLength.L4096]: '4096-bit' },
      legacy: { [LegacyKeyMode.DES56]: '56-bit', [LegacyKeyMode.TDES112]: '112-bit (2-Key)', [LegacyKeyMode.TDES168]: '168-bit (3-Key)' }
    },
    algoDetails: {
        CAESAR: {
            theory: "STORIA:\nIl Cifrario di Cesare prende il nome da Gaio Giulio Cesare (c. 100-44 a.C.), che lo utilizzava per la corrispondenza militare segreta. Svetonio racconta che Cesare traslava le lettere di 3 posizioni.\n\nANALISI MATEMATICA:\nÈ un cifrario a sostituzione monoalfabetica basato sull'aritmetica modulare. Definito un alfabeto di dimensione $N=26$, la funzione di cifratura è $E_k(x) = (x + k) \\pmod{N}$, dove $x$ è la posizione della lettera e $k$ la chiave.\n\nCRITTANALISI:\nIl sistema è estremamente debole per gli standard moderni. Lo spazio delle chiavi è di sole $N-1 = 25$ chiavi possibili, rendendo banale un attacco *Brute Force*. Inoltre, preserva la distribuzione statistica delle lettere, rendendolo vulnerabile all'analisi delle frequenze.",
            guide: "Usa lo slider per selezionare la chiave $k$ (spostamento). Osserva come 'A' diventa la lettera spostata di $k$ posizioni."
        },
        VIGENERE: {
            theory: "STORIA:\nDescritto da Giovan Battista Bellaso nel 1553, fu erroneamente attribuito a Blaise de Vigenère nel XIX secolo. Per secoli fu considerato 'le chiffre indéchiffrable' (il cifrario indecifrabile).\n\nANALISI MATEMATICA:\nÈ un cifrario polialfabetico che applica una serie di cifrari di Cesare basati sulle lettere di una parola chiave. Matematicamente: $E_K(P_i) = (P_i + K_{i \\pmod m}) \\pmod{26}$, dove $m$ è la lunghezza della chiave.\n\nCRITTANALISI:\nLa sicurezza dipende dalla lunghezza della chiave. Friedrich Kasiski nel 1863 pubblicò il primo metodo generale per decifrarlo, basato sulla ricerca di sequenze ripetute nel testo cifrato per dedurre la lunghezza della chiave e successivamente applicare l'analisi delle frequenze.",
            guide: "Inserisci una parola chiave (es. 'LIME'). Il sistema ripeterà la chiave per coprire l'intera lunghezza del messaggio."
        },
        PLAYFAIR: {
            theory: "STORIA:\nInventato da Charles Wheatstone nel 1854, ma promosso da Lord Playfair. Fu il primo cifrario digrafico pratico, usato dalla Gran Bretagna fino alla Seconda Guerra Mondiale.\n\nMECCANISMO:\nIl testo viene diviso in coppie di lettere (digrafi). La cifratura avviene tramite una matrice 5x5 costruita dalla chiave. Le regole di sostituzione (rettangolo, riga, colonna) operano spazialmente sulla matrice.\n\nCRITTANALISI:\nSostituendo coppie invece di singole lettere, Playfair appiattisce la distribuzione delle frequenze (ci sono $26 \\times 26 = 676$ possibili digrafi). Tuttavia, lascia tracce statistiche analizzabili con testi sufficientemente lunghi.",
            guide: "La 'J' viene fusa con la 'I'. Le doppie lettere (es. 'LL') vengono separate da una 'X'."
        },
        MONOALPHABETIC: {
            theory: "DEFINIZIONE:\nUn cifrario a sostituzione monoalfabetica generale mappa l'alfabeto di testo in chiaro a una permutazione arbitraria dell'alfabeto cifrato.\n\nSPAZIO DELLE CHIAVI:\nLo spazio delle chiavi è fattoriale: $26! \\approx 4 \\times 10^{26}$. Un numero enorme che rende impraticabile il brute force manuale.\n\nCRITTANALISI:\nNonostante l'enorme numero di chiavi, il cifrario è insicuro perché mantiene identica la distribuzione delle frequenze del linguaggio originale. La lettera 'E' nel testo cifrato apparirà con la stessa frequenza della 'E' nella lingua originale (~12% in inglese/italiano).",
            guide: "Inserisci una stringa chiave. Il sistema genererà un alfabeto permutato basato sui caratteri unici della chiave seguiti dalle restanti lettere."
        },
        AES: {
            theory: "STANDARD:\nL'Advanced Encryption Standard (AES) è stato stabilito dal NIST nel 2001 (FIPS 197) dopo una competizione internazionale vinta dall'algoritmo Rijndael (progettato dai belgi Daemen e Rijmen).\n\nMATEMATICA:\nAES non usa la rete di Feistel (come DES), ma una *Substitution-Permutation Network* (SPN). Opera su blocchi di 128 bit rappresentati come matrici $4 \\times 4$ di byte. Le operazioni avvengono nel campo finito di Galois $GF(2^8)$.\n\nFASI DEL ROUND:\n1. **SubBytes**: Sostituzione non lineare tramite S-Box.\n2. **ShiftRows**: Permutazione delle righe.\n3. **MixColumns**: Mescolamento lineare delle colonne (diffusione).\n4. **AddRoundKey**: XOR con la chiave di round.",
            guide: "GCM (Galois/Counter Mode) è la modalità raccomandata poiché fornisce cifratura autenticata (AEAD), garantendo sia confidenzialità che integrità."
        },
        DES: {
            theory: "STORIA:\nIl Data Encryption Standard (DES) fu lo standard dominante dagli anni '70 fino all'avvento di AES. Basato sull'algoritmo Lucifer di IBM.\n\nDEBOLEZZA:\nLa sua principale debolezza è la lunghezza della chiave: 56 bit. Ciò comporta uno spazio delle chiavi di $2^{56} \\approx 7.2 \\times 10^{16}$, che oggi può essere esplorato esaustivamente (brute force) in poche ore utilizzando hardware specializzato o GPU.\n\nSTRUTTURA:\nUtilizza una rete di Feistel a 16 round, che ha il vantaggio di rendere le operazioni di cifratura e decifratura quasi identiche.",
            guide: "Algoritmo obsoleto e insicuro. Presente solo a scopo didattico."
        },
        TRIPLE_DES: {
            theory: "DEFINIZIONE:\nIl Triple DES (3DES o TDEA) applica l'algoritmo DES tre volte a ogni blocco di dati per aumentare la sicurezza effettiva.\n\nMODALITÀ:\nLa configurazione standard è EDE (Encrypt-Decrypt-Encrypt) con tre chiavi diverse ($K1, K2, K3$) o due ($K1, K3=K1, K2$).\n\nSICUREZZA:\nSebbene offra una sicurezza teorica di 112 bit (con keying option 2) o 168 bit, è molto lento in software e vulnerabile all'attacco *Sweet32* (collisioni su blocchi di 64 bit). Il NIST lo ha deprecato ufficialmente per nuove applicazioni dopo il 2023.",
            guide: "Più sicuro del DES singolo, ma lento. Si consiglia la migrazione ad AES."
        },
        RC4: {
            theory: "STORIA:\nRivest Cipher 4 (RC4) è uno stream cipher progettato da Ron Rivest nel 1987. Per anni è stato il cifrario più diffuso al mondo (WEP, WPA, TLS).\n\nFUNZIONAMENTO:\nUtilizza un array di stato interno di 256 byte $S$ e due indici $i, j$. L'algoritmo di pianificazione della chiave (KSA) inizializza lo stato, e l'algoritmo di generazione pseudo-casuale (PRGA) produce il keystream che viene messo in XOR con il testo.\n\nVULNERABILITÀ:\nRC4 soffre di gravi bias statistici, specialmente nei primi byte del keystream (bias di Fluhrer-Mantin-Shamir). Queste debolezze hanno portato alla compromissione del protocollo WEP e alla sua rimozione da TLS (RFC 7465).",
            guide: "Inserisci una chiave. Nota che l'output ha la stessa lunghezza dell'input (caratteristica degli stream cipher)."
        },
        CHACHA20: {
            theory: "MODERNITÀ:\nChaCha20 is a stream cipher developed by Daniel J. Bernstein in 2008. Adopted by Google and TLS 1.3 standard as an alternative to AES, especially on mobile devices without AES-NI hardware acceleration.\n\nARCHITETTURA:\nBasa la sua sicurezza su operazioni ARX (Add-Rotate-Xor) a 32 bit, estremamente veloci su CPU general purpose. A differenza di RC4, offre un'altissima diffusione e resistenza alla critanalisi.\n\nPOLY1305:\nSpesso accoppiato con Poly1305 (un MAC one-time) per fornire cifratura autenticata (AEAD), garantendo che il testo cifrato non sia stato manomesso.",
            guide: "Lo stato dell'arte per la crittografia su mobile e web."
        },
        RSA: {
            theory: "FONDAMENTA:\nRSA (Rivest-Shamir-Adleman, 1977) è il primo e più diffuso criptosistema a chiave pubblica. La sua sicurezza si basa sulla difficoltà computazionale del problema della **fattorizzazione di numeri interi**.\n\nMATEMATICA:\nSi generano due grandi numeri primi $p$ e $q$. Si calcola il modulo $n = p \\times q$. La sicurezza deriva dal fatto che, dato $n$, è computazionalmente intrattabile risalire a $p$ e $q$ se sono sufficientemente grandi (es. 2048 bit).\n\nTRAPDOOR:\nRSA utilizza una funzione trapdoor basata sull'esponenziazione modulare. Cifratura: $c = m^e \\pmod n$. Decifratura: $m = c^d \\pmod n$, dove $d$ è l'inverso moltiplicativo di $e$ modulo $\\phi(n)$.",
            guide: "Le chiavi generate sono reali a 2048 bit. L'operazione può richiedere qualche istante nel browser."
        },
        DIFFIE_HELLMAN: {
            theory: "RIVOLUZIONE:\nIl protocollo Diffie-Hellman (1976) ha introdotto il concetto di crittografia a chiave pubblica. Non serve per cifrare messaggi, ma per **accordarsi su una chiave segreta** comune attraverso un canale insicuro.\n\nPRINCIPIO:\nLa sicurezza si basa sul **Problema del Logaritmo Discreto** in un gruppo ciclico finito. Dati un generatore $g$ e un numero primo $p$, se Alice invia $A = g^a \\pmod p$, per un attaccante è difficile trovare l'esponente segreto $a$, anche conoscendo $g, p$ e $A$.\n\nAPPLICAZIONI:\nÈ la base di protocolli come IKE (IPsec), SSH e delle prime versioni di SSL/TLS.",
            guide: "Simula lo scambio tra Alice e Bob. Alla fine, entrambi calcoleranno lo stesso 'Segreto Condiviso' senza mai trasmetterlo."
        },
        ECC: {
            theory: "EFFICIENCY:\nLa Crittografia su Curve Ellittiche (ECC) offre la stessa sicurezza di RSA ma con chiavi molto più corte. Una chiave ECC a 256 bit offre una sicurezza comparabile a una chiave RSA a 3072 bit.\n\nMATEMATICA:\nSi basa sulla struttura algebrica delle curve ellittiche su campi finiti. L'operazione di 'moltiplicazione scalare' sulla curva è la funzione one-way: dato un punto base $G$ e un punto $P = kG$, è difficile trovare lo scalare $k$ (problema del logaritmo discreto su curve ellittiche).\n\nUTILIZZO:\nÈ lo standard de-facto per le comunicazioni moderne (ECDH per scambio chiavi, ECDSA per firme), usato in Bitcoin, WhatsApp, TLS.",
            guide: "Simulazione di ECDH. Nota come le chiavi pubbliche (coordinate X,Y) siano molto più compatte rispetto ai blocchi RSA."
        },
        MD5: { theory: "DEPRECATED:\nMD5 (Message-Digest algorithm 5) produces 128-bit hash. Developed in 1991, now considered **cryptographically broken**.\n\nCOLLISIONS:\nIn 2004 it was shown possible to generate collisions (two different files with same hash) very quickly. Must never be used for digital signatures or SSL certificates, but persists for non-critical integrity checks.", guide: "Fixed 32 hex char output (128-bit)." },
        SHA1: { theory: "DEPRECATED:\nSHA-1 produces 160-bit digest. Designed by NSA, was standard for years.\n\nSHATTERED:\nIn 2017, Google announced 'SHAttered' attack, generating first practical SHA-1 collision. Since retired from browsers and CAs. No longer secure for digital signatures.", guide: "Fixed 40 hex char output (160-bit)." },
        SHA256: { theory: "CURRENT STANDARD:\nBelongs to SHA-2 family (Secure Hash Algorithm 2), designed by NSA. Produces 256-bit digest.\n\nSECURITY:\nCurrently no known practical attacks compromise collision resistance. Widely used in TLS, Bitcoin, HMAC. Structure based on Merkle-Damgård construction.", guide: "64 hex char output. Industrial standard." },
        SHA512: { theory: "HIGH SECURITY:\nSHA-2 variant operating on 64-bit words (optimized for 64-bit CPUs) and producing 512-bit output.\n\nROBUSTNESS:\nOffers higher security margin against future attacks (e.g., quantum computers) and length extension attacks compared to SHA-256.", guide: "Very long digest (128 hex chars)." },
        SHA3: { theory: "NEXT-GEN:\nSHA-3 (Keccak) selected by NIST in 2012. Unlike SHA-2 (Merkle-Damgård), uses **Sponge** construction.\n\nINDEPENDENCE:\nBeing structurally different from SHA-2, offers secure alternative should vulnerabilities be found in SHA-2 family. Versatile, can be used as stream cipher or MAC (KMAC).", guide: "Keccak is basis for SHAKE and other modern primitives." },
        BLAKE2: { theory: "PERFORMANCE:\nBLAKE2 is hash optimized for speed, often faster than MD5 but with SHA-3 security. Born as evolution of SHA-3 finalist BLAKE.\n\nUSAGE:\nPopular in modern software (WireGuard, IPFS, Argon2) where general-purpose CPU performance is critical.", guide: "BLAKE2b optimized for 64-bit systems." },
        BLAKE3: { theory: "PARALLELISM:\nBLAKE3 is 2020 evolution. Uses internal **Merkle Tree** allowing hash calculation parallelization across all CPU cores (SIMD).\n\nSPEED:\nExtremely fast, capable of processing GB/s, maintaining 128-bit security against collisions, pre-images, and extension attacks.", guide: "Fastest hash in this suite." },
        HMAC: { theory: "AUTHENTICATION:\nHMAC (Hash-based Message Authentication Code) is a specific construction to calculate a MAC using a cryptographic hash function with a secret key.\n\nRFC 2104:\nDefined as $H(K' \\oplus opad || H(K' \\oplus ipad || message))$. Double hash execution protects against *Length Extension* attacks affecting pure Merkle-Damgård hashes (like SHA-256) if used naively as $H(k || m)$.", guide: "Requires secret key. Verifies message hasn't been altered and comes from key holder." },
        CMAC: { theory: "BLOCK-CIPHER MAC:\nCMAC (Cipher-based MAC) calculates authentication code using a symmetric block cipher (like AES).\n\nSECURITY:\nResolves deficiencies of old CBC-MAC standard, securely handling variable length messages. Widely used in network protocols and smart cards where AES hardware is available but Hash engine is not.", guide: "Uses AES as underlying primitive." }
    }
  },
  en: {
    title: 'CryptoFlow',
    subtitle: 'Powered by Prof. Carello',
    inputPlaceholder: 'Type input text here...',
    outputPlaceholder: 'Output will appear here...',
    cipherInput: 'Plaintext',
    cipherOutput: 'Output',
    decipherInput: 'Ciphertext',
    decipherOutput: 'Decrypted Text',
    key: 'Key / Password',
    shift: 'Shift',
    encrypt: 'Encryption Module',
    decrypt: 'Decryption Module',
    copy: 'Copy',
    clear: 'Clear',
    transfer: 'Use to Decrypt',
    console: 'System Console',
    consolePlaceholder: 'Waiting for operations...',
    sidebarTitle: 'Algorithms',
    tooltips: {
        catClassical: 'Historical substitution algorithms',
        catSymmetric: 'Single key for encryption and decryption',
        catAsymmetric: 'Key pair (Public/Private)',
        catHashing: 'Irreversible digital fingerprints',
        catMac: 'Message authentication with key',
        clearInput: 'Clear all text',
        copyOutput: 'Copy to clipboard',
        transfer: 'Move output to decryption module',
        randomize: 'Generate random value',
        newParams: 'Generate new group parameters',
        sendKey: 'Send Public Key',
        getKey: 'Receive Public Key',
        openGuide: 'Open Documentation'
    },
    categories: {
      CLASSICAL: 'Classical',
      SYMMETRIC: 'Symmetric',
      ASYMMETRIC: 'Asymmetric',
      HASHING: 'Hash Functions',
      MAC: 'MAC (Auth)',
      GENERAL: 'General Cryptography'
    },
    categoryDetails: {
      GENERAL: "**Cryptography** (from Greek kruptós, \"hidden\", and gráphein, \"to write\") is the discipline of securing communication from adversarial behavior.\n\nHistorically divided into classical and modern, today it rests on three pillars, often summarized as **CIA**:\n**Confidentiality**: Only authorized parties can read the data.\n**Integrity**: The data has not been altered.\n**Authenticity**: The source of the data is verified.\n\nThis application simulates the underlying mathematical mechanisms, from the modular arithmetic of Roman ciphers to the Elliptic Curves used today to secure TLS/SSL communications.",
      CLASSICAL: "**Classical Ciphers** represent the pre-computational era of cryptography, typically operating on alphabetic characters rather than bits.\n\nThey are primarily divided into:\n1. **Substitution Ciphers**: Each unit of plaintext is replaced with another according to a regular system (e.g., Caesar, Vigenère).\n2. **Transposition Ciphers**: The units of plaintext are rearranged according to a complex scheme, maintaining the identity of the characters but obscuring their position.\n\nAlthough considered insecure today due to vulnerability to **frequency analysis** and low key entropy, studying these algorithms is fundamental for understanding basic concepts of confusion and diffusion.",
      SYMMETRIC: "**Symmetric Cryptography** (or secret-key cryptography) is a class of algorithms where the same cryptographic key is used for both encryption of plaintext and decryption of ciphertext.\n\n**Key Properties:**\n• **Efficiency**: They are computationally very fast, ideal for encrypting large volumes of data (e.g., full disk encryption or video streaming).\n• **Primitives**: Divided into *Block Ciphers* (operate on fixed bit blocks, e.g., AES) and *Stream Ciphers* (operate on continuous bit streams, e.g., ChaCha20).\n• **Challenges**: The main drawback is the *Key Distribution Problem*: how to exchange the secret key over an insecure channel without interception?",
      ASYMMETRIC: "**Asymmetric Cryptography** (or public-key cryptography), introduced by Diffie and Hellman in 1976, revolutionized the field by employing a pair of mathematically related keys:\n\n1. **Public Key**: Known to everyone, used to encrypt or verify a signature.\n2. **Private Key**: Secret, used to decrypt or generate a signature.\n\nSecurity relies on computationally intractable mathematical problems, such as **integer factorization** (RSA) or the **discrete logarithm** (Diffie-Hellman, ECC). While it solves the key exchange problem, it is orders of magnitude slower than symmetric cryptography, which is why it is mainly used to exchange symmetric keys (hybrid systems).",
      HASHING: "A cryptographic **Hash Function** is a deterministic algorithm that maps arbitrary length data (message) to a fixed-length bit string (digest or fingerprint).\n\n**Required Security Properties:**\n• **Pre-image Resistance**: Given a hash *h*, it should be computationally difficult to find a message *m* such that *hash(m) = h* (one-way).\n• **Second Pre-image Resistance**: Given *m1*, it is difficult to find *m2* such that *hash(m1) = hash(m2)*.\n• **Collision Resistance**: It is difficult to find any pair *(m1, m2)* such that *hash(m1) = hash(m2)*.\n\nHash functions are ubiquitous: file integrity checks, secure password storage (with salt), and digital signatures.",
      MAC: "A **Message Authentication Code (MAC)** is a cryptographic technique that uses a secret key to generate an authentication tag for a message.\n\nUnlike a Hash (which only guarantees integrity against accidental errors), a MAC guarantees **authenticity** and **integrity** against active attacks. An attacker, lacking the secret key, cannot generate a valid MAC for a forged message.\n\nconstructions include:\n• **HMAC**: Based on Hash functions (e.g., SHA-256).\n• **CMAC**: Based on Block Ciphers (e.g., AES).\n• **Poly1305**: Based on universal modular arithmetic (used with ChaCha20)."
    },
    algorithms: {
      CAESAR: 'Caesar Cipher',
      VIGENERE: 'Vigenère Cipher',
      PLAYFAIR: 'Playfair Cipher',
      MONOALPHABETIC: 'Mono-Substitution',
      AES: 'AES (Modern)',
      DES: 'DES (Legacy Sim)',
      TRIPLE_DES: '3DES (Legacy Sim)',
      RC4: 'RC4 (Stream)',
      CHACHA20: 'ChaCha20-Poly1305',
      RSA: 'RSA (Public Key)',
      DIFFIE_HELLMAN: 'Diffie-Hellman',
      ECC: 'Elliptic Curve (ECC)',
      MD5: 'MD5',
      SHA1: 'SHA-1',
      SHA256: 'SHA-256',
      SHA512: 'SHA-512',
      SHA3: 'SHA-3 (Keccak)',
      BLAKE2: 'BLAKE2b',
      BLAKE3: 'BLAKE3',
      HMAC: 'HMAC (Hash MAC)',
      CMAC: 'CMAC (Cipher MAC)',
    },
    modes: {
      vigenere: { [VigenereMode.REPEATING]: 'Repeating', [VigenereMode.AUTOKEY]: 'Autokey' },
      aes: { [AesMode.GCM]: 'GCM (Auth)', [AesMode.CBC]: 'CBC', [AesMode.CTR]: 'CTR', [AesMode.ECB]: 'ECB (Insecure)' },
      aesKey: { [AesKeyLength.L128]: '128-bit', [AesKeyLength.L192]: '192-bit', [AesKeyLength.L256]: '256-bit' },
      sha3: { [Sha3Length.L224]: '224', [Sha3Length.L256]: '256', [Sha3Length.L384]: '384', [Sha3Length.L512]: '512' },
      cmac: { [CmacKeyLength.L128]: '128-bit', [CmacKeyLength.L256]: '256-bit' },
      ecc: { [EccCurve.P256]: 'P-256', [EccCurve.P384]: 'P-384', [EccCurve.P521]: 'P-521' },
      dh: { [DhGroup.TOY]: 'Toy (Edu)', [DhGroup.MODP_14]: '2048-bit (Secure)' },
      rsa: { [RsaModulusLength.L2048]: '2048-bit', [RsaModulusLength.L4096]: '4096-bit' },
      legacy: { [LegacyKeyMode.DES56]: '56-bit', [LegacyKeyMode.TDES112]: '112-bit (2-Key)', [LegacyKeyMode.TDES168]: '168-bit (3-Key)' }
    },
    algoDetails: {
        CAESAR: {
            theory: "HISTORY:\nNamed after Julius Caesar (c. 100-44 BC), who used it for secret military correspondence. Suetonius reports that Caesar shifted letters by 3 positions.\n\nMATHEMATICAL ANALYSIS:\nIt is a monoalphabetic substitution cipher based on modular arithmetic. Given an alphabet size $N=26$, the encryption function is $E_k(x) = (x + k) \\pmod{N}$, where $x$ is the letter position and $k$ is the key.\n\nCRYPTANALYSIS:\nThe system is extremely weak by modern standards. The key space is only $N-1 = 25$ possible keys, making a *Brute Force* attack trivial. Furthermore, it preserves the statistical distribution of letters, making it vulnerable to frequency analysis.",
            guide: "Use the slider to select the key $k$ (shift). Observe how 'A' becomes the letter shifted by $k$ positions."
        },
        VIGENERE: {
            theory: "HISTORY:\nDescribed by Giovan Battista Bellaso in 1553, but mistakenly attributed to Blaise de Vigenère in the 19th century. For centuries it was considered 'le chiffre indéchiffrable' (the indecipherable cipher).\n\nMATHEMATICAL ANALYSIS:\nIt is a polyalphabetic cipher that applies a series of Caesar ciphers based on the letters of a keyword. Mathematically: $E_K(P_i) = (P_i + K_{i \\pmod m}) \\pmod{26}$, where $m$ is the key length.\n\nCRYPTANALYSIS:\nSecurity depends on key length. Friedrich Kasiski published the first general method to decipher it in 1863, based on finding repeated sequences in ciphertext to deduce key length and then applying frequency analysis.",
            guide: "Enter a keyword (e.g., 'LIME'). The system will repeat the key to cover the full message length."
        },
        PLAYFAIR: {
            theory: "HISTORY:\nInvented by Charles Wheatstone in 1854 but promoted by Lord Playfair. It was the first practical digraph cipher, used by Great Britain until WWII.\n\nMECHANISM:\nThe text is divided into pairs of letters (digraphs). Encryption occurs via a 5x5 matrix built from the key. Substitution rules (rectangle, row, column) operate spatially on the matrix.\n\nCRYPTANALYSIS:\nBy substituting pairs instead of single letters, Playfair flattens frequency distribution (there are $26 \\times 26 = 676$ possible digraphs). However, it leaves statistical traces analyzable with sufficiently long texts.",
            guide: "'J' is merged with 'I'. Double letters (e.g., 'LL') are separated by an 'X'."
        },
        MONOALPHABETIC: {
            theory: "DEFINITION:\nA general monoalphabetic substitution cipher maps the plaintext alphabet to an arbitrary permutation of the ciphertext alphabet.\n\nKEY SPACE:\nThe key space is factorial: $26! \\approx 4 \\times 10^{26}$. A huge number that makes manual brute force impractical.\n\nCRYPTANALYSIS:\nDespite the huge number of keys, the cipher is insecure because it keeps the frequency distribution of the original language identical. The letter 'E' in ciphertext will appear with the same frequency as 'E' in the source language (~12% in English).",
            guide: "Enter a key string. The system generates a permuted alphabet based on unique key characters followed by remaining letters."
        },
        AES: {
            theory: "STANDARD:\nThe Advanced Encryption Standard (AES) was established by NIST in 2001 (FIPS 197) after an international competition won by the Rijndael algorithm (designed by Belgians Daemen and Rijmen).\n\nMATHEMATICS:\nAES does not use a Feistel network (like DES), but a *Substitution-Permutation Network* (SPN). Opera su blocchi di 128 bit rappresentati come matrici $4 \\times 4$ byte matrices. Operations occur in the Galois Finite Field $GF(2^8)$.\n\nROUND PHASES:\n1. **SubBytes**: Non-linear substitution via S-Box.\n2. **ShiftRows**: Row permutation.\n3. **MixColumns**: Linear column mixing (diffusion).\n4. **AddRoundKey**: XOR with round key.",
            guide: "GCM (Galois/Counter Mode) is recommended as it provides authenticated encryption (AEAD), ensuring both confidentiality and integrity."
        },
        DES: {
            theory: "HISTORY:\nThe Data Encryption Standard (DES) was the dominant standard from the 70s until AES. Based on IBM's Lucifer algorithm.\n\nWEAKNESS:\nIts main weakness is key length: 56 bits. This results in a key space of $2^{56} \\approx 7.2 \\times 10^{16}$, which today can be exhaustively explored (brute force) in hours using specialized hardware or GPUs.\n\nSTRUCTURE:\nUses a 16-round Feistel network, which has the advantage of making encryption and decryption operations almost identical.",
            guide: "Obsolete and insecure algorithm. Present only for educational purposes."
        },
        TRIPLE_DES: {
            theory: "DEFINITION:\nTriple DES (3DES or TDEA) applies the DES algorithm three times to each data block to increase effective security.\n\nMODES:\nStandard configuration is EDE (Encrypt-Decrypt-Encrypt) with three different keys ($K1, K2, K3$) or two ($K1, K3=K1, K2$).\n\nSECURITY:\nWhile offering theoretical security of 112 bits (keying option 2) or 168 bits, it is very slow in software and vulnerable to *Sweet32* attack (collision on 64-bit blocks). NIST officially deprecated it for new applications after 2023.",
            guide: "More secure than single DES, but slow. Migration to AES is advised."
        },
        RC4: {
            theory: "HISTORY:\nRivest Cipher 4 (RC4) is a stream cipher designed by Ron Rivest in 1987. For years it was the most widely used cipher globally (WEP, WPA, TLS).\n\nOPERATION:\nUses an internal state array of 256 bytes $S$ and two indices $i, j$. The Key Scheduling Algorithm (KSA) initializes state, and Pseudo-Random Generation Algorithm (PRGA) produces keystream XORed with text.\n\nVULNERABILITY:\nRC4 suffers from severe statistical biases, especially in early keystream bytes (Fluhrer-Mantin-Shamir bias). These weaknesses led to WEP compromise and its removal from TLS (RFC 7465).",
            guide: "Enter a key. Note output length equals input length (stream cipher characteristic)."
        },
        CHACHA20: {
            theory: "MODERNITY:\nChaCha20 is a stream cipher developed by Daniel J. Bernstein in 2008. Adopted by Google and TLS 1.3 standard as an alternative to AES, especially on mobile devices without AES-NI hardware acceleration.\n\nARCHITECTURE:\nBases security on 32-bit ARX (Add-Rotate-Xor) operations, extremely fast on general-purpose CPUs. Unlike RC4, it offers very high diffusion and cryptanalysis resistance.\n\nPOLY1305:\nOften paired with Poly1305 (a one-time MAC) to provide authenticated encryption (AEAD), ensuring ciphertext has not been tampered with.",
            guide: "State-of-the-art for mobile and web encryption."
        },
        RSA: {
            theory: "FOUNDATIONS:\nRSA (Rivest-Shamir-Adleman, 1977) is the first and most widespread public-key cryptosystem. Its security relies on the computational difficulty of the **integer factorization problem**.\n\nMATHEMATICS:\nTwo large primes $p$ and $q$ are generated. Modulus $n = p \\times q$ is calculated. Security derives from the fact that, given $n$, it is computationally intractable to derive $p$ and $q$ if they are sufficiently large (e.g., 2048 bits).\n\nTRAPDOOR:\nRSA uses a trapdoor function based on modular exponentiation. Encryption: $c = m^e \\pmod n$. Decryption: $m = c^d \\pmod n$, where $d$ is multiplicative inverse of $e$ modulo $\\phi(n)$.",
            guide: "Keys generated are real 2048-bit keys. Operation might take a moment in browser."
        },
        DIFFIE_HELLMAN: {
            theory: "REVOLUTION:\nDiffie-Hellman protocol (1976) introduced public-key cryptography. It's not for encrypting messages, but to **agree on a secret key** over an insecure channel.\n\nPRINCIPLE:\nSecurity is based on **Discrete Logarithm Problem** in a finite cyclic group. Given generator $g$ and prime $p$, if Alice sends $A = g^a \\pmod p$, it is hard for an attacker to find secret exponent $a$, even knowing $g, p$ and $A$.\n\nAPPLICATIONS:\nBasis of protocols like IKE (IPsec), SSH, and early SSL/TLS versions.",
            guide: "Simulate exchange between Alice and Bob. Both will calculate same 'Shared Secret' without ever transmitting it."
        },
        ECC: {
            theory: "EFFICIENCY:\nElliptic Curve Cryptography (ECC) offers RSA-equivalent security with much shorter keys. A 256-bit ECC key offers security comparable to a 3072-bit RSA key.\n\nMATHEMATICS:\nBased on algebraic structure of elliptic curves over finite fields. 'Scalar multiplication' on curve is the one-way function: given base point $G$ and point $P = kG$, it's hard to find scalar $k$ (elliptic curve discrete logarithm problem).\n\nUSAGE:\nDe-facto standard for modern comms (ECDH for key exchange, ECDSA for signatures), used in Bitcoin, WhatsApp, TLS.",
            guide: "ECDH simulation. Note how public keys (X,Y coords) are much more compact than RSA blocks."
        },
        MD5: { theory: "DEPRECATED:\nMD5 (Message-Digest algorithm 5) produces 128-bit hash. Developed in 1991, now considered **cryptographically broken**.\n\nCOLLISIONS:\nIn 2004 it was shown possible to generate collisions (two different files with same hash) very quickly. Must never be used for digital signatures or SSL certificates, but persists for non-critical integrity checks.", guide: "Fixed 32 hex char output (128-bit)." },
        SHA1: { theory: "DEPRECATED:\nSHA-1 produces 160-bit digest. Designed by NSA, was standard for years.\n\nSHATTERED:\nIn 2017, Google announced 'SHAttered' attack, generating first practical SHA-1 collision. Since retired from browsers and CAs. No longer secure for digital signatures.", guide: "Fixed 40 hex char output (160-bit)." },
        SHA256: { theory: "CURRENT STANDARD:\nBelongs to SHA-2 family (Secure Hash Algorithm 2), designed by NSA. Produces 256-bit digest.\n\nSECURITY:\nCurrently no known practical attacks compromise collision resistance. Widely used in TLS, Bitcoin, HMAC. Structure based on Merkle-Damgård construction.", guide: "64 hex char output. Industrial standard." },
        SHA512: { theory: "HIGH SECURITY:\nSHA-2 variant operating on 64-bit words (optimized for 64-bit CPUs) and producing 512-bit output.\n\nROBUSTNESS:\nOffers higher security margin against future attacks (e.g., quantum computers) and length extension attacks compared to SHA-256.", guide: "Very long digest (128 hex chars)." },
        SHA3: { theory: "NEXT-GEN:\nSHA-3 (Keccak) selected by NIST in 2012. Unlike SHA-2 (Merkle-Damgård), uses **Sponge** construction.\n\nINDEPENDENCE:\nBeing structurally different from SHA-2, offers secure alternative should vulnerabilities be found in SHA-2 family. Versatile, can be used as stream cipher or MAC (KMAC).", guide: "Keccak is basis for SHAKE and other modern primitives." },
        BLAKE2: { theory: "PERFORMANCE:\nBLAKE2 is hash optimized for speed, often faster than MD5 but with SHA-3 security. Born as evolution of SHA-3 finalist BLAKE.\n\nUSAGE:\nPopular in modern software (WireGuard, IPFS, Argon2) where general-purpose CPU performance is critical.", guide: "BLAKE2b optimized for 64-bit systems." },
        BLAKE3: { theory: "PARALLELISM:\nBLAKE3 is 2020 evolution. Uses internal **Merkle Tree** allowing hash calculation parallelization across all CPU cores (SIMD).\n\nSPEED:\nExtremely fast, capable of processing GB/s, maintaining 128-bit security against collisions, pre-images, and extension attacks.", guide: "Fastest hash in this suite." },
        HMAC: { theory: "AUTHENTICATION:\nHMAC (Hash-based Message Authentication Code) is a specific construction to calculate a MAC using a cryptographic hash function with a secret key.\n\nRFC 2104:\nDefined as $H(K' \\oplus opad || H(K' \\oplus ipad || message))$. Double hash execution protects against *Length Extension* attacks affecting pure Merkle-Damgård hashes (like SHA-256) if used naively as $H(k || m)$.", guide: "Requires secret key. Verifies message hasn't been altered and comes from key holder." },
        CMAC: { theory: "BLOCK-CIPHER MAC:\nCMAC (Cipher-based MAC) calculates authentication code using a symmetric block cipher (like AES).\n\nSECURITY:\nResolves deficiencies of old CBC-MAC standard, securely handling variable length messages. Widely used in network protocols and smart cards where AES hardware is available but Hash engine is not.", guide: "Uses AES as underlying primitive." }
    }
  }
};