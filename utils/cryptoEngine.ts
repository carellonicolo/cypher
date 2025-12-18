// Utility to handle pure logic
import { AesMode, AlgorithmType, VigenereMode, Sha3Length, LegacyKeyMode, DhGroup, DhBitLength, EccCurve, AesKeyLength } from '../types';

// Access global libraries loaded via <script> tags in index.html
const getGlobalMD5 = () => (window as any).md5;
const getGlobalSHA3 = () => (window as any).sha3_512 ? (window as any) : null;
const getGlobalBLAKE2 = () => (window as any).blakejs;
const getGlobalBLAKE3 = () => (window as any).hashwasm?.blake3;

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

// Helper to get matrix for visualization
export const getPlayfairMatrix = (key: string): string[] => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // No J
  const cleanKey = (key.toUpperCase().replace(/[^A-Z]/g, '') + alphabet).replace(/J/g, 'I');
  
  const matrix: string[] = [];
  const seen = new Set();
  for (const char of cleanKey) {
    if (!seen.has(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }
  return matrix;
}

export const playfairCipher = (text: string, key: string, decrypt: boolean = false): string => {
  const matrix = getPlayfairMatrix(key);

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

export const getSubstitutionAlphabet = (key: string): Record<string, string> => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const cleanKey = Array.from(new Set((key.toLowerCase().replace(/[^a-z]/g, '') + alphabet).split(''))).join('');
    const map: Record<string, string> = {};
    for(let i=0; i<26; i++) {
        map[alphabet[i]] = cleanKey[i];
    }
    return map;
}

export const substitutionCipher = (text: string, key: string, decrypt: boolean = false): string => {
  const map = getSubstitutionAlphabet(key);
  
  // Invert map for decryption
  const activeMap: Record<string, string> = {};
  if (decrypt) {
      Object.entries(map).forEach(([k, v]) => activeMap[v] = k);
  } else {
      Object.assign(activeMap, map);
  }

  return text.replace(/[a-zA-Z]/g, (char) => {
    const lower = char.toLowerCase();
    const mapped = activeMap[lower] || lower;
    return char === lower ? mapped : mapped.toUpperCase();
  });
};


/* ================= HASHING & MAC ================= */

export const computeHash = async (text: string, algo: AlgorithmType, variantParam: string = Sha3Length.L512, key?: string): Promise<string> => {
  if (!text && algo !== AlgorithmType.HMAC && algo !== AlgorithmType.CMAC) return "";
  
  if (algo === AlgorithmType.MD5) {
      try {
        const md5Func = getGlobalMD5();
        if (typeof md5Func === 'function') return md5Func(text);
        return "Error: MD5 library failed to load";
      } catch (e) { return "Error computing MD5: " + String(e); }
  }

  if (algo === AlgorithmType.SHA3) {
    try {
      const sha3Lib = getGlobalSHA3();
      if (!sha3Lib) return "Error: SHA3 library failed to load.";
      const funcName = `sha3_${variantParam}`;
      if (typeof sha3Lib[funcName] === 'function') return sha3Lib[funcName](text);
      else if (typeof sha3Lib === 'function' && variantParam === Sha3Length.L512) return sha3Lib(text);
      return "Error: SHA3 function not found.";
    } catch (e) { return "Error computing SHA3: " + String(e); }
  }

  if (algo === AlgorithmType.BLAKE2) {
    try {
      const blake2 = getGlobalBLAKE2();
      if (!blake2 || !blake2.blake2bHex) return "Error: BLAKE2 library failed to load.";
      return blake2.blake2bHex(text);
    } catch (e) { return "Error computing BLAKE2: " + String(e); }
  }

  if (algo === AlgorithmType.BLAKE3) {
    try {
        const blake3Func = getGlobalBLAKE3();
        if (typeof blake3Func === 'function') {
            return await blake3Func(text);
        }
        return "Error: BLAKE3 library failed to load";
    } catch (e) { return "Error computing BLAKE3: " + String(e); }
  }

  const enc = new TextEncoder();
  const data = enc.encode(text);

  // HMAC
  if (algo === AlgorithmType.HMAC) {
      if (!key) return "Error: Key required for HMAC";
      try {
          const cryptoKey = await window.crypto.subtle.importKey(
              "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
          );
          const sig = await window.crypto.subtle.sign("HMAC", cryptoKey, data);
          return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) { return "Error computing HMAC: " + String(e); }
  }

  // CMAC (Simulated via AES-CBC Last Block - Educational)
  if (algo === AlgorithmType.CMAC) {
      if (!key) return "Error: Key required for CMAC";
      try {
          // Determine Key Length (128 or 256 bits) based on variantParam
          const targetKeyBits = parseInt(variantParam) === 128 ? 128 : 256;
          
          // Use SHA-256 to derive a consistent key from the user input
          const hashBuffer = await window.crypto.subtle.digest("SHA-256", enc.encode(key));
          const rawHash = new Uint8Array(hashBuffer);
          
          // If 128-bit requested, take first 16 bytes. If 256-bit, take full 32 bytes.
          const keyBytes = targetKeyBits === 128 ? rawHash.slice(0, 16) : rawHash;

          const cryptoKey = await window.crypto.subtle.importKey(
            "raw", keyBytes, 
            { name: "AES-CBC" }, false, ["encrypt"]
          );
          
          const iv = new Uint8Array(16); // Zero IV for CMAC simulation
          const encrypted = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv }, cryptoKey, data);
          const bytes = new Uint8Array(encrypted);
          
          // Take last 16 bytes (block) as the MAC
          const lastBlock = bytes.slice(bytes.length - 16);
          return Array.from(lastBlock).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) { return "Error computing CMAC: " + String(e); }
  }
  
  let hashBuffer;
  try {
    switch (algo) {
      case AlgorithmType.SHA1: hashBuffer = await window.crypto.subtle.digest('SHA-1', data); break;
      case AlgorithmType.SHA256: hashBuffer = await window.crypto.subtle.digest('SHA-256', data); break;
      case AlgorithmType.SHA512: hashBuffer = await window.crypto.subtle.digest('SHA-512', data); break;
      default: return "Hash algorithm not supported natively";
    }
  } catch (e) { return "Error computing hash: " + String(e); }
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/* ================= SYMMETRIC (MODERN & STREAM) ================= */

