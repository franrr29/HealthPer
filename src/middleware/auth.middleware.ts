//Middle para verificar si esta autorizado el usuario a ingresar al sistema

import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";


export function authMiddle (req: Request, res: Response, next: NextFunction){
   
    //Token enviado por el user:
    const authHeader= req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        
        res.status(401).json({ message: "Token requerido" });
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
            mensaje: "Invalid or expired token"
        })
    }


}