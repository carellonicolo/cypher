export type Language = 'it' | 'en';
export type Theme = 'light' | 'dark';

export enum AlgorithmType {
  CAESAR = 'CAESAR',
  VIGENERE = 'VIGENERE',
  AES = 'AES',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'process';
  message: string;
}

export interface CryptoState {
  input: string;
  output: string;
  key: string;
  shift: number; // For Caesar
  isEncrypting: boolean;
  algorithm: AlgorithmType;
}

export const LABELS = {
  it: {
    title: 'CryptoFlow',
    subtitle: 'Simulatore Didattico di Crittografia',
    inputPlaceholder: 'Inserisci il testo qui...',
    outputPlaceholder: 'Il risultato apparirà qui...',
    key: 'Chiave Segreta',
    shift: 'Spostamento (Shift)',
    encrypt: 'Cifra',
    decrypt: 'Decifra',
    copy: 'Copia',
    clear: 'Pulisci',
    console: 'Console di Sistema',
    consolePlaceholder: 'In attesa di operazioni...',
    algorithms: {
      CAESAR: 'Cifrario di Cesare',
      VIGENERE: 'Cifrario di Vigenère',
      AES: 'AES-GCM (Simmetrico Moderno)',
    },
    descriptions: {
      CAESAR: 'Un semplice cifrario a sostituzione monoalfabetica in cui ogni lettera è spostata di un numero fisso di posizioni.',
      VIGENERE: 'Un metodo di cifratura polialfabetica che usa una serie di diversi cifrari di Cesare basati sulle lettere di una parola chiave.',
      AES: 'Advanced Encryption Standard. Uno standard moderno utilizzato in tutto il mondo per proteggere i dati sensibili.',
    }
  },
  en: {
    title: 'CryptoFlow',
    subtitle: 'Educational Cryptography Simulator',
    inputPlaceholder: 'Enter text here...',
    outputPlaceholder: 'Result will appear here...',
    key: 'Secret Key',
    shift: 'Shift Amount',
    encrypt: 'Encrypt',
    decrypt: 'Decrypt',
    copy: 'Copy',
    clear: 'Clear',
    console: 'System Console',
    consolePlaceholder: 'Waiting for operations...',
    algorithms: {
      CAESAR: 'Caesar Cipher',
      VIGENERE: 'Vigenère Cipher',
      AES: 'AES-GCM (Modern Symmetric)',
    },
    descriptions: {
      CAESAR: 'A simple monoalphabetic substitution cipher where each letter is shifted by a fixed number of positions.',
      VIGENERE: 'A polyalphabetic substitution method using a series of different Caesar ciphers based on the letters of a keyword.',
      AES: 'Advanced Encryption Standard. A modern standard used worldwide to secure sensitive data.',
    }
  }
};