//Archivo con rutas e imports para registrar, login, etc:

import { Router } from "express";
import { registerUser, logginUser} from "../controllers/auth.controller";


const router=Router ();

//ruta para registrar usuarios y redirige a controllers
router.post ("/register", registerUser);
router.post ("/login", logginUser)



export default router