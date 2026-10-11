const DynamicRotorCipher = require('./rotor');

// Caesar Cipher Module
class CaesarCipher {
    constructor(key) {
        this.shift = parseInt(key) || 3;
    }
    encrypt(text) {
        return text.split('').map(char => String.fromCharCode(char.charCodeAt(0) + this.shift)).join('');
    }
    decrypt(ciphertext) {
        return ciphertext.split('').map(char => String.fromCharCode(char.charCodeAt(0) - this.shift)).join('');
    }
}

// XOR Cipher Module
class XorCipher {
    constructor(key) {
        this.key = key || 'default';
    }
    encrypt(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
        }
        return Buffer.from(result).toString('base64');
    }
    decrypt(ciphertext) {
        const text = Buffer.from(ciphertext, 'base64').toString('utf8');
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
        }
        return result;
    }
}

// Factory helper to build pipeline modules from an array of config objects
class CipherPipelineFactory {
    static create(pipelineConfig) {
        // pipelineConfig format: [{ type: 'rotor', key: 'k1' }, { type: 'caesar', key: '5' }]
        const pipeline = new CipherPipeline();
        
        for (const conf of pipelineConfig) {
            let cipherInstance;
            switch (conf.type.toLowerCase()) {
                case 'rotor':
                case 'dynamic':
                    cipherInstance = new DynamicRotorCipher(conf.key);
                    break;
                case 'caesar':
                    cipherInstance = new CaesarCipher(conf.key);
                    break;
                case 'xor':
                    cipherInstance = new XorCipher(conf.key);
                    break;
                default:
                    throw new Error(`Unknown cipher type: "${conf.type}"`);
            }
            pipeline.addModule(cipherInstance);
        }
        return pipeline;
    }
}

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

module.exports = { CipherPipeline, CipherPipelineFactory };