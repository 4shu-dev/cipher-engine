class DynamicRotorCipher {
    constructor(secretKey) {
        this.baseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !@#$%^&*()_+-=[]{}|;:,.<>?";
        this.seed = this._hashKey(secretKey);
    }

    _hashKey(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    encrypt(text) {
        let result = "";
        let shiftState = this.seed;
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let index = this.baseAlphabet.indexOf(char);
            if (index !== -1) {
                let dynamicShift = (index + shiftState) % this.baseAlphabet.length;
                result += this.baseAlphabet[dynamicShift];
                shiftState = (shiftState + 1) % this.baseAlphabet.length;
            } else {
                result += char;
            }
        }
        return result;
    }

    decrypt(ciphertext) {
        let result = "";
        let shiftState = this.seed;
        for (let i = 0; i < ciphertext.length; i++) {
            let char = ciphertext[i];
            let index = this.baseAlphabet.indexOf(char);
            if (index !== -1) {
                let dynamicShift = (index - shiftState + this.baseAlphabet.length * 100) % this.baseAlphabet.length;
                result += this.baseAlphabet[dynamicShift];
                shiftState = (shiftState + 1) % this.baseAlphabet.length;
            } else {
                result += char;
            }
        }
        return result;
    }
}

module.exports = DynamicRotorCipher;
