const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário para conexões com alguns servidores (ex: Railway)
  },
});

// Função para criar tabelas se não existirem
async function criarTabelas() {
  try {
    // Usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tarefas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL
      );
    `);

    // Compromissos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS compromissos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        hora TIME NOT NULL
      );
    `);

    // PDFs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pdfs (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        url TEXT NOT NULL
      );
    `);

    console.log('Tabelas criadas ou já existiam.');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  }
}

// Chama a função ao importar o módulo
criarTabelas();

module.exports = { pool };
