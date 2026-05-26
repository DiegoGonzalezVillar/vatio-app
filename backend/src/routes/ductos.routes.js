import { Router } from "express";
import { getDuctos, upsertDucto } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getDuctos);
router.post("/", upsertDucto);
export default router;
