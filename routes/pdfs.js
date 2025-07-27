const express = require("express");
const router = express.Router();
const { getPdfs, createPdf } = require("../controllers/pdfController");

router.get("/", getPdfs);
router.post("/", createPdf);

module.exports = router;
