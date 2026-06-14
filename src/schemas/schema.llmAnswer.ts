import { z } from "zod";

// Valida la estructura del resumen generado por la IA
export const consultationSummarySchema = z.object({
    chief_complaint: z.string(),
    symptoms: z.array(z.string()),
    diagnosis: z.string(),
    treatment: z.string(),
    follow_up: z.string()
});

export type ConsultationSummary = z.infer<typeof consultationSummarySchema>;