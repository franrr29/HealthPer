import type { PendingConsultation } from "@/types/consultation";

interface PendingSignaturesProps {
  consultations?: PendingConsultation[];
}

// saca las iniciales de un nombre para el avatar
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function PendingSignatures({ consultations }: PendingSignaturesProps) {
  return (
    <section id="pending-signatures">
      <h2 className="text-lg font-semibold text-foreground mb-3">Pending signatures</h2>
      <div className="neu-card rounded-2xl bg-card border border-border overflow-hidden">
        {consultations?.length === 0 ? (
          <p className="text-sm text-muted-foreground px-6 py-5">No pending signatures</p>
        ) : (
          consultations?.slice(0, 3).map((consultation, i) => (
            <div
              key={consultation.consultation_id}
              className={`px-6 py-4 flex items-center gap-4 ${i === 0 ? "" : "border-t border-border/70"}`}
            >
              <div className="w-9 h-9 rounded-full bg-wc-blue/10 flex items-center justify-center text-wc-blue font-semibold text-xs shrink-0">
                {initials(consultation.patient_name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {consultation.patient_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Waiting for signature</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-wc-blue/10 text-wc-blue shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-wc-blue" />
                Awaiting
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
