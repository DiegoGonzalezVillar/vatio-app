import { Router } from "express";
import {
  getTablerosByObra,
  createTablero,
  getLastTablero,
  updateTablero,
  deleteTablero,
} from "../controllers/tableros.controller.js";

const router = Router();

router.get("/obra/:obraId", getTablerosByObra);
router.post("/", createTablero);
router.get("/last/:obraId", getLastTablero);
router.put("/:id", updateTablero);
router.delete("/:id", deleteTablero);

export default router;
