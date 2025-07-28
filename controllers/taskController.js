const { pool } = require('../db');

// Buscar todas as tarefas
const getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

// Criar uma nova tarefa (só precisa de título)
const createTask = async (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }

  try {
    await pool.query(
      'INSERT INTO tarefas (titulo) VALUES ($1)', 
      [titulo]
    );
    res.status(201).json({ message: 'Tarefa criada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

module.exports = { getTasks, createTask };
