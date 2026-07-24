import { Request, Response, NextFunction } from 'express';
import { generatePatientEmailContent, sendPatientEmail } from './email.service';
import { getConsultationForEmail } from '../consultation/consultation.service';


// preview del email para el paciente
export async function previewPatientEmailController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const consultation_id = Number(req.params.id);
        const doctor_id = (req as any).user.id;

        // verificar que la consulta existe y pertenece al doctor
        const consultation = await getConsultationForEmail(consultation_id, doctor_id);

        if (!consultation) {

            res.status(404).json({ error: 'Consultation not found' });

            return;
        }

        if (consultation.status !== 'signed') {

            res.status(400).json({ error: 'Consultation must be signed before sending email' });

            return;
        }

        // si el doctor edito el resumen, usar ese, si no el original
        const summary = consultation.edited_summary ?? consultation.ai_summary;

        const emailContent = await generatePatientEmailContent(consultation.patient_name,consultation.doctor_name,JSON.stringify(summary)
        );

        res.status(200).json({ emailContent });

    } catch (error) {

        next(error);
    }
}


// enviar el email al paciente
export async function sendPatientEmailController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const consultation_id = Number(req.params.id);
        const doctor_id = (req as any).user.id;
        const { patientEmail, emailContent } = req.body;

        if (!patientEmail?.trim()) {

            res.status(400).json({ error: 'Patient email is required' });

            return;
        }

        if (!emailContent?.trim()) {

            res.status(400).json({ error: 'Email content is required' });

            return;
        }

        // verificar que la consulta existe y pertenece al doctor
        const consultation = await getConsultationForEmail(consultation_id, doctor_id);

        if (!consultation) {

            res.status(404).json({ error: 'Consultation not found' });
            return;
        }

        if (consultation.status !== 'signed') {

            res.status(400).json({ error: 'Consultation must be signed before sending email' });
            return;
        }

        await sendPatientEmail(patientEmail,consultation.patient_name,consultation.doctor_name,emailContent
        );

        res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {

        next(error);
    }
}