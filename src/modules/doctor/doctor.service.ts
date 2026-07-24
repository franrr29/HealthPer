//Service para buscar datos del doctor logeado en la base de datos:

import { RowDataPacket } from "mysql2";
import { conexionDB } from "../../config/db";
import { AppError } from "../../errors/appError";

//para tipar el resultado de la consulta de las ultimas 3 consultas del doctor logeado:
interface RecentConsultation extends RowDataPacket {
    id: number;
    status: string;
    created_at: Date;
    patient_id: number;
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

  //trae la consulta mas reciente de cada paciente, para no repetir el mismo paciente 3 veces
  //ROW_NUMBER numera las consultas de cada paciente de mas nueva a mas vieja, y nos quedamos solo con la numero 1 de cada uno
  const [recentRows] = await conexionDB.query<RowDataPacket[]>(
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
     ) ultima_por_paciente
     WHERE rn = 1
     ORDER BY created_at DESC, id DESC
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


//funcion para traer las ultimas 10 consultas del doctor logeado y mostrar en dashboard:
export async function getRecentActivityService(doctorId: number | undefined) {

    if (!doctorId) {
        throw new AppError("Doctor ID is required", 400);
    }

    const [rows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT c.id AS consultation_id, p.name AS patient_name, c.status,
                COALESCE(c.signed_at, c.created_at) AS timestamp
         FROM consultations c
         JOIN patients p ON c.patient_id = p.id
         WHERE c.doctor_id = ?
         ORDER BY COALESCE(c.signed_at, c.created_at) DESC
         LIMIT 10`,
        [doctorId]
    );

    return rows;
}



//funcion para traer las condiciones mas frecuentes de los pacientes del doc:
export async function getTopConditionsService(doctorId: number | undefined) {

    if (!doctorId) {
        throw new AppError("Doctor ID is required", 400);
    }

    const [rows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT pm.chronic_diseases, pm.allergies
         FROM patient_memory pm
         JOIN patients p ON pm.patient_id = p.id
         WHERE p.doctor_id = ?`,
        [doctorId]
    );

    // conteo de enfermedades cronicas
    const diseaseCount: Record<string, number> = {};

    // conteo de alergias
    const allergyCount: Record<string, number> = {};

    for (const row of rows) {
        
        const diseases = typeof row.chronic_diseases === "string" ? JSON.parse(row.chronic_diseases) : row.chronic_diseases ?? [];
        const allergies = typeof row.allergies === "string" ? JSON.parse(row.allergies) : row.allergies ?? [];

        for (const d of diseases) {
            diseaseCount[d] = (diseaseCount[d] || 0) + 1;
        }

        for (const a of allergies) {
            allergyCount[a] = (allergyCount[a] || 0) + 1;
        }
    }

    // convertir a array ordenado por frecuencia
    const topChronicDiseases = Object.entries(diseaseCount)
        .map(([condition, patientCount]) => ({ condition, patientCount }))
        .sort((a, b) => b.patientCount - a.patientCount)
        .slice(0, 5);

    const topAllergies = Object.entries(allergyCount)
        .map(([allergy, patientCount]) => ({ allergy, patientCount }))
        .sort((a, b) => b.patientCount - a.patientCount)
        .slice(0, 5);

    return { topChronicDiseases, topAllergies };
}