import { pool } from "../db.js";

const ok = (res, data) => res.json(data);
const fail = (res, e, msg) => {
  console.error(e);
  res.status(500).json({ error: msg });
};

const clean = (value) => String(value || "").trim();
const normalizeUpper = (value) => clean(value).toUpperCase();

const normalizeMateriales = (materiales) => {
  if (!Array.isArray(materiales) || materiales.length === 0) return null;
  const normalized = materiales.map((x) => normalizeUpper(x)).filter(Boolean);
  return normalized.length ? JSON.stringify(normalized) : null;
};

const catalogoColumns = "id, modulo, tipo, grupo, tipo_caja, item, materiales, activo, created_at, updated_at";

export const getTerminacionesCatalogo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const r = await pool.query(
      `SELECT ${catalogoColumns}
       FROM catalogos_items
       WHERE modulo = 'terminaciones'
         AND tipo = $1
         AND activo = true
       ORDER BY grupo, item`,
      [tipo]
    );
    ok(res, r.rows);
  } catch (e) {
    fail(res, e, "Error obteniendo catálogo de terminaciones");
  }
};

export const createTerminacionCatalogo = async (req, res) => {
  try {
    const tipo = clean(req.params.tipo);
    const grupo = normalizeUpper(req.body.grupo);
    const tipoCaja = normalizeUpper(req.body.tipo_caja);
    const item = clean(req.body.item);
    const materiales = normalizeMateriales(req.body.materiales);

    if (!tipo || !grupo || !tipoCaja || !item) {
      return res.status(400).json({ error: "Faltan datos para crear el ítem del catálogo" });
    }

    const r = await pool.query(
      `INSERT INTO catalogos_items (modulo, tipo, grupo, tipo_caja, item, materiales)
       VALUES ('terminaciones', $1, $2, $3, $4, COALESCE($5::jsonb, 'null'::jsonb))
       ON CONFLICT (modulo, tipo, grupo, tipo_caja, item)
       DO UPDATE SET
         activo = true,
         materiales = EXCLUDED.materiales,
         updated_at = NOW()
       RETURNING ${catalogoColumns}`,
      [tipo, grupo, tipoCaja, item, materiales]
    );

    ok(res, r.rows[0]);
  } catch (e) {
    fail(res, e, "Error creando ítem del catálogo");
  }
};

export const updateTerminacionCatalogo = async (req, res) => {
  const client = await pool.connect();
  try {
    const tipo = clean(req.params.tipo);
    const id = Number(req.params.id);
    const item = clean(req.body.item);
    const grupo = req.body.grupo !== undefined ? normalizeUpper(req.body.grupo) : null;
    const tipoCaja = req.body.tipo_caja !== undefined ? normalizeUpper(req.body.tipo_caja) : null;

    if (!id || !tipo || !item) {
      return res.status(400).json({ error: "Faltan datos para editar el ítem del catálogo" });
    }

    await client.query("BEGIN");

    const actual = await client.query(
      `SELECT ${catalogoColumns}
       FROM catalogos_items
       WHERE id = $1
         AND modulo = 'terminaciones'
         AND tipo = $2
         AND activo = true
       FOR UPDATE`,
      [id, tipo]
    );

    if (actual.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Ítem personalizado no encontrado" });
    }

    const anterior = actual.rows[0];
    const nuevoGrupo = grupo || anterior.grupo;
    const nuevoTipoCaja = tipoCaja || anterior.tipo_caja;

    const actualizado = await client.query(
      `UPDATE catalogos_items
       SET item = $1,
           grupo = $2,
           tipo_caja = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING ${catalogoColumns}`,
      [item, nuevoGrupo, nuevoTipoCaja, id]
    );

    // Como las terminaciones guardan el texto del ítem, actualizamos las obras existentes
    // que ya usaban este ítem personalizado para no perder cantidades ni histórico visible.
    await client.query(
      `UPDATE terminaciones
       SET item = $1, tipo_caja = $2
       WHERE tipo = $3
         AND item = $4
         AND COALESCE(tipo_caja, '') = COALESCE($5, '')`,
      [item, nuevoTipoCaja, tipo, anterior.item, anterior.tipo_caja]
    );

    await client.query("COMMIT");
    ok(res, actualizado.rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    if (e.code === "23505") {
      return res.status(409).json({ error: "Ya existe un ítem personalizado con esa descripción" });
    }
    fail(res, e, "Error editando ítem del catálogo");
  } finally {
    client.release();
  }
};

export const deleteTerminacionCatalogo = async (req, res) => {
  try {
    const tipo = clean(req.params.tipo);
    const id = Number(req.params.id);

    if (!id || !tipo) {
      return res.status(400).json({ error: "Faltan datos para eliminar el ítem del catálogo" });
    }

    const r = await pool.query(
      `UPDATE catalogos_items
       SET activo = false,
           updated_at = NOW()
       WHERE id = $1
         AND modulo = 'terminaciones'
         AND tipo = $2
       RETURNING ${catalogoColumns}`,
      [id, tipo]
    );

    if (r.rowCount === 0) {
      return res.status(404).json({ error: "Ítem personalizado no encontrado" });
    }

    ok(res, { message: "Ítem personalizado desactivado", item: r.rows[0] });
  } catch (e) {
    fail(res, e, "Error eliminando ítem del catálogo");
  }
};
