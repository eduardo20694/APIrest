const { pool } = require("../db");

const getAppointments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM compromissos");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar compromissos." });
  }
};

const createAppointment = async (req, res) => {
  const { titulo, descricao, data } = req.body;

  if (!titulo || !data) {
    return res.status(400).json({ error: "Título e data são obrigatórios." });
  }

  try {
    await pool.query(
      "INSERT INTO compromissos (titulo, descricao, data) VALUES ($1, $2, $3)",
      [titulo, descricao || "", data]
    );
    res.status(201).json({ message: "Compromisso criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar compromisso." });
  }
};

module.exports = { getAppointments, createAppointment };
