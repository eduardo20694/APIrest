const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const appointmentRoutes = require("./routes/appointments");
const pdfRoutes = require("./routes/pdfs");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Rota para testar recebimento de JSON
app.post("/teste-json", (req, res) => {
  console.log("Recebi JSON:", req.body);
  res.json({ recebido: req.body });
});

// Rotas públicas
app.use("/auth", authRoutes);

// Rotas protegidas (usuário logado)
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/appointments", authMiddleware, appointmentRoutes);
app.use("/pdfs", authMiddleware, pdfRoutes);

// Rota raiz de teste
app.get("/", (req, res) => res.json({ message: "API rodando" }));

const PORT = process.env.PORT || 5000;

// Sincroniza banco e depois inicia o servidor
sequelize.sync(/* { force: true } */)
  .then(() => {
    console.log("Banco sincronizado");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao sincronizar banco:", error);
  });

module.exports = app;
