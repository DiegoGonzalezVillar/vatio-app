import { Router } from "express";
import { getTerminaciones, upsertTerminacion } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId/:tipo", getTerminaciones);
router.post("/", upsertTerminacion);
export default router;
