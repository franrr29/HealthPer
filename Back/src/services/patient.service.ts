// Recibe datos del controller y ejecuta queries en BD

import { conexionDB } from "../config/db";


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