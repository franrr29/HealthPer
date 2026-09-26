import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { conexionDB } from "../../config/db";
import type { PatientMemoryRow, UpsertPatientMemoryDTO } from "../../types/patientMemory.types";

type PatientMemoryQueryRow = PatientMemoryRow & RowDataPacket;

export async function getByPatientId(patientId: number): Promise<PatientMemoryRow | null> {
  const [rows] = await conexionDB.query<PatientMemoryQueryRow[]>(
    `SELECT patient_id, chronic_diseases, allergies, medications, recurrent_symptoms, master_summary
     FROM patient_memory
     WHERE patient_id = ?`,
    [patientId]
  );

  return rows[0] ?? null;
}

export async function create(patientId: number, data: UpsertPatientMemoryDTO): Promise<void> {
  await conexionDB.query<ResultSetHeader>(
    `INSERT INTO patient_memory
     (patient_id, chronic_diseases, allergies, medications, recurrent_symptoms, master_summary)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      patientId,
      data.chronic_diseases,
      data.allergies,
      data.medications,
      data.recurrent_symptoms,
      data.master_summary,
    ]
  );
}

export async function update(patientId: number, data: UpsertPatientMemoryDTO): Promise<boolean> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    `UPDATE patient_memory
     SET chronic_diseases = ?,
         allergies = ?,
         medications = ?,
         recurrent_symptoms = ?,
         master_summary = ?
     WHERE patient_id = ?`,
    [
      data.chronic_diseases,
      data.allergies,
      data.medications,
      data.recurrent_symptoms,
      data.master_summary,
      patientId,
    ]
  );

  return result.affectedRows > 0;
}
