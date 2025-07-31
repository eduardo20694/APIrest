const { pool } = require("../db");

// Buscar PDFs do usuário autenticado
const getPdfs = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, titulo, url FROM pdfs WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar PDFs:", err);
    res.status(500).json({ error: "Erro ao buscar PDFs." });
  }
};

// Criar PDF com upload de arquivos
const createPdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const insertedFiles = [];

    for (const file of files) {
      const titulo = file.originalname;
      const url = `/uploads/${file.filename}`;

      const result = await pool.query(
        "INSERT INTO pdfs (titulo, url, user_id) VALUES ($1, $2, $3) RETURNING id, titulo, url",
        [titulo, url, userId]
      );

      insertedFiles.push(result.rows[0]);
    }

    res.status(201).json(insertedFiles);
  } catch (err) {
    console.error("Erro ao criar PDF:", err);
    res.status(500).json({ error: "Erro ao criar PDF." });
  }
};

// Deletar PDF por ID
const deletePdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const pdfId = req.params.id;

    // Verifica se o PDF pertence ao usuário
    const check = await pool.query(
      "SELECT * FROM pdfs WHERE id = $1 AND user_id = $2",
      [pdfId, userId]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ error: "PDF não encontrado ou não autorizado." });
    }

    // Remove do banco
    await pool.query("DELETE FROM pdfs WHERE id = $1", [pdfId]);

    res.status(200).json({ message: "PDF deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar PDF:", err);
    res.status(500).json({ error: "Erro ao deletar PDF." });
  }
};

module.exports = {
  getPdfs,
  createPdf,
  deletePdf
};
