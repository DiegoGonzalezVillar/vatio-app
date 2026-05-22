import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import obrasRoutes from "./routes/obras.routes.js";
import tablerosRoutes from "./routes/tableros.routes.js";
import circuitosRoutes from "./routes/circuitos.routes.js";
import terminacionesRoutes from "./routes/terminaciones.routes.js";
import puestaATierraRoutes from "./routes/puestaATierra.routes.js";
import tablerosMaterialesRoutes from "./routes/tablerosMateriales.routes.js";
import luminariasRoutes from "./routes/luminarias.routes.js";
import bandejasRoutes from "./routes/bandejas.routes.js";
import ductosRoutes from "./routes/ductos.routes.js";
import porterosRoutes from "./routes/porteros.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "vatio-backend" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "vatio-backend" });
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de conexión" });
  }
});

app.use("/api/obras", obrasRoutes);
app.use("/api/tableros", tablerosRoutes);
app.use("/api/circuitos", circuitosRoutes);
app.use("/api/terminaciones", terminacionesRoutes);
app.use("/api/puesta-a-tierra", puestaATierraRoutes);
app.use("/api/tableros-materiales", tablerosMaterialesRoutes);
app.use("/api/luminarias", luminariasRoutes);
app.use("/api/bandejas", bandejasRoutes);
app.use("/api/ductos", ductosRoutes);
app.use("/api/porteros", porterosRoutes);
app.use("/api/catalogos", catalogosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
