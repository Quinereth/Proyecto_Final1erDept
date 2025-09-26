const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const scoresRoutes = require("./scores.routes");

const app = express();

app.use(helmet());
app.use(cors()); // permite requests desde cualquier origen (ajusta si quieres limitar)
app.use(express.json());

// Rutas de la API
app.use("/api/scores", scoresRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RunnerJS API corriendo en puerto ${PORT}`);
});
