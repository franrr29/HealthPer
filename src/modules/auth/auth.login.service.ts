import bcrypt from "bcrypt";
import { logger } from "../../config/logger";
import { NotFoundError, UnauthorizedError } from "../../errors";
import * as authRepository from "./auth.repository";
import * as doctorRepository from "../doctor/doctor.repository";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./token.service";
import type { AuthenticatedDoctor, DoctorCredentials } from "../../types/doctor.types";
import type { RefreshTokenPayload } from "../../types/auth.types";

const DEMO_DOCTOR_EMAIL = "demo@demo.com";
const INVALID_REFRESH_TOKEN_MESSAGE = "Invalid or expired refresh token";

// same cost as real password hashes so a missing user takes as long as a wrong password
const DUMMY_HASH = "$2b$12$5ZK2R/dYRjkJ4c5fHtnqG.SV1MoQnOqPSykI9MhljRxBJwomTFKKm";

interface AuthResult {
  doctor: AuthenticatedDoctor;
  token: string;
  refreshToken: string;
}

function buildAuthResult(doctor: DoctorCredentials): AuthResult {
  return {
    doctor: { id: doctor.id, name: doctor.name, email: doctor.email, role: doctor.role },
    token: signAccessToken({ id: doctor.id, email: doctor.email, role: doctor.role }),
    refreshToken: signRefreshToken({ id: doctor.id }),
  };
}

async function tryDemoService(): Promise<AuthResult> {
  const doctor = await authRepository.getByEmail(DEMO_DOCTOR_EMAIL);

  if (!doctor) {
    throw new NotFoundError("Demo user not found");
  }

  logger.info(`Demo user logged successfully | Doctor ID: ${doctor.id}`);

  return buildAuthResult(doctor);
}

async function loginUser(email: string, password: string): Promise<AuthResult> {
  const doctor = await authRepository.getByEmail(email);

  if (!doctor) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, doctor.password_hash);

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid credentials");
  }

  logger.info(`Doctor logged successfully | Doctor ID: ${doctor.id}`);

  return buildAuthResult(doctor);
}

// the refresh token only carries the id, so email and role are reloaded from the db
async function refreshAccessToken(refreshToken: string): Promise<string> {
  let payload: RefreshTokenPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    // a jsonwebtoken failure means a bad token, not a server fault
    throw new UnauthorizedError(INVALID_REFRESH_TOKEN_MESSAGE);
  }

  const doctor = await doctorRepository.getById(payload.id);

  if (!doctor) {
    throw new UnauthorizedError(INVALID_REFRESH_TOKEN_MESSAGE);
  }

  return signAccessToken({ id: doctor.id, email: doctor.email, role: doctor.role });
}

export { tryDemoService, refreshAccessToken };
export default loginUser;
