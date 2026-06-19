// Recibe datos del controller y ejecuta queries en BD
//Puse algunas funciones sin TRY /CATCH porque al volver a controller, next relanza el error al errorHandler

import { ResultSetHeader } from "mysql2";
import { conexionDB } from "../config/db";
import { Patient } from "../schemas/schema.patient";
import { AppError } from "../errors/appError";


// Obtener todos los pacientes del doctor

export async function getPatients(doctor_id: number) {
    
    try {

        const [rows]: any = await conexionDB.query(

            "SELECT * FROM patients WHERE doctor_id = ?",
            [doctor_id]
        );

        return rows;


    } catch (error) {

        throw error;

    }
}


// Obtener un paciente específico del doctor

export async function getPatientByID(doctor_id: number, patientID: number) {
    
    try {

        const [rows]: any = await conexionDB.query(

            "SELECT * FROM patients WHERE id = ? AND doctor_id = ?",
            [patientID, doctor_id]
        );


        if (rows.length === 0) {

            throw new AppError ("Patient not found", 404);
        }


        return rows[0];


    } catch (error) {

        throw error;

    }
}


//Insertar datos al crear un paciente nuevo en base de datos:

export async function createPatient(patientData: Patient, doctor_id: number) {
    try {
        const [result]: any = await conexionDB.query(
            `INSERT INTO patients (name, birth_date, gender, national_id, phone, doctor_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [patientData.name, patientData.birth_date, patientData.gender, patientData.national_id, patientData.phone,
            doctor_id,]
         );

        if (result.affectedRows === 0) {

            throw new Error("Unable to insert patient data into database");
        }
        
        return { id: result.insertId, ...patientData, doctor_id };
    
    } catch (error) {
        
        throw error;
    }
}


//Actualizar X dato del paciente por parte del doctor:

export async function updatePatient(id: string, doctor_id: number, dataValidated: Partial<Patient>) {
    //extraer campos para patch
    const fields = Object.keys(dataValidated);
    //query ordenada dinamica
    const setQuery = fields.map(field => `${field} = ?`).join(", ");
    //valores de los fields
    const values = Object.values(dataValidated);

    const [result] = await conexionDB.query<ResultSetHeader>(
        `UPDATE patients 
         SET ${setQuery}
         WHERE id = ? AND doctor_id = ?`,
        [...values, id, doctor_id]
    );

    return result.affectedRows > 0;
}


//Eliminar completamente un paciente por parte del doctor:

export async function deletePatient(id: string, doctor_id: number) {
    
    const [result] = await conexionDB.query<ResultSetHeader>(
        "DELETE FROM patients WHERE id = ? AND doctor_id = ?",
        [id, doctor_id]
    );

    return result.affectedRows > 0;
}