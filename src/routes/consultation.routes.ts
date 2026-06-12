import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { createConsultation, getConsultation, getAllConsultations, patchConsultation } from "../controllers/consultation.controller";

const router=Router ();


router.post ("/consultations",authMiddle, createConsultation);
router.get("/consultations/:id", authMiddle, getConsultation);
router.get ("/patients/:id/consultations", authMiddle, getAllConsultations);
router.patch("/consultations/:id", authMiddle, patchConsultation);

export default router;