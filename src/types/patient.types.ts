export type PatientGender = "M" | "F" | "X" | "U";

export interface Patient {
  id: number;
  doctor_id: number;
  name: string;
  birth_date: Date | null;
  gender: PatientGender | null;
  national_id: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePatientDTO {
  name: string;
  birth_date?: string;
  gender?: PatientGender;
  national_id?: string;
  phone?: string;
}

export type UpdatePatientDTO = Partial<CreatePatientDTO>;

export type PatientMemoryRecord = {
  patient_id: number;
  chronic_diseases: string | string[] | null;
  allergies: string | string[] | null;
  medications: string | string[] | null;
  recurrent_symptoms: string | string[] | null;
  master_summary: string | null;
  last_updated: Date;
};

type PatientMemoryJsonField =
  | "chronic_diseases"
  | "allergies"
  | "medications"
  | "recurrent_symptoms";

export type ParsedPatientMemory = Omit<PatientMemoryRecord, PatientMemoryJsonField> &
  Record<PatientMemoryJsonField, string[] | null>;

export interface PatientFollowUp {
  id: number;
  name: string;
  last_consultation: Date | null;
  days_since_last_visit: number | null;
}
