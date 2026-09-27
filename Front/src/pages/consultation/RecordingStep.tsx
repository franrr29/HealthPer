import { Mic, Pause } from "lucide-react";
import SuggestedQuestions from "./SuggestedQuestions";
import PreviousRoundQuestions from "./PreviousRoundQuestions";
import type { RoundPhase } from "./useConsultationRounds";
import type { SuggestedQuestion } from "@/types/suggestedQuestions";

interface RecordingStepProps {
  roundPhase: RoundPhase;
  previousQuestions: SuggestedQuestion[];
  suggestedQuestions: SuggestedQuestion[];
  roundError: string | null;
  error: string | null;
  onStartRound: () => void;
  onStopRound: () => void;
  onFinalizeRound: () => void;
}

export default function RecordingStep({roundPhase,previousQuestions,suggestedQuestions,roundError,error,onStartRound,onStopRound,onFinalizeRound,
}: RecordingStepProps) {

  return (
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
          onClick={onStartRound}
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
          <PreviousRoundQuestions questions={previousQuestions} />

          <div className="flex items-center gap-2">
            <span className="recording-badge h-4 w-4 rounded-full bg-rose-600 border border-rose-700/60 shrink-0" />
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-rose-600">
              Recording
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={onStopRound}
              className="neu-card bg-slate-500 hover:brightness-110 text-white rounded-xl px-4 py-2 border border-slate-600/60 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
            >
              <Pause className="h-3.5 w-3.5" />
              Pause & analyze
            </button>
            <button
              onClick={onFinalizeRound}
              className="neu-card bg-primary hover:bg-navy-elevated text-white rounded-md px-4 py-2 border border-navy-elevated text-xs font-bold uppercase tracking-wider transition-all duration-200"
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

      {roundPhase === 'finalizing' && (
        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200 animate-pulse">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
          Finishing consultation...
        </div>
      )}

      {/* preguntas sugeridas por la ia */}
      {roundPhase === 'reviewing' && (
        <SuggestedQuestions
          questions={suggestedQuestions}
          onContinue={onStartRound}
          onFinalize={onFinalizeRound}
        />
      )}

      {roundError && (
        <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
          {roundError}
        </p>
      )}

      {error && (
        <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
          {error}
        </p>
      )}
    </div>
  );
}
