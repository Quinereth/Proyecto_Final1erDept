const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs-extra");

const DATA_FILE = path.join(__dirname, "data", "scores.json");

// leer scores
async function readScores() {
  try {
    await fs.ensureFile(DATA_FILE);
    const txt = await fs.readFile(DATA_FILE, "utf8");
    if (!txt) return [];
    return JSON.parse(txt);
  } catch (err) {
    console.error("Error reading scores:", err);
    return [];
  }
}

// escribir scores
async function writeScores(scores) {
  try {
    await fs.outputJson(DATA_FILE, scores, { spaces: 2 });
  } catch (err) {
    console.error("Error writing scores:", err);
    throw err;
  }
}

// GET /api/scores?limit=10
router.get("/", async (req, res) => {
  try {
    let scores = await readScores();
    const limit = parseInt(req.query.limit) || 10;
    scores.sort((a, b) => b.score - a.score || b.level - a.level);
    return res.json(scores.slice(0, limit));
  } catch (err) {
    return res.status(500).json({ error: "No se pudieron obtener los scores" });
  }
});

// POST /api/scores
// body { name, score, level }
router.post("/", async (req, res) => {
  try {
    const { name, score, level } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    if (typeof score !== "number" || Number.isNaN(score) || score < 0) {
      return res.status(400).json({ error: "Puntaje inválido" });
    }

    const newScore = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name: name.trim().slice(0, 30),
      score: Math.floor(score),
      level: Number(level) || 0,
      date: new Date().toISOString()
    };

    const scores = await readScores();
    scores.push(newScore);
    await writeScores(scores);

    return res.status(201).json({ ok: true, score: newScore });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "No se pudo guardar el puntaje" });
  }
});

module.exports = router;
