import EditSummary from "./EditSummary";
import SendEmailPatient from "../patients/SendEmailPatient";

interface SummaryAndSignatureStepProps {
  consultationId: number;
  patientId: number;
  summary: string;
  signing: boolean;
  signSuccess: boolean;
  signError: string | null;
  onSign: () => void;
}

export default function SummaryAndSignatureStep({
  consultationId,
  patientId,
  summary,
  signing,
  signSuccess,
  signError,
  onSign,
}: SummaryAndSignatureStepProps) {

  return (
    <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-4 transition-all duration-200">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
          3. Summary & Medical Signature
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Step 3 of 3</span>
      </div>

      <EditSummary consultationId={consultationId} summary={summary} />

      <div className="border-t border-border/80 pt-4">
        {signSuccess ? (
          <SendEmailPatient consultationId={consultationId} patientId={patientId} />
        ) : signing ? (
          <div className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground bg-muted/60 p-3 rounded-lg border border-border/60">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />
            Signing and saving consultation...
          </div>
        ) : (
          <button
            onClick={onSign}
            className="neu-card w-full sm:w-auto bg-navy-elevated hover:brightness-110 text-white rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-navy-elevated/60 transition-all duration-200"
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
  );
}
