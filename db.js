const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function criarTabelas() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE,
        date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    // Garantir que colunas existam (caso tabela já criada)
    const colunaDone = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='tarefas' AND column_name='done';
    `);

    if (colunaDone.rowCount === 0) {
      await pool.query(`ALTER TABLE tarefas ADD COLUMN done BOOLEAN DEFAULT FALSE;`);
      console.log('Coluna "done" adicionada na tabela tarefas.');
    }

    const colunaDateTarefas = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='tarefas' AND column_name='date';
    `);

    if (colunaDateTarefas.rowCount === 0) {
      await pool.query(`ALTER TABLE tarefas ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;`);
      console.log('Coluna "date" adicionada na tabela tarefas.');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS compromissos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        hora TIME NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    const colunaDateCompromissos = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='compromissos' AND column_name='date';
    `);

    if (colunaDateCompromissos.rowCount === 0) {
      await pool.query(`ALTER TABLE compromissos ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;`);
      console.log('Coluna "date" adicionada na tabela compromissos.');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pdfs (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        url TEXT NOT NULL
      );
    `);

    console.log('Tabelas criadas e atualizadas com sucesso.');
  } catch (err) {
    console.error('Erro ao criar/atualizar tabelas:', err);
  }
}

criarTabelas();

module.exports = { pool };
