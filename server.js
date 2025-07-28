const express = require("express");
const cors = require("cors");
const path = require("path");
const { pool } = require("./db"); // sua conexão com o banco
require("dotenv").config();

// Importa rotas
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");
const appointmentsRoutes = require("./routes/appointments");
const pdfRoutes = require("./routes/pdfs");

// Middleware de autenticação JWT
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas públicas - registro e login (não precisam de token)
app.use("/api/auth", authRoutes);

// Rotas protegidas - precisam de token e autenticação
app.use("/api/tasks", authMiddleware, tasksRoutes);
app.use("/api/appointments", authMiddleware, appointmentsRoutes);
app.use("/api/pdfs", authMiddleware, pdfRoutes);

// Rota raiz para teste (pode ser pública ou protegida conforme você queira)
app.get("/", (req, res) => {
  res.json({ message: "API rodando com sucesso!" });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});