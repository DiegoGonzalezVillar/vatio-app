import { Router } from "express";
import { getPuestaATierra, upsertPuestaATierra } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getPuestaATierra);
router.post("/", upsertPuestaATierra);
export default router;
