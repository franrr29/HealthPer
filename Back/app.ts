//Configurar express y correr middlewares:

import express from "express";
import cors from "cors";
import { errorHandler } from "./src/middleware/errorHandler";

const app = express(); 

// Middlewares globales
app.use(express.json());
app.use(cors());


//ErrorHandler:
app.use (errorHandler)

export default app;
