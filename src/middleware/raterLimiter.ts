//middle para limitar la cantidad de reqts por ip:
import rateLimit from "express-rate-limit";


// 100 requests por ventana para soportar la demo sin bloquear al usuario
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});

const RATE_LIMIT_ERROR_RESPONSE = { success: false, message: "Too many requests, try again later" };

// endpoints que consumen Groq/Gemini (pago): comparten un mismo budget de 20/min por IP
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: RATE_LIMIT_ERROR_RESPONSE,
});

// endpoints que consumen Resend (pago): comparten un mismo budget de 5/min por IP
export const emailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: RATE_LIMIT_ERROR_RESPONSE,
});

export default limiter;