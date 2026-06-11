import { NextFunction, Request, Response } from "express";
import { createConsultation as createConsultationService, getConsultationByIdService } from "../services/consultation.service";
import { schemaConsult, schemaConsultParams } from "../schemas/schema.consultation";


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

//GET para traer las consultas relacionadas al paciente por parte del doctor:

export async function getConsultation(req: Request, res: Response, next: NextFunction) {
  
  try {

    const consultIDs = schemaConsultParams.parse(req.params);

    const { id: doctor_id } = req.user;

    const consultation = await getConsultationByIdService(consultIDs.id,doctor_id);

    if (!consultation) {

      return res.status(404).json({

        message: "No consultations found"

      });
    }

    return res.status(200).json({

      message: "Consultations fetched successfully",

      consultation
    });

  } catch (error) {

    next(error);

  }
}