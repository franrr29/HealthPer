import { conexionDB } from "../config/db";


// Crea una consulta mdica validando que el paciente pertenezca al doctor
export async function createConsultation(patient_id: number, doctor_id: number, transcript ?: string) {
    
    try {

        const [rows]: any = await conexionDB.query ("SELECT * FROM patients WHERE id=? AND doctor_id = ?", [patient_id, doctor_id])
        
        if (rows.length ===0){
            return null
        }

        const [result]: any = await conexionDB.query(
            `INSERT INTO consultations (patient_id, doctor_id, status) VALUES (?, ?, 'draft')`,
            [patient_id, doctor_id, transcript ?? null]
        );

        return { id: result.insertId };

    } catch (error) {

        throw error
    }
}