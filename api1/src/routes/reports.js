const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");
const upload = require("../middleware/upload");
const { haversineDistance } = require("../utils/geo");

const NEARBY_RADIUS_METERS = 30; // umbral para asociar al pothole canonico

//POST /reports (multipart/form-data si hay fotos)
router.post("/", upload.array("photos", 5), async (req, res) => {
  const {
    reporter_id,
    lat,
    lon,
    descripcion = null,
    severidad = null,
    fuente = "app",
    clima = null,
  } = req.body;

  if (!lat || !lon)
    return res.status(400).json({ error: "lat y lon obligatorios" });

  const id = uuidv4();
  const created_at = new Date();

  const photos = (req.files || []).map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
  }));

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Busca potholes existentes cerca (simple: traer candidatos y filtrar por Haversine)
    const [cands] = await conn.query(
      `SELECT id, lat, lon FROM potholes
        WHERE lat BETWEEN ? AND ? lon BETWEEN ? AND ?`,
      [
        parseFloat(lat) - 0.0005,
        parseFloat(lat) + 0.0005, // ~ +/- 55m lat approx
        parseFloat(lon) - 0.0005,
        parseFloat(lon) + 0.0005,
      ]
    );
    // encontrar el más cercano dentro de NEARBY_RADIUS_METERS
    let closest = null;
    for (const c of cands) {
      const d = haversineDistance(
        parseFloat(lat),
        parseFloat(lon),
        parseFloat(c.lat),
        parseFloat(c.lon)
      );
      if (d <= NEARBY_RADIUS_METERS && (!closest || d < closest.dist)) {
        closest = { id: c.id, dist: d };
      }
    }
    // 2) insertar reporte
    await conn.query(
      `INSERT INTO pothole_reports (id, pothole_id, reporter_id, lat, lon, descripcion, severidad, num_fotos, fuente, clima, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        closest ? closest.id : null,
        reporter_id || null,
        lat,
        lon,
        descripcion,
        severidad || null,
        photos.length,
        fuente,
        clima,
        created_at,
      ]
    );
    //) guardar fotos (si hay)
    for (const p of photos) {
      const photoId = uuidv4();
      await conn.query(
        `INSERT INTO pothole_photos (id, pothole_id, reporter_id, url, thumb_url, metadata, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          photoId,
          closest ? closest.id : null,
          reporter_id || null,
          p.url,
          p.url,
          JSON.stringify({ filename: p.filename }),
          created_at,
        ]
      );
    }
    // 4) si había pothole cercano, actualizamos agregados
    if (closest) {
      await conn.query(
        `UPDATE potholes
         SET num_reportes = num_reportes + 1,
             fecha_ultimo_reporte = ?
         WHERE id = ?`,
        [created_at, closest.id]
      );
    } else {
      // No se encontró uno cercano: opcionalmente crear un record canonical provisional
      const newPotholeId = uuidv4();
      await conn.query(
        `INSERT INTO potholes (id, geom, lat, lon, fecha_primer_reporte, fecha_ultimo_reporte, num_reportes, created_at)
         VALUES (?, ST_PointFromText(?), ?, ?, ?, ?, ?, ?)`,
        [
          newPotholeId,
          `POINT(${lon} ${lat})`,
          lat,
          lon,
          created_at,
          created_at,
          1,
          created_at,
        ]
      );
      // actualizar el reporte y las fotos para apuntar a este pothole
      await conn.query(
        `UPDATE pothole_reports SET pothole_id = ? WHERE id = ?`,
        [newPotholeId, id]
      );
      await conn.query(
        `UPDATE pothole_photos SET pothole_id = ? WHERE pothole_id IS NULL AND reporter_id = ?`,
        [newPotholeId, reporter_id || null]
      );
      closest = { id: newPotholeId, dist: 0 };
    }

    await conn.commit();

    res
      .status(201)
      .json({
        report_id: id,
        associated_pothole: closest.id,
        distance_m: closest.dist || 0,
      });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "error interno" });
  } finally {
    conn.release();
  }
});

module.exports = router;