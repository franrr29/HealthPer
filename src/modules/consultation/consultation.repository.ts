import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { conexionDB } from "../../config/db";
import type {
  Consultation,
  ConsultationForEmail,
  ConsultationForSigning,
  CreateConsultationDTO,
  PendingConsultation,
  SignedConsultationResult,
  UpdateConsultationDTO,
} from "../../types/consultation.types";

type ConsultationRow = Consultation & RowDataPacket;
type ConsultationForSigningRow = ConsultationForSigning & RowDataPacket;
type ConsultationForEmailRow = ConsultationForEmail & RowDataPacket;
type PendingConsultationRow = PendingConsultation & RowDataPacket;
type SignedConsultationRow = SignedConsultationResult & RowDataPacket;

const UPDATABLE_COLUMNS = [
  "transcript",
  "edited_summary",
  "status",
] as const satisfies readonly (keyof UpdateConsultationDTO)[];

export async function create(
  data: CreateConsultationDTO,
  doctorId: number
): Promise<number> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    `INSERT INTO consultations (patient_id, doctor_id, transcript, status)
     VALUES (?, ?, ?, 'draft')`,
    [data.patient_id, doctorId, data.transcript ?? null]
  );

  return result.insertId;
}

export async function getByIdAndDoctorId(
  consultationId: number,
  doctorId: number
): Promise<Consultation | null> {
  const [rows] = await conexionDB.query<ConsultationRow[]>(
    "SELECT * FROM consultations WHERE id = ? AND doctor_id = ?",
    [consultationId, doctorId]
  );

  return rows[0] ?? null;
}

// ownership is enforced through the patients join
export async function getHistoryByPatientId(
  patientId: number,
  doctorId: number
): Promise<Consultation[]> {
  const [rows] = await conexionDB.query<ConsultationRow[]>(
    `SELECT c.*
     FROM consultations c
     JOIN patients p ON c.patient_id = p.id
     WHERE p.id = ? AND p.doctor_id = ?`,
    [patientId, doctorId]
  );

  return rows;
}

export async function updateFields(
  consultationId: number,
  doctorId: number,
  data: UpdateConsultationDTO
): Promise<boolean> {
  const columns = UPDATABLE_COLUMNS.filter((column) => column in data);

  if (columns.length === 0) {
    return false;
  }

  const setClause = columns.map((column) => `${column} = ?`).join(", ");
  const values = columns.map((column) => data[column]);

  const [result] = await conexionDB.query<ResultSetHeader>(
    `UPDATE consultations SET ${setClause} WHERE id = ? AND doctor_id = ?`,
    [...values, consultationId, doctorId]
  );

  return result.affectedRows > 0;
}

export async function appendTranscript(
  consultationId: number,
  doctorId: number,
  text: string
): Promise<boolean> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    `UPDATE consultations
     SET transcript = CONCAT(COALESCE(transcript, ''), ' ', ?)
     WHERE id = ? AND doctor_id = ?`,
    [text, consultationId, doctorId]
  );

  return result.affectedRows > 0;
}

// storing a summary moves the consultation into review
export async function updateAiSummary(
  consultationId: number,
  doctorId: number,
  summary: string
): Promise<boolean> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    "UPDATE consultations SET ai_summary = ?, status = 'reviewed' WHERE id = ? AND doctor_id = ?",
    [summary, consultationId, doctorId]
  );

  return result.affectedRows > 0;
}

export async function updateEditedSummary(
  consultationId: number,
  doctorId: number,
  summary: string
): Promise<boolean> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    "UPDATE consultations SET edited_summary = ? WHERE id = ? AND doctor_id = ?",
    [summary, consultationId, doctorId]
  );

  return result.affectedRows > 0;
}

export async function getForSigning(
  consultationId: number,
  doctorId: number
): Promise<ConsultationForSigning | null> {
  const [rows] = await conexionDB.query<ConsultationForSigningRow[]>(
    `SELECT id, ai_summary, patient_id, status, transcript
     FROM consultations
     WHERE id = ? AND doctor_id = ?`,
    [consultationId, doctorId]
  );

  return rows[0] ?? null;
}

export async function sign(
  consultationId: number,
  doctorId: number
): Promise<boolean> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    "UPDATE consultations SET status = 'signed', signed_at = NOW() WHERE id = ? AND doctor_id = ?",
    [consultationId, doctorId]
  );

  return result.affectedRows > 0;
}

// read back from mysql so the timestamp comes from the db clock, not node's
export async function getSignedAt(
  consultationId: number,
  doctorId: number
): Promise<SignedConsultationResult | null> {
  const [rows] = await conexionDB.query<SignedConsultationRow[]>(
    "SELECT signed_at FROM consultations WHERE id = ? AND doctor_id = ?",
    [consultationId, doctorId]
  );

  return rows[0] ?? null;
}

export async function getPendingByDoctorId(
  doctorId: number
): Promise<PendingConsultation[]> {
  const [rows] = await conexionDB.query<PendingConsultationRow[]>(
    `SELECT c.id AS consultation_id, p.name AS patient_name, c.status,
            TIMESTAMPDIFF(HOUR, c.created_at, NOW()) AS hours_pending
     FROM consultations c
     JOIN patients p ON c.patient_id = p.id
     WHERE c.doctor_id = ? AND c.status != 'signed'
     ORDER BY c.created_at ASC`,
    [doctorId]
  );

  return rows;
}

export async function getForEmail(
  consultationId: number,
  doctorId: number
): Promise<ConsultationForEmail | null> {
  const [rows] = await conexionDB.query<ConsultationForEmailRow[]>(
    `SELECT c.ai_summary, c.edited_summary, c.status,
            p.name AS patient_name,
            d.name AS doctor_name
     FROM consultations c
     JOIN patients p ON c.patient_id = p.id
     JOIN doctors d ON c.doctor_id = d.id
     WHERE c.id = ? AND c.doctor_id = ?`,
    [consultationId, doctorId]
  );

  return rows[0] ?? null;
}
