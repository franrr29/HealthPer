// Schema de datos que el doctor guarda en DB cuando crea un paciente:
import { z } from "zod";

 const schemaPatient = z.object({

  name: z.string().min(1, "Nombre del paciente obligatorio"),

  birth_date: z.string().optional(),

  gender: z.enum(["M", "F", "X", "U"]).optional(),

  national_id: z.string().min(6).max(20).optional(),

  phone: z.string().min(5).max(20).optional(),

});

export type Patient = z.infer<typeof schemaPatient>;