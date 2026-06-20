import { z } from "zod";

// Valida la estructura de la memoria del paciente fusionada por la ia

export const patientMemorySchema = z.object({
    chronic_diseases: z.array(z.string()),
    allergies: z.array(z.string()),
    medications: z.array(z.string()),
    recurrent_symptoms: z.array(z.string()),
    master_summary: z.string()
});

export type PatientMemory = z.infer<typeof patientMemorySchema>;