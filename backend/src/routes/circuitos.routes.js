import { Router } from "express";
import { createCircuito, deleteCircuito, getCircuitosByObra, getCircuitosByTablero, updateCircuito } from "../controllers/circuitos.controller.js";
const router = Router();
router.get("/tablero/:tableroId/:tipo", getCircuitosByTablero);
router.get("/obra/:obraId/:tipo", getCircuitosByObra);
router.post("/", createCircuito);
router.put("/:id", updateCircuito);
router.delete("/:id", deleteCircuito);
export default router;