// RC4 Implementation (Manual)
export const rc4Cipher = (text: string, key: string): string => {
    if (!key) return "Error: Key required";
    const s = new Uint8Array(256);
    for(let i=0; i<256; i++) s[i] = i;
    let j = 0;
    const k = new TextEncoder().encode(key);
    if(k.length === 0) return text;
    
    for(let i=0; i<256; i++) {
        j = (j + s[i] + k[i % k.length]) % 256;
        [s[i], s[j]] = [s[j], s[i]];
    }

    let i=0; j=0;
    const input = new TextEncoder().encode(text);
    const output = new Uint8Array(input.length);

    for(let n=0; n<input.length; n++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        [s[i], s[j]] = [s[j], s[i]];
        const keystreamByte = s[(s[i] + s[j]) % 256];
        output[n] = input[n] ^ keystreamByte;
    }

    // Convert to Hex for display to handle non-printable chars safely
    return Array.from(output).map(b => b.toString(16).padStart(2, '0')).join('');
};

// RC4 Decrypt (XOR is symmetric, so encryption logic is same, but input format differs if we output Hex)
export const rc4Decrypt = (hex: string, key: string): string => {
     // Hex to bytes
     const cleanHex = hex.replace(/\s/g, '');
     if (cleanHex.length % 2 !== 0) return "Error: Invalid Hex";
     
     // To decrypt RC4, we just re-run the stream gen. 
     // We need to pass the raw bytes of ciphertext to the cipher function
     // But my rc4Cipher above accepts string input. 
     // Let's copy logic for byte-to-string decrypt.
     
     if (!key) return "Error: Key required";
     const bytes = new Uint8Array(cleanHex.length / 2);
     for(let i=0; i<cleanHex.length; i+=2) bytes[i/2] = parseInt(cleanHex.substr(i, 2), 16);

     const s = new Uint8Array(256);
     for(let i=0; i<256; i++) s[i] = i;
     let j = 0;
     const k = new TextEncoder().encode(key);
     
     for(let i=0; i<256; i++) {
        j = (j + s[i] + k[i % k.length]) % 256;
        [s[i], s[j]] = [s[j], s[i]];
    }

    let i=0; j=0;
    const output = new Uint8Array(bytes.length);
    for(let n=0; n<bytes.length; n++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        [s[i], s[j]] = [s[j], s[i]];
        const keystreamByte = s[(s[i] + s[j]) % 256];
        output[n] = bytes[n] ^ keystreamByte;
    }
    
    return new TextDecoder().decode(output);
}

