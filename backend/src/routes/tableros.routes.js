import { Router } from "express";
import {
  getTablerosByObra,
  createTablero,
  getLastTablero,
} from "../controllers/tableros.controller.js";

const router = Router();

router.get("/obra/:obraId", getTablerosByObra);
router.post("/", createTablero);
router.get("/last/:obraId", getLastTablero);

export default router;
