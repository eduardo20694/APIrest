const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");
const {
  getPdfs,
  createPdf,
  deletePdf
} = require("../controllers/pdfController");

// Configuração do multer para armazenar arquivos localmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // pasta uploads precisa existir
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // aceita todos os tipos
    cb(null, true);
  },
});

// Buscar PDFs
router.get("/", authMiddleware, getPdfs);

// Enviar PDFs (nome do campo 'pdfs' deve bater com o frontend)
router.post("/", authMiddleware, upload.array("pdfs"), createPdf);

// Deletar PDF por ID
router.delete("/:id", authMiddleware, deletePdf);

module.exports = router;
