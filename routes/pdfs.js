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
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Buscar PDFs
router.get("/", authMiddleware, getPdfs);

// Enviar PDFs (campo 'pdfs' deve bater com o frontend)
router.post("/", authMiddleware, upload.array("pdfs"), createPdf);

// Deletar PDF por ID
router.delete("/:id", authMiddleware, deletePdf);

module.exports = router;
