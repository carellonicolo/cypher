// Utility to handle pure logic
// Note: In a production app, we would use proper buffers for everything, 
// but for an educational simulator, string manipulation is often clearer for visualization.

export const caesarCipher = (text: string, shift: number, decrypt: boolean = false): string => {
  const s = decrypt ? (26 - (shift % 26)) : (shift % 26);
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base + s) % 26) + base);
  });
};

export const vigenereCipher = (text: string, key: string, decrypt: boolean = false): string => {
  if (!key) return text;
  
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleanKey.length === 0) return text;

  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const base = char >= 'a' ? 97 : 65;
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
      const actualShift = decrypt ? (26 - shift) : shift;
      
      result += String.fromCharCode(((char.charCodeAt(0) - base + actualShift) % 26) + base);
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
};

// Uses Web Crypto API for a realistic modern example
export const aesEncrypt = async (text: string, password: string): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password.padEnd(16, '0')), // Simplification for demo: padding password
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("salty_salt"), // Static salt for demo repeatability
        iterations: 1000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedText = enc.encode(text);
    
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedText
    );

    const encryptedArray = new Uint8Array(encryptedContent);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    // Convert to Base64
    let binary = '';
    const len = combined.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return window.btoa(binary);
  } catch (e) {
    console.error(e);
    return "Error encrypting (Check Console)";
  }
};

export const aesDecrypt = async (ciphertext: string, password: string): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    
    // Decode Base64
    const binary = window.atob(ciphertext);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password.padEnd(16, '0')),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("salty_salt"),
        iterations: 1000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    return dec.decode(decryptedContent);
  } catch (e) {
    console.error(e);
    return "Error: Invalid Key or Corrupted Data";
  }
};