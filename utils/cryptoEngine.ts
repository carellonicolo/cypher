// Utility to handle pure logic
import { AesMode, AlgorithmType, VigenereMode, Sha3Length } from '../types';
import { sha3_224, sha3_256, sha3_384, sha3_512 } from 'js-sha3';

/* ================= CLASSICAL ALGORITHMS ================= */

export const caesarCipher = (text: string, shift: number, decrypt: boolean = false): string => {
  const s = decrypt ? (26 - (shift % 26)) : (shift % 26);
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base + s) % 26) + base);
  });
};

export const vigenereCipher = (text: string, key: string, decrypt: boolean = false, mode: VigenereMode = VigenereMode.REPEATING): string => {
  if (!key) return text;
  
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleanKey.length === 0) return text;

  let result = '';
  let keyIndex = 0;
  let currentKeyStream: number[] = [];
  
  for(let i = 0; i < cleanKey.length; i++) {
    currentKeyStream.push(cleanKey.charCodeAt(i) - 65);
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const base = char >= 'a' ? 97 : 65;
      let shift = 0;
      
      if (mode === VigenereMode.REPEATING) {
        shift = currentKeyStream[keyIndex % currentKeyStream.length];
      } else {
        if (keyIndex < currentKeyStream.length) {
          shift = currentKeyStream[keyIndex];
        } else {
          shift = 0; 
        }
      }

      const actualShift = decrypt ? (26 - shift) : shift;
      const charCode = char.charCodeAt(0) - base;
      const newCharCode = ((charCode + actualShift) % 26);
      const processedChar = String.fromCharCode(newCharCode + base);
      
      result += processedChar;

      if (mode === VigenereMode.AUTOKEY) {
        if (decrypt) {
          currentKeyStream.push(newCharCode);
        } else {
          currentKeyStream.push(charCode);
        }
      }
      
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
};

// --- Playfair ---
export const playfairCipher = (text: string, key: string, decrypt: boolean = false): string => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // No J
  const cleanKey = (key.toUpperCase().replace(/[^A-Z]/g, '') + alphabet).replace(/J/g, 'I');
  
  // Create 5x5 Matrix
  const matrix: string[] = [];
  const seen = new Set();
  for (const char of cleanKey) {
    if (!seen.has(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }

  // Preprocess Text
  let input = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  if (!decrypt) {
    // Insert X between doubles
    for (let i = 0; i < input.length - 1; i += 2) {
      if (input[i] === input[i + 1]) {
        input = input.slice(0, i + 1) + 'X' + input.slice(i + 1);
      }
    }
    if (input.length % 2 !== 0) input += 'X';
  }

  const result: string[] = [];
  const shift = decrypt ? 4 : 1; // 4 is -1 mod 5

  for (let i = 0; i < input.length; i += 2) {
    const a = input[i];
    const b = input[i + 1] || 'X';
    
    const idxA = matrix.indexOf(a);
    const idxB = matrix.indexOf(b);
    
    const rowA = Math.floor(idxA / 5), colA = idxA % 5;
    const rowB = Math.floor(idxB / 5), colB = idxB % 5;
    
    if (rowA === rowB) {
      result.push(matrix[rowA * 5 + (colA + shift) % 5]);
      result.push(matrix[rowB * 5 + (colB + shift) % 5]);
    } else if (colA === colB) {
      result.push(matrix[((rowA + shift) % 5) * 5 + colA]);
      result.push(matrix[((rowB + shift) % 5) * 5 + colB]);
    } else {
      result.push(matrix[rowA * 5 + colB]);
      result.push(matrix[rowB * 5 + colA]);
    }
  }

  return result.join('');
};

// --- Monoalphabetic Substitution ---
export const substitutionCipher = (text: string, key: string, decrypt: boolean = false): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  // Generate distinct key map
  const cleanKey = Array.from(new Set((key.toLowerCase().replace(/[^a-z]/g, '') + alphabet).split(''))).join('');
  
  const map: Record<string, string> = {};
  for(let i=0; i<26; i++) {
    if(decrypt) map[cleanKey[i]] = alphabet[i];
    else map[alphabet[i]] = cleanKey[i];
  }

  return text.replace(/[a-zA-Z]/g, (char) => {
    const lower = char.toLowerCase();
    const mapped = map[lower] || lower;
    return char === lower ? mapped : mapped.toUpperCase();
  });
};


/* ================= HASHING ================= */

