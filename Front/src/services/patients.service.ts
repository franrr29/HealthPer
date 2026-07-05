import api from "../services/api";
import type { Patient } from "@/types/patient";
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
}

// CRUD DE PACIENTES (para admin)

//crear un paciente nuevo:
export async function createPatient(patientData: Omit<Patient, "id">): Promise<Patient> {

    const response = await api.post("/patients", patientData);

    return response.data.patient;

}


//actualizar un paciente existente:

export async function updatePatient(id: number, patientData: Partial<Omit<Patient, "id">>): Promise<string> {

    const response = await api.patch(`/patients/${id}`, patientData);

    return response.data.message;
}