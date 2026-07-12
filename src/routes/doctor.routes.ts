//Rutas del endpoint del doctor para traer sus datos y mostrarlos en el dashboard:

import { Router } from "express";
import { authMiddle } from "../middleware/auth.middleware";
import { getDoctorData, getDoctorStatsById  } from "../controllers/doctors.controller";

const router= Router();

router.get("/me", authMiddle, getDoctorData);
router.get("/stats", authMiddle, getDoctorStatsById);

export default router;