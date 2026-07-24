import api from "../services/api";
import type { Patient, PatientFollowUp } from "@/types/patient";
import type { Consultation } from "@/types/consultation";


//envia peticion a patient.controller que saca doctor_id de rq.user y manda al serivce para que haga la query:
export async function getPatients(): Promise<Patient[]> {

    //sin try pq tanQuery atrapa el error
    const response = await api.get("/patients");
    return response.data.data;
};


//trae un paciente por id y su info para ver en detalle:
export async function getPatientById(id: number): Promise<Patient> {
    const response = await api.get(`/patients/${id}`);
    return response.data.data;
};



//trae todas las consultas de un paciente por su id, para verlas en detalle:
export async function getAllConsultations(patient_id: number): Promise<Consultation[]> {
    try {

        const response = await api.get(`/patients/${patient_id}/consultations`);

        return response.data.consultations;

    } catch (error: any) {

        if (error.response?.status === 404) {
            
            return [];
        }
        throw error;
    }
};



// CRUD DE PACIENTES (para admin)

//crear un paciente nuevo:
export async function createPatient(patientData: Omit<Patient, "id">): Promise<Patient> {

    const response = await api.post("/patients", patientData);

    return response.data.patient;

};


//actualizar un paciente existente:

export async function updatePatient(id: number, patientData: Partial<Omit<Patient, "id">>): Promise<string> {

    const response = await api.patch(`/patients/${id}`, patientData);

    return response.data.message;
};


//borrar un paciente existente:

export async function deletePatient(id: number): Promise<string> {

    const response = await api.delete(`/patients/${id}`);

    return response.data.message;
};



//traer la memoria de un paciente por su id, para ver en detalle:
export async function patientMemory (patient_id: number) {

    try {

        const response = await api.get(`/patients/${patient_id}/memory`);

        return response.data.data;

    } catch (error: any) {

        if (error.response?.status === 404) {

            return null;
        }
        throw error;
    }
}


//preguntar al llm sobre informacion del paciente que busca por RAG:
export async function askPatientInfo (patient_id: number, question: string): Promise<string> {

    const response = await api.post(`/patients/${patient_id}/ask`, { question });
    
    return response.data.data;
}


//pacientes que necesitan seguimiento:
export async function getPatientsNeedingFollowUp (): Promise<PatientFollowUp[]> {

    const response = await api.get("/patients/follow-up");

    return response.data.data;
}