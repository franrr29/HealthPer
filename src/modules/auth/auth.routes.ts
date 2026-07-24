//Archivo con rutas e imports para registrar, login, etc:

import { Router, RequestHandler } from "express";
import {tryDemo, registerUser, logginUser, logout, refreshToken } from "./auth.controller";
import limiter from "../../middleware/raterLimiter";



const router = Router();


//ruta para registrar usuarios y redirige a controllers

router.post("/try-demo", limiter, tryDemo as RequestHandler);

router.post("/register", limiter, registerUser as RequestHandler);

router.post("/login", limiter, logginUser as RequestHandler);

router.post("/logout", logout as RequestHandler);

router.post("/refresh", limiter, refreshToken as RequestHandler);


export default router;