export const chachaEncrypt = async (text: string, password: string): Promise<string> => {
    try {
        const enc = new TextEncoder();
        // Key Derivation
        const keyMaterial = await window.crypto.subtle.importKey(
          "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
        );
        const key = await window.crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: enc.encode("chacha_salt"), iterations: 1000, hash: "SHA-256" },
          keyMaterial, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"] 
        );
        
        const rawKey = await window.crypto.subtle.exportKey("raw", key);
        const chachaKey = await window.crypto.subtle.importKey("raw", rawKey, "ChaCha20-Poly1305", false, ["encrypt", "decrypt"]);

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt({ name: "ChaCha20-Poly1305", iv: iv }, chachaKey, enc.encode(text));

        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        let binary = '';
        for (let i = 0; i < combined.byteLength; i++) binary += String.fromCharCode(combined[i]);
        return window.btoa(binary);
    } catch(e) {
        return "Error: Browser may not support ChaCha20-Poly1305 natively.";
    }
}

export const chachaDecrypt = async (ciphertext: string, password: string): Promise<string> => {
    try {
        const enc = new TextEncoder();
        const cleanCipher = ciphertext.trim().replace(/\s/g, '');
        let binary = window.atob(cleanCipher);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const iv = bytes.slice(0, 12);
        const data = bytes.slice(12);

        const keyMaterial = await window.crypto.subtle.importKey(
          "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
        );
        const key = await window.crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: enc.encode("chacha_salt"), iterations: 1000, hash: "SHA-256" },
          keyMaterial, { name: "AES-GCM", length: 256 }, true, ["encrypt"]
        );
        const rawKey = await window.crypto.subtle.exportKey("raw", key);
        const chachaKey = await window.crypto.subtle.importKey("raw", rawKey, "ChaCha20-Poly1305", false, ["encrypt", "decrypt"]);

        const decrypted = await window.crypto.subtle.decrypt({ name: "ChaCha20-Poly1305", iv: iv }, chachaKey, data);
        return new TextDecoder().decode(decrypted);
    } catch(e) {
        return "Error: Decryption Failed";
    }
}

// AES Functions
export const aesEncrypt = async (text: string, password: string, mode: AesMode = AesMode.GCM, keyLength: AesKeyLength = AesKeyLength.L256): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const bits = parseInt(keyLength);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(password.padEnd(16, '0')), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: enc.encode("salty_salt"), iterations: 1000, hash: "SHA-256" },
      keyMaterial, { name: `AES-${mode === AesMode.ECB ? 'CBC' : mode}`, length: bits }, true, ["encrypt", "decrypt"]
    );

    let iv: Uint8Array;
    let algorithmParams: any;

    if (mode === AesMode.GCM) {
      iv = window.crypto.getRandomValues(new Uint8Array(12));
      algorithmParams = { name: "AES-GCM", iv: iv };
    } else if (mode === AesMode.CBC || mode === AesMode.ECB) { 
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

export const aesDecrypt = async (ciphertext: string, password: string, mode: AesMode = AesMode.GCM, keyLength: AesKeyLength = AesKeyLength.L256): Promise<string> => {
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
    const bits = parseInt(keyLength);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(password.padEnd(16, '0')), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: enc.encode("salty_salt"), iterations: 1000, hash: "SHA-256" },
      keyMaterial, { name: `AES-${mode === AesMode.ECB ? 'CBC' : mode}`, length: bits }, true, ["encrypt", "decrypt"]
    );

    let algorithmParams: any;
    if (mode === AesMode.GCM) algorithmParams = { name: "AES-GCM", iv: iv };
    else if (mode === AesMode.CBC || mode === AesMode.ECB) algorithmParams = { name: "AES-CBC", iv: iv };
    else algorithmParams = { name: "AES-CTR", counter: iv, length: 64 };

    const decryptedContent = await window.crypto.subtle.decrypt(algorithmParams, key, data);
    return dec.decode(decryptedContent);
  } catch (e) {
    return "Error: Decryption Failed";
  }
};

