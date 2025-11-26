// src/index.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir uploads (en desarrollo)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas
app.use('/api/reports', require('./routes/reports'));
app.use('/api/potholes', require('./routes/potholes'));
app.use('/api/reporters', require('./routes/reporters'));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
