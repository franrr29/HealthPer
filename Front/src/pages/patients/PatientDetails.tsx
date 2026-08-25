import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientById, getAllConsultations, patientMemory } from "@/services/patients.service";
import { createConsultation } from "@/services/consultations.service";
import { useDeletePatientMutation } from "@/hooks/usePatientMutation";
import { formatDate } from "@/utils/format";
import PatientChatWidget from "@/components/common/ChatPatientMessage";
import { Brain } from "lucide-react";

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
        Loading core metrics...
      </div>
    );
  }

  if (patientError || consultationsError) {
    return (
      <div className="p-6 border border-rose-300 bg-rose-50/50 text-destructive text-xs font-semibold rounded-xl flex justify-between items-center neu-surface">
        <span>Error synchronization medical records</span>
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
        Patient structure empty
      </div>
    );
  }

  const patientDetails = [
    { label: "Gender", value: patient.gender },
    { label: "Birth Date", value: formatDate(patient.birth_date) },
    { label: "National ID", value: patient.national_id },
    { label: "Phone Number", value: patient.phone },
  ];

  const memoryMeta = [
    { label: "Chronic Diseases", data: memory?.chronic_diseases, tone: "blue" as const },
    { label: "Allergies Risk", data: memory?.allergies, tone: "rose" as const },
    { label: "Active Medications", data: memory?.medications, tone: "neutral" as const },
    { label: "Recurrent Symptoms", data: memory?.recurrent_symptoms, tone: "neutral" as const },
  ];

  const memoryToneStyles = {
    blue: { box: "bg-blue-100/90 border border-blue-300/80", label: "text-blue-700", value: "text-blue-950" },
    rose: { box: "bg-rose-100/90 border border-rose-300/80", label: "text-rose-700", value: "text-rose-950" },
    neutral: { box: "bg-card/70 border border-border/60", label: "text-muted-foreground", value: "text-foreground" },
  };

  return (
    <div className="max-w-5xl mx-auto my-4 mb-8 space-y-6 transition-all duration-300 ease-in-out">
      <Link
        to="/patients"
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block"
      >
        ← Back to registry index
      </Link>

      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="font-feature text-2xl font-semibold tracking-tight text-foreground">
          {patient.name}
        </h1>
        <div className="flex gap-2">
          <Link
            to={`/patients/${patient.id}/edit`}
            className="neu-card inline-flex items-center gap-2 bg-card text-foreground rounded-xl px-4 py-2 border border-border text-[11px] font-bold uppercase tracking-wider hover:brightness-95 transition-all duration-200"
          >
            Edit Profile
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="neu-card inline-flex items-center gap-2 bg-rose-600 text-white rounded-xl px-4 py-2 border border-rose-700/60 text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Detalle básico del paciente */}
      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 transition-all duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {patientDetails.map((item) => (
            <div key={item.label} className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                {item.label}
              </span>
              <span className="text-sm font-medium text-foreground block">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memoria clínica */}
      {memory && (
        <div className="neu-card rounded-2xl bg-blue-50/40 p-5 border border-blue-200/80 space-y-5 transition-all duration-200">
          <div className="flex items-center gap-2 border-b border-blue-200/90 pb-3">
            <Brain className="h-4 w-4 text-blue-700" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-blue-950">
              Clinical Intelligence Memory
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700/70 block">
                Master Summary
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {memory.master_summary}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700/70 block">
                Follow Up Strategy
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {memory.master_summary?.follow_up}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-blue-200/60">
            {memoryMeta.map((meta) => {
              const tone = memoryToneStyles[meta.tone];
              return (
                <div
                  key={meta.label}
                  className={`rounded-md p-3 space-y-1 shadow-sm transition-shadow duration-200 ${tone.box}`}
                >
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-widest block ${tone.label}`}>
                    {meta.label}
                  </span>
                  <span className={`text-xs font-semibold block truncate ${tone.value}`}>
                    {meta.data?.join(", ") || "None recorded"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Histórico de consultas */}
      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-5 transition-all duration-200">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            Consultation Pipeline
          </h3>
          <button
            onClick={handleCreateConsultation}
            className="neu-card inline-flex items-center gap-2 bg-[#2F3B35] text-white rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-[#3B4A42] hover:bg-[#3B4A42] transition-all duration-200"
          >
            Open Consultation
          </button>
        </div>

        {createError && (
          <p className="font-mono text-xs uppercase tracking-wider text-destructive">
            {createError}
          </p>
        )}

        {consultations && consultations.length > 0 ? (
          <ul className="space-y-3">
            {consultations.map((consultation) => (
              <li
                key={consultation.id}
                className="rounded-xl overflow-hidden neu-surface border border-border/80 transition-all duration-150"
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">
                      {formatDate(consultation.created_at)}
                    </span>
                    {consultation.ai_summary && (
                      <p className="text-xs font-medium text-foreground leading-relaxed truncate">
                        {consultation.ai_summary.diagnosis || consultation.ai_summary.chief_complaint}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`px-4 py-1.5 border-t font-mono text-[9px] font-extrabold uppercase tracking-widest ${
                    consultation.status === "signed"
                      ? "bg-[#769283] border-[#5E7367]/60 text-white"
                      : "bg-amber-400 border-amber-500/60 text-slate-950"
                  }`}
                >
                  {consultation.status}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground py-2">
            No historical consultations in system pipeline.
          </p>
        )}
      </div>

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#2F3B35]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200">
          <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 w-full max-w-sm space-y-4 transition-all duration-200 transform scale-100">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              Destructive Protocol
            </h3>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Are you absolutely sure you want to completely purge{" "}
              <span className="text-foreground font-bold">{patient.name}</span>? System memory
              structures cannot revert this process.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}
                className="neu-card inline-flex items-center gap-2 bg-card text-foreground rounded-xl px-3 py-1.5 border border-border text-[11px] font-bold uppercase tracking-wider hover:brightness-95 transition-all duration-200 disabled:opacity-50"
              >
                Abort
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="neu-card inline-flex items-center gap-2 bg-rose-600 text-white rounded-xl px-3 py-1.5 border border-rose-700/60 text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all duration-200 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Purging..." : "Confirm Purge"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PatientChatWidget patientId={patient.id} />
    </div>
  );
}
