// Crea y exporta el pool de conexiones a MySQL

import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});