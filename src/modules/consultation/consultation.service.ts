import { generateConsultationSummary } from "../ai/llm.service";
import { ConflictError, NotFoundError, ValidationError } from "../../errors";
import { buildUpdatedPatientMemory, savePatientMemory } from "../ai/memory.service";
import { buildConsultationIndex, saveConsultationIndex } from "../ai/indexing.service";
import { transcribeAudio } from "../ai/whisper.service";
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
  try {
    return consultationSummarySchema.parse(typeof value === "string" ? JSON.parse(value) : value);
  } catch {
    throw new ValidationError("Consultation summary has an invalid structure");
  }
}

async function ensureNotSigned(
  consultation_id: number,
  doctor_id: number,
  message: string
): Promise<void> {
  const status = await consultationRepository.getStatusById(consultation_id, doctor_id);

  if (!status) {
    throw new NotFoundError("Consultation not found");
  }

  if (status === "signed") {
    throw new ConflictError(message);
  }
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
  await ensureNotSigned(consultation_id, doctor_id, "Cannot modify a signed consultation");

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

export async function transcribeConsultationAudio(
  consultation_id: number,
  doctor_id: number,
  audioBuffer: Buffer,
  mimetype?: string
): Promise<string> {
  // checked before calling whisper so a signed or foreign consultation never spends quota
  await ensureNotSigned(consultation_id, doctor_id, "Cannot transcribe into a signed consultation");

  const transcription = await transcribeAudio(audioBuffer, mimetype);

  if (transcription) {
    await appendTranscript(consultation_id, doctor_id, transcription);
  }

  return transcription;
}

export async function summarizeConsultation(
  consultation_id: number,
  doctor_id: number
): Promise<ConsultationSummary> {
  await ensureNotSigned(consultation_id, doctor_id, "Cannot re-summarize a signed consultation");

  const consultation = await getConsultationByIdService(consultation_id, doctor_id);

  if (!consultation) {
    throw new NotFoundError("Consultation not found");
  }

  if (!consultation.transcript) {
    throw new ValidationError("Transcript is required for summarization");
  }

  const summary = await generateConsultationSummary(consultation.patient_id, consultation.transcript);

  const isSaved = await consultationRepository.updateAiSummary(
    consultation_id,
    doctor_id,
    JSON.stringify(summary)
  );

  if (!isSaved) {
    throw new ConflictError("Cannot re-summarize a signed consultation");
  }

  return summary;
}

export async function editConsultationSummary(
  consultation_id: number,
  doctor_id: number,
  edited_summary: string
): Promise<{ consultation_id: number; edited_summary: string }> {
  await ensureNotSigned(consultation_id, doctor_id, "Cannot edit a signed consultation summary");

  const isSaved = await consultationRepository.updateEditedSummary(consultation_id, doctor_id, edited_summary);

  if (!isSaved) {
    throw new ConflictError("Cannot edit a signed consultation summary");
  }

  return { consultation_id, edited_summary };
}

export async function signConsultationService(
  consultation_id: number,
  doctor_id: number
): Promise<SignConsultationOutcome> {
  await ensureNotSigned(consultation_id, doctor_id, "Consultation is already signed");

  const consultation = await consultationRepository.getForSigning(consultation_id, doctor_id);

  if (!consultation) {
    throw new NotFoundError("Consultation not found");
  }

  // the doctor's correction wins over the ai draft
  const summaryToUse = consultation.edited_summary ?? consultation.ai_summary;

  if (!summaryToUse) {
    throw new ValidationError("AI summary is required to sign the consultation");
  }

  // the slow external calls run first so no db connection or row lock is held while waiting on them;
  // if any of them fails nothing has been written and the consultation stays unsigned
  const updatedMemory = await buildUpdatedPatientMemory(
    consultation.patient_id,
    toConsultationSummary(summaryToUse)
  );
  const consultationIndex = await buildConsultationIndex(consultation.transcript ?? "");

  const signedConsultation = await consultationRepository.signWithTransaction(
    consultation_id,
    doctor_id,
    async (connection) => {
      await savePatientMemory(consultation.patient_id, updatedMemory, connection);

      if (consultationIndex) {
        await saveConsultationIndex(consultation.patient_id, consultation_id, consultationIndex, connection);
      }
    }
  );

  // nothing was updated, so another request signed it between the check and the write
  if (!signedConsultation) {
    throw new ConflictError("Consultation is already signed");
  }

  return {
    message: "Consultation signed successfully",
    consultation_id,
    status: "signed",
    signed_at: signedConsultation.signed_at,
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
