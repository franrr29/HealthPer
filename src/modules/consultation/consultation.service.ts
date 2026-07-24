import { z } from "zod";
import { schemaConsultPatch } from "../../schemas/schema.consultation";
import { conexionDB } from "../../config/db";
import { generateConsultationSummary } from "../ai/llm.service";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { AppError } from "../../errors/appError";
import { logger } from "../../config/logger"
import { updatePatientMemoryService } from "../ai/memory.service";
import { indexConsultation } from "../ai/indexing.service";


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


//Funcion para acumular el transcript de la consulta en la base de datos:
export async function appendTranscript(consultation_id: number, doctor_id: number, newText: string) {
    const [result] = await conexionDB.query<ResultSetHeader>(
        `UPDATE consultations 
         SET transcript = CONCAT(COALESCE(transcript, ''), ' ', ?) 
         WHERE id = ? AND doctor_id = ?`,
        [newText, consultation_id, doctor_id]
    );
    return result.affectedRows > 0;
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


    const summary = await generateConsultationSummary(consultation.patient_id, consultation.transcript);


    const summaryString = JSON.stringify(summary);


   const [saveSummaryResult] = await conexionDB.query<ResultSetHeader>(

    "UPDATE consultations SET ai_summary = ?, status = 'reviewed' WHERE id = ? AND doctor_id = ?",
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
    const [rows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT id, ai_summary, patient_id, status, transcript FROM consultations WHERE id = ? AND doctor_id = ?`,
        [consultation_id, doctor_id]
    );

    const consulta = rows[0];

    if (!consulta) {
        throw new AppError("Consultation not found", 404);
    }

    if (consulta.status === "signed") {
        throw new AppError("Consultation is already signed", 409);
    }

    //Si la consulta resumida no existe no se puede firmar
    if (!consulta.ai_summary) {
        throw new AppError("AI summary is required to sign the consultation", 400);
    }

    await conexionDB.query<ResultSetHeader>(
        `UPDATE consultations SET status = 'signed', signed_at = NOW() WHERE id = ? AND doctor_id = ?`,
        [consultation_id, doctor_id]
    );

    //Releo signed_at real desde mysql para el timestamp,
    //en vez de generarlo de nuevo en js evita desfasaje por reloj del servidor node

    const [updatedRows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT signed_at FROM consultations WHERE id = ?`,
        [consultation_id]
    );
    const signed_at = updatedRows[0].signed_at;

    let memoryUpdated = true;

    try {
        await updatePatientMemoryService(consulta.patient_id, consulta.ai_summary);

    } catch (error) {

        memoryUpdated = false;
        logger.error(`Failed to update patient memory after signing consultation ${consultation_id}: ${(error as Error).message}`);
    }

    //Despues del catch porque asi me aseguro que este firmada la consulta y no depender de la actualizacion
    //de la memoria del paciente para firmar la consulta


    //Le mando los datos a indexConsultation para que haga el chunking, embedding y guarde en la base de datos:
    try {

        await indexConsultation (consulta.patient_id, consultation_id, consulta.transcript);

    } catch (error){

        logger.error(`Failed to index consultation ${consultation_id}: ${(error as Error).message}`);
    }
    
    return {
        message: memoryUpdated
            ? "Consultation signed successfully"
            : "Consultation signed successfully, but patient memory update is pending",
        consultation_id,
        status: "signed",
        signed_at
    };
}


//Funcion para traer las consultas pendientes de firma del doctor logeado y mostrar en dashboard:
export async function getPendingConsultationsService(doctor_id: number) {

    const [rows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT c.id AS consultation_id, p.name AS patient_name, c.status,
                TIMESTAMPDIFF(HOUR, c.created_at, NOW()) AS hours_pending
         FROM consultations c
         JOIN patients p ON c.patient_id = p.id
         WHERE c.doctor_id = ? AND c.status != 'signed'
         ORDER BY c.created_at ASC`,
        [doctor_id]
    );

    return rows;
}


//traer la consulta con el resumen aprobado y los nombres del paciente y doctor para enviar el email al paciente:
export async function getConsultationForEmail(consultation_id: number, doctor_id: number) {

    const [rows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT c.ai_summary, c.edited_summary, c.status,
                p.name AS patient_name,
                d.name AS doctor_name
         FROM consultations c
         JOIN patients p ON c.patient_id = p.id
         JOIN doctors d ON c.doctor_id = d.id
         WHERE c.id = ? AND c.doctor_id = ?`,
        [consultation_id, doctor_id]
    );

    if (rows.length === 0) return null;

    return rows[0];
}