const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function criarTabelas() {
  try {
    // Usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        avatar_url TEXT, -- adiciona a coluna do avatar
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tarefas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `);

    // Compromissos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS compromissos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        hora TIME NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `);

    // PDFs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pdfs (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        url TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `);

    console.log('Tabelas criadas e atualizadas com sucesso.');
  } catch (err) {
    console.error('Erro ao criar/atualizar tabelas:', err);
  }
}

// Executa a criação/atualização das tabelas
criarTabelas();

module.exports = { pool };
