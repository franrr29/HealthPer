import { NextFunction, Request, Response } from "express";
import { createConsultation as createConsultationService, getConsultationByIdService, allConsultations, patchFields } from "../services/consultation.service";
import { schemaConsult, schemaConsultParams, schemaConsultPatch } from "../schemas/schema.consultation";


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

    if (!consultation || consultation.length === 0) {

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


//GET todo el historial del paciente que pertenece al doctor

export async function getAllConsultations(req: Request, res: Response, next: NextFunction) {
  
  try {

    const { id: patient_id } = schemaConsultParams.parse(req.params);

    const { id: doctor_id } = req.user;

    const consultations = await allConsultations(patient_id,doctor_id);

    if (!consultations || consultations.length === 0) {

      return res.status(404).json({

        message: "Consultations not found"

      });
    }

    return res.status(200).json({

      message: "Showing all consultations from the patient",

      consultations

    });


  } catch (error) {

    next(error);
  }
};


//PATCH para modificar X campos por parte del medico:

export async function patchConsultation(req: Request, res: Response, next: NextFunction) {
  
  try {

    const { id: consultation_id } = schemaConsultParams.parse(req.params);
    const { id: doctor_id } = req.user;
    const fields = schemaConsultPatch.parse(req.body);

    if (Object.keys(fields).length === 0){

       return res.status(400).json({ message: "At least one field is required for update" });
    }
    
    const patchedFields= await patchFields (consultation_id, doctor_id, fields);

    if (!patchedFields){

       return res.status(404).json({ message: "Unable to patch patient data"})
    }

    res.status(200).json({

      message: "Patient information updated succesfully",
    
    });


  } catch (error){

    next (error)

  }
}