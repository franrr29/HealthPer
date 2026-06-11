//Schema para verificar datos que guardo en transcript de base de datos

import { z } from "zod";


export const schemaConsult = z.object({
  patient_id: z.number().positive(),
  transcript: z.string().trim().min(1).optional()
});

export const schemaConsultParams = z.object({
  id: z.coerce.number().positive()
});

//coerce convierte el string del url a num