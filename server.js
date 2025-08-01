const express = require("express");
const cors = require("cors");
const { pool } = require("./db");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");
const appointmentsRoutes = require("./routes/appointments");
const pdfRoutes = require("./routes/pdfs");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Pasta uploads criada.");
}

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/api/uploads', express.static(uploadDir));

app.use("/api/auth", authRoutes);

app.use("/api/tasks", authMiddleware, tasksRoutes);
app.use("/api/appointments", authMiddleware, appointmentsRoutes);
app.use("/api/pdfs", authMiddleware, pdfRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API rodando com sucesso!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
