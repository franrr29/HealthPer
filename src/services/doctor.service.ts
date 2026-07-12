//Service para buscar datos del doctor logeado en la base de datos:

import { RowDataPacket } from "mysql2";
import { conexionDB } from "../config/db";
import { AppError } from "../errors/appError";

//para tipar el resultado de la consulta de las ultimas 3 consultas del doctor logeado:
interface RecentConsultation extends RowDataPacket {
    id: number;
    status: string;
    created_at: Date;
    patient_name: string;
}


export async function getDoctorByIdService(doctorId: number | undefined) {

    if (!doctorId) {

        throw new AppError("Doctor ID is required", 400);
    }

    const [rows]= await conexionDB.query<RowDataPacket[]> ("SELECT id, name, email, role, specialty FROM doctors WHERE id = ?",
         [doctorId]);

    if (rows.length === 0) {

        throw new AppError("Doctor not found", 404);
    }

    return rows[0];
}



//funcion para traer las estadisticas del doctor logeado y mostrar en dashboard:
export async function getDoctorStatsByIdService(doctorId: number | undefined) {

  if (!doctorId) {
    throw new AppError("Doctor ID is required", 400);
  }

  const [totalRows] = await conexionDB.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS totalConsultations FROM consultations WHERE doctor_id = ?",
    [doctorId]
  );

  const [pendingRows] = await conexionDB.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS pendingDrafts FROM consultations WHERE doctor_id = ? AND status != 'signed'",
    [doctorId]
  );

  const [recentRows] = await conexionDB.query<RowDataPacket[]>(
    `SELECT
        c.id,
        c.status,
        c.created_at,
        p.name AS patient_name
     FROM consultations c
     JOIN patients p ON c.patient_id = p.id
     WHERE c.doctor_id = ?
     ORDER BY c.created_at DESC
     LIMIT 3`,
    [doctorId]
  );

  //counts pueden venir como strings por eso puse NUmber
  return {
    totalConsultations: Number(totalRows[0].totalConsultations),
    pendingDrafts: Number(pendingRows[0].pendingDrafts),
    recentConsultations: recentRows as RecentConsultation[],
};

}