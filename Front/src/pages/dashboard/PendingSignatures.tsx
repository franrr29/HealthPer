import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
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

function formatWaiting(hours: number) {
  if (hours < 1) return "less than 1 hour";
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"}`;
}

const statusLabel: Record<string, string> = { draft: "Draft", reviewed: "Reviewed" };

export function PendingSignatures({ consultations }: PendingSignaturesProps) {
  const count = consultations?.length ?? 0;

  return (
    <section id="pending-signatures" className="scroll-mt-6">
      <h2 className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-foreground">
        Pending signatures
        {count > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 tabular-nums">{count}</span>
        )}
      </h2>
      <div className="neu-card overflow-hidden rounded-2xl border border-border border-l-4 border-l-wc-blue bg-card">
        {count === 0 ? (
          <p className="flex items-center gap-2.5 px-6 py-5 text-sm text-muted-foreground">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-600" />
            You&apos;re all caught up. No consultations are waiting for your signature.
          </p>
        ) : (
          consultations?.map((consultation, i) => (
            <div
              key={consultation.consultation_id}
              className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 ${i === 0 ? "" : "border-t border-border/70"}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wc-blue/10 text-xs font-semibold text-wc-blue">
                  {initials(consultation.patient_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{consultation.patient_name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Consultation on {formatShortDate(consultation.created_at)}
                    {" · "}waiting {formatWaiting(consultation.hours_pending)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {statusLabel[consultation.status] ?? "Pending"}
                </span>
                <Link
                  to={`/patients/${consultation.patient_id}/consultations/${consultation.consultation_id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-wc-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-wc-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-blue focus-visible:ring-offset-2"
                >
                  Review &amp; Sign
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
