import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import obrasRoutes from "./routes/obras.routes.js";
import tablerosRoutes from "./routes/tableros.routes.js";
import circuitosElectricosRoutes from "./routes/circuitosElectricos.routes.js";

const app = express();

// MIDDLEWARES (SIEMPRE ARRIBA)
app.use(cors());
app.use(express.json());

// TEST DB
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de conexión" });
  }
});

// ROUTES
app.use("/api/obras", obrasRoutes);
app.use("/api/tableros", tablerosRoutes);
app.use("/api/circuitos-electricos", circuitosElectricosRoutes);

// SERVER
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
