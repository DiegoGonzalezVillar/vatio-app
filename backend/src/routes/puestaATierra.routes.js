import { Router } from "express";
import { deletePuestaATierra, getPuestaATierra, upsertPuestaATierra } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getPuestaATierra);
router.post("/", upsertPuestaATierra);
router.delete("/:itemId", deletePuestaATierra);
export default router;
