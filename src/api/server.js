const express = require('express');
const DynamicRotorCipher = require('../core/rotor');
const db = require('../../database/db');

const app = express();
app.use(express.json());

app.post('/api/v1/encrypt', async (req, res) => {
    const { text, key } = req.body;
    if (!text || !key) return res.status(400).json({ error: 'Missing text or key' });

    try {
        const cipher = new DynamicRotorCipher(key);
        const ciphertext = cipher.encrypt(text);
        
        await db.query('INSERT INTO audit_logs (action, payload_length) VALUES ($1, $2)', ['ENCRYPT', text.length]).catch(() => {});

        res.json({ success: true, ciphertext });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`🛡️ Cipher REST API running on port ${PORT}`));