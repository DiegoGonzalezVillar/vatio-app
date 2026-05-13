import express from "express";
import {
  getCircuitosByTablero,
  createCircuitoElectrico,
  updateCircuitoElectrico,
  deleteCircuitoElectrico,
} from "../controllers/circuitosElectricos.controller.js";

const router = express.Router();

router.get("/tablero/:tableroId", getCircuitosByTablero);
router.post("/", createCircuitoElectrico);
router.put("/:id", updateCircuitoElectrico);
router.delete("/:id", deleteCircuitoElectrico);

export default router;
