import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "../../config/logger";
import { env } from "../../config/env";
import { AppError } from "../../errors/appError";
import * as authRepository from "./auth.repository";
import type { AuthenticatedDoctor, DoctorCredentials } from "../../types/doctor.types";

const DEMO_DOCTOR_EMAIL = "demo@demo.com";

interface AuthResult {
  doctor: AuthenticatedDoctor;
  token: string;
  refreshToken: string;
}

function buildAuthResult(doctor: DoctorCredentials): AuthResult {
  const payload = { id: doctor.id, email: doctor.email, role: doctor.role };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  return {
    doctor: { id: doctor.id, name: doctor.name, email: doctor.email, role: doctor.role },
    token,
    refreshToken,
  };
}

async function tryDemoService(): Promise<AuthResult> {
  const doctor = await authRepository.getByEmail(DEMO_DOCTOR_EMAIL);

  if (!doctor) {
    throw new AppError("Demo user not found", 404);
  }

  logger.info(`Demo user logged successfully | Email: ${doctor.email}`);

  return buildAuthResult(doctor);
}

async function loginUser(email: string, password: string): Promise<AuthResult> {
  const doctor = await authRepository.getByEmail(email);

  if (!doctor) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValidPassword = await bcrypt.compare(password, doctor.password_hash);

  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  logger.info(`Doctor logged successfully | Email: ${email}`);

  return buildAuthResult(doctor);
}

export { tryDemoService };
export default loginUser;
