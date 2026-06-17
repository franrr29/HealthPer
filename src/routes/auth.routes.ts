//Archivo con rutas e imports para registrar, login, etc:

import { Router, RequestHandler } from "express";
import { registerUser, logginUser, logout, refreshToken } from "../controllers/auth.controller";


const router = Router();


//ruta para registrar usuarios y redirige a controllers

router.post("/register", registerUser as RequestHandler);

router.post("/login", logginUser as RequestHandler);

router.post("/logout", logout as RequestHandler);

router.post("/refresh", refreshToken as RequestHandler);


export default router;