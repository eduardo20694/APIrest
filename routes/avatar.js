const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool } = require("../db"); // seu pool do PostgreSQL
const authMiddleware = require("../middleware/authMiddleware");

// Pasta uploads
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `avatar-${req.user.id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    allowedTypes.test(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error("Apenas imagens são permitidas!"));
  },
});

// POST /upload -> upload ou alterar avatar
router.post("/upload", authMiddleware, upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado!" });

  const avatarUrl = `/api/uploads/${req.file.filename}`;

  try {
    // Buscar avatar antigo
    const { rows } = await pool.query("SELECT avatar_url FROM usuarios WHERE id = $1", [req.user.id]);
    const oldAvatar = rows[0]?.avatar_url;

    // Atualiza avatar no banco
    await pool.query("UPDATE usuarios SET avatar_url = $1 WHERE id = $2", [avatarUrl, req.user.id]);

    // Remove avatar antigo do servidor
    if (oldAvatar) {
      const oldPath = path.join(__dirname, "..", oldAvatar.replace("/api/uploads", "uploads"));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    res.json({ message: "Avatar enviado com sucesso!", avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar avatar no banco de dados." });
  }
});

// GET / -> retorna avatar do usuário logado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT avatar_url FROM usuarios WHERE id = $1", [req.user.id]);
    const avatarUrl = rows[0]?.avatar_url || null;
    res.json({ avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar avatar." });
  }
});

// GET /:id -> retorna avatar de qualquer usuário
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT avatar_url FROM usuarios WHERE id = $1", [id]);
    const avatarUrl = rows[0]?.avatar_url || null;
    res.json({ avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar avatar do usuário." });
  }
});

module.exports = router;
