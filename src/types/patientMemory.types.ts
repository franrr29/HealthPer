import type { PatientMemoryRecord } from "./patient.types";

export type PatientMemoryRow = Omit<PatientMemoryRecord, "last_updated">;

export interface UpsertPatientMemoryDTO {
  chronic_diseases: string;
  allergies: string;
  medications: string;
  recurrent_symptoms: string;
  master_summary: string;
}
