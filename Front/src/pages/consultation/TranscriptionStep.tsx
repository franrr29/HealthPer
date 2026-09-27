interface TranscriptionStepProps {
  fullTranscript: string;
  summary: string | null;
  loadingSummary: boolean;
  summaryError: string | null;
  onRetrySummarize: () => void;
}

export default function TranscriptionStep({
  fullTranscript,
  summary,
  loadingSummary,
  summaryError,
  onRetrySummarize,
}: TranscriptionStepProps) {

  return (
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
            onClick={onRetrySummarize}
            className="neu-card self-start bg-primary hover:bg-navy-elevated text-white rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40"
          >
            Generate summary
          </button>
        )}

        {loadingSummary && (
          <div className="flex items-center gap-2.5 text-xs text-navy-elevated bg-muted p-3 rounded-lg border border-accent animate-pulse">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-navy-elevated border-t-transparent animate-spin" />
            Processing clinical summary...
          </div>
        )}

        {summaryError && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p className="text-xs text-rose-700">{summaryError}</p>
            <button
              onClick={onRetrySummarize}
              className="text-xs font-bold text-rose-700 underline underline-offset-2 hover:text-rose-900 transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
