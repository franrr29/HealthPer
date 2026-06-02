//Configurar express y correr middlewares:

import express from "express";
import cors from "cors";

const app = express(); 

// Middlewares globales
app.use(express.json());
app.use(cors());

export default app;
