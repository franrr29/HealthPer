//Recibe info de patient.routes y envia a patient.service data:

import { Request, Response } from "express";
import * as patientService from "../services/patient.service";
import { schemaPatient } from "../schemas/schema.patient";

//Get para todos los pacientes:

export async function getPatients(req: Request, res: Response) {

    try {

     const { id: doctor_id } = req.user

     const infoPatients= await patientService.getPatients(doctor_id);

     res.status(200).json({

        message: "Patients information recieved",
        data: infoPatients

     });

    } catch (error){
        
        res.status(500).json({ message: "Internal server error" });

    }
};


//Buscar un paciente por id:

export async function getPatientByID(req: Request, res: Response) {
    
    try {

        const { id: doctor_id } = req.user;
        const { id } = req.params;
        
        const patientInfo = await patientService.getPatientByID(doctor_id, id)
        
        if (!patientInfo) {

            return res.status(404).json({ message: "Patient not found" })
        }

        res.status(200).json({

            message: "Patient information recieved",
            data: patientInfo

        });

    } catch (error){

        res.status(500).json({

            message: "Error trying to get patient information"
            
        });
    }
};


//Crear paciente nuevo por parte del doctor si no existe en db:

export async function createPatient(req: Request, res: Response) {
    
    try {

        const patientData = schemaPatient.parse(req.body);
        const { id: doctor_id } = req.user;

        const newPatient = await patientService.createPatient(patientData,doctor_id
        );

        if (!newPatient) {

            return res.status(400).json({ 

                message: "Failed to create patient" 
            });
        }

        return res.status(201).json({

            message: "Patient created successfully",

            patient: newPatient
        });

    } catch (error) {

        return res.status(500).json({

            message: "Unable to create patient"

        });

    }
}