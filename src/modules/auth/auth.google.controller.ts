// Recibe el usuario validado por pssport y genera un jwt

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../config/cookieOptions";


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
        { expiresIn: "15m" }
    );

    //Genera un refresh token igual que en el login normal

    const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )

    // Redirige al frontend con los tokens en cookies
    res.cookie("accessToken", token, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.redirect(`${env.FRONTEND_URL}/auth/callback`);
}