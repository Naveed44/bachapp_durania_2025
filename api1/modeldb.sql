-- Esquema MySQL (MySQL 8+) para la aplicación de reportes de baches
-- Usar base de datos adecuada antes de ejecutar: e.g. CREATE DATABASE potholes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- USE potholes_db;

SET @@sql_mode = CONCAT(@@sql_mode, ',NO_AUTO_VALUE_ON_ZERO');

-- ----------------------------------------------------
-- Tabla: reporters (usuarios/anon ids)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS reporters (
  id CHAR(36) NOT NULL PRIMARY KEY,
  anon_name VARCHAR(128),
  reputation_score DECIMAL(5,3) DEFAULT 0.0,
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Trigger: asigna UUID() si no se pasa id
DELIMITER $$
CREATE TRIGGER trg_reporters_before_insert
BEFORE INSERT ON reporters
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT UUID());
  END IF;
END$$
DELIMITER ;

-- ----------------------------------------------------
-- Tabla: potholes (registro canonical de baches)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS potholes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  geom POINT NOT NULL,                           -- requiere SRID 4326 para datos geográficos (ver nota)
  lat DECIMAL(10,7) NOT NULL,
  lon DECIMAL(10,7) NOT NULL,
  direccion_texto TEXT,
  longitud_m DECIMAL(6,3),
  ancho_m DECIMAL(6,3),
  profundidad_m DECIMAL(6,3),
  area_m2 DECIMAL(8,3),
  forma VARCHAR(32),
  material_visible VARCHAR(32),
  severidad_usuario TINYINT,                     -- 1..5
  impacto_via VARCHAR(16),
  riesgo_ciclistas TINYINT,                      -- 0..5
  tipo_via VARCHAR(32),
  num_carriles SMALLINT,
  velocidad_permitida_kmh SMALLINT,
  volumen_trafico BIGINT,
  fecha_primer_reporte DATETIME(6),
  fecha_ultimo_reporte DATETIME(6),
  num_reportes INT UNSIGNED DEFAULT 0,
  estado VARCHAR(32) DEFAULT 'reportado',
  verificado BOOLEAN DEFAULT FALSE,
  confiabilidad_score DECIMAL(4,3) DEFAULT 0.0,
  score_prioridad DECIMAL(5,4) DEFAULT 0.0,
  duplicate_cluster_id CHAR(36),
  asignado_a CHAR(36),
  fecha_reparacion DATETIME(6),
  metadata JSON,
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  updated_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nota: opcionalmente puedes fijar SRID en la columna geom con:
-- ALTER TABLE potholes MODIFY COLUMN geom POINT NOT NULL SRID 4326;
-- (MySQL maneja POINT SRID si tu instalación lo soporta)

-- Índices
CREATE SPATIAL INDEX idx_potholes_geom ON potholes (geom);
CREATE INDEX idx_potholes_score ON potholes (score_prioridad);
CREATE INDEX idx_potholes_estado ON potholes (estado);

-- Trigger: asigna id si no se pasa
DELIMITER $$
CREATE TRIGGER trg_potholes_before_insert
BEFORE INSERT ON potholes
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT UUID());
  END IF;
END$$
DELIMITER ;

-- ----------------------------------------------------
-- Tabla: pothole_reports (cada reporte individual enviado por usuarios)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS pothole_reports (
  id CHAR(36) NOT NULL PRIMARY KEY,
  pothole_id CHAR(36),                          -- puede estar vacío si el reporte aún no fue asociado a un canonical
  reporter_id CHAR(36),
  lat DECIMAL(10,7),
  lon DECIMAL(10,7),
  descripcion TEXT,
  severidad TINYINT,                            -- 1..5 según usuario
  num_fotos TINYINT DEFAULT 0,
  fuente VARCHAR(32) DEFAULT 'app',             -- app, web, inspector, etc.
  clima VARCHAR(32),
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Índices para búsquedas/spatial (si guardas geom, podrías agregar)
CREATE INDEX idx_reports_pothole ON pothole_reports (pothole_id);
CREATE INDEX idx_reports_reporter ON pothole_reports (reporter_id);
CREATE INDEX idx_reports_created_at ON pothole_reports (created_at);

-- Trigger: id automático
DELIMITER $$
CREATE TRIGGER trg_reports_before_insert
BEFORE INSERT ON pothole_reports
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT UUID());
  END IF;
END$$
DELIMITER ;

