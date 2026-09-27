import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { env } from "../../config/env";
import { accessTokenCookieOptions, clearCookieOptions, oauthStateCookieOptions, refreshTokenCookieOptions } from "../../config/cookieOptions";
import { signAccessToken, signRefreshToken } from "./token.service";

const OAUTH_STATE_COOKIE = "oauthState";

export function initiateGoogleAuth(req: Request, res: Response, next: NextFunction): void {

    const state = crypto.randomBytes(32).toString("hex");

    res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions);

    passport.authenticate("google", { scope: ["profile", "email"], state })(req, res, next);
}

export function validateOAuthState(req: Request, res: Response, next: NextFunction): void {

    const cookieState = req.cookies[OAUTH_STATE_COOKIE];
    const queryState = req.query.state;

    res.clearCookie(OAUTH_STATE_COOKIE, clearCookieOptions);

    if (!cookieState || cookieState !== queryState) {
        res.status(403).json({ success: false, message: "Invalid or expired OAuth state" });
        return;
    }

    next();
}

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
