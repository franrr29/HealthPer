import { formatDate } from "@/utils/format";
import type { Consultation } from "@/types/consultation";

interface ConsultationHistoryListProps {
  consultations?: Consultation[];
  createError: string | null;
  onCreateConsultation: () => void;
}

export function ConsultationHistoryList({
  consultations,
  createError,
  onCreateConsultation,
}: ConsultationHistoryListProps) {

  return (
    <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-5 transition-all duration-200">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
          Consultations
        </h3>
        <button
          onClick={onCreateConsultation}
          className="neu-card inline-flex items-center gap-2 bg-primary text-white rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-navy-elevated hover:bg-navy-elevated transition-all duration-200"
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
                    ? "bg-navy-elevated border-navy-elevated/60 text-white"
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
          No consultations yet.
        </p>
      )}
    </div>
  );
}
