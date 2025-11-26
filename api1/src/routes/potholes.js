// src/routes/potholes.js

const express = require('express')
const router = express.Router();
const pool = require('../db')  

// GET /potholes?lat=..&lon=..&radius=..  => devuelve potholes cercanos
router.get('/', async (req, res) => {
    const {lat, lon, radius = 500} = req.query;
    if (!lat || !lon){
        // listar todos (paginado simple)
 const [rows] = await pool.query(`SELECT id, lat, lon, direccion_texto, num_reportes, score_prioridad, estado FROM potholes ORDER BY score_prioridad DESC LIMIT 200`);
    return res.json(rows);
    }

    // Traer candidatos por bounding box
    const r = Number(radius);
    const latDelta = (r / 111320); // aproximación: 1° lat ≈ 111.32 km
  const lonDelta = r / (111320 * Math.cos(lat * Math.PI / 180));
  const [rows] = await pool.query(
    `SELECT id, lat, lon, direccion_texto, num_reportes, score_prioridad, estado FROM potholes
    WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?`,
     [lat - latDelta, lat + latDelta, lon - lonDelta, lon + lonDelta]
  );
  res.json(rows);
})

// GET /potholes/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query(`SELECT * FROM potholes WHERE id = ?`, [id]);
  if (!rows.length) return res.status(404).json({ error: 'no encontrado' });
  res.json(rows[0]);
});

// PATCH /potholes/:id  -> actualizar campos (profundidad, estado, etc)
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const allowed = ['direccion_texto','longitud_m','ancho_m','profundidad_m','estado','verificado','score_prioridad','duplicate_cluster_id'];
  const updates = [];
  const params = [];
  for (const k of allowed) if (k in req.body) { updates.push(`${k} = ?`); params.push(req.body[k]); }
  if (!updates.length) return res.status(400).json({ error: 'nada que actualizar' });
  params.push(id);
  await pool.query(`UPDATE potholes SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
  res.json({ ok: true });
});

module.exports = router;