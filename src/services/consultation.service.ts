import { z } from "zod";
import { schemaConsultPatch } from "../schemas/schema.consultation";
import { conexionDB } from "../config/db";
import { generateConsultationSummary } from "./llm.service";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { AppError } from "../errors/appError";


// Crea una consulta mdica validando que el paciente pertenezca al doctor
export async function createConsultation(patient_id: number, doctor_id: number, transcript ?: string) {
    
 
        const [rows] = await conexionDB.query<RowDataPacket[]>(
            "SELECT * FROM patients WHERE id=? AND doctor_id = ?", 
            [patient_id, doctor_id]
        );
        
        if (rows.length ===0){
            return null
        }


        const [result] = await conexionDB.query<ResultSetHeader>(
            `INSERT INTO consultations (patient_id, doctor_id, transcript, status) VALUES (?, ?, ?, 'draft')`,
            [patient_id, doctor_id, transcript ?? null]
        );


        return { id: result.insertId };

    
}


//GET una consulta por id del paciente por parte del doctor:

export async function getConsultationByIdService(consultation_id: number, doctor_id: number) {
    
    

        const [rows] = await conexionDB.query<RowDataPacket[]>(
            "SELECT * FROM consultations WHERE id = ? AND doctor_id = ?",
             [consultation_id, doctor_id]
        );


        if (rows.length===0){
            return null
        }     


        return rows[0];

    
    
}


//Traer todo el historial de consultas del paciente del doctor con doble verificacion IDOR:

export async function  allConsultations(patient_id: number, doctor_id: number) {
    
    const [rows] = await conexionDB.query<RowDataPacket[]>(
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


    const [result] = await conexionDB.query<ResultSetHeader>(
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


   const [saveSummaryResult] = await conexionDB.query<ResultSetHeader>(

    "UPDATE consultations SET ai_summary = ?, status = 'signed' WHERE id = ? AND doctor_id = ?",
    [summaryString, consultation_id, doctor_id]);


    if (saveSummaryResult.affectedRows === 0) {
        return null;
    }


    return summary;
}




//Funcion que recibe el texto editado por el medico y lo guarda en edited_summary de la consulta:

export async function editConsultationSummary(consultation_id: number, doctor_id: number, edited_summary: string) {
    
  const consultation = await getConsultationByIdService(consultation_id, doctor_id);


  if (!consultation) return null;


  const [result] = await conexionDB.query<ResultSetHeader>(
    `UPDATE consultations SET edited_summary = ? WHERE id = ? AND doctor_id = ?`,
    [edited_summary, consultation_id, doctor_id]
  );


  return { consultation_id, edited_summary };
}



//Funcion que permite al doctor firmar la consulta luego de verificar en service y darle status signed:

export async function signConsultationService(consultation_id: number, doctor_id: number) {

    //busca que exista una consulta resumida
    const [rows]= await conexionDB.query<RowDataPacket[]>(
         `SELECT id, ai_summary, status FROM consultations WHERE id = ? AND doctor_id = ?`,
         [consultation_id, doctor_id]
    )

    const consulta= rows[0];

    //Si no hay consulta o no tiene reusmen tiro error
    if (!consulta){

        throw new AppError("Consultation not found", 404);
    }


    //Verificamos que no este firmada la consulta sino, no podemos modificarla:

    if (consulta.status === "signed"){

        throw new AppError("Consultation is already signed", 409);
    }


    //Si la consulta resumida no existe no se puede firmar 
    if (!consulta.ai_summary){

        throw new AppError("AI summary is required to sign the consultation", 400);
    }

    //Si paso ambos chequeos, actualizo el status a signed y guardo la fecha de firma
    await conexionDB.query<ResultSetHeader>(
        `UPDATE consultations SET status = 'signed', signed_at = NOW() WHERE id = ? AND doctor_id = ?`,
        [consultation_id, doctor_id]
    );
}