export const computeHash = async (text: string, algo: AlgorithmType, sha3Len: Sha3Length = Sha3Length.L512): Promise<string> => {
  if (!text) return "";
  
  if (algo === AlgorithmType.MD5) {
      return "098f6bcd4621d373cade4e832627b4f6 (MD5 requires external lib)";
  }

  if (algo === AlgorithmType.SHA3) {
    try {
      switch (sha3Len) {
        case Sha3Length.L224: return sha3_224(text);
        case Sha3Length.L256: return sha3_256(text);
        case Sha3Length.L384: return sha3_384(text);
        case Sha3Length.L512: return sha3_512(text);
        default: return sha3_512(text);
      }
    } catch (e) {
      return "Error computing SHA3: " + String(e);
    }
  }

  const enc = new TextEncoder();
  const data = enc.encode(text);
  
  let hashBuffer;
  
  try {
    switch (algo) {
      case AlgorithmType.SHA1:
        hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
        break;
      case AlgorithmType.SHA256:
        hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        break;
      case AlgorithmType.SHA512:
        hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
        break;
      default:
        return "Hash algorithm not supported natively";
    }
  } catch (e) {
    return "Error computing hash: " + String(e);
  }
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/* ================= SYMMETRIC (MODERN & LEGACY) ================= */

export const aesEncrypt = async (text: string, password: string, mode: AesMode = AesMode.GCM): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(password.padEnd(16, '0')), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: enc.encode("salty_salt"), iterations: 1000, hash: "SHA-256" },
      keyMaterial, { name: `AES-${mode}`, length: 256 }, true, ["encrypt", "decrypt"]
    );

    let iv: Uint8Array;
    let algorithmParams: any;

    if (mode === AesMode.GCM) {
      iv = window.crypto.getRandomValues(new Uint8Array(12));
      algorithmParams = { name: "AES-GCM", iv: iv };
    } else if (mode === AesMode.CBC) {
      iv = window.crypto.getRandomValues(new Uint8Array(16));
      algorithmParams = { name: "AES-CBC", iv: iv };
    } else { 
      iv = window.crypto.getRandomValues(new Uint8Array(16));
      algorithmParams = { name: "AES-CTR", counter: iv, length: 64 };
    }

    const encryptedContent = await window.crypto.subtle.encrypt(algorithmParams, key, enc.encode(text));
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    let binary = '';
    for (let i = 0; i < combined.byteLength; i++) binary += String.fromCharCode(combined[i]);
    return window.btoa(binary);
  } catch (e) {
    return "Error: " + (e as Error).message;
  }
};

export const aesDecrypt = async (ciphertext: string, password: string, mode: AesMode = AesMode.GCM): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const cleanCipher = ciphertext.trim().replace(/\s/g, '');
    let binary = window.atob(cleanCipher);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    let ivLength = (mode === AesMode.GCM) ? 12 : 16;
    if (bytes.length < ivLength) return "Error: Invalid Data";

    const iv = bytes.slice(0, ivLength);
    const data = bytes.slice(ivLength);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(password.padEnd(16, '0')), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: enc.encode("salty_salt"), iterations: 1000, hash: "SHA-256" },
      keyMaterial, { name: `AES-${mode}`, length: 256 }, true, ["encrypt", "decrypt"]
    );

    let algorithmParams: any;
    if (mode === AesMode.GCM) algorithmParams = { name: "AES-GCM", iv: iv };
    else if (mode === AesMode.CBC) algorithmParams = { name: "AES-CBC", iv: iv };
    else algorithmParams = { name: "AES-CTR", counter: iv, length: 64 };

    const decryptedContent = await window.crypto.subtle.decrypt(algorithmParams, key, data);
    return dec.decode(decryptedContent);
  } catch (e) {
    return "Error: Decryption Failed";
  }
};

// --- Legacy Simulations (DES/3DES) ---
// Since DES/3DES are removed from WebCrypto, we simulate them using AES with weakened parameters or visual shifts
// to purely demonstrate the concept in an educational app without 500 lines of polyfill code.
export const legacySimulationEncrypt = (text: string, type: 'DES' | '3DES'): string => {
  // Educational Simulation: Just scramble Base64 to look like ciphertext
  return `[${type}-SIMULATED]::` + window.btoa(text.split('').reverse().join('')); 
};

export const legacySimulationDecrypt = (text: string, type: 'DES' | '3DES'): string => {
  const prefix = `[${type}-SIMULATED]::`;
  if (!text.startsWith(prefix)) return "Error: Invalid Legacy format";
  const payload = text.replace(prefix, '');
  try {
    return window.atob(payload).split('').reverse().join('');
  } catch { return "Error"; }
};

/* ================= ASYMMETRIC (RSA) ================= */

export const generateRSAKeys = async (): Promise<{ kp: CryptoKeyPair, pubPem: string, privPem: string }> => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const pubBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  const pubPem = `-----BEGIN PUBLIC KEY-----\n${window.btoa(String.fromCharCode(...new Uint8Array(pubBuffer)))}\n-----END PUBLIC KEY-----`;
  const privPem = `-----BEGIN PRIVATE KEY-----\n${window.btoa(String.fromCharCode(...new Uint8Array(privBuffer)))}\n-----END PRIVATE KEY-----`;

  return { kp: keyPair, pubPem, privPem };
};

export const rsaEncrypt = async (text: string, publicKey: CryptoKey): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      enc.encode(text)
    );
    return window.btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch(e) { return "RSA Encrypt Error"; }
};

export const rsaDecrypt = async (text: string, privateKey: CryptoKey): Promise<string> => {
  try {
    const dec = new TextDecoder();
    const binary = window.atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      bytes
    );
    return dec.decode(decrypted);
  } catch(e) { return "RSA Decrypt Error (Key Mismatch?)"; }
};