// ... (Rest of legacy and asymmetric functions remain unchanged) ...
export const legacySimulationEncrypt = (text: string, type: 'DES' | '3DES', keyMode: LegacyKeyMode, blockMode: AesMode): string => {
  let processed = text;
  if (keyMode === LegacyKeyMode.DES56) {
      processed = text.split('').reverse().join('');
  } else if (keyMode === LegacyKeyMode.TDES112) {
      processed = text.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).reverse().join('');
  } else if (keyMode === LegacyKeyMode.TDES168) {
      processed = text.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 2)).reverse().join('');
  } else {
      processed = text.split('').reverse().join('');
  }
  const modeStr = blockMode === AesMode.ECB ? 'ECB' : 'CBC';
  return `[${type}-${keyMode}-${modeStr}-SIM]::` + window.btoa(processed); 
};

export const legacySimulationDecrypt = (text: string, type: 'DES' | '3DES', keyMode: LegacyKeyMode, blockMode: AesMode): string => {
  const modeStr = blockMode === AesMode.ECB ? 'ECB' : 'CBC';
  const possiblePrefix = `[${type}-${keyMode}-${modeStr}-SIM]::`;
  if (!text.startsWith(possiblePrefix)) return `Error: Invalid Format (Expected ${possiblePrefix})`;
  const payload = text.replace(possiblePrefix, '');
  try {
    const decoded = window.atob(payload);
    if (keyMode === LegacyKeyMode.DES56) {
        return decoded.split('').reverse().join('');
    } else if (keyMode === LegacyKeyMode.TDES112) {
        return decoded.split('').reverse().map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join('');
    } else if (keyMode === LegacyKeyMode.TDES168) {
        return decoded.split('').reverse().map(c => String.fromCharCode(c.charCodeAt(0) - 2)).join('');
    } else {
        return decoded.split('').reverse().join('');
    }
  } catch { return "Error"; }
};

export const generateRSAKeys = async (modulusLength: number = 2048): Promise<{ kp: CryptoKeyPair, pubPem: string, privPem: string }> => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: modulusLength,
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

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
  const b64 = pem.replace(/(-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----|\n|\s)/g, '');
  const str = window.atob(b64);
  const buf = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
  return buf.buffer;
};

export const rsaEncrypt = async (text: string, key: CryptoKey | string): Promise<string> => {
  try {
    let publicKey: CryptoKey;
    if (typeof key === 'string') {
        try {
            publicKey = await window.crypto.subtle.importKey(
                "spki",
                pemToArrayBuffer(key),
                { name: "RSA-OAEP", hash: "SHA-256" },
                false,
                ["encrypt"]
            );
        } catch (e) {
            return "Error: Invalid RSA Public Key Format";
        }
    } else {
        publicKey = key;
    }

    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      enc.encode(text)
    );
    return window.btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch(e) { return "RSA Encrypt Error"; }
};

export const rsaDecrypt = async (text: string, key: CryptoKey | string): Promise<string> => {
  try {
    let privateKey: CryptoKey;
    if (typeof key === 'string') {
        try {
            privateKey = await window.crypto.subtle.importKey(
                "pkcs8",
                pemToArrayBuffer(key),
                { name: "RSA-OAEP", hash: "SHA-256" },
                false,
                ["decrypt"]
            );
        } catch(e) {
            return "Error: Invalid RSA Private Key Format";
        }
    } else {
        privateKey = key;
    }

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

export const generateECCKeys = async (curve: string): Promise<{ kp: CryptoKeyPair, pubHex: string, privHex: string }> => {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: curve },
        true,
        ["deriveKey", "deriveBits"]
    );
    const pubJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    const privJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    return { 
        kp: keyPair, 
        pubHex: JSON.stringify({ x: pubJwk.x, y: pubJwk.y }), 
        privHex: JSON.stringify({ d: privJwk.d }) 
    };
};

export const eccCalculate = async (privKey: CryptoKey, otherPubJwkStr: string, curve: string): Promise<{ shared: string }> => {
    try {
        const otherJwk = JSON.parse(otherPubJwkStr);
        const peerKey = await window.crypto.subtle.importKey(
            "jwk", 
            { kty: "EC", crv: curve, x: otherJwk.x, y: otherJwk.y, ext: true }, 
            { name: "ECDH", namedCurve: curve }, 
            false, 
            []
        );

        const sharedBits = await window.crypto.subtle.deriveBits(
            { name: "ECDH", public: peerKey },
            privKey,
            256
        );
        return { shared: Array.from(new Uint8Array(sharedBits)).map(b => b.toString(16).padStart(2, '0')).join('') };
    } catch(e) {
        return { shared: "Error: Invalid Peer Key" };
    }
};

