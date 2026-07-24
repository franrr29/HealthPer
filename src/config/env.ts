// Valida y exporta variables de entorno al arrancar el servidor

import { z } from "zod";

export const serverSchema = z.object({
  // servidor
  PORT: z.coerce.number(),
   //coerce pasa de string a number
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  // Base de datos
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string().min(5),
  DB_NAME: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GROQ_API_KEY: z.string().min(10),
  GEMINI_API_KEY: z.string (). min (10),

  

  // Seguridad
  JWT_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ALLOW_REGISTER: z.enum(["true", "false"]).transform((value) => value === "true"),
  ALLOW_DEMO: z.enum(["true", "false"]).transform((value) => value === "true"),

  //ruta al front
  FRONTEND_URL: z.string().url(),


  // Resend API Key
  RESEND_API_KEY: z.string().min(10),

});

export const env = serverSchema.parse(process.env);