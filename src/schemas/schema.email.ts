import { z } from "zod";

export const schemaEmailParams = z.object({
  id: z.coerce.number().int().positive()
});

export const schemaSendEmail = z.object({
  emailContent: z.string().trim().min(1, "Email content is required")
});
