import { AppError } from "../../errors/appError";
import * as doctorRepository from "./doctor.repository";
import type {
  DoctorPublicProfile,
  DoctorStats,
  RecentActivity,
  TopConditions,
} from "../../types/doctor.types";

const RECENT_CONSULTATIONS_LIMIT = 3;
const RECENT_ACTIVITY_LIMIT = 10;
const TOP_CONDITIONS_LIMIT = 5;

function countOccurrences(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function getTopEntries(counts: Map<string, number>): [string, number][] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_CONDITIONS_LIMIT);
}

export async function getDoctorByIdService(doctorId: number | undefined): Promise<DoctorPublicProfile> {
  if (!doctorId) {
    throw new AppError("Doctor ID is required", 400);
  }

  const doctor = await doctorRepository.getById(doctorId);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  return doctor;
}

export async function getDoctorStatsByIdService(doctorId: number | undefined): Promise<DoctorStats> {
  if (!doctorId) {
    throw new AppError("Doctor ID is required", 400);
  }

  const totalConsultations = await doctorRepository.getConsultationCount(doctorId);
  const pendingDrafts = await doctorRepository.getPendingCount(doctorId);
  const recentConsultations = await doctorRepository.getRecentConsultations(
    doctorId,
    RECENT_CONSULTATIONS_LIMIT
  );

  return { totalConsultations, pendingDrafts, recentConsultations };
}

export async function getRecentActivityService(doctorId: number | undefined): Promise<RecentActivity[]> {
  if (!doctorId) {
    throw new AppError("Doctor ID is required", 400);
  }

  return doctorRepository.getRecentActivity(doctorId, RECENT_ACTIVITY_LIMIT);
}

export async function getTopConditionsService(doctorId: number | undefined): Promise<TopConditions> {
  if (!doctorId) {
    throw new AppError("Doctor ID is required", 400);
  }

  const patientConditions = await doctorRepository.getPatientConditions(doctorId);

  const diseaseCounts = countOccurrences(patientConditions.flatMap((row) => row.chronic_diseases ?? []));
  const allergyCounts = countOccurrences(patientConditions.flatMap((row) => row.allergies ?? []));

  return {
    topChronicDiseases: getTopEntries(diseaseCounts).map(([condition, patientCount]) => ({
      condition,
      patientCount,
    })),
    topAllergies: getTopEntries(allergyCounts).map(([allergy, patientCount]) => ({
      allergy,
      patientCount,
    })),
  };
}
