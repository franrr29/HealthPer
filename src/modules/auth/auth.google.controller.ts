import { Request, Response } from "express";
import { env } from "../../config/env";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../config/cookieOptions";
import { signAccessToken, signRefreshToken } from "./token.service";

export function handleGoogleCallback(req: Request, res: Response) {

    // passport already validated the user and put it in req.user
    const user = req.user;

    if (!user) {
        res.status(401).json({ success: false, message: "Google auth failed" });
        return;
    }

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.cookie("accessToken", token, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.redirect(`${env.FRONTEND_URL}/auth/callback`);
}
