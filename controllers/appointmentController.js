const { pool } = require("../db");

// Buscar todos os compromissos
const getAppointments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM compromissos");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar compromissos." });
  }
};

// Criar novo compromisso (precisa de título e hora)
const createAppointment = async (req, res) => {
  const { titulo, hora } = req.body;

  if (!titulo || !hora) {
    return res.status(400).json({ error: "Título e hora são obrigatórios." });
  }

  try {
    await pool.query(
      "INSERT INTO compromissos (titulo, hora) VALUES ($1, $2)",
      [titulo, hora]
    );
    res.status(201).json({ message: "Compromisso criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar compromisso." });
  }
};

module.exports = { getAppointments, createAppointment };
