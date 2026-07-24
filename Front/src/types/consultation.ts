//typos para la consulta que esta como en la basedatos:

export type ConsultationSummary = {
    chief_complaint: string | null,
    symptoms: string[],
    diagnosis: string | null,
    treatment: string | null,
    follow_up: string | null,
}

export type Consultation = {
    id: number,
    patient_id: number,
    doctor_id: number,
    transcript: string,
    ai_summary: ConsultationSummary | null,
    status: "draft" | "reviewed" | "signed",
    created_at: string
}

export type PendingConsultation = {
    consultation_id: number,
    patient_name: string,
}

