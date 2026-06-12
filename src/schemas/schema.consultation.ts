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


//PATCH ZOD para consultas:
export const schemaConsultPatch = z.object({
  transcript: z.string().trim().min(1).optional(),
  edited_summary: z.string().trim().min(1).optional(),

  status: z.enum(["draft", "reviewed", "signed"]).optional()

}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field is required"
});

//refine al final evita que llegue un body vacio sin campos