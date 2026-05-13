import { pool } from "../db.js";

export const getCircuitosByTablero = async (req, res) => {
  try {
    const { tableroId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM circuitos_electricos
       WHERE tablero_id = $1
       ORDER BY id ASC`,
      [tableroId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener circuitos eléctricos" });
  }
};

export const createCircuitoElectrico = async (req, res) => {
  try {
    const {
      obra_id,
      tablero_id,
      numero_circuito,
      conductores,
      tipo_canalizacion,
      diametro_cano,
      metros_losa,
      metros_saltos_pared,
      metros_bandeja,
      caja_piso,
      caja_honda,
      bajada_tomas,
      bajada_tomas_picadas,
      caja_llana,
      centro,
      brazo,
      bajada_luces,
      bajada_luces_picadas,
      cano_losa,
      cano_pared,
      cable_metros,
      codos_especiales,
    } = req.body;

    if (!obra_id || !tablero_id) {
      return res.status(400).json({
        error: "obra_id y tablero_id son obligatorios",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO circuitos_electricos (
        obra_id,
        tablero_id,
        numero_circuito,
        conductores,
        tipo_canalizacion,
        diametro_cano,
        metros_losa,
        metros_saltos_pared,
        metros_bandeja,
        caja_piso,
        caja_honda,
        bajada_tomas,
        bajada_tomas_picadas,
        caja_llana,
        centro,
        brazo,
        bajada_luces,
        bajada_luces_picadas,
        cano_losa,
        cano_pared,
        cable_metros,
        codos_especiales
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
        $12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      )
      RETURNING *
      `,
      [
        obra_id,
        tablero_id,
        numero_circuito || null,
        conductores || null,
        tipo_canalizacion || null,
        diametro_cano || null,
        metros_losa || 0,
        metros_saltos_pared || 0,
        metros_bandeja || 0,
        caja_piso || 0,
        caja_honda || 0,
        bajada_tomas || 0,
        bajada_tomas_picadas || 0,
        caja_llana || 0,
        centro || 0,
        brazo || 0,
        bajada_luces || 0,
        bajada_luces_picadas || 0,
        cano_losa || 0,
        cano_pared || 0,
        cable_metros || 0,
        codos_especiales || 0,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear circuito eléctrico" });
  }
};

export const updateCircuitoElectrico = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      numero_circuito,
      conductores,
      tipo_canalizacion,
      diametro_cano,
      metros_losa,
      metros_saltos_pared,
      metros_bandeja,
      caja_piso,
      caja_honda,
      bajada_tomas,
      bajada_tomas_picadas,
      caja_llana,
      centro,
      brazo,
      bajada_luces,
      bajada_luces_picadas,
      cano_losa,
      cano_pared,
      cable_metros,
      codos_especiales,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE circuitos_electricos
      SET
        numero_circuito = $1,
        conductores = $2,
        tipo_canalizacion = $3,
        diametro_cano = $4,
        metros_losa = $5,
        metros_saltos_pared = $6,
        metros_bandeja = $7,
        caja_piso = $8,
        caja_honda = $9,
        bajada_tomas = $10,
        bajada_tomas_picadas = $11,
        caja_llana = $12,
        centro = $13,
        brazo = $14,
        bajada_luces = $15,
        bajada_luces_picadas = $16,
        cano_losa = $17,
        cano_pared = $18,
        cable_metros = $19,
        codos_especiales = $20
      WHERE id = $21
      RETURNING *
      `,
      [
        numero_circuito || null,
        conductores || null,
        tipo_canalizacion || null,
        diametro_cano || null,
        metros_losa || 0,
        metros_saltos_pared || 0,
        metros_bandeja || 0,
        caja_piso || 0,
        caja_honda || 0,
        bajada_tomas || 0,
        bajada_tomas_picadas || 0,
        caja_llana || 0,
        centro || 0,
        brazo || 0,
        bajada_luces || 0,
        bajada_luces_picadas || 0,
        cano_losa || 0,
        cano_pared || 0,
        cable_metros || 0,
        codos_especiales || 0,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Circuito no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar circuito eléctrico" });
  }
};

export const deleteCircuitoElectrico = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM circuitos_electricos
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Circuito no encontrado" });
    }

    res.json({
      message: "Circuito eléctrico eliminado correctamente",
      circuito: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar circuito eléctrico" });
  }
};
