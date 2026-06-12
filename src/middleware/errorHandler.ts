import { ZodError } from "zod";
import { logger } from "../config/logger";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    
    logger.error(error);

    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors
        });
    }

    res.status(500).json({
        success: false,
        message: error.message || "Error interno del servidor",
    });
}