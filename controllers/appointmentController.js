const { pool } = require("../db");

// Buscar todos os compromissos
const getAppointments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM compromissos ORDER BY hora ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar compromissos." });
  }
};

// Criar novo compromisso com título e hora
const createAppointment = async (req, res) => {
  const { titulo, hora } = req.body;

  if (!titulo || !hora) {
    return res.status(400).json({ error: "Título e hora são obrigatórios." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO compromissos (titulo, hora) VALUES ($1, $2) RETURNING *",
      [titulo.trim(), hora]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar compromisso." });
  }
};

module.exports = { getAppointments, createAppointment };
