const { pool } = require('../db');

// Buscar tarefas, opcionalmente filtrando por data
const getTasks = async (req, res) => {
  const { date } = req.query;
  try {
    let query = 'SELECT * FROM tarefas';
    const params = [];
    if (date) {
      query += ' WHERE date = $1';
      params.push(date);
    }
    query += ' ORDER BY id DESC';
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

// Criar tarefa, agora inserindo a data também
const createTask = async (req, res) => {
  const { titulo, date } = req.body;

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tarefas (titulo, done, date) VALUES ($1, false, $2) RETURNING *',
      [titulo.trim(), date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

module.exports = { getTasks, createTask };
