import { Request, Response, NextFunction } from 'express';
import { generatePatientEmailContent, sendPatientEmail } from './email.service';
import { getConsultationForEmail } from '../consultation/consultation.service';
import { schemaEmailParams, schemaSendEmail } from '../../schemas/schema.email';


// preview del email para el paciente
export async function previewPatientEmailController(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const { id: consultation_id } = schemaEmailParams.parse(req.params);
        const doctor_id = (req as any).user.id;

        // verificar que la consulta existe y pertenece al doctor
        const consultation = await getConsultationForEmail(consultation_id, doctor_id);

        if (!consultation) {

            res.status(404).json({ success: false, message: 'Consultation not found' });

            return;
        }

        if (consultation.status !== 'signed') {

            res.status(400).json({ success: false, message: 'Consultation must be signed before sending email' });

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

        const { id: consultation_id } = schemaEmailParams.parse(req.params);
        const doctor_id = (req as any).user.id;
        const { emailContent } = schemaSendEmail.parse(req.body);

        // verificar que la consulta existe y pertenece al doctor
        const consultation = await getConsultationForEmail(consultation_id, doctor_id);

        if (!consultation) {

            res.status(404).json({ success: false, message: 'Consultation not found' });
            return;
        }

        if (consultation.status !== 'signed') {

            res.status(400).json({ success: false, message: 'Consultation must be signed before sending email' });
            return;
        }

        await sendPatientEmail(consultation.patient_email,consultation.patient_name,consultation.doctor_name,emailContent
        );

        res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {

        next(error);
    }
}