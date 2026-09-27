// Crea y exporta el pool de conexiones a MySQL

import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  // capa extra: los call sites no deberian loggear estos campos directamente, esto es defensa en profundidad
  redact: {
    paths: [
      "email", "*.email",
      "name", "*.name",
      "first_name", "*.first_name",
      "last_name", "*.last_name",
      "patient_name", "*.patient_name",
      "doctor_name", "*.doctor_name",
    ],
    censor: "[REDACTED]",
  },
});