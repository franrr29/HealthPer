//Archivo con rutas e imports para registrar, login, etc:

import { Router } from "express";
import { registerUser, logginUser, logout, refreshToken} from "../controllers/auth.controller";



const router=Router ();

//ruta para registrar usuarios y redirige a controllers
router.post ("/register", registerUser);
router.post ("/login", logginUser);
router.post ("/logout", logout);
router.post ("/refresh", refreshToken)



export default router