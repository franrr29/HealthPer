import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { conexionDB } from "../../config/db";
import { parseJsonArray } from "../../utils/json";
import type {
  CreatePatientDTO,
  ParsedPatientMemory,
  Patient,
  PatientFollowUp,
  PatientMemoryRecord,
  UpdatePatientDTO,
} from "../../types/patient.types";

type PatientRow = Patient & RowDataPacket;
type PatientMemoryRow = PatientMemoryRecord & RowDataPacket;
type PatientFollowUpRow = PatientFollowUp & RowDataPacket;

const UPDATABLE_COLUMNS = [
  "name",
  "birth_date",
  "gender",
  "national_id",
  "phone",
] as const satisfies readonly (keyof UpdatePatientDTO)[];


export async function getAll(doctorId: number): Promise<Patient[]> {
  const [rows] = await conexionDB.query<PatientRow[]>(
    "SELECT * FROM patients WHERE doctor_id = ?",
    [doctorId]
  );

  return rows;
}

export async function getByIdAndDoctorId(
  patientId: number,
  doctorId: number
): Promise<Patient | null> {
  const [rows] = await conexionDB.query<PatientRow[]>(
    "SELECT * FROM patients WHERE id = ? AND doctor_id = ?",
    [patientId, doctorId]
  );

  return rows[0] ?? null;
}

export async function create(
  data: CreatePatientDTO,
  doctorId: number
): Promise<number> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    `INSERT INTO patients (name, birth_date, gender, national_id, phone, doctor_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.name, data.birth_date, data.gender, data.national_id, data.phone, doctorId]
  );

  return result.insertId;
}

export async function update(
  patientId: number,
  doctorId: number,
  data: UpdatePatientDTO
): Promise<boolean> {
  const columns = UPDATABLE_COLUMNS.filter((column) => column in data);

  if (columns.length === 0) {
    return false;
  }

  const setClause = columns.map((column) => `${column} = ?`).join(", ");
  const values = columns.map((column) => data[column]);

  const [result] = await conexionDB.query<ResultSetHeader>(
    `UPDATE patients
     SET ${setClause}
     WHERE id = ? AND doctor_id = ?`,
    [...values, patientId, doctorId]
  );

  return result.affectedRows > 0;
}

export async function remove(
  patientId: number,
  doctorId: number
): Promise<boolean> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    "DELETE FROM patients WHERE id = ? AND doctor_id = ?",
    [patientId, doctorId]
  );

  return result.affectedRows > 0;
}

// patient_memory has no doctor_id, so the join enforces ownership
export async function getMemoryByPatientIdAndDoctorId(
  patientId: number,
  doctorId: number
): Promise<ParsedPatientMemory | null> {
  const [rows] = await conexionDB.query<PatientMemoryRow[]>(
    `SELECT pm.*
     FROM patient_memory pm
     JOIN patients p ON pm.patient_id = p.id
     WHERE pm.patient_id = ? AND p.doctor_id = ?`,
    [patientId, doctorId]
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    ...row,
    chronic_diseases: parseJsonArray(row.chronic_diseases),
    allergies: parseJsonArray(row.allergies),
    medications: parseJsonArray(row.medications),
    recurrent_symptoms: parseJsonArray(row.recurrent_symptoms),
  };
}

export async function getFollowUps(doctorId: number): Promise<PatientFollowUp[]> {
  const [rows] = await conexionDB.query<PatientFollowUpRow[]>(
    `SELECT p.id, p.name, MAX(c.created_at) AS last_consultation,
     DATEDIFF(CURDATE(), MAX(c.created_at)) AS days_since_last_visit
     FROM patients p
     LEFT JOIN consultations c ON c.patient_id = p.id
     WHERE p.doctor_id = ?
     GROUP BY p.id
     HAVING last_consultation IS NULL
         OR last_consultation < NOW() - INTERVAL 1 DAY
     ORDER BY last_consultation ASC`,
    [doctorId]
  );

  return rows;
}
