import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientById, getAllConsultations, patientMemory } from "@/services/patients.service";
import { createConsultation } from "@/services/consultations.service";
import { useDeletePatientMutation } from "@/hooks/usePatientMutation";
import PatientChatWidget from "@/components/common/ChatPatientMessage";
import { PatientInfoHeader } from "./PatientInfoHeader";
import { PatientMemoryCard } from "./PatientMemoryCard";
import { ConsultationHistoryList } from "./ConsultationHistoryList";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = Number(id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const deleteMutation = useDeletePatientMutation();

  const { data: patient, isLoading: patientLoading, error: patientError } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: Boolean(id),
  });

  const { data: memory } = useQuery({
    queryKey: ["memory", patientId],
    queryFn: () => patientMemory(patientId),
    enabled: Boolean(id),
  });

  const { data: consultations, isLoading: consultationsLoading, error: consultationsError } = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: () => getAllConsultations(patientId),
    enabled: Boolean(id),
  });

  function handleDelete() {
    if (!patient) return;
    deleteMutation.mutate(patient.id, {
      onSuccess: () => navigate("/patients"),
    });
  }

  async function handleCreateConsultation() {
    if (!patient) return;
    setCreateError(null);

    try {
      const newConsultation = await createConsultation(patient.id);
      navigate(`/patients/${patient.id}/consultations/${newConsultation.id}`);
    } catch (error) {
      console.error("Error creating consultation:", error);
      setCreateError("Error creating consultation");
    }
  }

  if (patientLoading || consultationsLoading) {
    return (
      <div className="p-8 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-pulse">
        Loading patient record...
      </div>
    );
  }

  if (patientError || consultationsError) {
    return (
      <div className="p-6 border border-rose-300 bg-rose-50/50 text-destructive text-xs font-semibold rounded-xl flex justify-between items-center neu-surface">
        <span>Error loading patient data</span>
        <button
          onClick={() => window.location.reload()}
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Patient not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-4 mb-8 space-y-6 transition-all duration-300 ease-in-out">
      <PatientInfoHeader patient={patient} onDeleteClick={() => setShowDeleteModal(true)} />

      {memory && <PatientMemoryCard memory={memory} />}

      <ConsultationHistoryList
        consultations={consultations}
        createError={createError}
        onCreateConsultation={handleCreateConsultation}
      />

      {showDeleteModal && (
        <DeleteConfirmModal
          patientName={patient.name}
          isDeleting={deleteMutation.isPending}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      <PatientChatWidget patientId={patient.id} />
    </div>
  );
}
