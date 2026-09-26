export type ConsultationStatus = "draft" | "reviewed" | "signed";

export type ConsultationJson = string | Record<string, unknown> | null;

export interface Consultation {
  id: number;
  patient_id: number;
  doctor_id: number;
  transcript: string | null;
  ai_summary: ConsultationJson;
  edited_summary: ConsultationJson;
  audio_url: string | null;
  duration_sec: number | null;
  status: ConsultationStatus;
  created_at: Date;
  signed_at: Date | null;
}

export interface CreateConsultationDTO {
  patient_id: number;
  transcript?: string;
}

export interface UpdateConsultationDTO {
  transcript?: string;
  edited_summary?: string;
  status?: ConsultationStatus;
}

export type ConsultationForSigning = Pick<
  Consultation,
  "id" | "patient_id" | "ai_summary" | "status" | "transcript"
>;

export type ConsultationWithPatient = Pick<
  Consultation,
  "ai_summary" | "edited_summary" | "status"
> & {
  patient_name: string;
};

export type ConsultationForEmail = ConsultationWithPatient & {
  doctor_name: string;
};

export interface PendingConsultation {
  consultation_id: number;
  patient_name: string;
  status: ConsultationStatus;
  hours_pending: number;
}

export interface SignedConsultationResult {
  signed_at: Date | null;
}

export interface SignConsultationOutcome {
  message: string;
  consultation_id: number;
  status: "signed";
  signed_at: Date | null;
}
