import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("Encryption key is not defined. Set NEXT_PUBLIC_ENCRYPTION_KEY in your environment.");
}

// Encrypt Function
export const encrypt = (text) => {
  if (!text) {
    throw new Error("No text provided for encryption.");
  }
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

// Decrypt Function
export const decrypt = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed. Invalid ciphertext or key.");
    }

    return decryptedText;
  } catch (error) {
    throw new Error("Failed to decrypt. Ensure the key and ciphertext are correct.");
  }
};
