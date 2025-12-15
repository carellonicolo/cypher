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
  sha3Length: Sha3Length;
  // RSA specific
  rsaKeyPair?: CryptoKeyPair; 
  rsaPubPem?: string;
  rsaPrivPem?: string;
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
      sha3: {
        '224': 'SHA3-224',
        '256': 'SHA3-256',
        '384': 'SHA3-384',
        '512': 'SHA3-512',
      }
    },
    padding: 'Padding'
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
      sha3: {
        '224': 'SHA3-224',
        '256': 'SHA3-256',
        '384': 'SHA3-384',
        '512': 'SHA3-512',
      }
    },
    padding: 'Padding Scheme'
  }
};