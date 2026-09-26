import type { ConsultationStatus } from "./consultation.types";

export type DoctorRole = "doctor" | "admin";

export interface Doctor {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  specialty: string | null;
  role: DoctorRole;
  created_at: Date;
}

export type DoctorPublicProfile = Omit<Doctor, "password_hash">;

export interface RecentConsultation {
  id: number;
  status: ConsultationStatus;
  created_at: Date;
  patient_id: number;
  patient_name: string;
}

export interface DoctorStats {
  totalConsultations: number;
  pendingDrafts: number;
  recentConsultations: RecentConsultation[];
}

export interface RecentActivity {
  consultation_id: number;
  patient_name: string;
  status: ConsultationStatus;
  timestamp: Date;
}

export interface PatientConditionsRaw {
  chronic_diseases: string | string[] | null;
  allergies: string | string[] | null;
}

export interface PatientConditions {
  chronic_diseases: string[] | null;
  allergies: string[] | null;
}

export interface TopCondition {
  condition: string;
  patientCount: number;
}

export interface TopAllergy {
  allergy: string;
  patientCount: number;
}

export interface TopConditions {
  topChronicDiseases: TopCondition[];
  topAllergies: TopAllergy[];
}

export type DoctorCredentials = Pick<Doctor, "id" | "email" | "password_hash" | "name" | "role">;

export type AuthenticatedDoctor = Omit<DoctorCredentials, "password_hash">;

export interface CreateDoctorDTO {
  name: string;
  email: string;
  password: string;
}

export type CreateDoctorRecord = Omit<CreateDoctorDTO, "password"> & {
  password_hash: string;
};
