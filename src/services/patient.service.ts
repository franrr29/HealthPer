// Recibe datos del controller y ejecuta queries en BD

import { conexionDB } from "../config/db";
import { Patient } from "../schemas/schema.patient";


// Obtener todos los pacientes del doctor

export async function getPatients(doctor_id: number) {
    
    try {

        const [rows]: any = await conexionDB.query(

            "SELECT * FROM patients WHERE doctor_id = ?",
            [doctor_id]
        );


        if (rows.length === 0) {
            
            throw new Error("Patients not found");
        }


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

            throw new Error("Patient not found");
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