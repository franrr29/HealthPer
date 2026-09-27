import { z } from "zod";

export const schemaEmailParams = z.object({
  id: z.coerce.number().int().positive()
});

export const schemaSendEmail = z.object({
  patientEmail: z.string().trim().email("Invalid email address"),
  emailContent: z.string().trim().min(1, "Email content is required")
});
