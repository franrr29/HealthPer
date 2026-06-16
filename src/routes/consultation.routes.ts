import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { createConsultation, getConsultation, getAllConsultations, patchConsultation, transcribeConsultation, summarizeConsultationController } from "../controllers/consultation.controller";
import { uploadAudio } from "../config/multer";


const router=Router ();


router.post ("/consultations",authMiddle, createConsultation);
router.get("/consultations/:id", authMiddle, getConsultation);
router.get ("/patients/:id/consultations", authMiddle, getAllConsultations);
router.patch("/consultations/:id", authMiddle, patchConsultation);
router.post ("/consultations/:id/transcribe", authMiddle, uploadAudio.single ("audio"), transcribeConsultation);
router.post ("/consultations/:id/summarize", authMiddle, summarizeConsultationController);
export default router;