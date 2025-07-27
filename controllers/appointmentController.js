const { pool } = require("../db");

const getAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compromissos");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar compromissos." });
  }
};

const createAppointment = async (req, res) => {
  const { titulo, descricao, data } = req.body;
  try {
    await pool.query(
      "INSERT INTO compromissos (titulo, descricao, data) VALUES (?, ?, ?)",
      [titulo, descricao, data]
    );
    res.status(201).json({ message: "Compromisso criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar compromisso." });
  }
};

// Se quiser, implemente update, delete e getById conforme exemplo das tarefas.

module.exports = { getAppointments, createAppointment };
