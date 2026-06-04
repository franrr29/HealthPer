//Archivo con rutas e imports para registrar, login, etc:

import { Router } from "express";
import registerUser from "../controllers/auth.controller";

const router=Router ();

//ruta para registrar usuarios y redirige a controllers
router.post ("/register", registerUser);



export default router