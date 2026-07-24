import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import "./config/passport";
import authRouter from "./modules/auth/auth.routes";
import passport from "passport";
import googleAuthRouter from "./modules/auth/auth.google.routes";
import { errorHandler } from "./middleware/errorHandler";
import patientRouter from "./modules/patient/patient.routes";
import consultationRouter from "./modules/consultation/consultation.routes";
import doctorRouter from "./modules/doctor/doctor.routes";
import { env } from "./config/env";
import emailRouter from "./modules/email/email.routes";
import suggestedQuestionsRouter from "./questions/suggestedQuestions.routes";


const app = express();
app.set('trust proxy', 1);

// Seguridad: headers HTTP
app.use(helmet());

// Middlewares globales
app.use (cookieParser());
app.use(express.json());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
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
app.use("/doctor", doctorRouter);
app.use("/", emailRouter);
app.use("/consultations", suggestedQuestionsRouter);

// ErrorHandler
app.use(errorHandler);

export default app;