import { authMiddle } from "../../middleware/auth.middleware";
import { Router } from "express";
import { getPatients, getPatientByID, createPatient, patchPatient, deletePatient, getPatientMemoryController, askPatientController, getPatientFollowUpController } from "./patient.controller"

const router = Router();

router.get("/", authMiddle, getPatients);
router.get("/follow-up", authMiddle, getPatientFollowUpController);
router.get ("/:id/memory", authMiddle, getPatientMemoryController);
router.get("/:id", authMiddle, getPatientByID);
router.post("/", authMiddle, createPatient);
router.post("/:id/ask", authMiddle, askPatientController);
router.patch("/:id", authMiddle, patchPatient);
router.delete("/:id", authMiddle, deletePatient);


export default router;