const DH_GROUPS = {
  [DhGroup.MODP_14]: {
    p: "0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF",
    g: "2"
  },
  [DhGroup.MODP_15]: {
    p: "0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF",
    g: "2"
  }
};

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const isPrime = (n: number) => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

export const dhGenerateParams = (group: DhGroup = DhGroup.TOY): { p: string, g: string } => {
  if (group === DhGroup.TOY) {
    let p = 0;
    while (!isPrime(p)) {
      p = getRandomInt(1000, 9999);
    }
    const g = getRandomInt(2, 50); 
    return { p: p.toString(), g: g.toString() };
  } else {
    const params = DH_GROUPS[group];
    return { 
        p: BigInt(params.p).toString(), 
        g: BigInt(params.g).toString() 
    };
  }
};

export const dhGeneratePrivateKey = (pStr: string, group: DhGroup = DhGroup.TOY, bitLength: DhBitLength = DhBitLength.NATIVE): string => {
    if (bitLength !== DhBitLength.NATIVE) {
        const bits = parseInt(bitLength);
        const bytes = Math.ceil(bits / 8);
        const array = new Uint8Array(bytes);
        window.crypto.getRandomValues(array);
        let hex = "0x";
        for(let i=0; i<array.length; i++) {
            hex += array[i].toString(16).padStart(2, '0');
        }
        return BigInt(hex).toString();
    }

    if (group === DhGroup.TOY) {
        try {
            const prime = BigInt(pStr);
            if (prime <= 2n) return "2";
            if (prime < 9007199254740991n) {
                const pNum = Number(prime);
                return getRandomInt(2, Math.max(2, pNum - 2)).toString();
            } else {
                 const array = new Uint8Array(4); 
                 window.crypto.getRandomValues(array);
                 const r = BigInt("0x" + Array.from(array).map(b => b.toString(16).padStart(2,'0')).join(''));
                 return (r % (prime - 2n) + 2n).toString();
            }
        } catch {
            return "6";
        }
    } else {
        const array = new Uint8Array(32); 
        window.crypto.getRandomValues(array);
        let hex = "0x";
        for(let i=0; i<array.length; i++) {
            hex += array[i].toString(16).padStart(2, '0');
        }
        return BigInt(hex).toString();
    }
};

const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let res = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return res;
};

export const dhCalculate = (pStr: string, gStr: string, privStr: string, otherPubStr?: string): { pub: string, shared?: string } => {
  const isValidBigInt = (s: string) => {
    try {
      BigInt(s);
      return true;
    } catch { return false; }
  };

  if (!pStr || !pStr.trim()) return { pub: "Error: Prime (p) is missing" };
  if (!isValidBigInt(pStr)) return { pub: "Error: Prime (p) must be a valid number" };
  if (!gStr || !gStr.trim()) return { pub: "Error: Generator (g) is missing" };
  if (!isValidBigInt(gStr)) return { pub: "Error: Generator (g) must be a valid number" };
  if (!privStr || !privStr.trim()) return { pub: "Error: Private Key is missing" };
  if (!isValidBigInt(privStr)) return { pub: "Error: Private Key must be a valid number" };

  try {
    const p = BigInt(pStr);
    const g = BigInt(gStr);
    const priv = BigInt(privStr);
    
    if (p <= 1n) return { pub: "Error: Prime (p) must be > 1" };
    if (g <= 0n) return { pub: "Error: Generator (g) must be positive" };

    const pub = modPow(g, priv, p);
    
    let shared;
    if (otherPubStr && otherPubStr.trim() !== "") {
      if (!isValidBigInt(otherPubStr)) {
          return { pub: pub.toString(), shared: "Error: Invalid Peer Public Key" };
      }
      try {
        const otherPub = BigInt(otherPubStr);
        shared = modPow(otherPub, priv, p).toString();
      } catch (e) {
        shared = "Error: Invalid Peer Public Key";
      }
    }
    
    return { pub: pub.toString(), shared };
  } catch (e) {
    return { pub: "Error: Calculation Failed" };
  }
};