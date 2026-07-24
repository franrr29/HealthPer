import api from './api.ts';


// genera el preview del email para el paciente
export async function previewPatientEmail(consultation_id: number) {

    const response = await api.post(`/consultations/${consultation_id}/email-content`);

    return response.data.emailContent;
}


// envia el email al paciente con el resumen aprobado
export async function sendPatientEmail(consultation_id: number, patientEmail: string, emailContent: string) {

    const response = await api.post(`/consultations/${consultation_id}/send-email`, { patientEmail, emailContent });

    return response.data;
}