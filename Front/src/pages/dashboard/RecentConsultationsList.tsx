import { Link } from "react-router-dom";
import { ConsultationStatusBadge } from "@/components/common/ConsultationStatusBadge";
import { formatShortDate } from "@/lib/utils";
import type { DoctorStats } from "@/types/doctor";

const MAX_RECENT = 5;

interface RecentConsultationsListProps {
  consultations?: DoctorStats["recentConsultations"];
}

export function RecentConsultationsList({ consultations }: RecentConsultationsListProps) {
  return (
    <section id="recent-consultations">
      <h2 className="text-lg font-semibold text-foreground mb-3">Recent consultations</h2>
      <div className="neu-card rounded-2xl bg-card border border-border overflow-hidden">
        {!consultations?.length ? (
          <p className="text-sm text-muted-foreground px-6 py-5">No recent consultations.</p>
        ) : (
          consultations.slice(0, MAX_RECENT).map((consultation, i) => (
            <Link
              key={consultation.id}
              to={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
              className={`flex min-w-0 items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wc-blue sm:px-6 ${i === 0 ? "" : "border-t border-border/70"}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{consultation.patient_name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatShortDate(consultation.created_at)}
                </p>
              </div>
              <ConsultationStatusBadge status={consultation.status} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
