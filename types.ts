
export type Language = 'it' | 'en';
export type Theme = 'light' | 'dark';

export enum AlgorithmType {
  // Classical
  CAESAR = 'CAESAR',
  VIGENERE = 'VIGENERE',
  PLAYFAIR = 'PLAYFAIR',
  MONOALPHABETIC = 'MONOALPHABETIC',
  
  // Symmetric
  AES = 'AES',
  DES = 'DES',      // Simulation
  TRIPLE_DES = 'TRIPLE_DES', // Simulation
  
  // Asymmetric
  RSA = 'RSA',
  DIFFIE_HELLMAN = 'DIFFIE_HELLMAN',
  
  // Hashing
  MD5 = 'MD5',
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
  SHA3 = 'SHA3',
}

export enum AlgorithmCategory {
  CLASSICAL = 'CLASSICAL',
  SYMMETRIC = 'SYMMETRIC',
  ASYMMETRIC = 'ASYMMETRIC',
  HASHING = 'HASHING'
}

export const ALGO_CATEGORIES: Record<AlgorithmType, AlgorithmCategory> = {
  [AlgorithmType.CAESAR]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.VIGENERE]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.PLAYFAIR]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.MONOALPHABETIC]: AlgorithmCategory.CLASSICAL,
  [AlgorithmType.AES]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.DES]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.TRIPLE_DES]: AlgorithmCategory.SYMMETRIC,
  [AlgorithmType.RSA]: AlgorithmCategory.ASYMMETRIC,
  [AlgorithmType.DIFFIE_HELLMAN]: AlgorithmCategory.ASYMMETRIC,
  [AlgorithmType.MD5]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA1]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA256]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA512]: AlgorithmCategory.HASHING,
  [AlgorithmType.SHA3]: AlgorithmCategory.HASHING,
};

export enum VigenereMode {
  REPEATING = 'REPEATING',
  AUTOKEY = 'AUTOKEY',
}

