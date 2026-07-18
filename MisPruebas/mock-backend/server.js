const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.resolve(__dirname, '..');
const USERS_FILE = path.join(DATA_DIR, 'usuarios.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

function readJson(file, defaultVal) {
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file);
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('read error', file, e);
  }
  return defaultVal;
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('write error', file, e);
  }
}

let users = readJson(USERS_FILE, []);
let reviews = readJson(REVIEWS_FILE, []);

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const u = req.body;
  if (!u || !u.username) return res.status(400).send('Bad body');
  const exists = users.find(x => x.username === u.username);
  if (exists) {
    // mimic original: return false if exists
    return res.status(201).json(false);
  }
  if (!u.juegos) u.juegos = [];
  users.push(u);
  writeJson(USERS_FILE, users);
  return res.status(201).json(true);
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, clave } = req.body;
  if (!username) return res.status(400).send('Bad body');
  const user = users.find(x => x.username === username && x.clave === clave);
  if (user) return res.status(200).json(user);
  return res.status(401).end();
});

// POST /api/reviews/agregar
app.post('/api/reviews/agregar', (req, res) => {
  const r = req.body;
  if (!r || typeof r.idJuego === 'undefined') return res.status(400).send('Bad body');
  reviews.push(r);
  writeJson(REVIEWS_FILE, reviews);
  return res.status(201).json(r);
});

// GET /api/reviews/consultar/:id
app.get('/api/reviews/consultar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const list = reviews.filter(r => r.idJuego === id);
  return res.status(200).json(list);
});

// GET /api/reviews/consultar/calificacion/:id
app.get('/api/reviews/consultar/calificacion/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const list = reviews.filter(r => r.idJuego === id);
  if (list.length === 0) return res.status(200).json(0);
  const sum = list.reduce((s, it) => s + (Number(it.calificacion) || 0), 0);
  const avg = sum / list.length;
  const rounded = Math.round(avg * 100.0) / 100.0;
  return res.status(200).json(rounded);
});

// Simple health endpoint for CI
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => console.log('Mock backend listening on', PORT));
