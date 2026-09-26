import { ResultSetHeader } from "mysql2/promise";
import { conexionDB } from "../../config/db";

export const SUMMARY = {
    chief_complaint: "Dolor de cabeza",
    symptoms: ["cefalea", "mareos"],
    diagnosis: "Tension headache",
    treatment: "Ibuprofeno 400mg",
    follow_up: "Control en 1 semana",
};

export const EDITED_SUMMARY = {
    chief_complaint: "Dolor de cabeza",
    symptoms: ["cefalea"],
    diagnosis: "Migrana con aura corregida por el doctor",
    treatment: "Sumatriptan 50mg",
    follow_up: "Control en 2 semanas",
};

export async function insertPatient(doctorId: number, name = "Paciente Test"): Promise<number> {

    const [result] = await conexionDB.query<ResultSetHeader>(
        "INSERT INTO patients (doctor_id, name) VALUES (?, ?)",
        [doctorId, name]
    );

    return result.insertId;
}

interface ConsultationSeed {
    patientId: number;
    doctorId: number;
    status?: "draft" | "reviewed" | "signed";
    transcript?: string | null;
    aiSummary?: object | null;
    editedSummary?: object | null;
}

export async function insertConsultation(seed: ConsultationSeed): Promise<number> {

    const status = seed.status ?? "draft";

    const [result] = await conexionDB.query<ResultSetHeader>(
        `INSERT INTO consultations (patient_id, doctor_id, transcript, ai_summary, edited_summary, status, signed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            seed.patientId,
            seed.doctorId,
            seed.transcript === undefined ? "El paciente refiere dolor de cabeza intenso desde hace 3 dias" : seed.transcript,
            seed.aiSummary ? JSON.stringify(seed.aiSummary) : null,
            seed.editedSummary ? JSON.stringify(seed.editedSummary) : null,
            status,
            status === "signed" ? new Date() : null,
        ]
    );

    return result.insertId;
}

export async function getConsultationRow(id: number): Promise<Record<string, any>> {

    const [rows] = await conexionDB.query<any[]>("SELECT * FROM consultations WHERE id = ?", [id]);

    return rows[0];
}

export async function countRows(table: "patient_memory" | "consultation_chunks", column: string, value: number): Promise<number> {

    const [rows] = await conexionDB.query<any[]>(`SELECT COUNT(*) AS total FROM ${table} WHERE ${column} = ?`, [value]);

    return Number(rows[0].total);
}
