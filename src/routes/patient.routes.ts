import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { getPatients, getPatientByID, createPatient } from "../controllers/patient.controller"

const router = Router();

router.get("/", authMiddle, getPatients);
router.get("/:id", authMiddle, getPatientByID);
router.post("/", authMiddle, createPatient);

export default router;
