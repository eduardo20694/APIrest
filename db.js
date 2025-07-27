const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário para conexões com alguns servidores (ex: Railway)
  },
});

module.exports = { pool };
