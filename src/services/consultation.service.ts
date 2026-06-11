import { conexionDB } from "../config/db";


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