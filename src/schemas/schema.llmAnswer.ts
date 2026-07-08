import { z } from "zod";

// Valida la estructura del resumen generado por la IA y nullable hace opcionales los campos
export const consultationSummarySchema = z.object({
    chief_complaint: z.string().nullable(),
    symptoms: z.array(z.string()),
    diagnosis: z.string().nullable(),
    treatment: z.string().nullable(),
    follow_up: z.string().nullable()
});

export type ConsultationSummary = z.infer<typeof consultationSummarySchema>;