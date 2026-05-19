import { pool } from "../db.js";

const fields = [
  "tablero_id",
  "tipo",
  "numero",
  "tipo_conductor",
  "diametro",
  "x_cano_losa",
  "caño_losa",
  "caño_pared",
  "caño_piso",
  "en_saltos",
  "caja_piso",
  "caja_honda",
  "caja_llana",
  "caja_centro",
  "caja_brazo",
  "bajada_tomas",
  "bajada_tomas_picadas",
  "bajada_luces",
  "bajada_luces_picadas",
  "picada_yeso_m",
  "picada_mamposteria_m",
  "picada_piso_m",
  "zanja_m",
  "cable_metros",
  "codos_especiales",
  "bandeja_metros",
  "conductor",
  "detalle_tecnico",
];

const numericFields = new Set([
  "tablero_id",
  "x_cano_losa",
  "caño_losa",
  "caño_pared",
  "caño_piso",
  "en_saltos",
  "caja_piso",
  "caja_honda",
  "caja_llana",
  "caja_centro",
  "caja_brazo",
  "bajada_tomas",
  "bajada_tomas_picadas",
  "bajada_luces",
  "bajada_luces_picadas",
  "picada_yeso_m",
  "picada_mamposteria_m",
  "picada_piso_m",
  "zanja_m",
  "cable_metros",
  "codos_especiales",
  "bandeja_metros",
]);

const parseNumericValue = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  // Acepta entrada web y formato local:
  // 17.80 -> 17.8
  // 17,80 -> 17.8
  // 1.234,56 -> 1234.56
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const cleanValue = (field, value) => {
  if (field === "detalle_tecnico") {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch { return null; }
    }
    return value;
  }

  if (numericFields.has(field)) {
    return parseNumericValue(value);
  }

  return value ?? null;
};

const values = (body) => fields.map((f) => cleanValue(f, body[f]));

export const getCircuitosByTablero = async (req, res) => {
  try {
    const { tableroId, tipo } = req.params;
    const r = await pool.query("SELECT * FROM circuitos WHERE tablero_id=$1 AND tipo=$2 ORDER BY id DESC", [tableroId, tipo]);
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error obteniendo circuitos" });
  }
};

export const getCircuitosByObra = async (req, res) => {
  try {
    const { obraId, tipo } = req.params;
    const r = await pool.query(
      "SELECT c.* FROM circuitos c INNER JOIN tableros t ON t.id=c.tablero_id WHERE t.obra_id=$1 AND c.tipo=$2 ORDER BY c.id DESC",
      [obraId, tipo],
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error obteniendo circuitos de obra" });
  }
};

export const createCircuito = async (req, res) => {
  try {
    const ph = fields.map((_, i) => `$${i + 1}`).join(",");
    const r = await pool.query(`INSERT INTO circuitos (${fields.join(",")}) VALUES (${ph}) RETURNING *`, values(req.body));
    res.json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando circuito" });
  }
};

export const updateCircuito = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = fields.filter((f) => f !== "tablero_id" && f !== "tipo");
    const sets = updateFields.map((f, i) => `${f}=$${i + 1}`).join(",");
    const vals = updateFields.map((f) => cleanValue(f, req.body[f]));
    const r = await pool.query(`UPDATE circuitos SET ${sets}, updated_at=NOW() WHERE id=$${vals.length + 1} RETURNING *`, [...vals, id]);
    res.json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error actualizando circuito" });
  }
};

export const deleteCircuito = async (req, res) => {
  try {
    await pool.query("DELETE FROM circuitos WHERE id=$1", [req.params.id]);
    res.json({ message: "Circuito eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error eliminando circuito" });
  }
};
