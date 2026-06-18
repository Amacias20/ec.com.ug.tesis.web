import CryptoJS from 'crypto-js';

const secretKey: string = 'e4b9e3f9d25a4b1e82fb1cbb3f7c1b27d12f4c4d9c3e8e4d3e5b6f7a8b9c2e4f';

export const EncryptData = (data: Record<string, unknown>): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const DecryptData = (ciphertext: string): Record<string, unknown> | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedData: string = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch {
        return null;
    }
};
