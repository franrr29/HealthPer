import { useParams, Link } from "react-router-dom";
import { summarizeConsultation, signConsultation } from "@/services/consultations.service";
import { patientMemory } from "@/services/patients.service";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EditSummary from "./EditSummary";
import PatientChatWidget from "@/components/common/ChatPatientMessage";
import SendEmailPatient from "../patients/SendEmailPatient";
import { Brain, ListChecks, Mic, Pause, Sparkles } from "lucide-react";
import useConsultationRounds from "./useConsultationRounds";
import SuggestedQuestions from "./SuggestedQuestions";

const memoryToneStyles = {
  blue: { box: "bg-blue-100/90 border border-blue-300/80", label: "text-blue-700", value: "text-blue-950" },
  rose: { box: "bg-rose-100/90 border border-rose-300/80", label: "text-rose-700", value: "text-rose-950" },
  neutral: { box: "bg-card/70 border border-border/60", label: "text-muted-foreground", value: "text-foreground" },
};

export default function ConsultationFlow() {

  const { consultationId, patientId } = useParams<{ consultationId: string; patientId: string }>();
  const consultationIdNumber = Number(consultationId);
  const patientIdNumber = Number(patientId);

  // hook de rondas de grabacion
  const {roundPhase,suggestedQuestions,previousQuestions,fullTranscript,startRound,stopRound,finalizeRound,error,
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

  const memoryMeta = [
    { label: "Chronic Diseases", data: memory?.chronic_diseases, tone: "blue" as const },
    { label: "Allergies", data: memory?.allergies, tone: "rose" as const },
    { label: "Active Medications", data: memory?.medications, tone: "neutral" as const },
    { label: "Recurrent Symptoms", data: memory?.recurrent_symptoms, tone: "neutral" as const },
  ];

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
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D9488] border border-[#0D9488]/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Questions Ready
          </span>
        )}
      </div>

      {/* memoria del paciente */}
      {memory && (
        <div className="neu-card rounded-2xl bg-blue-50/40 p-5 border border-blue-200/80 space-y-5 transition-all duration-200">
          <div className="flex items-center justify-between border-b border-blue-200/90 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-700" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-blue-950">
                Patient History
              </h3>
            </div>
            <span className="px-3 py-0.5 rounded-full bg-blue-600 border border-blue-700/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              Context
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700/70 block">
                Master Summary
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {memory.master_summary}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700/70 block">
                Follow-Up Strategy
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
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
                  className={`rounded-md p-2.5 space-y-1 shadow-sm transition-shadow duration-200 ${tone.box}`}
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

      {/* step 1: grabacion */}
      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-4 transition-all duration-200">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            1. Consultation Recording
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Step 1 of 3</span>
        </div>

        {/* primera vez, sin rondas previas */}
        {roundPhase === 'idle' && (
          <button
            onClick={startRound}
            className="neu-card bg-rose-600 hover:brightness-110 text-white rounded-xl px-4 py-2 border border-rose-700/60 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
          >
            <Mic className="h-3.5 w-3.5" />
            Start recording
          </button>
        )}

        {/* grabando */}
        {roundPhase === 'recording' && (
          <>
            {/* preguntas de la ronda anterior como referencia */}
            {previousQuestions.length > 0 && (
              <div className="max-h-80 overflow-y-auto rounded-lg bg-[#F5F5F5] p-4 space-y-3 border border-[#E5E5E5]">
                <div className="flex items-center gap-1.5 sticky top-0 bg-[#F5F5F5]/95 backdrop-blur-sm pb-2 -mx-1 px-1">
                  <ListChecks className="h-3.5 w-3.5 text-[#404040]" />
                  <span className="font-display text-[11px] font-bold uppercase tracking-widest text-[#404040]">
                    Questions to address
                  </span>
                </div>
                {previousQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white px-5 py-4 border border-[#E5E5E5] hover:shadow-sm transition-shadow duration-200"
                  >
                    <p className="font-display text-sm font-bold text-foreground leading-snug">{q.question}</p>
                    <p className="text-xs font-medium text-[#404040] leading-relaxed mt-2">{q.reason}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="recording-badge h-4 w-4 rounded-full bg-rose-600 border border-rose-700/60 shrink-0" />
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-rose-600">
                Recording
              </span>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={stopRound}
                className="neu-card bg-slate-500 hover:brightness-110 text-white rounded-xl px-4 py-2 border border-slate-600/60 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause & analyze
              </button>
              <button
                onClick={finalizeRound}
                className="neu-card bg-[#115E59] hover:bg-[#0D9488] text-white rounded-md px-4 py-2 border border-[#0D9488] text-xs font-bold uppercase tracking-wider transition-all duration-200"
              >
                Finalize consultation
              </button>
            </div>
          </>
        )}

        {/* procesando la ronda */}
        {roundPhase === 'analyzing' && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200 animate-pulse">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
            Transcribing and analyzing consultation...
          </div>
        )}

        {/* preguntas sugeridas por la ia */}
        {roundPhase === 'reviewing' && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onContinue={startRound}
            onFinalize={finalizeRound}
          />
        )}

        {error && (
          <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
            {error}
          </p>
        )}
      </div>

      {/* step 2: transcripcion completa */}
      {roundPhase === 'done' && fullTranscript && (
        <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-4 transition-all duration-200">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              2. Audio Transcription
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Step 2 of 3</span>
          </div>

          <div className="bg-muted/60 rounded-lg p-4 border border-border/60 text-xs text-foreground leading-relaxed italic">
            "{fullTranscript.trim()}"
          </div>

          <div className="flex flex-col gap-3">
            {!loadingSummary && !summary && (
              <button
                disabled={loadingSummary}
                onClick={retrySummarize}
                className="neu-card self-start bg-[#115E59] hover:bg-[#0D9488] text-white rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40"
              >
                Generate summary
              </button>
            )}

            {loadingSummary && (
              <div className="flex items-center gap-2.5 text-xs text-[#0D9488] bg-[#F5F5F5] p-3 rounded-lg border border-[#F0FDFA] animate-pulse">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0D9488] border-t-transparent animate-spin" />
                Processing clinical summary...
              </div>
            )}

            {summaryError && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs text-rose-700">{summaryError}</p>
                <button
                  onClick={retrySummarize}
                  className="text-xs font-bold text-rose-700 underline underline-offset-2 hover:text-rose-900 transition-colors shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* step 3: resumen y firma medica */}
      {summary && (
        <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-4 transition-all duration-200">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              3. Summary & Medical Signature
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Step 3 of 3</span>
          </div>

          <EditSummary consultationId={consultationIdNumber} summary={summary} />

          <div className="border-t border-border/80 pt-4">
            {signSuccess ? (
              <SendEmailPatient consultationId={consultationIdNumber} patientId={patientIdNumber} />
            ) : signing ? (
              <div className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground bg-muted/60 p-3 rounded-lg border border-border/60">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />
                Signing and saving consultation...
              </div>
            ) : (
              <button
                onClick={handleSignConsultation}
                className="neu-card w-full sm:w-auto bg-[#0D9488] hover:brightness-110 text-white rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-[#0D9488]/60 transition-all duration-200"
              >
                Sign consultation
              </button>
            )}

            {signError && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mt-3">
                {signError}
              </p>
            )}
          </div>
        </div>
      )}

      <PatientChatWidget patientId={patientIdNumber} />
    </div>
  );
}