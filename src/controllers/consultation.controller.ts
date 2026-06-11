import { NextFunction, Request, Response } from "express";
import { createConsultation as createConsultationService } from "../services/consultation.service";
import { schemaConsult } from "../schemas/schema.consultation";


// Crea una consulta medica usando el doctor autenticado y valida los datos recibidos

export async function createConsultation(req: Request,res: Response,next: NextFunction
) {

  try {

    const { id: doctor_id } = req.user;

    const consultInfo = schemaConsult.parse(req.body);

    const crearConsult = await createConsultationService(consultInfo.patient_id,doctor_id,consultInfo.transcript
    );

    if (crearConsult === null) {

      return res.status(404).json({

        message: "Failed to create consult"

      });
    }

    return res.status(201).json({

      message: "Consult created",

      data: crearConsult

    });

  } catch (error) {

    next(error);
  }
}