//Todas las rutas relacionadas a las consultas que vienen del front, van hacia el controller y luego al service:

import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { createConsultation, getConsultation, getAllConsultations, patchConsultation,
         transcribeConsultation, summarizeConsultationController, editSummaryController } from "../controllers/consultation.controller";
import { uploadAudio } from "../config/multer";


const router=Router ();

//Rutas para las consultas:

router.post ("/consultations",authMiddle, createConsultation);
router.get("/consultations/:id", authMiddle, getConsultation);
router.get ("/patients/:id/consultations", authMiddle, getAllConsultations);
router.patch("/consultations/:id", authMiddle, patchConsultation);
router.post ("/consultations/:id/transcribe", authMiddle, uploadAudio.single ("audio"), transcribeConsultation);
router.post ("/consultations/:id/summarize", authMiddle, summarizeConsultationController);
router.patch('/consultations/:id/summary',authMiddle, editSummaryController);



export default router;