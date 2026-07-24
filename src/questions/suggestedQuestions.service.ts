import { getPatientByID, getPatientMemoryService } from '../modules/patient/patient.service';
import { buildSuggestedQuestionsPrompt } from '../modules/ai/prompt.service';
import { generateTextAnswer } from '../modules/ai/llm.service';
import { AppError } from '../errors/appError';


export async function generateSuggestedQuestionsService(transcript: string, patient_id: number, doctor_id: number) {

    const patient = await getPatientByID(doctor_id, patient_id);

    const patientMemory = await getPatientMemoryService(patient_id, doctor_id);

    const prompt = buildSuggestedQuestionsPrompt(transcript, patientMemory?.memory || null);

    const llmResponse = await generateTextAnswer(prompt);


    //por si el llm devuelve algo que no es un json valido, lo parseo y si falla tiro error

    try {

        const questions = JSON.parse(llmResponse) as { question: string; reason: string }[];

        return questions;
        
    } catch {

        throw new AppError('Failed to parse suggested questions', 500);
    }
}