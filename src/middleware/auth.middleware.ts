import { RequestHandler } from "express";
import { verifyAccessToken } from "../modules/auth/token.service";

export const authMiddle: RequestHandler = (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        res.status(401).json({
            success: false, message: "Access token not provided"
        });
        return;
    }

    try {
        req.user = verifyAccessToken(token);

        next();

    } catch {
        res.status(401).json({
            success: false, message: "Invalid or expired token"
        });
    }
}
