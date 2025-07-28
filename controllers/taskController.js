const { pool } = require('../db');

// Buscar todas as tarefas
const getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

// Criar uma nova tarefa (só precisa de título)
const createTask = async (req, res) => {
  const { titulo } = req.body;

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tarefas (titulo, done) VALUES ($1, false) RETURNING *',
      [titulo.trim()]
    );
    res.status(201).json(result.rows[0]); // Retorna a tarefa criada
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

module.exports = { getTasks, createTask };
