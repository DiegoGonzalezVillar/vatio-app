import { Router } from "express";
import {
  getObras,
  createObra,
  updateObra,
  deleteObra,
} from "../controllers/obras.controller.js";

const router = Router();

router.get("/", getObras);
router.post("/", createObra);
router.put("/:id", updateObra);
router.delete("/:id", deleteObra);

export default router;
