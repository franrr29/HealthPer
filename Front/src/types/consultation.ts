//typos para la consulta que esta como en la basedatos:

export type Consultation = {
    id: number,
    patient_id: number,
    doctor_id: number,
    transcript: string,
    ai_summary: string,
    status: "draft" | "reviewed" | "signed",
    created_at: string
}