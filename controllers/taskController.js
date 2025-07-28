const { pool } = require('../db');

const getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

const createTask = async (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
  }
  try {
    await pool.query(
      'INSERT INTO tarefas (titulo, descricao) VALUES ($1, $2)', 
      [titulo, descricao]
    );
    res.status(201).json({ message: 'Tarefa criada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

module.exports = { getTasks, createTask };
