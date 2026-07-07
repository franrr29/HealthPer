import api from './api.ts';


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

export async function transcribeAudio(audioBuffer: Buffer){

    const response = await api.post(`/consultations/transcribe`, audioBuffer, {
        headers: {
            'Content-Type': 'audio/webm'
        }
    });

    return response.data.transcription;
}