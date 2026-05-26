import { Router } from "express";
import { createPortero, deletePortero, getPorteros, updatePortero } from "../controllers/excelModules.controller.js";
const router = Router();
router.get("/obra/:obraId", getPorteros);
router.post("/", createPortero);
router.put("/:id", updatePortero);
router.delete("/:id", deletePortero);
export default router;
