//Schema para autenticacion de usuarios 
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
  .email({ message: "Invalid email address" }),
  password: z.string()
  .min(6, { message: "Password must be at least 6 characters long" })
});

export const registerSchema = z.object({
  name: z.string()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name must be less than 50 characters long" }),
  email: z.string()
  .email({ message: "Invalid email address" }),
  password: z.string()
  .min(6, { message: "Password must be at least 6 characters long" })
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
  .min(1, { message: "Refresh token is required" })
});