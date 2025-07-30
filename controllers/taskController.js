const { pool } = require("../db");

// Listar tarefas do usuário por data
const getTasks = async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  try {
    let query = "SELECT * FROM tarefas WHERE user_id = $1";
    const params = [userId];

    if (date) {
      query += " AND date = $2";
      params.push(date);
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar tarefas." });
  }
};

// Criar tarefa para o usuário
const createTask = async (req, res) => {
  const { titulo, date } = req.body;
  const userId = req.user.id;

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: "Título é obrigatório." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tarefas (titulo, done, date, user_id) VALUES ($1, false, $2, $3) RETURNING *",
      [titulo.trim(), date || new Date().toISOString().split("T")[0], userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar tarefa." });
  }
};

// Atualizar tarefa (toggle done)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const userId = req.user.id;

  try {
    // Verifica se a tarefa pertence ao usuário
    const check = await pool.query("SELECT * FROM tarefas WHERE id = $1 AND user_id = $2", [id, userId]);
    if (check.rowCount === 0) return res.status(404).json({ error: "Tarefa não encontrada" });

    const result = await pool.query(
      "UPDATE tarefas SET done = $1 WHERE id = $2 RETURNING *",
      [done, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar tarefa." });
  }
};

// Remover tarefa
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Verifica se a tarefa pertence ao usuário
    const check = await pool.query("SELECT * FROM tarefas WHERE id = $1 AND user_id = $2", [id, userId]);
    if (check.rowCount === 0) return res.status(404).json({ error: "Tarefa não encontrada" });

    await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);

    res.status(200).json({ message: "Tarefa removida." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover tarefa." });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