-- Trigger que actualiza agregados en potholes al insertar un reporte
-- Si el reporte tiene pothole_id poblado, actualizamos num_reportes y fechas.
DELIMITER $$
CREATE TRIGGER trg_reports_after_insert
AFTER INSERT ON pothole_reports
FOR EACH ROW
BEGIN
  IF NEW.pothole_id IS NOT NULL THEN
    -- si fecha_primer_reporte es NULL, fijarla; siempre actualizar ultimo y sumar contador
    INSERT INTO potholes (id, geom, lat, lon, created_at)
      SELECT NEW.pothole_id, ST_GeomFromText(CONCAT('POINT(', NEW.lon, ' ', NEW.lat, ')')), NEW.lat, NEW.lon, NOW()
      FROM DUAL
      WHERE NOT EXISTS (SELECT 1 FROM potholes p WHERE p.id = NEW.pothole_id);
    UPDATE potholes p
      SET p.num_reportes = p.num_reportes + 1,
          p.fecha_ultimo_reporte = NEW.created_at,
          p.fecha_primer_reporte = COALESCE(p.fecha_primer_reporte, NEW.created_at)
      WHERE p.id = NEW.pothole_id;
  END IF;
END$$
DELIMITER ;

-- ----------------------------------------------------
-- Tabla: pothole_photos (fotos asociadas a baches / reportes)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS pothole_photos (
  id CHAR(36) NOT NULL PRIMARY KEY,
  pothole_id CHAR(36),
  reporter_id CHAR(36),
  url TEXT,
  thumb_url TEXT,
  metadata JSON,
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  CONSTRAINT fk_photos_pothole FOREIGN KEY (pothole_id) REFERENCES potholes (id) ON DELETE SET NULL,
  CONSTRAINT fk_photos_reporter FOREIGN KEY (reporter_id) REFERENCES reporters (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Trigger: id automático
DELIMITER $$
CREATE TRIGGER trg_photos_before_insert
BEFORE INSERT ON pothole_photos
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = (SELECT UUID());
  END IF;
END$$
DELIMITER ;

-- ----------------------------------------------------
-- Tabla: pothole_history (auditoría / historial de cambios)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS pothole_history (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pothole_id CHAR(36),
  action VARCHAR(64),
  details JSON,
  performed_by CHAR(36),
  performed_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  CONSTRAINT fk_history_pothole FOREIGN KEY (pothole_id) REFERENCES potholes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------
-- Constraints / Foreign keys adicionales (opcional)
-- ----------------------------------------------------
ALTER TABLE pothole_reports
  ADD CONSTRAINT fk_reports_pothole FOREIGN KEY (pothole_id) REFERENCES potholes (id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES reporters (id) ON DELETE SET NULL;

-- ----------------------------------------------------
-- VISTAS y columnas GENERADAS (ejemplos útiles)
-- ----------------------------------------------------
-- Columna generada para area aproximada (si longitud/ancho disponibles)
ALTER TABLE potholes
  ADD COLUMN area_computed DECIMAL(9,3) GENERATED ALWAYS AS (COALESCE(longitud_m,0) * COALESCE(ancho_m,0)) VIRTUAL;

-- ----------------------------------------------------
-- Sugerencias / NOTAS (no parte ejecutable)
-- ----------------------------------------------------
-- 1) Recalcular score_prioridad: recomendamos no hacerlo totalmente en triggers
--    (para evitar carga en inserts masivos). Mejor: ETL nocturno / job que recalcule score_prioridad
--    con la fórmula elegida y actualice la tabla potholes.
-- 2) Para indexar contenido JSON (e.g., metadata->'$.something'), usar columnas generadas y luego índices.
-- 3) Para particionamiento: usar PARTITION BY RANGE (e.g. YEAR(created_at)) o particionamiento por zona.
-- 4) Si quieres que geom tenga SRID 4326 y lo haga respetarse, usa:
--    ALTER TABLE potholes MODIFY COLUMN geom POINT NOT NULL SRID 4326;
--    y usa funciones espaciales de MySQL (ST_Distance, ST_Within, etc).
-- 5) Si tu flujo de ingestión crea muchos reportes, considera usar una cola (Kafka/Redis) y jobs para
--    deduplicación espacial-temporal (DBSCAN / ST_ClusterWithin en un proceso ETL).

-- ----------------------------------------------------
-- Ejemplo de índice adicional: para consultas por última fecha o prioridad
-- ----------------------------------------------------
CREATE INDEX idx_potholes_lastreport ON potholes (fecha_ultimo_reporte);
CREATE INDEX idx_potholes_priority_state ON potholes (score_prioridad, estado);

-- FIN del script
