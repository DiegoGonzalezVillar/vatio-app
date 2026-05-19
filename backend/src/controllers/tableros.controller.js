import { pool } from "../db.js";

// Obtener tableros de una obra
export const getTablerosByObra = async (req, res) => {
  try {
    const { obraId } = req.params;

    const result = await pool.query(
      "SELECT * FROM tableros WHERE obra_id = $1 ORDER BY id DESC",
      [obraId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener tableros" });
  }
};

// Crear tablero
export const createTablero = async (req, res) => {
  try {
    const {
      obra_id,
      nombre,
      tipo_tablero_id,
      altura_local,
      altura_tablero,
      agregado_tablero,
      altura_toma,
      altura_llave_luz,
      altura_brazo,
      altura_especial,
      agregado_caja_honda,
      agregado_caja_centro,
      agregado_caja_brazo,
      agregado_h_especial,
      extra_por_vigas,
      cantidad_tableros,
      cant_modulos,
      precio_tablero_usd,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tableros (
        obra_id,
        nombre,
        tipo_tablero_id,
        altura_local,
        altura_tablero,
        agregado_tablero,
        altura_toma,
        altura_llave_luz,
        altura_brazo,
        altura_especial,
        agregado_caja_honda,
        agregado_caja_centro,
        agregado_caja_brazo,
        agregado_h_especial,
        extra_por_vigas,
        cantidad_tableros,
        cant_modulos,
        precio_tablero_usd
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING *`,
      [
        obra_id,
        nombre,
        tipo_tablero_id,
        altura_local || null,
        altura_tablero || null,
        agregado_tablero || null,
        altura_toma || null,
        altura_llave_luz || null,
        altura_brazo || null,
        altura_especial || null,
        agregado_caja_honda || null,
        agregado_caja_centro || null,
        agregado_caja_brazo || null,
        agregado_h_especial || null,
        extra_por_vigas || 0,
        cantidad_tableros || 1,
        cant_modulos || null,
        precio_tablero_usd || 0,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tablero" });
  }
};

export const getLastTablero = async (req, res) => {
  try {
    const { obraId } = req.params;

    const result = await pool.query(
      `SELECT * 
       FROM tableros
       WHERE obra_id = $1
       ORDER BY id DESC
       LIMIT 1`,
      [obraId],
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo último tablero",
    });
  }
};
