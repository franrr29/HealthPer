//Configurar express y correr middlewares:

import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.routes";

import { errorHandler } from "./src/middleware/errorHandler";


const app = express(); 

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use ("/auth", authRouter)


//ErrorHandler:
app.use (errorHandler)

export default app;
