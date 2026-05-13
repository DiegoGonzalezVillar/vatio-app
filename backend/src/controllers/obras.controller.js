import { pool } from "../db.js";

// Obtener todas las obras
export const getObras = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM obras ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener obras" });
  }
};

// Crear obra
export const createObra = async (req, res) => {
  try {
    const {
      nombre,
      metros2,
      potencia,
      tipo_obra,
      nombre_contacto,
      telefono_contacto,
      email_contacto,
      ubicacion,
      empresa_solicitante,
      notas_generales,
      fecha_solicitud,
      archivos_recibidos,
      fecha_entrega,
      fecha_presupuesto,
      fecha_entregado,
      observacion_prorroga,
      estado_obra,
    } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre de la obra es obligatorio" });
    }

    const result = await pool.query(
      `INSERT INTO obras (
        nombre,
        metros2,
        potencia,
        tipo_obra,
        nombre_contacto,
        telefono_contacto,
        email_contacto,
        ubicacion,
        empresa_solicitante,
        notas_generales,
        fecha_solicitud,
        archivos_recibidos,
        fecha_entrega,
        fecha_presupuesto,
        fecha_entregado,
        observacion_prorroga,
        estado_obra
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      )
      RETURNING *`,
      [
        nombre,
        metros2 || null,
        potencia || null,
        tipo_obra || null,
        nombre_contacto || null,
        telefono_contacto || null,
        email_contacto || null,
        ubicacion || null,
        empresa_solicitante || null,
        notas_generales || null,
        fecha_solicitud || null,
        archivos_recibidos || null,
        fecha_entrega || null,
        fecha_presupuesto || null,
        fecha_entregado || null,
        observacion_prorroga || null,
        estado_obra || null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear obra" });
  }
};

export const getObraById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM obras WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Obra no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener obra" });
  }
};

export const updateObra = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      metros2,
      potencia,
      tipo_obra,
      nombre_contacto,
      telefono_contacto,
      email_contacto,
      ubicacion,
      empresa_solicitante,
      notas_generales,
      fecha_solicitud,
      archivos_recibidos,
      fecha_entrega,
      fecha_presupuesto,
      fecha_entregado,
      observacion_prorroga,
      estado_obra,
    } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre de la obra es obligatorio" });
    }

    const result = await pool.query(
      `
      UPDATE obras
      SET
        nombre = $1,
        metros2 = $2,
        potencia = $3,
        tipo_obra = $4,
        nombre_contacto = $5,
        telefono_contacto = $6,
        email_contacto = $7,
        ubicacion = $8,
        empresa_solicitante = $9,
        notas_generales = $10,
        fecha_solicitud = $11,
        archivos_recibidos = $12,
        fecha_entrega = $13,
        fecha_presupuesto = $14,
        fecha_entregado = $15,
        observacion_prorroga = $16,
        estado_obra = $17
      WHERE id = $18
      RETURNING *
      `,
      [
        nombre,
        metros2 || null,
        potencia || null,
        tipo_obra || null,
        nombre_contacto || null,
        telefono_contacto || null,
        email_contacto || null,
        ubicacion || null,
        empresa_solicitante || null,
        notas_generales || null,
        fecha_solicitud || null,
        archivos_recibidos || null,
        fecha_entrega || null,
        fecha_presupuesto || null,
        fecha_entregado || null,
        observacion_prorroga || null,
        estado_obra || null,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Obra no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar obra" });
  }
};

export const deleteObra = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM obras WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Obra no encontrada" });
    }

    res.json({ message: "Obra eliminada correctamente", obra: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar obra" });
  }
};
