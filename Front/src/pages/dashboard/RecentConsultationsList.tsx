import { Link } from "react-router-dom";
import type { DoctorStats } from "@/types/doctor";

const statusPill: Record<string, string> = {
  signed: "bg-emerald-100 text-emerald-700",
  reviewed: "bg-wc-blue/10 text-wc-blue",
  draft: "bg-amber-100 text-amber-700",
};

interface RecentConsultationsListProps {
  consultations?: DoctorStats["recentConsultations"];
}

export function RecentConsultationsList({ consultations }: RecentConsultationsListProps) {
  return (
    <section id="recent-consultations" className="lg:col-span-2">
      <h2 className="text-lg font-semibold text-foreground mb-3">Recent consultations</h2>
      <div className="neu-card rounded-2xl bg-card border border-border overflow-hidden">
        {consultations?.length === 0 ? (
          <p className="text-sm text-muted-foreground px-6 py-5">No recent consultations.</p>
        ) : (
          consultations?.map((consultation, i) => (
            <Link
              key={consultation.id}
              to={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
              className={`flex min-w-0 items-center gap-3 px-6 py-4 hover:bg-muted/60 transition-colors ${i === 0 ? "" : "border-t border-border/70"}`}
            >
              <span
                className={`h-2 w-2 flex-shrink-0 rounded-full ${
                  consultation.status === "signed" ? "bg-emerald-500" : consultation.status === "reviewed" ? "bg-wc-blue" : "bg-amber-500"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {consultation.patient_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(consultation.created_at).toLocaleDateString("en-US")}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusPill[consultation.status] ?? "bg-slate-100 text-slate-600"}`}>
                {consultation.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
