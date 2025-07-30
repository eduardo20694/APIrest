const { pool } = require("../db");

// Listar compromissos do usuário por data
const getAppointments = async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  try {
    let query = "SELECT * FROM compromissos WHERE user_id = $1";
    const params = [userId];

    if (date) {
      query += " AND date = $2";
      params.push(date);
    }

    query += " ORDER BY hora ASC";

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar compromissos." });
  }
};

// Criar compromisso
const createAppointment = async (req, res) => {
  const { titulo, hora, date } = req.body;
  const userId = req.user.id;

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: "Título é obrigatório." });
  }
  if (!hora) {
    return res.status(400).json({ error: "Hora é obrigatória." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO compromissos (titulo, hora, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo.trim(), hora, date || new Date().toISOString().split("T")[0], userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar compromisso." });
  }
};

// Remover compromisso
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const check = await pool.query("SELECT * FROM compromissos WHERE id = $1 AND user_id = $2", [id, userId]);
    if (check.rowCount === 0) return res.status(404).json({ error: "Compromisso não encontrado" });

    await pool.query("DELETE FROM compromissos WHERE id = $1", [id]);
    res.status(200).json({ message: "Compromisso removido." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover compromisso." });
  }
};

module.exports = { getAppointments, createAppointment, deleteAppointment };
