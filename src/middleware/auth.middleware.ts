//Middle para verificar si esta autorizado el usuario a ingresar al sistema

import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RequestHandler } from "express";


export const authMiddle: RequestHandler = (req, res, next) => {
   
    //Token enviado por el user:
    const authHeader= req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        
        res.status(401).json({ 
            success: false,
            message: "Token required" });
        return;
    }
    

    //sacar el bearer y dejar solo el token:
    const token = authHeader.split(" ")[1];

    try {
        
        //revisa si el token es valido:
        const payload= jwt.verify(token, env.JWT_SECRET) as { id: number; email: string; role: string };
        

        req.user = payload;
        
        next();

    } catch {

        res.status(401).json ({
            message: "Invalid or expired token"
        });

    }


}