# 🛡️ Cipher Engine & Multi-Layer Cryptographic Ecosystem

A robust, open-source multi-layer cryptographic engine, REST API, and Discord bot built with Node.js. Designed to move away from standard 8-bit binary encryption (like AES/RSA) into semantic, deterministic, and dynamic traditional/classical cipher architectures that resist frequency analysis.

---

## 🚀 Features

- **Dynamic Rotor Substitution:** Unlike static substitution ciphers (Caesar/Atbash), this engine shifts alphabets dynamically per character using a rolling key seed, completely flattening frequency distribution graphs.
- **Pipeline Chaining:** Modular architecture allowing multiple cryptographic modules to be chained together sequentially (e.g., *Rotor $\rightarrow$ Transposition $\rightarrow$ Layer 2*).
- **REST API:** Express-powered backend to handle encryption and decryption requests programmatically.
- **Discord Bot Interface:** Real-time server utility enabling interactive encryption and decryption commands directly via chat embeds.
- **PostgreSQL Audit Logging:** Optional database tracking for transaction logs and cryptographic operations.

---

## 📁 Project Architecture

```text
cipher-engine/
├── src/
│   ├── core/
│   │   ├── rotor.js       # Dynamic Enigma-style rolling shift engine
│   │   └── pipeline.js    # Multi-stage execution pipeline orchestrator
│   ├── api/
│   │   └── server.js      # Express REST API endpoints
│   └── bot/
│       └── index.js       # Discord bot command handler
├── database/
│   └── db.js              # PostgreSQL connection pool manager
├── .env                   # Environment configurations
├── package.json
└── README.md
