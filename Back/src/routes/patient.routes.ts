//Llama a patient.controller

import { authMiddle } from "../middleware/auth.middleware";
import { Router } from "express";
import { getPatients, getPatientByID } from "../controllers/patient.controller"
const router=Router ();

//Traer todos los pacientes:
router.get ("/",authMiddle, getPatients);

//Traer pacientes por ID:
router.get ("/patients/:id", authMiddle, getPatientByID);


export default router;

