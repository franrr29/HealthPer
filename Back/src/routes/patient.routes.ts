//Llama a patient.controller

import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { getPatients, getPatientByID, createPatient } from "../controllers/patient.controller"

const router=Router ();

//Traer todos los pacientes:
router.get ("/",authMiddle, getPatients);

//Traer pacientes por ID:
router.get ("/:id", authMiddle, getPatientByID);
router.post ("/", authMiddle, createPatient)


export default router;

