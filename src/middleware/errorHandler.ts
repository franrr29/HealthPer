import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";
import { AppError } from "../errors/appError";


// Middleware global de errores: captura errores enviados con next(error)
export const errorHandler: ErrorRequestHandler = (error,req,res,next) => {


    logger.error(error);


    // Errores de validación Zod
    if (error instanceof ZodError) {

        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.issues
        });

        return;

    }



    // Errores controlados de la aplicación
    if (error instanceof AppError) {

        res.status(error.statusCode).json({
            success:false,
            message:error.message
        });

        return;

    }



    // Errores inesperados
    res.status(500).json({

        success:false,
        message:"Internal server error"

    });


};