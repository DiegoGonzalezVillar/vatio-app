ALTER TABLE IF EXISTS obras ADD COLUMN IF NOT EXISTS pisos JSONB DEFAULT '["PB"]';
ALTER TABLE IF EXISTS obras ADD COLUMN IF NOT EXISTS coeficiente_error_canalizaciones DECIMAL(8,3) DEFAULT 1.08;
ALTER TABLE IF EXISTS tableros ADD COLUMN IF NOT EXISTS extra_por_vigas DECIMAL(8,2) DEFAULT 0;
ALTER TABLE IF EXISTS tableros ADD COLUMN IF NOT EXISTS cantidad_tableros INT DEFAULT 1;
ALTER TABLE IF EXISTS tableros ADD COLUMN IF NOT EXISTS cant_modulos INT;
ALTER TABLE IF EXISTS tableros ADD COLUMN IF NOT EXISTS precio_tablero_usd DECIMAL(10,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS circuitos (
  id SERIAL PRIMARY KEY,
  tablero_id INT REFERENCES tableros(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL,
  numero VARCHAR(20),
  tipo_conductor VARCHAR(20),
  diametro VARCHAR(10),
  x_cano_losa DECIMAL(10,2) DEFAULT 0,
  caño_losa DECIMAL(10,2) DEFAULT 0,
  caño_pared DECIMAL(10,2) DEFAULT 0,
  en_saltos DECIMAL(10,2) DEFAULT 0,
  caja_piso INT DEFAULT 0,
  caja_honda INT DEFAULT 0,
  caja_llana INT DEFAULT 0,
  caja_centro INT DEFAULT 0,
  caja_brazo INT DEFAULT 0,
  bajada_tomas INT DEFAULT 0,
  bajada_tomas_picadas DECIMAL(10,2) DEFAULT 0,
  bajada_luces INT DEFAULT 0,
  bajada_luces_picadas DECIMAL(10,2) DEFAULT 0,
  cable_metros DECIMAL(10,2) DEFAULT 0,
  codos_especiales INT DEFAULT 0,
  bandeja_metros DECIMAL(10,2) DEFAULT 0,
  conductor VARCHAR(40),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terminaciones (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL,
  tablero_id INT REFERENCES tableros(id) ON DELETE CASCADE,
  item VARCHAR(120) NOT NULL,
  tipo_caja VARCHAR(20),
  material VARCHAR(10),
  cantidad INT DEFAULT 0,
  UNIQUE (obra_id, tipo, tablero_id, item, material)
);

CREATE TABLE IF NOT EXISTS puesta_a_tierra (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  item_id VARCHAR(40) NOT NULL,
  descripcion VARCHAR(160),
  unidad VARCHAR(20) DEFAULT 'unid',
  cantidad DECIMAL(10,2) DEFAULT 0,
  orden INT DEFAULT 999,
  es_personalizado BOOLEAN DEFAULT false,
  UNIQUE (obra_id, item_id)
);

ALTER TABLE puesta_a_tierra
  ADD COLUMN IF NOT EXISTS descripcion VARCHAR(160),
  ADD COLUMN IF NOT EXISTS unidad VARCHAR(20) DEFAULT 'unid',
  ADD COLUMN IF NOT EXISTS orden INT DEFAULT 999,
  ADD COLUMN IF NOT EXISTS es_personalizado BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS tableros_materiales (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  tablero_id INT REFERENCES tableros(id) ON DELETE CASCADE,
  material VARCHAR(100) NOT NULL,
  cantidad INT DEFAULT 0,
  precio_usd DECIMAL(10,2) DEFAULT 0,
  UNIQUE (obra_id, tablero_id, material)
);

CREATE TABLE IF NOT EXISTS luminarias (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  tipo VARCHAR(40) NOT NULL,
  descripcion TEXT,
  piso VARCHAR(20) NOT NULL,
  cantidad INT DEFAULT 0,
  UNIQUE (obra_id, tipo, piso)
);

CREATE TABLE IF NOT EXISTS bandejas (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  ancho_mm VARCHAR(10) NOT NULL,
  sistema VARCHAR(10) NOT NULL,
  piso VARCHAR(20) NOT NULL,
  metraje DECIMAL(10,2) DEFAULT 0,
  tapa VARCHAR(10) DEFAULT 'no',
  curva_horizontal INT DEFAULT 0,
  curva_articulada INT DEFAULT 0,
  vertical_ext INT DEFAULT 0,
  vertical_int INT DEFAULT 0,
  cruces_h INT DEFAULT 0,
  cruces_v INT DEFAULT 0,
  descenso INT DEFAULT 0,
  derivacion INT DEFAULT 0,
  desvio_h INT DEFAULT 0,
  desvio_h_izq INT DEFAULT 0,
  desvio_h_der INT DEFAULT 0,
  desvio_v INT DEFAULT 0,
  UNIQUE (obra_id, ancho_mm, sistema, piso)
);

CREATE TABLE IF NOT EXISTS ductos (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  tamaño VARCHAR(15) NOT NULL,
  sistema VARCHAR(10) NOT NULL,
  piso VARCHAR(20) NOT NULL,
  metros DECIMAL(10,2) DEFAULT 0,
  quiebres INT DEFAULT 0,
  UNIQUE (obra_id, tamaño, sistema, piso)
);

CREATE TABLE IF NOT EXISTS porteros_items (
  id SERIAL PRIMARY KEY,
  obra_id INT REFERENCES obras(id) ON DELETE CASCADE,
  cant INT DEFAULT 0,
  descripcion VARCHAR(160),
  precio DECIMAL(10,2) DEFAULT 0,
  proveedor VARCHAR(100)
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bandejas'
      AND column_name = 'tapa'
      AND data_type <> 'character varying'
  ) THEN
    ALTER TABLE bandejas
      ALTER COLUMN tapa TYPE VARCHAR(10)
      USING CASE WHEN COALESCE(tapa::numeric, 0) > 0 THEN 'si' ELSE 'no' END;
  END IF;
END $$;


-- Corrección 2026-05-13: guardar también el valor de entrada "x caño en losa".
-- Necesario para poder editar circuitos sin perder la lógica de cálculo del Excel.
ALTER TABLE circuitos
  ADD COLUMN IF NOT EXISTS x_cano_losa DECIMAL(10,2) DEFAULT 0;

-- Corrección 2026-05-14: campos de cálculo recuperados de la web vieja / Calculos.ts.
-- Permiten separar caño piso, picada yeso, picada mampostería, picada piso/contrapiso y zanja.
ALTER TABLE circuitos
  ADD COLUMN IF NOT EXISTS caño_piso DECIMAL(10,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS picada_yeso_m DECIMAL(10,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS picada_mamposteria_m DECIMAL(10,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS picada_piso_m DECIMAL(10,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zanja_m DECIMAL(10,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS detalle_tecnico JSONB;

-- Catálogos personalizables por módulo.
-- Permite agregar ítems que no vienen fijos en el Excel y reutilizarlos en futuras obras.
CREATE TABLE IF NOT EXISTS catalogos_items (
  id SERIAL PRIMARY KEY,
  modulo VARCHAR(40) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  grupo VARCHAR(80) NOT NULL,
  tipo_caja VARCHAR(30) NOT NULL,
  item VARCHAR(160) NOT NULL,
  materiales JSONB,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (modulo, tipo, grupo, tipo_caja, item)
);

-- Ajustes para catálogos personalizados editables.
ALTER TABLE terminaciones
  ALTER COLUMN item TYPE VARCHAR(160);

ALTER TABLE catalogos_items
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