export enum AesMode {
  GCM = 'GCM',
  CBC = 'CBC',
  CTR = 'CTR',
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
  legacyKeyMode: LegacyKeyMode;
  sha3Length: Sha3Length;
  // RSA specific
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
    tooltips: {
        catClassical: 'Algoritmi storici basati su sostituzione',
        catSymmetric: 'Chiave singola per cifrare e decifrare',
        catAsymmetric: 'Coppia di chiavi (Pubblica/Privata)',
        catHashing: 'Impronte digitali irreversibili',
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
      HASHING: 'Hashing',
    },
    algorithms: {
      CAESAR: 'Cifrario di Cesare',
      VIGENERE: 'Cifrario di Vigenère',
      PLAYFAIR: 'Cifrario Playfair',
      MONOALPHABETIC: 'Sostituzione Mono',
      AES: 'AES (Moderno)',
      DES: 'DES (Legacy Sim)',
      TRIPLE_DES: '3DES (Legacy Sim)',
      RSA: 'RSA (Public Key)',
      DIFFIE_HELLMAN: 'Diffie-Hellman',
      MD5: 'MD5',
      SHA1: 'SHA-1',
      SHA256: 'SHA-256',
      SHA512: 'SHA-512',
      SHA3: 'SHA-3 (Keccak)',
    },
    descriptions: {
      CAESAR: 'Sostituzione semplice con spostamento fisso.',
      VIGENERE: 'Polialfabetico con parola chiave.',
      PLAYFAIR: 'Cifra coppie di lettere usando una griglia 5x5.',
      MONOALPHABETIC: 'Sostituisce ogni lettera con un\'altra mappatura fissa.',
      AES: 'Standard avanzato (128/256 bit). Sicuro e veloce.',
      DES: 'Vecchio standard a 56 bit. (Simulazione Didattica)',
      TRIPLE_DES: 'Applica DES tre volte per maggiore sicurezza. (Simulazione)',
      RSA: 'Crittografia a chiave pubblica per scambio dati sicuro.',
      DIFFIE_HELLMAN: 'Protocollo di scambio chiavi per canale insicuro.',
      MD5: 'Hash a 128-bit (Obsoleto, vulnerabile a collisioni).',
      SHA1: 'Hash a 160-bit (Deprecato).',
      SHA256: 'Hash standard a 256-bit (Molto comune).',
      SHA512: 'Hash a 512-bit (Alta sicurezza).',
      SHA3: 'Ultimo standard NIST, basato su Keccak.',
    },
    modes: {
      vigenere: {
        REPEATING: 'Standard',
        AUTOKEY: 'Autokey',
      },
      aes: {
        GCM: 'GCM',
        CBC: 'CBC',
        CTR: 'CTR',
      },
      legacy: {
        DES56: '56-bit',
        TDES112: '112-bit',
        TDES168: '168-bit',
      },
      sha3: {
        '224': 'SHA3-224',
        '256': 'SHA3-256',
        '384': 'SHA3-384',
        '512': 'SHA3-512',
      },
      dh: {
        TOY: 'Toy (Edu)',
        MODP_14: '2048-bit',
        MODP_15: '3072-bit',
      },
      dhBitLength: {
        NATIVE: 'Auto',
        '64': '64-bit',
        '128': '128-bit',
        '256': '256-bit',
        '512': '512-bit',
        '1024': '1024-bit',
      }
    },
    padding: 'Padding',
    algoDetails: {
        CAESAR: {
            theory: "STORIA:\nIl Cifrario di Cesare prende il nome da Giulio Cesare, che secondo Svetonio lo usava con uno spostamento di 3 per proteggere messaggi di importanza militare. È uno dei più semplici esempi di cifrario a sostituzione monoalfabetica.\n\nMECCANISMO:\nL'algoritmo funziona traslando ogni lettera del testo in chiaro di un numero fisso di posizioni (la chiave) lungo l'alfabeto. Matematicamente, se associamo ogni lettera a un numero (A=0, B=1, ..., Z=25), la cifratura di una lettera x con spostamento k è data da: E(x) = (x + k) mod 26. La decifratura è D(x) = (x - k) mod 26.\n\nSICUREZZA:\nOggi il cifrario di Cesare non offre alcuna sicurezza reale. Poiché ci sono solo 25 possibili chiavi (spostamenti), un attaccante può facilmente provare tutte le combinazioni (attacco a forza bruta) in pochi secondi. Inoltre, è estremamente vulnerabile all'analisi delle frequenze: in un testo lungo cifrato, la lettera più frequente corrisponderà probabilmente alla 'E' (in inglese) o alla 'A'/'E' (in italiano).",
            guide: "1. SELEZIONE CHIAVE: Usa lo slider 'Spostamento' per scegliere un numero tra 1 e 25. Questo numero rappresenta di quante posizioni ogni lettera verrà spostata in avanti.\n2. CIFRATURA: Scrivi il tuo messaggio nel campo 'Testo in Chiaro'. Il simulatore calcolerà istantaneamente il testo cifrato.\n3. DECIFRATURA: Copia il testo cifrato e incollalo nel modulo di decifratura (o usa il tasto 'Usa per Decifrare'). Assicurati che lo slider 'Spostamento' sia impostato sullo STESSO valore usato per cifrare."
        },
        VIGENERE: {
            theory: "STORIA:\nDescritto per la prima volta da Giovan Battista Bellaso nel 1553, ma erroneamente attribuito a Blaise de Vigenère nel XIX secolo. Per secoli è stato considerato 'le chiffre indéchiffrable' (il cifrario indecifrabile), finché Friedrich Kasiski non pubblicò un metodo per romperlo nel 1863.\n\nMECCANISMO:\nÈ un cifrario polialfabetico. Invece di usare un unico spostamento per tutto il testo (come Cesare), usa una parola chiave. La chiave viene ripetuta fino a coprire la lunghezza del testo. Ogni lettera della chiave determina lo spostamento per la lettera corrispondente del testo (A=0, B=1, ecc.).\nNella variante 'Autokey' (più sicura), dopo aver usato la parola chiave, la chiave continua utilizzando il testo in chiaro stesso, eliminando la periodicità.\n\nSICUREZZA:\nMolto più sicuro di Cesare perché la stessa lettera del testo in chiaro può essere cifrata in modi diversi a seconda della sua posizione. Tuttavia, se la chiave è corta e ripetuta, pattern ripetuti nel testo cifrato permettono di dedurre la lunghezza della chiave e applicare l'analisi delle frequenze (Metodo Kasiski).",
            guide: "1. IMPOSTAZIONE CHIAVE: Inserisci una parola segreta (es. 'VERME'). Evita spazi o numeri.\n2. MODALITÀ: Scegli 'Standard' (la chiave si ripete ciclicamente) o 'Autokey' (la chiave è seguita dal messaggio stesso).\n3. CIFRATURA: Digita il messaggio. Nota come lettere uguali nel messaggio originale possano diventare lettere diverse nel risultato.\n4. DECIFRATURA: Bob deve conoscere la stessa Parola Chiave e la stessa Modalità per recuperare il messaggio."
        },
        PLAYFAIR: {
            theory: "STORIA:\nInventato da Charles Wheatstone nel 1854, ma prende il nome da Lord Playfair che ne promosse l'uso. Fu usato dalle forze britanniche nella Seconda Guerra Boera e nella Prima Guerra Mondiale per la sua velocità di esecuzione manuale.\n\nMECCANISMO:\nCifra coppie di lettere (digrafi) invece di singole lettere. Si costruisce una matrice 5x5 basata su una parola chiave (omettendo le lettere ripetute e unendo I/J). Le regole di cifratura dipendono dalla posizione delle due lettere nella griglia:\n- Stessa riga: prendi le lettere a destra.\n- Stessa colonna: prendi le lettere sotto.\n- Rettangolo: prendi le lettere agli angoli opposti della stessa riga.\n\nSICUREZZA:\nDistrugge le frequenze delle singole lettere, rendendo l'analisi più difficile rispetto ai cifrari monoalfabetici. Tuttavia, soffre ancora di pattern riconoscibili sui digrafi frequenti (come 'TH', 'HE', 'ER') e può essere rotto con sufficiente testo cifrato.",
            guide: "1. MATRICE: Inserisci una chiave testuale. Il sistema genererà automaticamente la griglia 5x5.\n2. INPUT: Scrivi il messaggio. Il sistema gestirà automaticamente le regole:\n   - Sostituirà J con I.\n   - Inserirà una 'X' tra doppie lettere (es. 'LL' diventa 'LXL').\n   - Aggiungerà una 'X' finale se il testo ha lunghezza dispari.\n3. OSSERVAZIONE: Nota come l'output sia composto da coppie di lettere trasformate."
        },
        MONOALPHABETIC: {
            theory: "MECCANISMO:\nIn un cifrario a sostituzione monoalfabetica generale, l'alfabeto del testo in chiaro viene mappato su un alfabeto cifrante disordinato in modo arbitrario. Invece di un semplice spostamento (come Cesare), la relazione è una permutazione completa delle 26 lettere.\nCi sono 26! (fattoriale) possibili chiavi, un numero enorme (circa 4 x 10^26), che rende impossibile un attacco a forza bruta.\n\nSICUREZZA:\nNonostante l'enorme numero di chiavi, questo sistema è debole. La struttura statistica del linguaggio rimane intatta. La lettera 'E' è sempre cifrata con lo stesso simbolo, così come la 'A', ecc. Un crittanalista può usare l'analisi delle frequenze delle lettere e dei bigrammi per ricostruire l'alfabeto originale molto rapidamente.",
            guide: "1. CHIAVE: Inserisci una stringa di caratteri unici che fungerà da alfabeto di destinazione. (Il simulatore rimuoverà i duplicati e completerà l'alfabeto per te).\n2. ESEMPIO: Se la chiave inizia con 'ZEBRA', allora A->Z, B->E, C->B, D->R, E->A, e le altre lettere seguono l'alfabeto rimanente.\n3. UTILIZZO: Ottimo per comprendere il concetto di mappatura 1-a-1 e le sue debolezze statistiche."
        },
        AES: {
            theory: "STORIA:\nL'Advanced Encryption Standard (AES), o Rijndael, è stato selezionato dal NIST nel 2001 dopo una competizione internazionale per sostituire il vecchio DES. È lo standard globale attuale per la crittografia.\n\nMECCANISMO:\nAES è un cifrario a blocchi simmetrico. Opera su blocchi di dati di 128 bit usando chiavi di 128, 192 o 256 bit. Utilizza una 'Substitution-Permutation Network' (SPN) che include molteplici round (10, 12 o 14) di operazioni matematiche: sostituzione di byte (SubBytes), permutazione di righe (ShiftRows), mescolamento di colonne (MixColumns) e aggiunta della chiave (AddRoundKey).\n\nMODALITÀ OPERATIVE:\n- GCM (Galois/Counter Mode): Offre sia confidenzialità che autenticazione. È lo standard moderno raccomandato.\n- CBC (Cipher Block Chaining): Ogni blocco dipende dal precedente. Richiede padding.\n- CTR (Counter): Trasforma il cifrario a blocchi in uno a flusso. Molto veloce e parallelizzabile.\n\nSICUREZZA:\nAttualmente considerato inviolabile. Non sono noti attacchi pratici in grado di rompere AES-256.",
            guide: "1. PASSWORD: Inserisci una password robusta. Il sistema userà PBKDF2 per derivare una chiave crittografica sicura da essa.\n2. MODALITÀ: Seleziona GCM (consigliato), CBC o CTR.\n3. IV/NONCE: AES richiede un vettore di inizializzazione (IV) casuale affinché lo stesso messaggio cifrato due volte produca output diversi. Questo simulatore genera l'IV automaticamente e lo include nell'output (i primi caratteri del testo cifrato)."
        },
        DES: {
            theory: "STORIA:\nSviluppato da IBM negli anni '70 e adottato come standard federale USA nel 1977. Ha dominato la crittografia per vent'anni.\n\nMECCANISMO:\nÈ un cifrario a blocchi (64 bit) basato su una rete di Feistel con 16 round. La sua debolezza principale è la lunghezza della chiave: solo 56 bit effettivi.\n\nSICUREZZA:\nOBSOLETO E INSICURO. Nel 1999, la EFF (Electronic Frontier Foundation) costruì 'Deep Crack', una macchina costata 250.000 dollari in grado di trovare una chiave DES in meno di 24 ore. Oggi, una chiave DES può essere trovata in pochi minuti. Questo algoritmo è presente qui solo a scopo storico e didattico (simulato).",
            guide: "1. ATTENZIONE: Questa è una simulazione didattica. Non usa il vero algoritmo DES bit-per-bit per limitazioni del browser, ma ne simula la logica di trasformazione.\n2. INPUT: Inserisci una chiave e un testo.\n3. CONFRONTO: Nota come, a differenza dei cifrari classici, il testo cifrato appaia completamente casuale (pseudo-random)."
        },
        TRIPLE_DES: {
            theory: "STORIA:\nIntrodotto come soluzione temporanea per salvare l'hardware progettato per DES quando la chiave a 56 bit divenne insicura.\n\nMECCANISMO:\nApplica l'algoritmo DES tre volte a ogni blocco di dati: Cifratura -> Decifratura -> Cifratura (EDE), usando due o tre chiavi diverse.\n- Opzione 2-Key (112 bit): K1 per cifrare, K2 per decifrare, K1 per cifrare.\n- Opzione 3-Key (168 bit): K1, K2, K3 indipendenti.\n\nSICUREZZA:\nMolto più sicuro del DES singolo, ma estremamente lento in software. È stato ufficialmente deprecato dal NIST nel 2017 a favore di AES. È vulnerabile all'attacco Sweet32 su connessioni con grandi volumi di dati.",
            guide: "1. SIMULAZIONE: Come per DES, questa è una simulazione educativa.\n2. CHIAVI: Seleziona la lunghezza della chiave (112 o 168 bit).\n3. OSSERVA: L'output è simile a DES ma la complessità computazionale interna è triplicata."
        },
        RSA: {
            theory: "STORIA:\nPubblicato nel 1977 da Rivest, Shamir e Adleman (MIT). Ha rivoluzionato la crittografia introducendo il concetto di 'chiave pubblica'.\n\nMECCANISMO:\nÈ un sistema asimmetrico. Si basa sulla difficoltà matematica di fattorizzare il prodotto di due grandi numeri primi.\n- Chiave Pubblica (e, n): Nota a tutti, usata per cifrare.\n- Chiave Privata (d, n): Segreta, usata per decifrare.\nIl messaggio 'm' viene cifrato come c = m^e mod n. Viene decifrato come m = c^d mod n.\n\nSICUREZZA:\nLa sicurezza dipende dalla lunghezza della chiave. Oggi si raccomandano almeno 2048 bit. RSA è molto lento rispetto ad AES, quindi solitamente si usa RSA per scambiare una chiave AES, e poi AES per cifrare i dati veri e propri (approccio ibrido).",
            guide: "1. GENERAZIONE: All'avvio, il simulatore crea una coppia di chiavi reale a 2048 bit.\n2. RUOLI: Immagina di essere Alice.\n3. CIFRATURA: Alice usa la CHIAVE PUBBLICA del destinatario (Bob). Copia la chiave pubblica e usala nel modulo di cifratura.\n4. DECIFRATURA: Bob usa la sua CHIAVE PRIVATA (interna e nascosta) per leggere il messaggio.\n5. NOTA: Non puoi decifrare un messaggio usando la chiave pubblica che lo ha creato!"
        },
        DIFFIE_HELLMAN: {
            theory: "CONCETTO:\nDescritto nel 1976, non è un algoritmo di cifratura, ma un protocollo di SCAMBIO CHIAVI.\n\nFORMULA DEL SEGRETO CONDIVISO:\nAlice calcola: S = B^a mod p\nBob calcola: S = A^b mod p\nDove:\n- 'S' è il Segreto Condiviso\n- 'a'/'b' sono le Chiavi Private\n- 'A'/'B' sono le Chiavi Pubbliche\n- 'p' è il Modulo Primo\n\nESPONENZIAZIONE MODULARE:\nLa sicurezza si basa sul calcolo di (base^esponente) % modulo. È un'operazione facile in una direzione, ma computazionalmente intrattabile da invertire (trovare l'esponente) su grandi numeri (Problema del Logaritmo Discreto).\n\nANALOGIA (Colori):\nAlice e Bob mescolano il loro colore segreto con un colore comune pubblico. Si scambiano i mix. Poi aggiungono il proprio colore segreto al mix ricevuto. Il risultato finale è un colore identico per entrambi, impossibile da replicare per chi osserva solo i mix pubblici.",
            guide: "1. PARAMETRI: Alice genera 'p' e 'g'.\n2. CHIAVI PRIVATE: Alice e Bob generano le loro chiavi private (numeri casuali).\n3. SCAMBIO: Alice invia la sua Chiave Pubblica (A) a Bob. Bob invia la sua (B) ad Alice. (Usa i pulsanti 'Send to...' per vedere l'animazione).\n4. CALCOLO: Il simulatore calcola automaticamente il 'Shared Secret'. Verifica che il segreto sia IDENTICO per entrambi.\n5. GRUPPI: Prova il gruppo 'Toy' per vedere numeri piccoli comprensibili, o 'MODP' per vedere la crittografia reale a 2048 bit."
        },
        MD5: {
            theory: "STORIA:\nMessage Digest Algorithm 5, sviluppato da Ronald Rivest nel 1991. Usatissimo in passato per verificare l'integrità dei file.\n\nMECCANISMO:\nPrende un input di qualsiasi lunghezza e produce un output fisso di 128 bit (32 caratteri esadecimali). È progettato per essere veloce e produrre un effetto valanga (cambiare un bit dell'input cambia completamente l'output).\n\nSICUREZZA:\nROTTO. MD5 soffre di vulnerabilità critiche alle collisioni (trovare due file diversi con lo stesso hash). È possibile generare collisioni in pochi secondi su un laptop. Non usare mai per password o firme digitali.",
            guide: "1. INPUT: Scrivi qualsiasi testo.\n2. OUTPUT: Osserva la stringa esadecimale.\n3. PROVA: Cambia una sola lettera nel testo originale. Nota come l'hash cambi completamente."
        },
        SHA1: {
            theory: "STORIA:\nSecure Hash Algorithm 1, progettato dalla NSA nel 1993. Produce un digest a 160 bit.\n\nSICUREZZA:\nDEPRECATO. Nel 2017, Google ha annunciato 'SHAttered', il primo attacco pratico di collisione contro SHA-1. I moderni browser e certificati SSL non lo accettano più come sicuro.",
            guide: "Usa come MD5. Nota che l'output è leggermente più lungo (40 caratteri hex) rispetto a MD5."
        },
        SHA256: {
            theory: "STORIA:\nParte della famiglia SHA-2 (pubblicata nel 2001 dalla NSA). È lo standard di fatto per la sicurezza informatica moderna.\n\nAPPLICAZIONI:\nÈ il cuore di Bitcoin (Proof of Work), dei certificati SSL/TLS (HTTPS), e dell'autenticazione delle password (con salt).\n\nSICUREZZA:\nMolto sicuro. Non sono noti attacchi di collisione pratici. Offre 256 bit di sicurezza contro attacchi pre-immagine.",
            guide: "Inserisci il testo per generare l'hash a 256 bit. È irreversibile: non puoi risalire al testo originale dall'hash."
        },
        SHA512: {
            theory: "VARIANTE:\nSimile strutturalmente a SHA-256, ma opera su word a 64 bit invece che a 32 bit, rendendolo spesso più veloce sui moderni processori a 64 bit. Produce un digest di 512 bit.\n\nSICUREZZA:\nEstrema. Usato quando si richiede il massimo livello di resistenza alle collisioni o per generare chiavi lunghe.",
            guide: "Genera un hash molto lungo (128 caratteri hex). Ideale per vedere l'effetto valanga su larga scala."
        },
        SHA3: {
            theory: "STORIA:\nNel 2007 il NIST lanciò una competizione pubblica per trovare un successore a SHA-2. Il vincitore fu l'algoritmo Keccak, standardizzato come SHA-3 nel 2015.\n\nDIFFERENZA:\nNon deriva da MD5 o SHA-1/2. Usa una struttura a 'spugna' (Sponge Construction). Questo significa che anche se un giorno SHA-2 venisse rotto, SHA-3 rimarrebbe probabilmente sicuro perché matematicamente diverso.\n\nVARIANTI:\nPuò produrre output di qualsiasi lunghezza, ma le versioni standard ricalcano le lunghezze di SHA-2 (224, 256, 384, 512).",
            guide: "1. LUNGHEZZA: Seleziona la lunghezza in bit desiderata.\n2. CALCOLO: Il simulatore usa l'implementazione Keccak ufficiale per generare l'hash."
        }
    }
  },
  en: {
    title: 'CryptoFlow',
    subtitle: 'Powered by Prof. Carello',
    inputPlaceholder: 'Enter text here...',
    outputPlaceholder: 'Result will appear here...',
    cipherInput: 'Plaintext',
    cipherOutput: 'Output',
    decipherInput: 'Ciphertext',
    decipherOutput: 'Decrypted Text',
    key: 'Key / Password',
    shift: 'Shift Amount',
    encrypt: 'Encryption Module',
    decrypt: 'Decryption Module',
    copy: 'Copy',
    clear: 'Clear',
    transfer: 'Use to Decrypt',
    console: 'System Console',
    consolePlaceholder: 'Waiting for operations...',
    tooltips: {
        catClassical: 'Historical substitution-based algorithms',
        catSymmetric: 'Single key for encryption and decryption',
        catAsymmetric: 'Key pair (Public/Private)',
        catHashing: 'Irreversible digital fingerprints',
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
      HASHING: 'Hashing',
    },
    algorithms: {
      CAESAR: 'Caesar Cipher',
      VIGENERE: 'Vigenère Cipher',
      PLAYFAIR: 'Playfair Cipher',
      MONOALPHABETIC: 'Mono Substitution',
      AES: 'AES (Modern)',
      DES: 'DES (Legacy Sim)',
      TRIPLE_DES: '3DES (Legacy Sim)',
      RSA: 'RSA (Public Key)',
      DIFFIE_HELLMAN: 'Diffie-Hellman',
      MD5: 'MD5',
      SHA1: 'SHA-1',
      SHA256: 'SHA-256',
      SHA512: 'SHA-512',
      SHA3: 'SHA-3 (Keccak)',
    },
    descriptions: {
      CAESAR: 'Simple substitution with fixed shift.',
      VIGENERE: 'Polyalphabetic substitution using a keyword.',
      PLAYFAIR: 'Encrypts digraphs using a 5x5 grid.',
      MONOALPHABETIC: 'Replaces each letter with a fixed mapping.',
      AES: 'Advanced Standard (128/256 bit). Secure & Fast.',
      DES: 'Old 56-bit standard. (Educational Simulation)',
      TRIPLE_DES: 'Applies DES three times. (Simulation)',
      RSA: 'Public-key cryptography for secure data exchange.',
      DIFFIE_HELLMAN: 'Key exchange protocol for insecure channels.',
      MD5: '128-bit Hash (Obsolete, collision vulnerable).',
      SHA1: '160-bit Hash (Deprecated).',
      SHA256: 'Standard 256-bit Hash (Common).',
      SHA512: '512-bit Hash (High security).',
      SHA3: 'Latest NIST standard, based on Keccak.',
    },
    modes: {
      vigenere: {
        REPEATING: 'Standard',
        AUTOKEY: 'Autokey',
      },
      aes: {
        GCM: 'GCM',
        CBC: 'CBC',
        CTR: 'CTR',
      },
      legacy: {
        DES56: '56-bit',
        TDES112: '112-bit',
        TDES168: '168-bit',
      },
      sha3: {
        '224': 'SHA3-224',
        '256': 'SHA3-256',
        '384': 'SHA3-384',
        '512': 'SHA3-512',
      },
      dh: {
        TOY: 'Toy (Edu)',
        MODP_14: '2048-bit',
        MODP_15: '3072-bit',
      },
      dhBitLength: {
        NATIVE: 'Auto',
        '64': '64-bit',
        '128': '128-bit',
        '256': '256-bit',
        '512': '512-bit',
        '1024': '1024-bit',
      }
    },
    padding: 'Padding Scheme',
    algoDetails: {
        CAESAR: {
            theory: "HISTORY:\nNamed after Julius Caesar, who used it with a shift of 3 to protect military messages. It is one of the simplest forms of monoalphabetic substitution.\n\nMECHANISM:\nEach letter in the plaintext is shifted a fixed number of positions down the alphabet. Mathematically: E(x) = (x + k) mod 26. Decryption is D(x) = (x - k) mod 26.\n\nSECURITY:\nVery weak. With only 25 possible keys, it can be brute-forced instantly. It is also highly vulnerable to frequency analysis (e.g., 'E' is the most common letter in English; in a Caesar ciphertext, the most common letter likely corresponds to 'E').",
            guide: "1. KEY: Use the slider to set the Shift amount (1-25).\n2. ENCRYPT: Type in the Plaintext box. Result appears instantly.\n3. DECRYPT: Use the same shift value on the ciphertext to get the original message back."
        },
        VIGENERE: {
            theory: "HISTORY:\nOnce called 'le chiffre indéchiffrable' (the indecipherable cipher). Broken by Kasiski in 1863.\n\nMECHANISM:\nA polyalphabetic cipher. It uses a keyword to apply different Caesar shifts to different letters. \n- 'Standard': The keyword repeats (KEYKEYKE...).\n- 'Autokey': The keyword starts the key, followed by the plaintext itself, eliminating periodicity.\n\nSECURITY:\nResistant to simple frequency analysis because the same plaintext letter can be encrypted differently depending on its position. However, repeating keys create patterns that can be exploited (Kasiski examination).",
            guide: "1. KEY: Enter a text keyword (e.g., 'SECRET').\n2. MODE: Choose Standard or Autokey.\n3. OBSERVE: Type 'AAAAA'. Notice how the output is not 'BBBBB' but changes based on the key letters."
        },
        PLAYFAIR: {
            theory: "HISTORY:\nInvented by Wheatstone in 1854, popularized by Lord Playfair. Used in WWI for its ease of manual use.\n\nMECHANISM:\nEncrypts digraphs (pairs of letters). Uses a 5x5 grid generated from a keyword (I/J are merged). Rules:\n- Same row: Shift right.\n- Same col: Shift down.\n- Rectangle: Swap corners.\n\nSECURITY:\nObscures single-letter frequencies but preserves digraph frequencies. Vulnerable to modern cryptanalysis.",
            guide: "1. KEY: Enter a keyword to generate the grid.\n2. INPUT: Type your message.\n3. PROCESS: The system handles the rules (swapping J for I, inserting X between double letters)."
        },
        MONOALPHABETIC: {
            theory: "MECHANISM:\nReplaces the standard alphabet with a scrambled permutation. There are 26! (approx 4x10^26) possible keys, making brute force impossible.\n\nSECURITY:\nWeak. It preserves the statistical structure of the language. 'E' maps to a unique symbol, 'A' to another. Frequency analysis can crack this very quickly.",
            guide: "1. KEY: Enter a scramble string. The system removes duplicates to create the mapping.\n2. USAGE: Useful for understanding simple substitution."
        },
        AES: {
            theory: "HISTORY:\nSelected by NIST in 2001 to replace DES. Used globally for top-secret data.\n\nMECHANISM:\nA symmetric block cipher (128-bit blocks). Uses substitution (S-Box), permutation (ShiftRows), mixing (MixColumns), and key addition.\n- GCM: Adds authentication.\n- CBC: Chains blocks together.\n\nSECURITY:\nSecure. No practical attacks exist against AES-256.",
            guide: "1. PASS: Enter a strong password.\n2. MODE: Use GCM for best security.\n3. IV: The system automatically handles the Initialization Vector."
        },
        DES: {
            theory: "HISTORY:\nStandard from 1977 to roughly 2000.\n\nMECHANISM:\nFeistel network with a 56-bit key.\n\nSECURITY:\nBROKEN. The key is too short. It can be cracked in minutes by modern hardware. Included here as a simulation only.",
            guide: "1. SIMULATION: This demonstrates the transformation logic, not bit-perfect implementation.\n2. TRY: Encrypt something and see the pseudo-random output."
        },
        TRIPLE_DES: {
            theory: "MECHANISM:\nRuns DES three times (Encrypt-Decrypt-Encrypt) to increase key size to 112 or 168 bits.\n\nSECURITY:\nBetter than DES, but slow and officially deprecated. Vulnerable to specific collision attacks (Sweet32).",
            guide: "1. KEY: Select key length.\n2. COMPARE: Slower and more complex than standard DES."
        },
        RSA: {
            theory: "HISTORY:\nThe first practical public-key cryptosystem (1977).\n\nMECHANISM:\nAsymmetric. Uses a Key Pair.\n- Public Key: Encrypts.\n- Private Key: Decrypts.\nSecurity relies on the difficulty of factoring the product of two large primes.\n\nUSAGE:\nSlow. Usually used to encrypt a small symmetric key (like an AES key), not the whole file.",
            guide: "1. KEYS: Generated on load.\n2. ENCRYPT: Use the Recipient's Public Key.\n3. DECRYPT: Use your own Private Key."
        },
        DIFFIE_HELLMAN: {
            theory: "CONCEPT:\nA method to exchange a secret key over a public channel. It is NOT for encrypting messages directly.\n\nSHARED SECRET FORMULA:\nAlice calculates: S = B^a mod p\nBob calculates: S = A^b mod p\nWhere:\n- 'S' is the Shared Secret\n- 'a'/'b' are Private Keys\n- 'A'/'B' are Public Keys\n- 'p' is the Prime Modulus\n\nMODULAR EXPONENTIATION:\nThe security relies on calculating (base^exponent) % modulus. This operation is easy to perform forward but computationally infeasible to reverse (finding the exponent) for large numbers. This is known as the Discrete Logarithm Problem.\n\nANALOGY:\nLike mixing paint colors. You can send the mix, but an attacker can't 'un-mix' it to find the original secret color.",
            guide: "1. SETUP: Generate parameters.\n2. EXCHANGE: Send public keys back and forth.\n3. RESULT: Check the 'Shared Secret'. It must be identical."
        },
        MD5: {
            theory: "MECHANISM:\nProduces a 128-bit hash.\n\nSECURITY:\nBROKEN. Collision attacks are trivial. Do not use for security.",
            guide: "Type text, see the hex fingerprint. Change one letter, see the whole hash change."
        },
        SHA1: {
            theory: "MECHANISM:\nProduces a 160-bit hash.\n\nSECURITY:\nBROKEN. Google proved a collision attack in 2017. Deprecated.",
            guide: "Similar to MD5 but longer output."
        },
        SHA256: {
            theory: "STANDARD:\nThe current industry standard (SHA-2 family). 256-bit output. Secure and widely used (Bitcoin, HTTPS).",
            guide: "Generates a secure, irreversible hash."
        },
        SHA512: {
            theory: "HIGH SEC:\n512-bit output. faster on 64-bit systems. Extremely secure.",
            guide: "Generates a long hash string."
        },
        SHA3: {
            theory: "NEXT GEN:\nBased on Keccak (Sponge construction). Different internal math than SHA-2, providing a safeguard if SHA-2 is ever broken.",
            guide: "Select bit length and compute."
        }
    }
  }
};
    