// Valida y exporta variables de entorno al arrancar el servidor

import { z } from "zod";

export const serverSchema = z.object({
  // servidor
  PORT: z.coerce.number(),
   //coerce pasa de string a number

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
  JWT_SECRET: z.string().min(5),
  REFRESH_TOKEN_SECRET: z.string().min(5),

});

export const env = serverSchema.parse(process.env);