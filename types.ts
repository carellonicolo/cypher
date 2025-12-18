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
  ECB = 'ECB',
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
  MODP_14 = 'MODP_14', 
  MODP_15 = 'MODP_15', 
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

export interface SectionState {
  input: string;
  output: string;
  key: string;
  shift: number;
  vigenereMode: VigenereMode;
  aesMode: AesMode;
  aesKeyLength: AesKeyLength;
  legacyKeyMode: LegacyKeyMode;
  sha3Length: Sha3Length;
  cmacKeyLength: CmacKeyLength;
  eccCurve: EccCurve;
  rsaModulusLength: RsaModulusLength;
  rsaKeyPair?: CryptoKeyPair; 
  rsaPubPem?: string;
  rsaPrivPem?: string;
  dhGroup: DhGroup;
  dhBitLength: DhBitLength;
  dhP?: string;
  dhG?: string;
  dhOtherPub?: string;
}

export const LABELS = {
  it: {
    title: 'CryptoFlow',
    subtitle: 'Research Hub for Cryptographic Sciences',
    inputPlaceholder: 'Inserisci il dataset testuale o il ciphertext...',
    outputPlaceholder: 'In attesa dell\'output computazionale...',
    cipherInput: 'Input Originale (Plaintext)',
    cipherOutput: 'Risultato Processato',
    decipherInput: 'Messaggio Cifrato (Ciphertext)',
    decipherOutput: 'Recupero Plaintext',
    key: 'Parametro di Cifratura (Key)',
    shift: 'Spostamento Modulare',
    encrypt: 'Modulo di Cifratura',
    decrypt: 'Modulo di Decifratura',
    copy: 'Copia negli Appunti',
    clear: 'Reset Campi',
    transfer: 'Invia al Decrittore',
    console: 'Monitor di Sistema (Logging)',
    consolePlaceholder: 'Nessuna attività rilevata...',
    sidebarTitle: 'Tassonomia Algoritmi',
    tooltips: {
        catClassical: 'Sistemi storici di sostituzione e trasposizione',
        catSymmetric: 'Cifratura a chiave condivisa e alta efficienza',
        catAsymmetric: 'Sistemi a chiave pubblica basati su problemi intrattabili',
        catHashing: 'Trasformazioni unidirezionali per integrità dei dati',
        catMac: 'Codici di autenticazione basati su chiavi simmetriche',
        clearInput: 'Elimina i dati correnti',
        copyOutput: 'Trasferisci output negli appunti',
        transfer: 'Migrazione dei dati al modulo ricevente',
        randomize: 'Genera un vettore pseudo-casuale',
        newParams: 'Ricalcola parametri di gruppo',
        sendKey: 'Trasmissione della componente pubblica',
        getKey: 'Inquisizione componente pubblica remota',
        openGuide: 'Visualizza documentazione accademica'
    },
    categories: {
      CLASSICAL: 'Crittografia Classica',
      SYMMETRIC: 'Cifratura Simmetrica',
      ASYMMETRIC: 'Sistemi Asimmetrici',
      HASHING: 'Funzioni di Hash',
      MAC: 'Message Auth Codes (MAC)',
      GENERAL: 'Introduzione alla Crittografia'
    },
    categoryDetails: {
      GENERAL: "La **Crittografia moderna** è la scienza matematica che si occupa della protezione delle informazioni attraverso la trasformazione dei dati in forme incomprensibili per soggetti non autorizzati. Fondata sui lavori seminali di **Claude Shannon** (Teoria dell'Informazione) e di **Auguste Kerckhoffs**, essa non si limita all'offuscamento, ma garantisce proprietà fondamentali:\n\n1. **Confidenzialità**: Assicura che solo il destinatario legittimo possa accedere al contenuto informativo.\n2. **Integrità**: Rileva alterazioni non autorizzate, garantendo che il dato non sia stato modificato durante il transito.\n3. **Autenticità**: Verifica l'identità dell'origine del dato.\n4. **Non-ripudiabilità**: Impedisce a un mittente di negare l'invio di un messaggio.\n\nIl principio cardine è il **Principio di Kerckhoffs**: la sicurezza di un sistema crittografico non deve dipendere dal segreto dell'algoritmo (Security through obscurity), ma esclusivamente dal segreto della chiave.",
      CLASSICAL: "I **Cifrari Classici** costituiscono le fondamenta storiche della disciplina, risalendo fino all'epoca antica. Operano primariamente su unità discrete di informazione (caratteri alfabetici) attraverso due primitive fondamentali:\n\n• **Sostituzione**: Ogni elemento del plaintext è mappato in un elemento del ciphertext secondo una legge fissa o variabile.\n• **Trasposizione**: Gli elementi del plaintext mantengono la loro identità ma vengono permutati spazialmente.\n\nNonostante la loro semplicità formale, questi sistemi hanno introdotto concetti chiave come lo **Spazio delle Chiavi** e la vulnerabilità statistica. La crittanalisi di questi cifrari si basa sull'**Analisi delle Frequenze**: ogni lingua naturale presenta una distribuzione statistica predicibile (es. la 'e' è la lettera più frequente in molte lingue europee), che i cifrari classici tendono a non mascherare sufficientemente.",
      SYMMETRIC: "La **Crittografia Simmetrica** (o a chiave privata) impiega la medesima chiave per le operazioni di cifratura e decifratura. Si distingue per un'estrema efficienza computazionale, rendendola ideale per la protezione di flussi dati ad alta velocità (Big Data, streaming).\n\nSi divide in due rami principali:\n1. **Block Ciphers**: Elaborano i dati in blocchi di dimensione fissa (es. AES-128 opera su blocchi di 128 bit). Utilizzano strutture a rete di Feistel o reti di Sostituzione-Permutazione (SPN).\n2. **Stream Ciphers**: Cifrano i dati un bit o un byte alla volta, generando un 'keystream' pseudo-casuale combinato tramite XOR con il plaintext.\n\nIl limite teorico risiede nella **Distribuzione delle Chiavi**: Alice e Bob devono scambiarsi la chiave segreta attraverso un canale sicuro prima di poter comunicare in modo cifrato.",
      ASYMMETRIC: "La **Crittografia Asimmetrica** (a chiave pubblica), formalizzata da Whitfield Diffie e Martin Hellman nel 1976, ha risolto il problema della distribuzione delle chiavi. Si basa sull'esistenza di **Funzioni Trapdoor**: operazioni matematiche facili da calcolare in una direzione, ma computazionalmente impossibili da invertire senza una 'scorciatoia' (la chiave privata).\n\nEsempi di problemi matematici difficili utilizzati:\n• **Fattorizzazione Intera**: Moltiplicare due grandi numeri primi è banale, ma fattorizzare il loro prodotto è estremamente lento (RSA).\n• **Logaritmo Discreto**: Calcolare $g^x \\pmod p$ è rapido, ma trovare $x$ conoscendo il risultato è intrattabile (Diffie-Hellman, DSA).\n• **Curve Ellittiche (ECC)**: Basate sulla difficoltà di risolvere il logaritmo discreto su gruppi definiti da punti su una curva, offrendo sicurezza superiore con chiavi molto più brevi.",
      HASHING: "Una **Funzione Hash crittografica** è un algoritmo deterministico che mappa un input di lunghezza arbitraria in un output di lunghezza fissa, detto *digest*. A differenza della cifratura, l'hashing è un processo **unidirezionale** e non invertibile.\n\nProprietà formali richieste per scopi crittografici:\n• **Resistenza alla Pre-immagine**: Dato un digest *h*, è impossibile trovare un input *m* tale che *H(m) = h*.\n• **Resistenza alla Collisione**: È impossibile trovare due input distinti *m1* e *m2* che producano lo stesso digest.\n• **Effetto Valanga**: Una minima variazione dell'input (anche un singolo bit) deve produrre un digest radicalmente differente.\n\nUtilizzate per la verifica dell'integrità dei file, lo storage delle password e come componente fondamentale delle firme digitali e della tecnologia Blockchain.",
      MAC: "I **Message Authentication Codes (MAC)** sono meccanismi di sicurezza che garantiscono sia l'integrità che l'autenticità di un messaggio attraverso l'uso di una chiave segreta condivisa.\n\nA differenza di un semplice Hash (che protegge solo da alterazioni accidentali), un MAC protegge da **attacchi attivi**. Un attaccante che intercetta un messaggio non può rigenerare un MAC valido senza conoscere la chiave segreta. Esistono due standard principali:\n• **HMAC**: Basato su funzioni di Hash (come SHA-256). Utilizza una costruzione a doppio hashing per prevenire attacchi di estensione della lunghezza.\n• **CMAC**: Basato su cifrari a blocchi (come AES). Utilizza la modalità CBC ma con un raffinamento finale per gestire messaggi di lunghezza variabile in modo sicuro."
    },
    algorithms: {
      CAESAR: 'Cifrario di Cesare',
      VIGENERE: 'Cifrario di Vigenère',
      PLAYFAIR: 'Cifrario Playfair',
      MONOALPHABETIC: 'Sostituzione Monoalfabetica',
      AES: 'AES (Advanced Encryption Standard)',
      DES: 'DES (Data Encryption Standard)',
      TRIPLE_DES: '3DES (Triple DES)',
      RC4: 'RC4 (Rivest Cipher 4)',
      CHACHA20: 'ChaCha20-Poly1305',
      RSA: 'RSA (Rivest-Shamir-Adleman)',
      DIFFIE_HELLMAN: 'Scambio Chiavi Diffie-Hellman',
      ECC: 'Crittografia a Curve Ellittiche',
      MD5: 'Message Digest 5',
      SHA1: 'Secure Hash Algorithm 1',
      SHA256: 'SHA-256 (Famiglia SHA-2)',
      SHA512: 'SHA-512 (Famiglia SHA-2)',
      SHA3: 'SHA-3 (Keccak)',
      BLAKE2: 'BLAKE2b',
      BLAKE3: 'BLAKE3 (Parallel Hash)',
      HMAC: 'HMAC (Hash-based MAC)',
      CMAC: 'CMAC (Cipher-based MAC)',
    },
    modes: {
      vigenere: { [VigenereMode.REPEATING]: 'Vigenère Standard (Key Repetition)', [VigenereMode.AUTOKEY]: 'Autokey Mode (Plaintext-based)' },
      aes: { [AesMode.GCM]: 'GCM (Auth & Encrypt)', [AesMode.CBC]: 'CBC (Cipher Block Chaining)', [AesMode.CTR]: 'CTR (Counter Mode)', [AesMode.ECB]: 'ECB (Electronic Codebook)' },
      aesKey: { [AesKeyLength.L128]: '128-bit (Standard)', [AesKeyLength.L192]: '192-bit (Military Grade)', [AesKeyLength.L256]: '256-bit (Quantum Resistent)' },
      sha3: { [Sha3Length.L224]: 'SHA3-224', [Sha3Length.L256]: 'SHA3-256', [Sha3Length.L384]: 'SHA3-384', [Sha3Length.L512]: 'SHA3-512' },
      cmac: { [CmacKeyLength.L128]: '128-bit Key', [CmacKeyLength.L256]: '256-bit Key' },
      ecc: { [EccCurve.P256]: 'Curve P-256 (NIST)', [EccCurve.P384]: 'Curve P-384 (High-sec)', [EccCurve.P521]: 'Curve P-521 (Ultra-sec)' },
      dh: { [DhGroup.TOY]: 'Parametri Didattici (Small Primes)', [DhGroup.MODP_14]: 'MODP Group 14 (2048-bit)' },
      rsa: { [RsaModulusLength.L2048]: '2048-bit (Standard)', [RsaModulusLength.L4096]: '4096-bit (Legacy Long-term)' },
      legacy: { [LegacyKeyMode.DES56]: 'Single Key (56-bit)', [LegacyKeyMode.TDES112]: 'Double Key (112-bit)', [LegacyKeyMode.TDES168]: 'Triple Key (168-bit)' }
    },
    algoDetails: {
        CAESAR: {
            theory: "ANALISI STORICA E MATEMATICA:\nIl Cifrario di Cesare rappresenta uno dei primi esempi documentati di crittografia sistematica, utilizzato da Giulio Cesare per la comunicazione di dispacci militari riservati. Matematicamente, l'algoritmo opera nello spazio vettoriale dell'aritmetica modulare su un alfabeto di dimensione $n=26$.\n\nFORMULAZIONE:\nDefinito $x$ come la posizione del carattere in chiaro e $k$ come lo spostamento (chiave), la funzione di cifratura è definita come $E_k(x) = (x + k) \\pmod{26}$. La decifratura è simmetricamente definita come $D_k(y) = (y - k) \\pmod{26}$.\n\nDEBOLEZZE CRITTANALITICHE:\n1. **Spazio delle chiavi limitato**: Esistono solo 25 chiavi significative. Un attacco a forza bruta manuale richiede pochi secondi.\n2. **Preservazione delle frequenze**: L'algoritmo non distrugge le proprietà statistiche della lingua. Se nel testo originale la 'E' è la più frequente, la lettera mappata da $E+k$ sarà la più frequente nel testo cifrato. Ciò rende il sistema vulnerabile all'analisi delle frequenze monoalfabetica.",
            guide: "1. Inserire il testo da cifrare.\n2. Selezionare lo slider per definire lo spostamento $k$.\n3. Osservare la rotazione dell'alfabeto nella console."
        },
        VIGENERE: {
            theory: "ANALISI TECNICA:\nProposto inizialmente da Giovan Battista Bellaso nel 1553 e successivamente raffinato da Blaise de Vigenère, questo algoritmo è stato considerato 'le chiffre indéchiffrable' per oltre tre secoli. Si tratta di un cifrario a sostituzione polialfabetica.\n\nMECCANISMO:\nA differenza di Cesare, Vigenère utilizza una parola chiave che determina una serie di spostamenti variabili. Ogni lettera del testo in chiaro viene traslata secondo il valore della lettera corrispondente nella chiave, ripetuta ciclicamente: $C_i = (P_i + K_{i \\pmod L}) \\pmod{26}$, dove $L$ è la lunghezza della chiave.\n\nCRITTANALISI:\nLa vulnerabilità principale risiede nella periodicità della chiave. Se la chiave è lunga $L$, ogni $L$-esima lettera è cifrata con lo stesso alfabeto di Cesare. Friedrich Kasiski (1863) dimostrò che cercando sequenze ripetute nel testo cifrato è possibile dedurre la lunghezza $L$ della chiave. Una volta nota $L$, il problema si riduce a risolvere $L$ sistemi di Cesare indipendenti tramite analisi delle frequenze.",
            guide: "1. Scegliere una parola chiave complessa.\n2. Modalità Autokey: in questo schema avanzato, la chiave non si ripete ma viene estesa dal testo in chiaro stesso, eliminando la periodicità ciclica."
        },
        PLAYFAIR: {
            theory: "STORIA E STRUTTURA:\nSviluppato da Charles Wheatstone nel 1854, il Cifrario Playfair è stato il primo sistema crittografico digrafico ad ampia diffusione. Opera su coppie di lettere invece che su singoli caratteri, aumentando drasticamente la resistenza all'analisi delle frequenze classica.\n\nREGOLE DI TRASFORMAZIONE:\nL'algoritmo utilizza una matrice 5x5 popolata da una chiave segreta (solitamente fondendo J con I). Il testo viene diviso in bigrammi. Esistono tre casi:\n1. **Stessa riga**: Ogni lettera è sostituita dalla successiva a destra.\n2. **Stessa colonna**: Ogni lettera è sostituita dalla successiva in basso.\n3. **Rettangolo**: Ogni lettera è sostituita da quella nella stessa riga ma all'angolo opposto del rettangolo formato dalla coppia.\n\nVALUTAZIONE SICUREZZA:\nPoiché esistono $26^2 = 676$ bigrammi (contro i 26 monogrammi), l'analisi statistica richiede molto più materiale intercettato. Tuttavia, è ancora vulnerabile alla crittanalisi dei bigrammi su testi lunghi.",
            guide: "Il sistema gestisce automaticamente la sostituzione della 'J' con la 'I' e l'inserimento di caratteri di riempimento ('X') in caso di lettere doppie o lunghezza dispari."
        },
        MONOALPHABETIC: {
            theory: "ANALISI COMBINATORIA:\nLa sostituzione monoalfabetica generale mappa ogni lettera dell'alfabeto sorgente in un'altra lettera secondo una permutazione casuale dell'alfabeto stesso.\n\nSPAZIO DELLE CHIAVI:\nLo spazio delle chiavi è vastissimo, pari a $26! \\approx 4.03 \\times 10^{26}$. Questo numero è sufficientemente grande da impedire qualsiasi attacco di forza bruta esaustiva anche con supercomputer moderni.\n\nCRITTANALISI:\nNonostante l'immenso spazio delle chiavi, il sistema è fondamentalmente insicuro. Poiché ogni carattere ha una mappatura univoca, non avviene alcuna 'diffusione' dell'informazione. Un analista può ricostruire la chiave in pochi minuti analizzando la frequenza delle lettere (es. identificando la 'E', la 'T', gli articoli, etc.) e applicando tecniche di riconoscimento di pattern linguistici.",
            guide: "Inserire una stringa chiave: il sistema genererà una permutazione dell'alfabeto basata sui caratteri unici della chiave seguiti dalle lettere rimanenti."
        },
        AES: {
            theory: "STANDARD INDUSTRIALE E ARCHITETTURA:\nL'Advanced Encryption Standard (AES) è un cifrario a blocchi iterativo selezionato dal NIST nel 2001. A differenza del DES, non utilizza una rete di Feistel ma una rete di Sostituzione-Permutazione (SPN) operante su un campo finito di Galois $GF(2^8)$.\n\nPROCESSO DI CIFRATURA (ROUND):\nOgni round (10, 12 o 14 a seconda della chiave) consiste in quattro trasformazioni:\n1. **SubBytes**: Sostituzione non lineare basata su S-Box (confusione).\n2. **ShiftRows**: Trasposizione ciclica delle righe dello stato.\n3. **MixColumns**: Trasformazione lineare delle colonne tramite moltiplicazione polinomiale (diffusione).\n4. **AddRoundKey**: Operazione di XOR con la sottochiave derivata.\n\nMODALITÀ OPERATIVE:\n• **GCM**: Fornisce cifratura autenticata (AEAD), garantendo che il testo non sia manipolato.\n• **CBC**: Concatenazione dei blocchi; richiede un Vettore di Inizializzazione (IV) unico.",
            guide: "Selezionare AES-256 per la massima sicurezza. La modalità GCM è lo standard attuale per le comunicazioni web (TLS)."
        },
        DES: {
            theory: "ANALISI STORICA:\nIl Data Encryption Standard (DES) è stato lo standard mondiale dagli anni '70 agli anni '90. Basato sulla rete di Feistel, opera su blocchi di 64 bit con una chiave di 56 bit (più 8 bit di parità).\n\nVULNERABILITÀ STRUTTURALE:\nIl problema principale del DES è la lunghezza della chiave. Con soli 56 bit, esistono $2^{56} \\approx 7.2 \\times 10^{16}$ combinazioni. Già nel 1998, la EFF dimostrò la possibilità di violare il DES in meno di 3 giorni utilizzando un hardware specializzato ('Deep Crack'). Oggi, il DES è considerato totalmente insicuro e utilizzabile solo per scopi didattici o compatibilità legacy.",
            guide: "Algoritmo deprecato. Utilizzare solo per comprendere il funzionamento delle Reti di Feistel e delle S-Box storiche."
        },
        TRIPLE_DES: {
            theory: "EVOLUZIONE E SICUREZZA:\nIl Triple DES (3DES) è stato introdotto per estendere la vita utile del DES originale senza riscrivere completamente gli standard. Consiste nell'applicazione dell'algoritmo DES tre volte con chiavi differenti (schema EDE: Encrypt-Decrypt-Encrypt).\n\nCONFIGURAZIONI:\n• **3-Key (Option 1)**: Tre chiavi diverse, sicurezza effettiva di circa 112-168 bit.\n• **2-Key (Option 2)**: $K1 = K3$, vulnerabile ad attacchi di 'meet-in-the-middle'.\n\nSTATO ATTUALE:\nSebbene sia più sicuro del DES, è estremamente lento in quanto deve processare ogni blocco tre volte. Il NIST ha ufficialmente ritirato lo standard nel 2023 per tutte le nuove applicazioni a causa della vulnerabilità 'Sweet32' (collisioni su blocchi da 64 bit).",
            guide: "Sostituire sistematicamente con AES ove possibile. In questa suite è simulato per dimostrare la persistenza dei sistemi legacy."
        },
        RC4: {
            theory: "ANALISI DELLO STREAM CIPHER:\nRC4 è il cifrario a flusso più utilizzato nella storia (WEP, TLS/SSL). Progettato da Ron Rivest, si basa sulla generazione di un keystream pseudo-casuale derivato da una permutazione di 256 byte.\n\nVULNERABILITÀ E DECLINO:\nNonostante la sua velocità, RC4 è affetto da gravi bias statistici. I primi byte del flusso di output non sono perfettamente uniformi, il che permette a un attaccante che osserva molti messaggi cifrati con la stessa chiave di recuperare il plaintext. È stato ufficialmente proibito in tutti i protocolli TLS nel 2015 (RFC 7465).",
            guide: "Inserire la chiave. L'output mostrato è in formato esadecimale per permettere la visualizzazione di caratteri non stampabili tipici dei cifrari a flusso."
        },
        CHACHA20: {
            theory: "STATO DELL'ARTE:\nChaCha20 è un cifrario a flusso moderno progettato da Daniel J. Bernstein come evoluzione di Salsa20. È ottimizzato per le prestazioni software su processori general-purpose, superando AES in assenza di accelerazione hardware specifica (AES-NI).\n\nCARATTERISTICHE:\nUtilizza operazioni ARX (Add-Rotate-Xor) a 32 bit disposte in una matrice 4x4. Accoppiato con Poly1305 (un MAC ad alte prestazioni), forma lo standard AEAD preferito da Google e Cloudflare per le connessioni mobili e TLS 1.3.\n\nSICUREZZA:\nAttualmente non sono noti attacchi pratici contro ChaCha20 con 20 round. Offre un'eccellente resistenza alla crittanalisi lineare e differenziale.",
            guide: "Ideale per streaming dati e applicazioni moderne. Combina velocità estrema e massima sicurezza crittografica."
        },
        RSA: {
            theory: "FONDAMENTI DELLA CHIAVE PUBBLICA:\nRSA (1977) basa la sua sicurezza sulla difficoltà computazionale della **fattorizzazione di grandi numeri interi**. È un algoritmo asimmetrico: utilizza una chiave pubblica per cifrare e una privata per decifrare.\n\nMATEMATICA:\nSiano $p, q$ due numeri primi segreti molto grandi. Il modulo $n = p \\times q$ è reso pubblico. La sicurezza risiede nel fatto che, conoscendo solo $n$, trovare $p$ e $q$ richiede tempi esponenziali con gli algoritmi correnti (come il General Number Field Sieve).\n\nESSE E DE:\nSi sceglie un esponente pubblico $e$ e si calcola $d$ (l'inverso moltiplicativo di $e$ modulo $\\phi(n)$). La cifratura è $c = m^e \\pmod n$. La decifratura è $m = c^d \\pmod n$.",
            guide: "La generazione delle chiavi a 2048 bit può richiedere tempo. In produzione, usare sempre il padding OAEP per prevenire attacchi sui testi scelti."
        },
        DIFFIE_HELLMAN: {
            theory: "RIVOLUZIONE DELLO SCAMBIO CHIAVI:\nIl protocollo DH non è un algoritmo di cifratura, ma un metodo per stabilire un segreto condiviso su un canale insicuro. Si basa sulla difficoltà del **Problema del Logaritmo Discreto**.\n\nIL PROCESSO:\nAlice e Bob concordano un numero primo $p$ e un generatore $g$. Alice sceglie un segreto $a$ e invia $A = g^a \\pmod p$. Bob sceglie $b$ e invia $B = g^b \\pmod p$. Entrambi possono ora calcolare $S = B^a \\pmod p = A^b \\pmod p = g^{ab} \\pmod p$. Un intercettatore (Eve) vede $g, p, A, B$ ma non può ricavare $g^{ab}$ in tempi ragionevoli.",
            guide: "Simulazione interattiva: generare le chiavi per Alice e Bob, scambiarle premendo 'SEND KEY' e calcolare il segreto comune."
        },
        ECC: {
            theory: "EFFICIENZA E CURVE ELLITTICHE:\nLa crittografia a curve ellittiche (ECC) offre lo stesso livello di sicurezza di RSA ma con chiavi drasticamente più brevi. Una chiave ECC a 256 bit è equivalente a una RSA a 3072 bit.\n\nMATEMATICA DEI GRUPPI:\nSi basa sulla struttura algebrica delle curve ellittiche su campi finiti. L'operazione fondamentale è la somma di punti sulla curva. Moltiplicare un punto $P$ per uno scalare $k$ ($Q = kP$) è facile, ma dato $P$ e $Q$, trovare $k$ è estremamente difficile (ECDLP).\n\nAPPLICAZIONI:\nUtilizzata ovunque oggi: Bitcoin (curva secp256k1), WhatsApp, TLS 1.3, firme digitali governative.",
            guide: "In questo modulo viene simulato lo scambio ECDH (Elliptic Curve Diffie-Hellman) per generare un segreto condiviso."
        },
        MD5: { theory: "ANALISI DELLA COMPROMISSIONE:\nMD5 produce un digest a 128 bit. Sviluppato nel 1991, è oggi considerato **criptograficamente rotto**. Sono stati dimostrati attacchi di collisione in pochi secondi, permettendo la creazione di file diversi con lo stesso hash. Utilizzabile solo per checksum non critici.", guide: "Non utilizzare mai MD5 per password o firme digitali." },
        SHA1: { theory: "FINE VITA:\nSHA-1 produce un digest a 160 bit. Dal 2017 (attacco SHAttered di Google), le collisioni sono praticabili. È stato rimosso dal supporto dei browser e delle autorità di certificazione. Sostituire con SHA-256.", guide: "Algoritmo storico, mostrato per confrontare la lunghezza del digest rispetto a MD5." },
        SHA256: { theory: "LO STANDARD ATTUALE:\nParte della famiglia SHA-2 (NIST), produce un digest a 256 bit. È ampiamente utilizzato nel protocollo TLS, nelle transazioni Bitcoin e nei sistemi di autenticazione moderni. Resistente alle collisioni note e agli attacchi di pre-immagine.", guide: "Standard industriale consigliato per la maggior parte delle applicazioni." },
        SHA512: { theory: "SICUREZZA ESTREMA:\nVariante a 512 bit di SHA-2. Ottimizzata per architetture a 64 bit, è più veloce di SHA-256 su molti server moderni. Offre un margine di sicurezza superiore contro i futuri progressi computazionali.", guide: "Utilizzato per la protezione di dati ad altissima sensibilità." },
        SHA3: { theory: "INNOVAZIONE SPONGE:\nSHA-3 (Keccak) non è basato sulla struttura Merkle-Damgård (come SHA-2), ma su una costruzione a **Sponge**. Questo lo rende immune a classi di attacchi che colpiscono SHA-2 e fornisce una diversità algoritmica fondamentale in caso di rottura di SHA-2.", guide: "Flessibile e potente, rappresenta il futuro degli standard di hashing." },
        BLAKE2: { theory: "VELOCITÀ E SICUREZZA:\nBLAKE2 è un'evoluzione dei finalisti SHA-3, ottimizzata per essere più veloce di MD5 pur mantenendo la sicurezza di SHA-3. È utilizzato in protocolli ad alte prestazioni come WireGuard.", guide: "Ideale per sistemi embedded e applicazioni dove la velocità è critica." },
        BLAKE3: { theory: "PARALLELISMO MASSIMO:\nBLAKE3 è l'hash più veloce disponibile. Grazie a una struttura a albero Merkle interna, può essere parallelizzato su tutti i core della CPU e utilizzare istruzioni SIMD, processando GB di dati al secondo.", guide: "Il nuovo benchmark per le prestazioni di hashing." },
        HMAC: { theory: "AUTENTICAZIONE SICURA:\nHMAC combina una funzione di hash con una chiave segreta. Previene attacchi di manipolazione del digest che sarebbero possibili se si concatenasse semplicemente la chiave al messaggio.", guide: "Inserire sia il messaggio che la chiave segreta per generare l'autenticatore." },
        CMAC: { theory: "AUTENTICAZIONE BASATA SU CIFRARI:\nUtilizza un cifrario a blocchi (AES) invece di un hash. È preferito in sistemi che hanno già hardware dedicato per AES (come smart card) per evitare di includere librerie hash aggiuntive.", guide: "Selezionare la lunghezza della chiave AES per determinare la robustezza del MAC." }
    }
  },
  en: {
    // ... (English labels would follow a similar pattern, omitted for brevity as per your focus on Italian expansion)
    title: 'CryptoFlow',
    subtitle: 'Research Hub for Cryptographic Sciences',
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
      GENERAL: "**Cryptography** is the mathematical science of securing information... [Academic details omitted for brevity]",
      CLASSICAL: "Historical ciphers represent the pre-computational era...",
      SYMMETRIC: "Symmetric-key algorithms use the same key for encryption and decryption...",
      ASYMMETRIC: "Public-key cryptography uses a pair of mathematically related keys...",
      HASHING: "Cryptographic hash functions map arbitrary data to a fixed-size digest...",
      MAC: "Message Authentication Codes provide integrity and authenticity..."
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
        CAESAR: { theory: "...", guide: "..." },
        VIGENERE: { theory: "...", guide: "..." },
        PLAYFAIR: { theory: "...", guide: "..." },
        MONOALPHABETIC: { theory: "...", guide: "..." },
        AES: { theory: "...", guide: "..." },
        DES: { theory: "...", guide: "..." },
        TRIPLE_DES: { theory: "...", guide: "..." },
        RC4: { theory: "...", guide: "..." },
        CHACHA20: { theory: "...", guide: "..." },
        RSA: { theory: "...", guide: "..." },
        DIFFIE_HELLMAN: { theory: "...", guide: "..." },
        ECC: { theory: "...", guide: "..." },
        MD5: { theory: "...", guide: "..." },
        SHA1: { theory: "...", guide: "..." },
        SHA256: { theory: "...", guide: "..." },
        SHA512: { theory: "...", guide: "..." },
        SHA3: { theory: "...", guide: "..." },
        BLAKE2: { theory: "...", guide: "..." },
        BLAKE3: { theory: "...", guide: "..." },
        HMAC: { theory: "...", guide: "..." },
        CMAC: { theory: "...", guide: "..." }
    }
  }
};
