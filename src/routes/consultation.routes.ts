import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { createConsultation, getConsultation, getAllConsultations, patchConsultation, transcribeConsultation } from "../controllers/consultation.controller";
import { uploadAudio } from "../config/multer";

const router=Router ();


router.post ("/consultations",authMiddle, createConsultation);
router.get("/consultations/:id", authMiddle, getConsultation);
router.get ("/patients/:id/consultations", authMiddle, getAllConsultations);
router.patch("/consultations/:id", authMiddle, patchConsultation);
router.post ("/consultations/:id/transcribe", authMiddle, uploadAudio.single ("audio"), transcribeConsultation);

export default router;