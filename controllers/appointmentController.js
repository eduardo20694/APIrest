const { pool } = require('../db');

// Buscar compromissos, opcionalmente filtrando por data
const getAppointments = async (req, res) => {
  const { date } = req.query;
  try {
    let query = 'SELECT * FROM compromissos';
    const params = [];
    if (date) {
      query += ' WHERE date = $1';
      params.push(date);
    }
    query += ' ORDER BY hora ASC';
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar compromissos.' });
  }
};

// Criar compromisso incluindo a data
const createAppointment = async (req, res) => {
  const { titulo, hora, date } = req.body;

  if (!titulo || !hora) {
    return res.status(400).json({ error: 'Título e hora são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO compromissos (titulo, hora, date) VALUES ($1, $2, $3) RETURNING *',
      [titulo.trim(), hora, date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar compromisso.' });
  }
};

module.exports = { getAppointments, createAppointment };
