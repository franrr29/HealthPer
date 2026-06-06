// Recibe el usuario validado por pssport y genera un jwt

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function handleGoogleCallback(req: Request, res: Response) {

    // Passport ya valido al usuario y lo puso en req.user
    
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: "Google auth failed" });
        return;
    }

    // Genera un jwt igual que en el login normal

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({ token });
}