import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { conexionDB } from "../../config/db";
import type { CreateDoctorRecord, DoctorCredentials } from "../../types/doctor.types";

type DoctorCredentialsRow = DoctorCredentials & RowDataPacket;

export async function getByEmail(email: string): Promise<DoctorCredentials | null> {
  const [rows] = await conexionDB.query<DoctorCredentialsRow[]>(
    "SELECT id, email, password_hash, name, role FROM doctors WHERE email = ?",
    [email]
  );

  return rows[0] ?? null;
}

export async function create(data: CreateDoctorRecord): Promise<number> {
  const [result] = await conexionDB.query<ResultSetHeader>(
    "INSERT INTO doctors (name, email, password_hash) VALUES (?, ?, ?)",
    [data.name, data.email, data.password_hash]
  );

  return result.insertId;
}
