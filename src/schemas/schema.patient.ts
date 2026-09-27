import { z } from "zod";

export const schemaPatient = z.object({
  name: z.string().min(1, "Nombre del paciente obligatorio"),
  birth_date: z.string().optional(),
  gender: z.enum(["M", "F", "X", "U"]).optional(),
  national_id: z.string().min(6).max(20).optional(),
  phone: z.string().min(5).max(20).optional(),
});

export const schemaPatientParams = z.object({
  id: z.coerce.number().int().positive()
});

export const schemaPatientAsk = z.object({
  question: z.string().trim().min(1, "Question is required")
});

export type Patient = z.infer<typeof schemaPatient>;
