class CipherPipeline {
    constructor() {
        this.modules = [];
    }

    addModule(cipherInstance) {
        this.modules.push(cipherInstance);
        return this;
    }

    encrypt(text) {
        let current = text;
        for (const mod of this.modules) {
            current = mod.encrypt(current);
        }
        return current;
    }

    decrypt(ciphertext) {
        let current = ciphertext;
        for (let i = this.modules.length - 1; i >= 0; i--) {
            current = this.modules[i].decrypt(current);
        }
        return current;
    }
}

module.exports = CipherPipeline;
