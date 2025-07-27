const { pool } = require("../db");

const getPdfs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pdfs");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar PDFs." });
  }
};

const createPdf = async (req, res) => {
  const { titulo, url } = req.body;
  try {
    await pool.query("INSERT INTO pdfs (titulo, url) VALUES (?, ?)", [titulo, url]);
    res.status(201).json({ message: "PDF criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar PDF." });
  }
};

module.exports = { getPdfs, createPdf };
