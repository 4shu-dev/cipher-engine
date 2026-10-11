const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for cloud databases like Azure PostgreSQL
});

pool.on('connect', () => {
    console.log('[Database] 🟢 Connected to PostgreSQL pool successfully.');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};