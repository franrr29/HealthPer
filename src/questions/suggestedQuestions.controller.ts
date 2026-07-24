import type { Request, Response, NextFunction } from 'express';
import { generateSuggestedQuestionsService  } from './suggestedQuestions.service';


//genera preguntas a partir de la trasncript de la consulta y el id del paciente, envia a suggestedQuestions.service.ts
export async function suggestedQuestionsController(req: Request, res: Response, next: NextFunction) {

    if (!req.user) {

        res.status(401).json({ message: "Unauthorized" });

        return;
    }

  try {

    const { transcript, patient_id } = req.body;
    const { id: doctor_id } = req.user;

   

    if (!transcript || !patient_id) {

      return res.status(400).json({ message: "transcript and patient_id are required" });
    }

    const questions = await generateSuggestedQuestionsService(transcript, patient_id, doctor_id);

    return res.status(200).json({questions});

  } catch (error) {

    next(error);
  }
}