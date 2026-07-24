//middle para limitar la cantidad de reqts por ip:
import rateLimit from "express-rate-limit";


//limitado a 15 reqts por 15 minutos, para evitar que un usuario haga demasiadas reqts y sature el servidor
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 15, 
  message: "Too many requests from this IP, please try again later.",
});

export default limiter;