// Configurar express y correr middlewares:

import express from "express";
import cors from "cors";
import "./src/config/passport";
import authRouter from "./src/routes/auth.routes";
import passport from "passport";
import googleAuthRouter from "./src/routes/auth.google.routes";
import { errorHandler } from "./src/middleware/errorHandler";
import patientRouter from "./src/routes/patient.routes";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Rutas
app.use("/auth", authRouter);
app.use("/auth", googleAuthRouter);
app.use("/patients", patientRouter);

// ErrorHandler
app.use(errorHandler);

export default app;