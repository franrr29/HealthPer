import { NextFunction, Request, Response } from "express";
import { createConsultation as createConsultationService, getConsultationByIdService, allConsultations, 
  patchFields, summarizeConsultation, editConsultationSummary, signConsultationService } from "../services/consultation.service";
import { schemaConsult, schemaConsultParams, schemaConsultPatch } from "../schemas/schema.consultation";
import { transcribeAudio } from "../services/whisper.service";



// Crea una consulta medica usando el doctor autenticado y valida los datos recibidos

export async function createConsultation(req: Request,res: Response,next: NextFunction
) {

  try {

    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


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


    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


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


    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


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


    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


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


//Enviar el buffer con el audio a whisper.service y traer la transcripcion del audio

export async function transcribeConsultation(req: Request, res: Response, next: NextFunction) {
  
  try {


    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


    const { id: doctor_id } = req.user;
    const { id: consultation_id } = schemaConsultParams.parse(req.params);

    const audioBuffer = req.file?.buffer;


    if (!audioBuffer) {

      return res.status(400).json({

        message: "Audio file is required"

      });
    }


    const sendAudio = await transcribeAudio(audioBuffer);


    if (!sendAudio) {

      return res.status(500).json({

        message: "Audio transcription failed"

      });
    }

    await patchFields (consultation_id, doctor_id, { transcript: sendAudio})


    return res.status(200).json({

      message: "Audio transcribed successfully",

      transcription: sendAudio

    });

  } catch (error) {

    next(error);

  }
}


//Funcion para generar resumen de consulta que envia a summarizeConsultation en consultation.service:
export async function summarizeConsultationController (req: Request, res: Response, next: NextFunction) {

  try {


    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


    const { id: doctor_id } = req.user;
    const { id: consultation_id } = schemaConsultParams.parse(req.params);

    const sendInfo= await summarizeConsultation(consultation_id, doctor_id);

    if (!sendInfo) {

      return res.status(404).json({

        message: "Consultation not found or transcript missing"

      });
    } 

    return res.status(200).json({

      message: "Consultation summarized successfully", 
      data: sendInfo 

  })


  } catch (error) {

    next(error);    
} 
}


//Funcion para generar resumen de consulta envia a consultation.service y guardar el resumen en la base de datos:

export async function editSummaryController (req: Request, res: Response, next: NextFunction) {

  try {


    if (!req.user) {

      res.status(401).json({ message: "Unauthorized" });
      return;

    }


    const { id: doctor_id } = req.user;
    const { id: consultation_id } = schemaConsultParams.parse(req.params);
    const { edited_summary } = schemaConsultPatch.parse(req.body);

    if (!edited_summary) {
      return res.status(400).json({ message: "edited_summary is required" });
    }

    const result = await editConsultationSummary(consultation_id, doctor_id, edited_summary);

    if (!result) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    return res.status(200).json({ message: "Summary edited successfully", data: result });

  } catch (error) {
    next(error);
  }
}


//Funcion que permite al doctor firmar la consulta luego de verificar en service y darle status signed:
export async function signConsultationController(req: Request, res: Response, next: NextFunction) {

  try {

    const { id: doctor_id } = req.user;
    const { id: consultation_id } = schemaConsultParams.parse(req.params);

    //Sin if porque service ya maneja el error si no hay resumen de la consulta o no existe

    await signConsultationService(consultation_id, doctor_id);

    return res.status(200).json({
      message: "Consultation signed successfully"
    });

  } catch (error) {
    next(error);
  }

}