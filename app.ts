import express from "express";
import helmet from "helmet";
import cors from "cors";
import "./src/config/passport";
import authRouter from "./src/routes/auth.routes";
import passport from "passport";
import googleAuthRouter from "./src/routes/auth.google.routes";
import { errorHandler } from "./src/middleware/errorHandler";
import patientRouter from "./src/routes/patient.routes";
import consultationRouter from "./src/routes/consultation.routes";

const app = express();

// Seguridad: headers HTTP
app.use(helmet());

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Rutas
app.use("/auth", authRouter);
app.use("/auth", googleAuthRouter);
app.use("/patients", patientRouter);
app.use("/", consultationRouter);

// ErrorHandler
app.use(errorHandler);

export default app;