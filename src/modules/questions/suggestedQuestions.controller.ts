import type { Request, Response, NextFunction } from 'express';
import { generateSuggestedQuestionsService  } from './suggestedQuestions.service';
import { schemaSuggestedQuestions } from '../../schemas/schema.questions';


//genera preguntas a partir de la trasncript de la consulta y el id del paciente, envia a suggestedQuestions.service.ts
export async function suggestedQuestionsController(req: Request, res: Response, next: NextFunction) {

    if (!req.user) {

        res.status(401).json({ success: false, message: "Unauthorized" });

        return;
    }

  try {

    const { transcript, patient_id } = schemaSuggestedQuestions.parse(req.body);
    const { id: doctor_id } = req.user;

    const questions = await generateSuggestedQuestionsService(transcript, patient_id, doctor_id);

    return res.status(200).json({questions});

  } catch (error) {

    next(error);
  }
}