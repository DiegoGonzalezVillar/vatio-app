import { Router } from "express";
import { getBandejas, upsertBandeja } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getBandejas);
router.post("/", upsertBandeja);
export default router;
