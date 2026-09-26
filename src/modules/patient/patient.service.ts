import { AppError } from "../../errors/appError";
import { retrieveRelevantChunks } from "../ai/rag.service";
import { buildAskPrompt } from "../ai/prompt.service";
import { generateTextAnswer } from "../ai/llm.service";
import * as patientRepository from "./patient.repository";
import type {
  CreatePatientDTO,
  ParsedPatientMemory,
  Patient,
  PatientFollowUp,
  UpdatePatientDTO,
} from "../../types/patient.types";

export async function getPatients(doctor_id: number): Promise<Patient[]> {
  return patientRepository.getAll(doctor_id);
}

export async function getPatientByID(doctor_id: number, patientID: number): Promise<Patient> {
  const patient = await patientRepository.getByIdAndDoctorId(patientID, doctor_id);

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  return patient;
}

export async function createPatient(patientData: CreatePatientDTO, doctor_id: number): Promise<Patient> {
  const id = await patientRepository.create(patientData, doctor_id);

  return getPatientByID(doctor_id, id);
}

export async function updatePatient(
  id: string,
  doctor_id: number,
  dataValidated: UpdatePatientDTO
): Promise<boolean> {
  const patientId = Number(id);

  // a non numeric id can't match any row, same outcome as before the repository took numbers
  if (Number.isNaN(patientId)) {
    return false;
  }

  return patientRepository.update(patientId, doctor_id, dataValidated);
}

export async function deletePatient(id: string, doctor_id: number): Promise<boolean> {
  const patientId = Number(id);

  if (Number.isNaN(patientId)) {
    return false;
  }

  return patientRepository.remove(patientId, doctor_id);
}

export async function getPatientMemoryService(
  patient_id: number,
  doctor_id: number
): Promise<ParsedPatientMemory | null> {
  return patientRepository.getMemoryByPatientIdAndDoctorId(patient_id, doctor_id);
}

export async function askPatientMemoryService(
  patient_id: number,
  doctor_id: number,
  question: string
): Promise<string> {
  // validate ownership before touching the patient's chunks
  await getPatientByID(doctor_id, patient_id);

  const retrievedChunks = await retrieveRelevantChunks(patient_id, question, 5);

  if (retrievedChunks.length === 0) {
    return "There isn't enough information in this patient's history yet to answer that question.";
  }

  const prompt = buildAskPrompt(question, retrievedChunks);

  return generateTextAnswer(prompt);
}

export async function getPatientsNeedingFollowUp(doctor_id: number): Promise<PatientFollowUp[]> {
  return patientRepository.getFollowUps(doctor_id);
}
