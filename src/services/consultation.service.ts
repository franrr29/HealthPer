import { z } from "zod";
import { schemaConsultPatch } from "../schemas/schema.consultation";
import { conexionDB } from "../config/db";
import { generateConsultationSummary } from "./llm.service";
import { json } from "stream/consumers";

// Crea una consulta mdica validando que el paciente pertenezca al doctor
export async function createConsultation(patient_id: number, doctor_id: number, transcript ?: string) {
    
 
         const [rows]: any = await conexionDB.query ("SELECT * FROM patients WHERE id=? AND doctor_id = ?", [patient_id, doctor_id])
        
        if (rows.length ===0){
            return null
        }

        const [result]: any = await conexionDB.query(
            `INSERT INTO consultations (patient_id, doctor_id, transcript, status) VALUES (?, ?, ?, 'draft')`,
            [patient_id, doctor_id, transcript ?? null]
        );

        return { id: result.insertId };

    
}


//GET una consulta por id del paciente por parte del doctor:

export async function getConsultationByIdService(consultation_id: number, doctor_id: number) {
    
    

        const [rows]= await conexionDB.query ("SELECT * FROM consultations WHERE id = ? AND doctor_id = ?",
             [consultation_id, doctor_id]);

        if (rows.length===0){
            return null
        }     

        return rows[0];

    
    
}

//Traer todo el historial de consultas del paciente del doctor con doble verificacion IDOR:

export async function  allConsultations(patient_id: number, doctor_id: number) {
    
    const [rows]: any = await conexionDB.query(
    `SELECT c.* FROM consultations c JOIN patients p ON c.patient_id = p.id WHERE p.id = ? AND p.doctor_id = ?`,
    [patient_id, doctor_id]);

    if (rows.length===0){
        return null
    }
    
    return rows;
}

//PATCH para campos de consultas por parte del doctor:

export async function patchFields(consultation_id: number,doctor_id: number,fields: z.infer<typeof schemaConsultPatch>) {

    const allowedFields = ["transcript", "edited_summary", "status"];
    const camposValidados = Object.keys(fields).filter(f => allowedFields.includes(f));
    const setQuery = camposValidados.map(field => `${field} = ?`).join(", ");
    const values = camposValidados.map(f => (fields as any)[f]);

    const [result]: any = await conexionDB.query(
        `UPDATE consultations SET ${setQuery} WHERE id = ? AND doctor_id = ?`,
        [...values, consultation_id, doctor_id]
    );

    if (result.affectedRows === 0) return null;

    return { updated: true };
}


// Funcion para generar resumen de consulta utilizando el LLM y guardar el resumen en la base de datos:
export async function summarizeConsultation(consultation_id: number, doctor_id: number) {

    const consultation = await getConsultationByIdService(consultation_id, doctor_id);

    if (!consultation) {

        return null;
    }

    if (!consultation.transcript) {

        throw Error("Transcript is required for summarization");
    }

    const summary = await generateConsultationSummary(consultation.transcript);

    const summaryString = JSON.stringify(summary);

   const [saveSummaryResult]: any = await conexionDB.query(

    "UPDATE consultations SET ai_summary = ?, status = 'signed' WHERE id = ? AND doctor_id = ?",
    [summaryString, consultation_id, doctor_id]);

    if (saveSummaryResult.affectedRows === 0) {
        return null;
    }

    return summary;
}