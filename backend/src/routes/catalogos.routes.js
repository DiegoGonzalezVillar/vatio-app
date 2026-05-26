import { Router } from "express";
import {
  createTerminacionCatalogo,
  deleteTerminacionCatalogo,
  getTerminacionesCatalogo,
  updateTerminacionCatalogo,
} from "../controllers/catalogos.controller.js";

const router = Router();

router.get("/terminaciones/:tipo", getTerminacionesCatalogo);
router.post("/terminaciones/:tipo", createTerminacionCatalogo);
router.put("/terminaciones/:tipo/:id", updateTerminacionCatalogo);
router.delete("/terminaciones/:tipo/:id", deleteTerminacionCatalogo);

export default router;
