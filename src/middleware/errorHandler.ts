import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";


// Middleware global de errores: captura errores enviados con next(error)
export const errorHandler: ErrorRequestHandler = (error,req,res,next) => {

  logger.error(error);


  if (error instanceof ZodError) {

    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.issues,

    });

    return;
  }


  res.status(500).json({

    success: false,
    message: error.message || "Server error occurred",

  });

};