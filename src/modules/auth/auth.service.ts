import { ConflictError } from "../../errors";
import bcrypt from "bcrypt";
import { logger } from "../../config/logger";
import * as authRepository from "./auth.repository";

const SALT_ROUNDS = 12;

async function registerDoc(name: string, email: string, password: string): Promise<{ insertId: number }> {
  const existingDoctor = await authRepository.getByEmail(email);

  if (existingDoctor) {
    throw new ConflictError("Doctor already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const insertId = await authRepository.create({ name, email, password_hash: passwordHash });

  logger.info(`Doctor registered successfully | Doctor ID: ${insertId}`);

  return { insertId };
}

export default registerDoc;
