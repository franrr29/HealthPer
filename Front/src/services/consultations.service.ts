import api from './api.ts';
import type { PendingConsultation } from '../types/consultation';


//crea una nueva consulta con audio
export async function createConsultation (patient_id: number){

        const response =  await api.post('/consultations', { patient_id })

        return response.data.data;
    
};


//trae resumen de las consultas para el doct
export async function summarizeConsultation(consultation_id: number){

    const response = await api.post(`/consultations/${consultation_id}/summarize`);

    return response.data.data;
};


//edita el resumen de la consulta y lo guarda en la base de datos
export async function editSummary(consultation_id: number, edited_summary: string){

    const response = await api.patch(`/consultations/${consultation_id}/summary`, { edited_summary });

    return response.data.data;
};
    


//firma la consulta y la guarda en la base de datos
export async function signConsultation(consultation_id: number){

    const response = await api.post (`/consultations/${consultation_id}/sign`);

    return response.data.data;
};


//funcion para enviar el audio a whisper.service:

export async function transcribeAudio(consultation_id: number, audioBuffer: Blob){

    //para enviar el audio a la api, se crea un FormData y se agrega el audio como archivo
    const formData = new FormData();
    formData.append('audio', audioBuffer);

    const response = await api.post(`/consultations/${consultation_id}/transcribe`, formData);

    return response.data.transcription;
   
}


//consultas pendientes del dr:
export async function getPendingConsultations(): Promise<PendingConsultation[]> {

    const response = await api.get('/consultations/pending');

    return response.data.data;
}

