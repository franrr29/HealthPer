import { useParams, Link } from "react-router-dom";
import { summarizeConsultation, signConsultation } from "@/services/consultations.service";
import { patientMemory } from "@/services/patients.service";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PatientChatWidget from "@/components/common/ChatPatientMessage";
import { Pause, Sparkles } from "lucide-react";
import useConsultationRounds from "./useConsultationRounds";
import PatientMemoryPanel from "./PatientMemoryPanel";
import RecordingStep from "./RecordingStep";
import TranscriptionStep from "./TranscriptionStep";
import SummaryAndSignatureStep from "./SummaryAndSignatureStep";

export default function ConsultationFlow() {

  const { consultationId, patientId } = useParams<{ consultationId: string; patientId: string }>();
  const consultationIdNumber = Number(consultationId);
  const patientIdNumber = Number(patientId);

  // hook de rondas de grabacion
  const {roundPhase,suggestedQuestions,previousQuestions,fullTranscript,roundError,startRound,stopRound,finalizeRound,error,
  } = useConsultationRounds(patientIdNumber, consultationIdNumber);

  // estados del resumen
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // estados de la firma
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [signSuccess, setSignSuccess] = useState(false);

  const { data: memory } = useQuery({
    queryKey: ["memory", patientIdNumber],
    queryFn: () => patientMemory(patientIdNumber),
    enabled: Boolean(patientId),
  });

  // generar resumen con el llm
  async function retrySummarize() {
    setLoadingSummary(true);
    setSummaryError(null);

    try {
      const data = await summarizeConsultation(consultationIdNumber);
      setSummary(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error summarizing consultation:", err);
      setSummaryError("Error summarizing consultation");
    } finally {
      setLoadingSummary(false);
    }
  }

  // firmar la consulta
  async function handleSignConsultation() {
    setSigning(true);
    setSignError(null);

    try {
      await signConsultation(consultationIdNumber);
      setSignSuccess(true);
    } catch (err) {
      console.error("Error signing consultation:", err);
      setSignError("Error signing consultation");
      setSigning(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 transition-all duration-300 ease-in-out">

      <Link
        to={`/patients/${patientId}`}
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
      >
        <span>←</span> Back to patient
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <h1 className="font-feature text-2xl font-semibold tracking-tight text-foreground">Clinical Consultation</h1>
        {roundPhase === 'analyzing' && (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500 border border-slate-600/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest">
            <Pause className="h-3 w-3" />
            Paused
          </span>
        )}
        {roundPhase === 'reviewing' && (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-navy-elevated border border-navy-elevated/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Questions Ready
          </span>
        )}
      </div>

      {memory && <PatientMemoryPanel memory={memory} />}

      <RecordingStep
        roundPhase={roundPhase}
        previousQuestions={previousQuestions}
        suggestedQuestions={suggestedQuestions}
        roundError={roundError}
        error={error}
        onStartRound={startRound}
        onStopRound={stopRound}
        onFinalizeRound={finalizeRound}
      />

      {roundPhase === 'done' && fullTranscript && (
        <TranscriptionStep
          fullTranscript={fullTranscript}
          summary={summary}
          loadingSummary={loadingSummary}
          summaryError={summaryError}
          onRetrySummarize={retrySummarize}
        />
      )}

      {summary && (
        <SummaryAndSignatureStep
          consultationId={consultationIdNumber}
          patientId={patientIdNumber}
          summary={summary}
          signing={signing}
          signSuccess={signSuccess}
          signError={signError}
          onSign={handleSignConsultation}
        />
      )}

      <PatientChatWidget patientId={patientIdNumber} />
    </div>
  );
}
