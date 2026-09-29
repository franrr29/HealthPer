import { useQueries, useQuery } from "@tanstack/react-query";
import { getAllConsultations, getPatients } from "@/services/patients.service";
import type { Consultation } from "@/types/consultation";

export type ConsultationWithPatient = Consultation & { patient_name: string };

interface AllConsultationsState {
  consultations: ConsultationWithPatient[];
  isLoading: boolean;
  hasPartialError: boolean;
}

// no hay endpoint global de consultas: se reutiliza el de cada paciente (misma cache que PatientDetails)
export function useAllConsultations() {
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  const patients = patientsQuery.data ?? [];

  const state = useQueries({
    queries: patients.map((patient) => ({
      queryKey: ["consultations", patient.id],
      queryFn: () => getAllConsultations(patient.id),
    })),
    combine: (results): AllConsultationsState => {
      const nameById = new Map(patients.map((p) => [p.id, p.name]));
      const consultations = results
        .flatMap((r) => r.data ?? [])
        .map((c) => ({ ...c, patient_name: nameById.get(c.patient_id) ?? "Unknown patient" }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        consultations,
        isLoading: results.some((r) => r.isLoading),
        hasPartialError: results.some((r) => r.isError),
      };
    },
  });

  return {
    consultations: state.consultations,
    isLoading: patientsQuery.isLoading || state.isLoading,
    hasPartialError: state.hasPartialError,
    error: patientsQuery.error,
  };
}
