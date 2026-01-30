export class EncryptionUtils {
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async encrypt(data: string, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: ArrayBuffer }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(data));
    return { iv, ciphertext };
  }
  async decrypt(ciphertext: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  }
}
export const encryptionUtils = new EncryptionUtils();
