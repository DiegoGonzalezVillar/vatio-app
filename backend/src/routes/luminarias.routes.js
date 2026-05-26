import { Router } from "express";
import { getLuminarias, upsertLuminaria } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getLuminarias);
router.post("/", upsertLuminaria);
export default router;
