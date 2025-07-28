const { pool } = require("../db");

const getPdfs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pdfs");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar PDFs." });
  }
};

const createPdf = async (req, res) => {
  const { titulo, url } = req.body;
  if (!titulo || !url) {
    return res.status(400).json({ error: "Título e URL são obrigatórios." });
  }
  try {
    await pool.query(
      "INSERT INTO pdfs (titulo, url) VALUES ($1, $2)",
      [titulo, url]
    );
    res.status(201).json({ message: "PDF criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar PDF." });
  }
};

module.exports = { getPdfs, createPdf };
