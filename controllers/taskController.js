const { pool } = require('../db');

const getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tarefas');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

const createTask = async (req, res) => {
  const { titulo, descricao } = req.body;
  try {
    await pool.query('INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)', [titulo, descricao]);
    res.status(201).json({ message: 'Tarefa criada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

module.exports = { getTasks, createTask };
