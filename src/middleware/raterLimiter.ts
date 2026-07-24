//middle para limitar la cantidad de reqts por ip:
import rateLimit from "express-rate-limit";


// 100 requests por ventana para soportar la demo sin bloquear al usuario
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});

export default limiter;