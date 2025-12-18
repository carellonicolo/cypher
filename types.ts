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
    subtitle: 'Advanced Scientific Cryptography Hub',
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
      GENERAL: 'Scienza Crittografica'
    },
    categoryDetails: {
      GENERAL: "La **Crittografia moderna** rappresenta l'intersezione tra matematica pura, informatica teorica e ingegneria della sicurezza. Non si limita alla mera protezione del segreto, ma costituisce l'infrastruttura di fiducia dell'era digitale.\n\n### Fondamenti Teorici\nIl campo è stato rivoluzionato dai lavori di **Claude Shannon** (Teoria dell'Informazione, 1949), che ha introdotto i concetti di **Confusione** (distruggere la relazione statistica tra chiave e testo cifrato) e **Diffusione** (distribuire l'influenza del plaintext su tutto il ciphertext). Un sistema crittografico moderno deve soddisfare il **Principio di Kerckhoffs**: la sicurezza deve risiedere esclusivamente nella segretezza della chiave, non nell'offuscamento dell'algoritmo.\n\n### Proprietà della Sicurezza\nOltre alla riservatezza, la crittografia garantisce:\n1. **Integrità**: Il dato non è stato alterato (Hash).\n2. **Autenticazione**: L'identità dell'origine è verificata (MAC, Firme).\n3. **Non-ripudio**: L'autore non può negare la paternità dell'azione (Crittografia Asimmetrica).\n\nAttualmente, la ricerca si sta spostando verso la **Crittografia Post-Quantum (PQC)**, volta a resistere ad attacchi basati sull'algoritmo di Shor in grado di rompere RSA ed ECC utilizzando computer quantistici.",
      CLASSICAL: "I **Cifrari Classici** costituiscono il retaggio storico della disciplina, operando su una semantica di caratteri alfabetici piuttosto che su bit.\n\n### Meccanismi Evolutivi\nSi dividono in due grandi famiglie:\n• **Cifrari a Sostituzione**: Sostituiscono un carattere con un altro. Si evolvono da monoalfabetici (mappatura fissa) a polialfabetici (mappatura variabile, come Vigenère), cercando di mascherare le frequenze statistiche della lingua.\n• **Cifrari a Trasposizione**: Mantengono i caratteri originali ma ne permutano la posizione (es. Rail Fence, Cifrari Colonnari).\n\n### Crittanalisi Storica\nIl punto di rottura di questi sistemi è sempre stato l'**Analisi delle Frequenze**. In ogni lingua naturale, le lettere non appaiono con la stessa probabilità. Ad esempio, in Italiano, la 'E' e la 'A' dominano statisticamente. Un cifrario classico è considerato debole se non riesce a generare un output con una distribuzione di frequenza uniforme (piatta), permettendo a un attaccante di 'indovinare' le mappature basandosi su pattern linguistici ripetitivi.",
      SYMMETRIC: "La **Crittografia Simmetrica** (o a chiave privata) è la spina dorsale delle comunicazioni moderne ad alte prestazioni grazie alla sua efficienza computazionale.\n\n### Block Ciphers vs Stream Ciphers\n1. **Cifrari a Blocchi**: Elaborano dati in segmenti di dimensione fissa (es. 128 bit per AES). Utilizzano round iterativi di permutazioni e sostituzioni. La loro sicurezza dipende dalla **modalità operativa** (CBC, GCM, etc.), che impedisce a blocchi di plaintext identici di produrre ciphertext identici.\n2. **Cifrari a Flusso**: Generano un flusso di bit pseudo-casuale (keystream) che viene combinato (solitamente tramite XOR) con il messaggio. Sono ideali per lo streaming di dati dove la latenza deve essere minima.\n\n### Il Problema della Distribuzione\nIl limite intrinseco è lo scambio della chiave: come possono due parti che non si sono mai incontrate scambiarsi una chiave segreta senza che un intercettatore la veda? Questa sfida ha portato all'invenzione dei sistemi asimmetrici, che oggi vengono spesso usati insieme ai simmetrici in protocolli ibridi (es. TLS) per combinare sicurezza e velocità.",
      ASYMMETRIC: "La **Crittografia Asimmetrica** (a chiave pubblica) ha risolto il problema secolare dello scambio delle chiavi introducendo il concetto di funzioni matematiche unidirezionali.\n\n### Funzioni Trapdoor\nSi basa su problemi matematici facili da calcolare in un senso, ma 'computazionalmente impossibili' da invertire senza una specifica informazione aggiuntiva (la chiave privata). I pilastri sono:\n• **Fattorizzazione Intera**: Difficoltà di trovare i fattori primi di un numero molto grande (RSA).\n• **Logaritmo Discreto**: Invertire l'elevamento a potenza in campi finiti (Diffie-Hellman).\n• **Logaritmo Discreto su Curve Ellittiche (ECDLP)**: Una variante molto più efficiente basata sulla geometria delle curve ellittiche.\n\n### Infrastruttura a Chiave Pubblica (PKI)\nL'uso di coppie di chiavi permette la creazione di **Firme Digitali**, garantendo che un messaggio non solo sia segreto, ma provenga indiscutibilmente dal mittente dichiarato. Questo è il fondamento legale della validità dei documenti digitali moderni.",
      HASHING: "Le **Funzioni Hash Crittografiche** sono algoritmi unidirezionali che trasformano un input di qualsiasi dimensione in un 'digest' di lunghezza fissa.\n\n### Requisiti di un Hash 'Sicuro'\nPer essere crittograficamente utile, una funzione hash deve possedere tre proprietà critiche:\n1. **Resistenza alla Pre-immagine**: Dato un hash *h*, deve essere impossibile trovare un input *m* tale che *Hash(m) = h*.\n2. **Resistenza alla Seconda Pre-immagine**: Dato un input *m1*, deve essere impossibile trovarne un secondo *m2* tale che *Hash(m1) = Hash(m2)*.\n3. **Resistenza alle Collisioni**: Deve essere impossibile trovare *qualsiasi* coppia di input distinti che producano lo stesso hash.\n\n### Applicazioni\nSono onnipresenti: dal controllo dell'integrità dei file (checksum) alla memorizzazione sicura delle password (tramite salting e stretching), fino alla struttura dei blocchi nelle blockchain, dove ogni blocco contiene l'hash del precedente, creando una catena immutabile.",
      MAC: "I **Message Authentication Codes (MAC)** sono algoritmi che utilizzano una chiave segreta per autenticare un messaggio e garantirne l'integrità.\n\n### Differenza dagli Hash\nMentre un hash standard è pubblico e chiunque può ricalcolarlo se il file viene modificato, un MAC richiede la conoscenza di una chiave segreta. Un attaccante che altera un messaggio non può rigenerare un MAC valido, poiché non possiede la chiave per farlo.\n\n### HMAC e CMAC\n• **HMAC (Hash-based MAC)**: Utilizza una funzione hash (come SHA-256) applicata due volte in modo specifico per evitare attacchi di estensione della lunghezza.\n• **CMAC (Cipher-based MAC)**: Utilizza un cifrario a blocchi (come AES) operando in modalità CBC. L'ultimo blocco cifrato serve come autenticatore per l'intero messaggio. È lo standard preferito in molti protocolli industriali e sistemi embedded dove l'hardware AES è già presente."
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
            theory: "### Analisi Storica e Matematica\nIl **Cifrario di Cesare** è uno dei più antichi algoritmi crittografici conosciuti, risalente all'epoca imperiale romana. Giulio Cesare lo utilizzava per proteggere messaggi di rilevanza militare durante le sue campagne.\n\n### Definizione Formale\nMatematicamente, il sistema opera nell'anello $\\mathbb{Z}_{26}$. Data una lettera $x$ e una chiave $k$, la cifratura è definita dalla congruenza lineare:\n$$E_k(x) = (x + k) \\pmod{26}$$\nLa decifratura è l'operazione inversa:\n$$D_k(y) = (y - k) \\pmod{26}$$\n\n### Vulnerabilità Crittanalitica\nIl sistema soffre di due debolezze fatali:\n1. **Spazio delle Chiavi Ridotto**: Con sole 25 chiavi possibili (escludendo lo spostamento nullo), un attacco a forza bruta è istantaneo anche senza computer.\n2. **Preservazione della Frequenza**: Essendo una sostituzione monoalfabetica, non altera la distribuzione statistica dell'alfabeto originale. Se in Italiano la lettera più frequente è la 'E', nel testo cifrato la lettera che la sostituisce sarà parimenti la più frequente. Questo lo rende vulnerabile all'analisi dei monogrammi.",
            guide: "1. Inserisci il testo in chiaro nel campo di input.\n2. Utilizza lo slider per selezionare il valore dello spostamento (da 1 a 25).\n3. Il testo processato apparirà istantaneamente nel riquadro dell'output."
        },
        VIGENERE: {
            theory: "### Il Cifrario 'Indecifrabile'\nPresentato da Giovan Battista Bellaso e perfezionato da Blaise de Vigenère nel XVI secolo, questo metodo è rimasto inviolato per oltre tre secoli. È un esempio classico di **crittografia polialfabetica**.\n\n### Meccanismo di Funzionamento\nA differenza di Cesare, Vigenère utilizza una parola chiave che determina una serie di spostamenti variabili. Ogni lettera del messaggio viene traslata secondo la lettera corrispondente della chiave, ripetuta ciclicamente:\n$$C_i = (P_i + K_{i \\pmod L}) \\pmod{26}$$\ndove $L$ è la lunghezza della chiave.\n\n### Modalità Autokey\nNella variante **Autokey**, la chiave non si ripete. Inizia con una parola segreta, ma prosegue utilizzando il testo in chiaro stesso come chiave. Questo elimina la periodicità del keystream, rendendo l'analisi di Kasiski inefficace.\n\n### Crittanalisi Moderna\nNel 1863, Friedrich Kasiski pubblicò un metodo per determinare la lunghezza della chiave analizzando le ripetizioni nel ciphertext. Una volta trovata la lunghezza $L$, il sistema si riduce a $L$ cifrari di Cesare indipendenti, risolvibili tramite analisi statistica.",
            guide: "1. Digita il messaggio.\n2. Inserisci una parola chiave segreta.\n3. Seleziona tra modalità 'Standard' (Ripetitiva) o 'Autokey' per una sicurezza superiore."
        },
        PLAYFAIR: {
            theory: "### Crittografia Digrafica\nSviluppato da Charles Wheatstone nel 1854, il **Cifrario Playfair** è stato il primo sistema a cifrare coppie di lettere (bigrammi) invece di singoli caratteri. Fu ampiamente utilizzato dall'Impero Britannico durante la Prima Guerra Mondiale.\n\n### Struttura della Matrice\nL'algoritmo crea una matrice 5x5 popolata da una parola chiave (omettendo le lettere duplicate e fondendo solitamente 'J' con 'I').\n\n### Regole di Trasformazione\nPer ogni coppia di lettere:\n• **Stessa Riga**: Sposta ogni lettera a destra.\n• **Stessa Colonna**: Sposta ogni lettera in basso.\n• **Rettangolo**: Sostituisci ogni lettera con quella situata nello stesso rigo ma nella colonna dell'altra lettera.\n\n### Sicurezza\nCifrando digrammi, l'algoritmo eleva lo spazio dei simboli da 26 a $26^2 = 676$. Questo appiattisce significativamente l'analisi delle frequenze, rendendo necessari testi molto più lunghi per una crittanalisi statistica efficace.",
            guide: "1. Inserisci una chiave alfanumerica.\n2. Osserva la generazione dinamica della matrice 5x5.\n3. Inserisci il testo: il sistema gestirà automaticamente i caratteri di riempimento ('X') e la normalizzazione 'J' -> 'I'."
        },
        MONOALPHABETIC: {
            theory: "### Sostituzione Generale\nA differenza di Cesare, che applica solo rotazioni, la **Sostituzione Monoalfabetica** permette a ogni lettera dell'alfabeto di essere mappata in una qualsiasi delle 26 lettere possibili, a condizione che la mappatura sia biunivoca.\n\n### Analisi Combinatoria\nLo spazio delle chiavi è vastissimo, pari a $26!$ (circa $4.03 \\times 10^{26}$). Anche provando un miliardo di chiavi al secondo, la vita dell'universo non basterebbe per un attacco a forza bruta.\n\n### Fragilità Statistica\nNonostante l'enorme spazio delle chiavi, il sistema è estremamente debole. Poiché la relazione tra carattere originale e cifrato è fissa, l'attaccante può ricostruire l'intero alfabeto analizzando la frequenza delle lettere, dei digrammi (es. 'QU', 'CH') e dei trigrammi, oltre ai pattern delle parole brevi (articoli e preposizioni).",
            guide: "1. Inserisci una stringa chiave casuale.\n2. Visualizza la tabella di mappatura generata (Alphabet Mapping).\n3. Digita il testo per vedere la sostituzione in tempo reale."
        },
        AES: {
            theory: "### Lo Standard Mondiale\nL'**Advanced Encryption Standard (AES)** è un cifrario a blocchi iterativo selezionato dal NIST nel 2001 dopo un concorso internazionale. È considerato inviolabile dai computer attuali e resiste a gran parte degli attacchi crittanalitici noti.\n\n### Architettura a Round\nAES opera su una matrice 4x4 di byte chiamata 'Stato'. A seconda della chiave (128, 192, 256 bit), l'algoritmo esegue 10, 12 o 14 round. Ogni round consiste in:\n1. **SubBytes**: Sostituzione non lineare tramite S-Box (Confusione).\n2. **ShiftRows**: Trasposizione ciclica delle righe dello stato.\n3. **MixColumns**: Moltiplicazione polinomiale in $GF(2^8)$ (Diffusione).\n4. **AddRoundKey**: XOR con la sottochiave del round.\n\n### Modalità Operative\n• **GCM (Galois/Counter Mode)**: La più sicura; fornisce sia confidenzialità che autenticità dei dati.\n• **CBC (Cipher Block Chaining)**: Ogni blocco dipende dal precedente; richiede un IV (Vettore di Inizializzazione) casuale.\n• **ECB (Electronic Codebook)**: Insicura; blocchi identici producono ciphertext identici, rivelando pattern visibili.",
            guide: "1. Scegli la lunghezza della chiave (256-bit è consigliato).\n2. Seleziona la modalità GCM per applicazioni moderne.\n3. Inserisci una password robusta: il sistema utilizzerà PBKDF2 per derivare la chiave crittografica."
        },
        DES: {
            theory: "### La Genesi della Crittografia Digitale\nSviluppato da IBM negli anni '70, il **Data Encryption Standard (DES)** è stato il primo algoritmo crittografico approvato per l'uso governativo civile. Si basa sulla **Rete di Feistel**, una struttura che divide il blocco di dati in due metà ed esegue funzioni di permutazione e sostituzione.\n\n### Il Declino della Sicurezza\nIl limite fatale del DES è la lunghezza della chiave: solo **56 bit**. Già negli anni '90, la potenza di calcolo ha reso possibile l'interrogazione dell'intero spazio delle chiavi ($2^{56}$) in tempi brevi. Nel 1998, il 'DES Cracker' della EFF lo violò in meno di tre giorni. Oggi è considerato obsoleto e insicuro per qualsiasi protezione di dati reali.",
            guide: "Questo modulo è a scopo puramente didattico. Sperimenta con le chiavi a 56 bit e osserva come blocchi piccoli (64-bit) siano vulnerabili agli attacchi moderni."
        },
        TRIPLE_DES: {
            theory: "### Estensione della Vita Utile\nIl **Triple DES (3DES)** è stato introdotto come rimedio temporaneo alla debolezza del DES. Invece di progettare un nuovo algoritmo, si applica il DES tre volte consecutive.\n\n### Lo Schema EDE\nIl processo segue solitamente la sequenza EDE (Encrypt-Decrypt-Encrypt) con tre chiavi distinte (K1, K2, K3):\n$$C = E_{K3}(D_{K2}(E_{K1}(P)))$$\nL'uso del 'Decrypt' nel mezzo permette la compatibilità con il DES standard se K1=K2=K3.\n\n### Stato Attuale\nSebbene offra uno spazio di chiavi fino a 168 bit, la sicurezza effettiva è di circa 112 bit a causa di attacchi 'meet-in-the-middle'. A causa della sua lentezza e della vulnerabilità 'Sweet32', il NIST ne ha dichiarato il ritiro definitivo entro il 2023.",
            guide: "Utilizza le opzioni a 2 chiavi (112-bit) o 3 chiavi (168-bit). Nota l'incremento del carico computazionale rispetto al DES singolo."
        },
        RC4: {
            theory: "### Semplicità ed Efficienza\nRC4 è il cifrario a flusso più utilizzato al mondo, celebre per la sua estrema semplicità (può essere memorizzato in pochi righe di codice). Progettato da Ron Rivest per RSA Security nel 1987.\n\n### Meccanismo Interno\nSi basa su un array di 256 byte (S-Box) che viene rimescolato continuamente. Genera un flusso di byte pseudo-casuali che vengono combinati tramite XOR con il messaggio.\n\n### Bias Statistici e Caduta\nNonostante la velocità, RC4 è affetto da gravi debolezze statistiche. I primi byte del keystream non sono perfettamente casuali. Attacchi come 'Royal Flush' permettono di recuperare informazioni analizzando molti messaggi cifrati. Dal 2015, il suo uso è proibito nei protocolli TLS (RFC 7465).",
            guide: "Inserisci una chiave e osserva l'output in formato esadecimale. Ricorda che lo XOR è simmetrico: cifrare due volte con la stessa chiave restituisce il testo originale."
        },
        CHACHA20: {
            theory: "### L'Erede Moderno degli Stream Cipher\nProgettato da Daniel J. Bernstein, **ChaCha20** è l'evoluzione di Salsa20. È diventato lo standard *de facto* per le connessioni mobili e TLS 1.3 grazie alla sua straordinaria velocità su hardware che non dispone di istruzioni AES dedicate.\n\n### Architettura ARX\nUtilizza esclusivamente operazioni di addizione, rotazione e XOR (ARX). Questo lo rende immune agli attacchi di 'timing' che affliggono le implementazioni software di AES basate su tabelle di ricerca (lookup tables).\n\n### Sicurezza e Prestazioni\nAccoppiato con Poly1305 (un autenticatore), forma una suite AEAD (Authenticated Encryption with Associated Data). È utilizzato da Google, Cloudflare e nel protocollo WireGuard per la sua robustezza e facilità di implementazione sicura.",
            guide: "Ideale per streaming dati. Inserisci il testo e una chiave; il sistema genererà un IV (Vettore di Inizializzazione) unico per garantire che ogni cifratura sia diversa anche per lo stesso messaggio."
        },
        RSA: {
            theory: "### Il Pilastro della Chiave Pubblica\nRSA (1977) è il primo algoritmo asimmetrico ad aver trovato applicazione pratica su larga scala. La sua sicurezza si fonda sulla difficoltà del **problema della fattorizzazione intera**.\n\n### Matematica del Sistema\nSiano $p$ e $q$ due numeri primi grandi. Il modulo $n = p \\times q$ è pubblico. La chiave pubblica $e$ è scelta tale da essere coprima con $\\phi(n)$. La chiave privata $d$ è l'inverso moltiplicativo di $e$ modulo $\\phi(n)$.\nCifratura: $C = M^e \\pmod n$\nDecifratura: $M = C^d \\pmod n$\n\n### Parametri di Sicurezza\nOggi, chiavi inferiori a 2048 bit sono considerate insicure per il lungo termine. RSA è molto più lento della crittografia simmetrica e viene solitamente usato per scambiare una chiave AES, non per cifrare grandi moli di dati.",
            guide: "1. Seleziona la lunghezza della chiave (2048 o 4096 bit).\n2. Premi 'Generate' per creare la coppia di chiavi PEM.\n3. Copia la chiave pubblica al destinatario per permettergli di cifrare i messaggi rivolti a te."
        },
        DIFFIE_HELLMAN: {
            theory: "### La Rivoluzione dello Scambio Chiavi\nIl protocollo DH (1976) ha permesso per la prima volta a due parti di stabilire un segreto comune su un canale intercettato da terzi, senza aver mai scambiato informazioni segrete in precedenza.\n\n### Logaritmo Discreto\nSi basa sulla difficoltà di calcolare il logaritmo discreto. Alice e Bob concordano un primo $p$ e un generatore $g$. Ognuno sceglie un segreto privato ($a$ e $b$) e calcola la propria componente pubblica ($g^a \\pmod p$ e $g^b \\pmod p$). Scambiandosi questi valori, entrambi arrivano allo stesso segreto finale $g^{ab} \\pmod p$.\n\n### Protezione Man-in-the-Middle\nDH non fornisce autenticazione. Senza certificati digitali, un attaccante potrebbe interporsi tra Alice e Bob, spacciandosi per l'uno con l'altro e stabilendo due segreti distinti.",
            guide: "Simulazione interattiva: 1. Alice e Bob generano chiavi private. 2. Si scambiano le chiavi pubbliche. 3. Entrambi calcolano il segreto condiviso, che sarà identico per entrambi."
        },
        ECC: {
            theory: "### Crittografia a Curve Ellittiche\nECC rappresenta lo stato dell'arte della crittografia asimmetrica. Offre un livello di sicurezza equivalente a RSA ma con chiavi molto più corte (es. ECC 256 bit $\\approx$ RSA 3072 bit).\n\n### Geometria Algebrica\nInvece di lavorare con numeri interi e potenze, ECC lavora con punti su una curva definita dall'equazione $y^2 = x^3 + ax + b$. L'operazione di base è la 'moltiplicazione scalare' di un punto. Trovare quante volte un punto $P$ è stato sommato a se stesso per ottenere $Q$ è un problema intrattabile (ECDLP).\n\n### Vantaggi Pratici\nGrazie alle chiavi ridotte, ECC richiede meno memoria, meno energia e meno banda, rendendolo ideale per smartphone, dispositivi IoT e smart card.",
            guide: "Seleziona una curva standard (es. P-256 del NIST). Genera le chiavi e calcola il segreto condiviso. Nota come la rappresentazione della chiave sia più compatta rispetto a RSA."
        },
        MD5: { 
            theory: "### Un Gigante Caduto\nMD5 genera un digest a 128 bit. Sviluppato nel 1991, è stato per decenni lo standard per verificare l'integrità dei dati.\n\n### Stato della Sicurezza\nOggi MD5 è considerato **criptograficamente rotto**. Sono stati scoperti algoritmi in grado di generare collisioni (due file diversi con lo stesso hash) in pochi secondi su un normale PC. Non deve mai essere usato per firme digitali, password o qualsiasi applicazione di sicurezza.", 
            guide: "Utilizzalo solo per checksum di file non critici dove la velocità è l'unico requisito." 
        },
        SHA1: { 
            theory: "### Obsoleto e Pericoloso\nSHA-1 produce un digest a 160 bit. Pur essendo più robusto di MD5, è stato vittima di attacchi di collisione pratici (SHAttered, 2017).\n\n### Abbandono Globale\nLe autorità di certificazione hanno smesso di emettere certificati SHA-1 anni fa. Ogni sistema moderno deve migrare verso la famiglia SHA-2 o SHA-3 per garantire l'integrità dei dati a lungo termine.", 
            guide: "Algoritmo mostrato per scopi storici e comparativi. Osserva la lunghezza dell'hash rispetto a MD5 e SHA-256." 
        },
        SHA256: { 
            theory: "### Lo Standard di Integrità\nParte della famiglia SHA-2 progettata dalla NSA, produce un digest a 256 bit. È l'algoritmo di hash più utilizzato al mondo.\n\n### Applicazioni Critiche\nÈ la base della sicurezza di internet (TLS), dell'autenticazione software e del protocollo Bitcoin. Attualmente non sono noti attacchi pratici in grado di generare collisioni. Offre un equilibrio perfetto tra prestazioni e sicurezza impenetrabile.", 
            guide: "Standard consigliato per hashing di file, verifica di download e storage di password (con salt)." 
        },
        SHA512: { 
            theory: "### Potenza a 64-bit\nVariante a 512 bit di SHA-2. È ottimizzata per processori a 64 bit, dove può risultare addirittura più veloce di SHA-256 pur offrendo un margine di sicurezza doppio.\n\n### Resistenza Futura\nCon un digest così ampio, SHA-512 offre una protezione estrema contro attacchi di forza bruta e potenziali futuri algoritmi quantistici di ricerca collisioni (Algoritmo di Grover).", 
            guide: "Utilizzalo per dati ad altissima sensibilità o quando lavori su sistemi server ad alte prestazioni." 
        },
        SHA3: { 
            theory: "### L'Algoritmo Sponge\nSHA-3 (Keccak) è il vincitore del concorso NIST terminato nel 2012. A differenza di SHA-2, non usa la struttura Merkle-Damgård ma una costruzione a **Sponge**.\n\n### Diversità Crittografica\nEssendo strutturalmente diverso dai suoi predecessori, SHA-3 garantisce che, se venisse scoperta una vulnerabilità fondamentale in SHA-2, il mondo avrebbe un'alternativa sicura e testata pronta all'uso.", 
            guide: "Sperimenta con le diverse lunghezze del digest (224, 256, 384, 512 bit). SHA-3 è considerato il futuro della standardizzazione hash." 
        },
        BLAKE2: { 
            theory: "### Più Veloce di MD5, Più Sicuro di SHA-3\nBLAKE2b è un'evoluzione del finalista SHA-3 BLAKE. È progettato per essere estremamente veloce in software, superando quasi ogni altro algoritmo su processori moderni.\n\n### Caratteristiche\nInclude funzionalità native per l'hashing personalizzato, l'hashing ad albero e l'uso di chiavi, rendendolo estremamente versatile per gli sviluppatori.", 
            guide: "Ideale per checksum di grandi dataset in tempi record senza sacrificare la sicurezza crittografica." 
        },
        BLAKE3: { 
            theory: "### Parallelismo Estremo\nBLAKE3 è l'ultimo nato nella famiglia BLAKE (2020). Utilizza una struttura interna ad albero Merkle che permette di parallelizzare il calcolo dell'hash su tutti i core della CPU e su istruzioni vettoriali (SIMD).\n\n### Prestazioni Ineguagliate\nPuò essere fino a 10-15 volte più veloce di SHA-256. È la scelta perfetta per sistemi che devono processare gigabyte di dati al secondo garantendo l'immutabilità.", 
            guide: "Confronta la velocità di generazione dell'hash su testi lunghi rispetto a SHA-512." 
        },
        HMAC: { 
            theory: "### Autenticazione Robusta\nHMAC (Keyed-Hash Message Authentication Code) non è una funzione hash, ma un meccanismo che le utilizza insieme a una chiave segreta.\n\n### Perché non basta un Hash?\nSe concatenassimo semplicemente Chiave+Messaggio e ne facessimo l'hash, il sistema sarebbe vulnerabile ad attacchi di 'Length Extension'. HMAC risolve questo problema eseguendo due passaggi di hashing con pad interni ed esterni specifici, garantendo che nessuno possa alterare il messaggio senza conoscere la chiave.", 
            guide: "Inserisci sia il messaggio che la chiave segreta. L'output è un autenticatore che prova che il messaggio è integro e proviene da una fonte fidata." 
        },
        CMAC: { 
            theory: "### Autenticazione tramite Cifrario\nCMAC utilizza un cifrario a blocchi (AES) per generare un codice di autenticazione. È ampiamente utilizzato negli standard bancari e nei protocolli di comunicazione industriale.\n\n### Efficienza Hardware\nIn molti dispositivi embedded, è disponibile un'accelerazione hardware per AES ma non per le funzioni hash. CMAC permette di ottenere un'autenticazione forte riutilizzando lo stesso motore crittografico della cifratura, risparmiando spazio e memoria.", 
            guide: "Seleziona la lunghezza della chiave AES (128 o 256 bit). Il MAC risultante è derivato dall'ultimo blocco cifrato della catena CBC." 
        }
    }
  },
  en: {
    title: 'CryptoFlow',
    subtitle: 'Advanced Scientific Cryptography Hub',
    inputPlaceholder: 'Type input text or ciphertext...',
    outputPlaceholder: 'Waiting for computational output...',
    cipherInput: 'Plaintext',
    cipherOutput: 'Processed Result',
    decipherInput: 'Ciphertext',
    decipherOutput: 'Recovered Plaintext',
    key: 'Encryption Key',
    shift: 'Modular Shift',
    encrypt: 'Encryption Module',
    decrypt: 'Decryption Module',
    copy: 'Copy to Clipboard',
    clear: 'Reset Fields',
    transfer: 'Send to Decryptor',
    console: 'System Console',
    consolePlaceholder: 'No activity detected...',
    sidebarTitle: 'Algorithm Taxonomy',
    tooltips: {
        catClassical: 'Historical substitution and transposition systems',
        catSymmetric: 'Shared key encryption for high efficiency',
        catAsymmetric: 'Public key systems based on hard math problems',
        catHashing: 'One-way transformations for data integrity',
        catMac: 'Key-based authentication codes',
        clearInput: 'Delete current data',
        copyOutput: 'Copy output to clipboard',
        transfer: 'Move data to receiving module',
        randomize: 'Generate pseudo-random vector',
        newParams: 'Recalculate group parameters',
        sendKey: 'Transmit public component',
        getKey: 'Inquire remote public component',
        openGuide: 'View academic documentation'
    },
    categories: {
      CLASSICAL: 'Classical Cryptography',
      SYMMETRIC: 'Symmetric Ciphers',
      ASYMMETRIC: 'Asymmetric Systems',
      HASHING: 'Hash Functions',
      MAC: 'Message Auth Codes (MAC)',
      GENERAL: 'Crypto Science'
    },
    categoryDetails: {
      GENERAL: "Modern Cryptography is the mathematical science... [Detailed English content placeholder]",
      CLASSICAL: "Classical ciphers form the historical legacy... [Detailed English content placeholder]",
      SYMMETRIC: "Symmetric-key algorithms are the backbone... [Detailed English content placeholder]",
      ASYMMETRIC: "Asymmetric (Public-key) cryptography solved... [Detailed English content placeholder]",
      HASHING: "Cryptographic Hash Functions are one-way algorithms... [Detailed English content placeholder]",
      MAC: "Message Authentication Codes (MACs) are security... [Detailed English content placeholder]"
    },
    algorithms: {
        CAESAR: 'Caesar Cipher',
        VIGENERE: 'Vigenère Cipher',
        PLAYFAIR: 'Playfair Cipher',
        MONOALPHABETIC: 'Mono-Substitution',
        AES: 'AES (Advanced Encryption Standard)',
        DES: 'DES (Data Encryption Standard)',
        TRIPLE_DES: '3DES (Triple DES)',
        RC4: 'RC4 (Rivest Cipher 4)',
        CHACHA20: 'ChaCha20-Poly1305',
        RSA: 'RSA (Rivest-Shamir-Adleman)',
        DIFFIE_HELLMAN: 'Diffie-Hellman Key Exchange',
        ECC: 'Elliptic Curve Cryptography',
        MD5: 'Message Digest 5',
        SHA1: 'Secure Hash Algorithm 1',
        SHA256: 'SHA-256 (SHA-2 Family)',
        SHA512: 'SHA-512 (SHA-2 Family)',
        SHA3: 'SHA-3 (Keccak)',
        BLAKE2: 'BLAKE2b',
        BLAKE3: 'BLAKE3 (Parallel Hash)',
        HMAC: 'HMAC (Hash-based MAC)',
        CMAC: 'CMAC (Cipher-based MAC)',
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
