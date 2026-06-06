//Errores centralizados con Express y delegando todo aca:

import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function errorHandler (error: Error, req: Request, res: Response, next: NextFunction){

    logger.error (error);

    res.status(500).json ({
        success: false,
        message:error.message || "Error interno del servidor",
    })
}