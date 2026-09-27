import { z } from "zod";

export const schemaSuggestedQuestions = z.object({
  transcript: z.string().trim().min(1, "Transcript is required"),
  patient_id: z.coerce.number().int().positive()
});
