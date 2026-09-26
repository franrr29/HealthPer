import { generateConsultationSummary } from "../ai/llm.service";
import { AppError } from "../../errors/appError";
import { logger } from "../../config/logger";
import { updatePatientMemoryService } from "../ai/memory.service";
import { indexConsultation } from "../ai/indexing.service";
import { consultationSummarySchema, ConsultationSummary } from "../../schemas/schema.llmAnswer";
import * as patientRepository from "../patient/patient.repository";
import * as consultationRepository from "./consultation.repository";
import type {
  Consultation,
  ConsultationForEmail,
  ConsultationJson,
  PendingConsultation,
  SignConsultationOutcome,
  UpdateConsultationDTO,
} from "../../types/consultation.types";

function toConsultationSummary(value: NonNullable<ConsultationJson>): ConsultationSummary {
  return consultationSummarySchema.parse(typeof value === "string" ? JSON.parse(value) : value);
}

export async function createConsultation(
  patient_id: number,
  doctor_id: number,
  transcript?: string
): Promise<{ id: number } | null> {
  // validate ownership before creating anything
  const patient = await patientRepository.getByIdAndDoctorId(patient_id, doctor_id);

  if (!patient) {
    return null;
  }

  const id = await consultationRepository.create({ patient_id, transcript }, doctor_id);

  return { id };
}

export async function getConsultationByIdService(
  consultation_id: number,
  doctor_id: number
): Promise<Consultation | null> {
  return consultationRepository.getByIdAndDoctorId(consultation_id, doctor_id);
}

export async function allConsultations(
  patient_id: number,
  doctor_id: number
): Promise<Consultation[] | null> {
  const consultations = await consultationRepository.getHistoryByPatientId(patient_id, doctor_id);

  if (consultations.length === 0) {
    return null;
  }

  return consultations;
}

export async function patchFields(
  consultation_id: number,
  doctor_id: number,
  fields: UpdateConsultationDTO
): Promise<{ updated: true } | null> {
  const isUpdated = await consultationRepository.updateFields(consultation_id, doctor_id, fields);

  if (!isUpdated) {
    return null;
  }

  return { updated: true };
}

export async function appendTranscript(
  consultation_id: number,
  doctor_id: number,
  newText: string
): Promise<boolean> {
  return consultationRepository.appendTranscript(consultation_id, doctor_id, newText);
}

export async function summarizeConsultation(
  consultation_id: number,
  doctor_id: number
): Promise<ConsultationSummary | null> {
  const consultation = await getConsultationByIdService(consultation_id, doctor_id);

  if (!consultation) {
    return null;
  }

  if (!consultation.transcript) {
    throw Error("Transcript is required for summarization");
  }

  const summary = await generateConsultationSummary(consultation.patient_id, consultation.transcript);

  const isSaved = await consultationRepository.updateAiSummary(
    consultation_id,
    doctor_id,
    JSON.stringify(summary)
  );

  if (!isSaved) {
    return null;
  }

  return summary;
}

export async function editConsultationSummary(
  consultation_id: number,
  doctor_id: number,
  edited_summary: string
): Promise<{ consultation_id: number; edited_summary: string } | null> {
  const consultation = await getConsultationByIdService(consultation_id, doctor_id);

  if (!consultation) {
    return null;
  }

  await consultationRepository.updateEditedSummary(consultation_id, doctor_id, edited_summary);

  return { consultation_id, edited_summary };
}

export async function signConsultationService(
  consultation_id: number,
  doctor_id: number
): Promise<SignConsultationOutcome> {
  const consulta = await consultationRepository.getForSigning(consultation_id, doctor_id);

  if (!consulta) {
    throw new AppError("Consultation not found", 404);
  }

  if (consulta.status === "signed") {
    throw new AppError("Consultation is already signed", 409);
  }

  if (!consulta.ai_summary) {
    throw new AppError("AI summary is required to sign the consultation", 400);
  }

  await consultationRepository.sign(consultation_id, doctor_id);

  const signedConsultation = await consultationRepository.getSignedAt(consultation_id, doctor_id);

  let memoryUpdated = true;

  try {
    await updatePatientMemoryService(consulta.patient_id, toConsultationSummary(consulta.ai_summary));
  } catch (error) {
    memoryUpdated = false;
    logger.error(`Failed to update patient memory after signing consultation ${consultation_id}: ${(error as Error).message}`);
  }

  // signing must not depend on memory update or indexing, so both failures are only logged
  try {
    await indexConsultation(consulta.patient_id, consultation_id, consulta.transcript ?? "");
  } catch (error) {
    logger.error(`Failed to index consultation ${consultation_id}: ${(error as Error).message}`);
  }

  return {
    message: memoryUpdated
      ? "Consultation signed successfully"
      : "Consultation signed successfully, but patient memory update is pending",
    consultation_id,
    status: "signed",
    signed_at: signedConsultation?.signed_at ?? null,
  };
}

export async function getPendingConsultationsService(doctor_id: number): Promise<PendingConsultation[]> {
  return consultationRepository.getPendingByDoctorId(doctor_id);
}

export async function getConsultationForEmail(
  consultation_id: number,
  doctor_id: number
): Promise<ConsultationForEmail | null> {
  return consultationRepository.getForEmail(consultation_id, doctor_id);
}
