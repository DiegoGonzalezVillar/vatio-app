import { pool } from "../db.js";

const ok = (res, rows) => res.json(rows);

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  const raw = String(value).trim();
  if (!raw) return fallback;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fail = (res, e, msg) => { console.error(e); res.status(500).json({ error: msg }); };

export const getTerminaciones = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM terminaciones WHERE obra_id=$1 AND tipo=$2 ORDER BY tipo_caja,item", [req.params.obraId, req.params.tipo]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo terminaciones"); }
};
export const upsertTerminacion = async (req, res) => {
  try { const { obra_id,tipo,tablero_id,item,tipo_caja,material,cantidad } = req.body; const r = await pool.query(`INSERT INTO terminaciones (obra_id,tipo,tablero_id,item,tipo_caja,material,cantidad) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (obra_id,tipo,tablero_id,item,material) DO UPDATE SET tipo_caja=EXCLUDED.tipo_caja,cantidad=EXCLUDED.cantidad RETURNING *`, [obra_id,tipo,tablero_id,item,tipo_caja,material,cantidad || 0]); ok(res, r.rows[0]); }
  catch (e) { fail(res, e, "Error guardando terminación"); }
};

export const getPuestaATierra = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM puesta_a_tierra WHERE obra_id=$1 ORDER BY item_id", [req.params.obraId]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo puesta a tierra"); }
};
export const upsertPuestaATierra = async (req, res) => {
  try { const { obra_id,item_id,cantidad } = req.body; const r = await pool.query(`INSERT INTO puesta_a_tierra (obra_id,item_id,cantidad) VALUES ($1,$2,$3) ON CONFLICT (obra_id,item_id) DO UPDATE SET cantidad=EXCLUDED.cantidad RETURNING *`, [obra_id,item_id,cantidad || 0]); ok(res, r.rows[0]); }
  catch (e) { fail(res, e, "Error guardando puesta a tierra"); }
};

export const getTablerosMateriales = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM tableros_materiales WHERE obra_id=$1 ORDER BY material", [req.params.obraId]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo materiales de tableros"); }
};
export const upsertTableroMaterial = async (req, res) => {
  try { const { obra_id,tablero_id,material,cantidad,precio_usd } = req.body; const r = await pool.query(`INSERT INTO tableros_materiales (obra_id,tablero_id,material,cantidad,precio_usd) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (obra_id,tablero_id,material) DO UPDATE SET cantidad=EXCLUDED.cantidad, precio_usd=EXCLUDED.precio_usd RETURNING *`, [obra_id,tablero_id,material,cantidad || 0,precio_usd || 0]); ok(res, r.rows[0]); }
  catch (e) { fail(res, e, "Error guardando material de tablero"); }
};

export const getLuminarias = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM luminarias WHERE obra_id=$1 ORDER BY tipo,piso", [req.params.obraId]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo luminarias"); }
};
export const upsertLuminaria = async (req, res) => {
  try { const { obra_id,tipo,descripcion,piso,cantidad } = req.body; const r = await pool.query(`INSERT INTO luminarias (obra_id,tipo,descripcion,piso,cantidad) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (obra_id,tipo,piso) DO UPDATE SET descripcion=EXCLUDED.descripcion,cantidad=EXCLUDED.cantidad RETURNING *`, [obra_id,tipo,descripcion || "",piso,cantidad || 0]); ok(res, r.rows[0]); }
  catch (e) { fail(res, e, "Error guardando luminaria"); }
};

export const getBandejas = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM bandejas WHERE obra_id=$1 ORDER BY ancho_mm,sistema,piso", [req.params.obraId]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo bandejas"); }
};
export const upsertBandeja = async (req, res) => {
  try {
    const f = ["obra_id","ancho_mm","sistema","piso","metraje","tapa","curva_horizontal","curva_articulada","vertical_ext","vertical_int","cruces_h","cruces_v","descenso","derivacion","desvio_h","desvio_h_izq","desvio_h_der","desvio_v"];
    const numericFields = new Set(f.filter((x) => !["obra_id", "ancho_mm", "sistema", "piso", "tapa"].includes(x)));
    const vals = f.map((x) => {
      if (x === "tapa") return String(req.body[x] || "no").toLowerCase().startsWith("s") ? "si" : "no";
      if (numericFields.has(x)) return parseNumber(req.body[x], 0);
      return req.body[x] ?? null;
    });
    vals[1] = req.body.ancho_mm;
    vals[2] = req.body.sistema;
    vals[3] = req.body.piso;
    const ph = f.map((_, i) => `$${i + 1}`).join(",");
    const update = f.slice(4).map((x) => `${x}=EXCLUDED.${x}`).join(",");
    const r = await pool.query(`INSERT INTO bandejas (${f.join(",")}) VALUES (${ph}) ON CONFLICT (obra_id,ancho_mm,sistema,piso) DO UPDATE SET ${update} RETURNING *`, vals);
    ok(res, r.rows[0]);
  }
  catch (e) { fail(res, e, "Error guardando bandeja"); }
};

export const getDuctos = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM ductos WHERE obra_id=$1 ORDER BY tamaño,sistema,piso", [req.params.obraId]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo ductos"); }
};
export const upsertDucto = async (req, res) => {
  try {
    const { obra_id, tamaño, sistema, piso } = req.body;
    const metros = parseNumber(req.body.metros, 0);
    const quiebres = parseNumber(req.body.quiebres, 0);
    const r = await pool.query(
      `INSERT INTO ductos (obra_id,tamaño,sistema,piso,metros,quiebres)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (obra_id,tamaño,sistema,piso)
       DO UPDATE SET metros=EXCLUDED.metros, quiebres=EXCLUDED.quiebres
       RETURNING *`,
      [obra_id, tamaño, sistema, piso, metros, quiebres]
    );
    ok(res, r.rows[0]);
  }
  catch (e) { fail(res, e, "Error guardando ducto"); }
};

export const getPorteros = async (req, res) => {
  try { const r = await pool.query("SELECT * FROM porteros_items WHERE obra_id=$1 ORDER BY id DESC", [req.params.obraId]); ok(res, r.rows); }
  catch (e) { fail(res, e, "Error obteniendo porteros"); }
};
export const createPortero = async (req, res) => {
  try { const { obra_id,cant,descripcion,precio,proveedor } = req.body; const r = await pool.query("INSERT INTO porteros_items (obra_id,cant,descripcion,precio,proveedor) VALUES ($1,$2,$3,$4,$5) RETURNING *", [obra_id,cant || 0,descripcion || "",precio || 0,proveedor || ""]); ok(res, r.rows[0]); }
  catch (e) { fail(res, e, "Error creando portero"); }
};
export const updatePortero = async (req, res) => {
  try { const { cant,descripcion,precio,proveedor } = req.body; const r = await pool.query("UPDATE porteros_items SET cant=$1,descripcion=$2,precio=$3,proveedor=$4 WHERE id=$5 RETURNING *", [cant || 0,descripcion || "",precio || 0,proveedor || "",req.params.id]); ok(res, r.rows[0]); }
  catch (e) { fail(res, e, "Error actualizando portero"); }
};
export const deletePortero = async (req, res) => {
  try { await pool.query("DELETE FROM porteros_items WHERE id=$1", [req.params.id]); ok(res, { message: "Portero eliminado" }); }
  catch (e) { fail(res, e, "Error eliminando portero"); }
};
