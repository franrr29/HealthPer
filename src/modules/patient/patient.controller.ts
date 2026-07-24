//Recibe info de patient.routes y envia a patient.service data:
import { NextFunction, RequestHandler, Request, Response } from "express";
import * as patientService from "./patient.service";
import { schemaPatient } from "../../schemas/schema.patient";


//Get para todos los pacientes:
export const getPatients: RequestHandler = async (req, res, next): Promise<void> => {

    try {

     if (!req.user){

        res.status(401).json({ 
            
        message: "Unauthorized" });

        return;
     }


     const { id: doctor_id } = req.user
     const infoPatients= await patientService.getPatients(doctor_id);


     res.status(200).json({

        message: "Patients information recieved",

        data: infoPatients
     });

    } catch (error){
        
        next (error)
    }
};


//Buscar un paciente por id:
export const getPatientByID: RequestHandler = async (req, res, next): Promise<void> => {
    
    try {

        if (!req.user){

            res.status(401).json({ 
                
            message: "Unauthorized" });

            return;
        }


        const { id: doctor_id } = req.user;
        const id = Number(req.params.id);
        
        const patientInfo = await patientService.getPatientByID(doctor_id, id)
        
        if (!patientInfo) {

            res.status(404).json({ message: "Patient not found" })
            return;
        }

        res.status(200).json({

            message: "Patient information recieved",

            data: patientInfo
        });

    } catch (error){

        next (error)
    }
};


//Crear paciente nuevo por parte del doctor si no existe en db:
export const createPatient: RequestHandler = async (req, res, next): Promise<void> => {
    
    try {


        if (!req.user){

            res.status(401).json({ 
                
            message: "Unauthorized" });

            return;
        }


        const patientData = schemaPatient.parse(req.body);
        const { id: doctor_id } = req.user;
        const newPatient = await patientService.createPatient(patientData,doctor_id);

        if (!newPatient) {

            res.status(400).json({ 

                message: "Failed to create patient" 
            });

            return;
        }

        res.status(201).json({

            message: "Patient created successfully",

            patient: newPatient
        });

    } catch (error) {

        next (error)
    }
}


//Actualizar X campo del paciente por parte del doctor:
export const patchPatient: RequestHandler = async (req, res, next): Promise<void> => {

    try {


        if (!req.user){

            res.status(401).json({ 
                
            message: "Unauthorized" });

            return;
        }


        const { id: doctor_id }= req.user;
        const id = req.params.id as string;
        const dataValidated= schemaPatient.partial().parse (req.body)


        // Evito ejecutar patch sin campos validos para actualizar usando object.keys:
        if (Object.keys(dataValidated).length === 0) {
            
            res.status(400).json({ message: "At least one field is required for update" });
            return;
        
        }


        const updateInfo= await patientService.updatePatient (id, doctor_id, dataValidated);
        
        if (!updateInfo) {

            res.status(404).json({ message: "Unable to patch patient data"})
            return;
        }


        res.status(200).json({

            message: "Patient information updated succesfully",
        });

    } catch (error){

        next (error)
    }
}


//DELETE un paciente por parte del doctor:
export const deletePatient: RequestHandler = async (req, res, next): Promise<void> => {
    
    try{


        if (!req.user){

            res.status(401).json({ 
                
            message: "Unauthorized" });

            return;
        }

        
        const { id: doctor_id }= req.user;
        const id = req.params.id as string;

        const deleteInfo= await patientService.deletePatient (id, doctor_id);

        if (!deleteInfo){

            res.status(404).json({

                message: "Unable to delete patient"
            });

            return;
        }

        res.status(200).json({

            message: "Patient information deleted"
        });

    } catch (error){
        
        next (error)
    }
}


//Funcion que trae la memoria del paciente por parte del doctor con verificacion IDOR de patientmemoryService:
export const getPatientMemoryController: RequestHandler = async (req, res, next) => {

    try {

        if (!req.user) {

            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        

        const { id: doctor_id } = req.user;
        const patient_id = Number(req.params.id);


        const memory = await patientService.getPatientMemoryService(patient_id, doctor_id);


        if (!memory) {

            res.status(404).json({
                message: "Patient memory not found"
            });

            return;
        }


        res.status(200).json({

            message: "Patient memory retrieved successfully",
            data: memory
        });


    } catch (error) {

        next(error);
    }
}



//Responder preguntas del doctor sobre el paciente usando RAG:
export const askPatientController: RequestHandler = async (req, res, next): Promise<void> => {

    try {

        if (!req.user) {

            res.status(401).json({ message: "Unauthorized" });
            return;
        }


        const { id: doctor_id } = req.user;
        const patient_id = Number(req.params.id);
        const question = req.body.question;


        if (Number.isNaN(patient_id)) {

            res.status(400).json({ message: "Invalid patient id" });
            return;
        }

        if (!question || question.trim().length === 0) {

            res.status(400).json({ message: "Question is required" });
            return;
        }


        const answer = await patientService.askPatientMemoryService(patient_id, doctor_id, question);


        if (!answer) {

            res.status(404).json({ message: "Unable to get answer for this patient" });
            return;
        }


        res.status(200).json({

            message: "Answer retrieved successfully",
            data: answer
        });

    } catch (error) {

        next(error);
    }
}

//funcion para traer los pacientes que necesitan seguimiento por parte del doctor:
export async function getPatientFollowUpController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        if (!req.user) {

            res.status(401).json({ message: "Unauthorized" });

            return;
        }

        const { id: doctor_id } = req.user;
        const patientsNeedingFollowUp = await patientService.getPatientsNeedingFollowUp(doctor_id);

        if (!patientsNeedingFollowUp || patientsNeedingFollowUp.length === 0) {

         res.status(200).json({ message: "No patients needing follow-up", data: [] });
         
         return;
}

        res.status(200).json({
            message: "Patients needing follow-up retrieved successfully",
            data: patientsNeedingFollowUp
        });
    } catch (error) {

        next(error);
    }
}