import { ErrorRequestHandler } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod";
import { logger } from "../config/logger";
import { AppError, ExternalServiceError } from "../errors";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {

    if (error instanceof ExternalServiceError) {
        logger.error({ err: error, provider: error.provider }, error.message);
    } else {
        logger.error(error);
    }

    if (error instanceof ZodError) {
        const message = error.issues
            .map((issue) => issue.path.length > 0 ? `${issue.path.join(".")}: ${issue.message}` : issue.message)
            .join("; ");

        res.status(400).json({ success: false, message });
        return;
    }

    // covers TokenExpiredError and NotBeforeError, which extend JsonWebTokenError
    if (error instanceof JsonWebTokenError) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
    }

    res.status(500).json({ success: false, message: "Internal server error" });
};
