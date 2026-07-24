import { buildPatientEmailPrompt, PATIENT_EMAIL_SYSTEM_PROMPT } from '../ai/prompt.service';
import { generateTextAnswer } from '../ai/llm.service';
import { Resend } from 'resend';
import { env } from '../../config/env';

const resend = new Resend(env.RESEND_API_KEY);


//funcion para generar el prompt para enviarle al llm y que genere el email para el paciente con el resumen de la consulta:
export async function generatePatientEmailContent(patientName: string, doctorName: string, summary: string): Promise<string> {

    if (!summary?.trim()) {
        throw new Error("Summary is required");
    }

    const respuesta = await generateTextAnswer(buildPatientEmailPrompt(patientName, doctorName, summary), PATIENT_EMAIL_SYSTEM_PROMPT);

    return respuesta;
}



//envio el mail con resend al paciente:
export async function sendPatientEmail(patientEmail: string, patientName: string, doctorName: string, aprovedSummary: string): Promise<void> {

    if (!patientEmail?.trim()) {
        throw new Error("Patient email is required");
    }

    if (!aprovedSummary?.trim()) {
        throw new Error("Approved summary is required");
    }

    const emailTemplate = buildEmailTemplate(patientName, doctorName, aprovedSummary);

    await resend.emails.send({
        from: 'HealthPer <onboarding@resend.dev>',
        to: patientEmail,
        subject: `Summary of your consultation with ${doctorName}`,
        html: emailTemplate,
    });
}



// asegurar saltos de linea entre secciones del email
function formatEmailContent(raw: string): string {
    return raw.replace(/<strong>/g, '<br><br><strong>').replace(/^<br><br>/, '');
}


// generar el template del email con estilos inline
function buildEmailTemplate(patientName: string, doctorName: string, aprovedSummary: string): string {

    const formattedSummary = formatEmailContent(aprovedSummary);

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2563eb;">HealthPer</h2>
        </div>

        <p style="font-size: 16px;">Hi ${patientName},</p>
        <p style="font-size: 14px; color: #555;">Please find below the summary of your recent consultation with ${doctorName}:</p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; line-height: 1.6;">
            ${formattedSummary}
        </div>

        <p style="font-size: 14px; color: #555;">Best regards,<br/><strong>${doctorName}</strong></p>
        <p style="font-size: 12px; color: #999; margin-top: 8px;">Sent from HealthPer</p>

        <div style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 12px;">
            <p style="font-size: 11px; color: #999; font-style: italic;">
                This summary is for informational purposes only and does not replace professional medical advice. 
                If you have any questions, please consult your doctor.
            </p>
        </div>

    </div>
    `;
}