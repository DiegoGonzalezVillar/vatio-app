import { Router } from "express";
import { getTablerosMateriales, upsertTableroMaterial } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getTablerosMateriales);
router.post("/", upsertTableroMaterial);
export default router;
