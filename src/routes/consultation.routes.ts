import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { createConsultation } from "../controllers/consultation.controller";

const router=Router ();


router.post ("/consultations",authMiddle, createConsultation);

export default router;