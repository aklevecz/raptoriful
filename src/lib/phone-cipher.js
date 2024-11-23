import { SACRET } from "$env/static/private";

// A simple symmetric encryption using XOR with a key
class PhoneCipher {
    constructor(secretKey = SACRET) {
      // Convert the secret key to a repeatable numeric sequence
      this.key = Array.from(secretKey).map(char => char.charCodeAt(0));
    }
  
    /**
     * Encrypts a phone number using a simple symmetric encryption
     * The phone number is first cleaned of any non-numeric characters,
     * then each digit is XORed with the corresponding digit of the
     * secret key. The result is then converted to a URL-safe string
     * using base64 with some characters replaced to make it look less
     * like base64.
     * @param {string} phoneNumber - the phone number to encrypt
     * @returns {string} - the encrypted phone number
     */
    encrypt(phoneNumber) {
      // Remove any non-numeric characters
      const cleaned = phoneNumber.replace(/\D/g, '');
      
      // Convert phone number to array of numbers
      const numbers = Array.from(cleaned).map(Number);
      
      // XOR each digit with the corresponding key digit
      const encrypted = numbers.map((num, i) => {
        const keyDigit = this.key[i % this.key.length];
        return num ^ keyDigit;
      });
      
      // Convert to base64 to make it URL-safe
      const encoded = btoa(encrypted.join(','));
      
      // Make it look less like base64 by replacing chars
      return encoded
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '~');
    }
  
    /**
     * Decrypts a phone number using a simple symmetric encryption
     * The encrypted phone number is expected to be a URL-safe string
     * created by the `encrypt` method of this class. The string is
     * first restored to its original base64 form, then decoded to
     * an array of numbers, which are then XORed with the corresponding
     * digit of the secret key to decrypt. If the input is invalid,
     * the method returns null.
     * @param {string} encoded - the encrypted phone number to decrypt
     * @returns {?string} - the decrypted phone number, or null if invalid
     */
    decrypt(encoded) {
      try {
        // Restore base64 characters
        const restored = encoded
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .replace(/~/g, '=');
        
        // Decode base64
        const encrypted = atob(restored)
          .split(',')
          .map(Number);
        
        // XOR with key to decrypt
        const decrypted = encrypted.map((num, i) => {
          const keyDigit = this.key[i % this.key.length];
          return num ^ keyDigit;
        });
        
        return decrypted.join('');
      } catch (e) {
        return null;
      }
    }
  }

  export default PhoneCipher