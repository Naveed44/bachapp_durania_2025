// src/routes/reporters.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

router.post('/', async (req, res) => {
  const id = uuidv4();
  const { anon_name } = req.body;
  await pool.query(`INSERT INTO reporters (id, anon_name) VALUES (?, ?)`, [id, anon_name || null]);
  res.status(201).json({ id });
});

module.exports = router;