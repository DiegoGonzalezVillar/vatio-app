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
      nombre_contacto,
      telefono_contacto,
      email_contacto,
      ubicacion,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO obras 
      (nombre, nombre_contacto, telefono_contacto, email_contacto, ubicacion) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [nombre, nombre_contacto, telefono_contacto, email_contacto, ubicacion],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear obra" });
  }
};

export const updateObra = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      nombre_contacto,
      telefono_contacto,
      email_contacto,
      ubicacion,
    } = req.body;

    const result = await pool.query(
      `UPDATE obras SET
        nombre = $1,
        nombre_contacto = $2,
        telefono_contacto = $3,
        email_contacto = $4,
        ubicacion = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [
        nombre,
        nombre_contacto,
        telefono_contacto,
        email_contacto,
        ubicacion,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Obra no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar obra" });
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

    res.json({ message: "Obra eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar obra" });
  }
};
