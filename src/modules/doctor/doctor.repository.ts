import { RowDataPacket } from "mysql2/promise";
import { conexionDB } from "../../config/db";
import { parseJsonArray } from "../../utils/json";
import type {
  DoctorPublicProfile,
  PatientConditions,
  PatientConditionsRaw,
  RecentActivity,
  RecentConsultation,
} from "../../types/doctor.types";

type DoctorPublicProfileRow = DoctorPublicProfile & RowDataPacket;
type ConsultationCountRow = { totalConsultations: number } & RowDataPacket;
type PendingCountRow = { pendingDrafts: number } & RowDataPacket;
type RecentConsultationRow = RecentConsultation & RowDataPacket;
type RecentActivityRow = RecentActivity & RowDataPacket;
type PatientConditionsRow = PatientConditionsRaw & RowDataPacket;

// password_hash is never selected so it can't leak through this layer
export async function getById(doctorId: number): Promise<DoctorPublicProfile | null> {
  const [rows] = await conexionDB.query<DoctorPublicProfileRow[]>(
    "SELECT id, name, email, role, specialty, created_at FROM doctors WHERE id = ?",
    [doctorId]
  );

  return rows[0] ?? null;
}

export async function getConsultationCount(doctorId: number): Promise<number> {
  const [rows] = await conexionDB.query<ConsultationCountRow[]>(
    "SELECT COUNT(*) AS totalConsultations FROM consultations WHERE doctor_id = ?",
    [doctorId]
  );

  return Number(rows[0].totalConsultations);
}

export async function getPendingCount(doctorId: number): Promise<number> {
  const [rows] = await conexionDB.query<PendingCountRow[]>(
    "SELECT COUNT(*) AS pendingDrafts FROM consultations WHERE doctor_id = ? AND status != 'signed'",
    [doctorId]
  );

  return Number(rows[0].pendingDrafts);
}

// latest consultation per patient, so the same patient doesn't fill the list
export async function getRecentConsultations(
  doctorId: number,
  limit: number
): Promise<RecentConsultation[]> {
  const [rows] = await conexionDB.query<RecentConsultationRow[]>(
    `SELECT id, status, created_at, patient_id, patient_name
     FROM (
        SELECT
            c.id,
            c.status,
            c.created_at,
            p.id AS patient_id,
            p.name AS patient_name,
            ROW_NUMBER() OVER (PARTITION BY c.patient_id ORDER BY c.created_at DESC, c.id DESC) AS rn
        FROM consultations c
        JOIN patients p ON c.patient_id = p.id
        WHERE c.doctor_id = ?
     ) latest_per_patient
     WHERE rn = 1
     ORDER BY created_at DESC, id DESC
     LIMIT ?`,
    [doctorId, limit]
  );

  return rows;
}

export async function getRecentActivity(
  doctorId: number,
  limit: number
): Promise<RecentActivity[]> {
  const [rows] = await conexionDB.query<RecentActivityRow[]>(
    `SELECT c.id AS consultation_id, p.name AS patient_name, c.status,
            COALESCE(c.signed_at, c.created_at) AS timestamp
     FROM consultations c
     JOIN patients p ON c.patient_id = p.id
     WHERE c.doctor_id = ?
     ORDER BY COALESCE(c.signed_at, c.created_at) DESC
     LIMIT ?`,
    [doctorId, limit]
  );

  return rows;
}

export async function getPatientConditions(doctorId: number): Promise<PatientConditions[]> {
  const [rows] = await conexionDB.query<PatientConditionsRow[]>(
    `SELECT pm.chronic_diseases, pm.allergies
     FROM patient_memory pm
     JOIN patients p ON pm.patient_id = p.id
     WHERE p.doctor_id = ?`,
    [doctorId]
  );

  return rows.map((row) => ({
    chronic_diseases: parseJsonArray(row.chronic_diseases),
    allergies: parseJsonArray(row.allergies),
  }));
}
