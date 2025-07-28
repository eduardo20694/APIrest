const express = require("express");
const cors = require("cors");
const path = require("path");
const { pool } = require("./db"); // Importa sua conexão com PostgreSQL
require("dotenv").config();

// Rotas (você precisa ter esses arquivos criados na pasta routes/)
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");
const appointmentsRoutes = require("./routes/appointments");
const pdfRoutes = require("./routes/pdfs");

// Middleware de autenticação (para proteger rotas)
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota pública (registro/login)
app.use("/api/auth", authRoutes);

// Middleware que exige token JWT nas rotas abaixo
app.use(authMiddleware);

// Rotas protegidas
app.use("/api/tasks", tasksRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/pdfs", pdfRoutes);

// Rota simples para ver status
app.get("/", (req, res) => {
  res.json({ message: "API rodando com sucesso!" });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

