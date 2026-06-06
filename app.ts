// Configurar express y correr middlewares:

import express from "express";
import cors from "cors";
import "./src/config/passport";
import authRouter from "./src/routes/auth.routes";
import passport from "passport";
import googleAuthRouter from "./src/routes/auth.google.routes";
import { errorHandler } from "./src/middleware/errorHandler";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Rutas
app.use("/auth", authRouter);
app.use("/auth", googleAuthRouter);

// ErrorHandler
app.use(errorHandler);

export default app;