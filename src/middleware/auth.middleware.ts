//Middle para verificar si esta autorizado el usuario a ingresar al sistema

import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RequestHandler } from "express";


export const authMiddle: RequestHandler = (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        res.status(401).json({
            message: "Access token not provided"
        });
        return;
    }

    try {
        // revisa si el token es valido
        const payload = jwt.verify(token, env.JWT_SECRET) as { id: number; email: string; role: string };

        req.user = payload;

        next();

    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}