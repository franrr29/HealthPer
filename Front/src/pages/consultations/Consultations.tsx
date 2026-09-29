import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAllConsultations } from "@/hooks/useAllConsultations";
import { formatShortDate } from "@/lib/utils";
import { ConsultationStatusBadge } from "@/components/common/ConsultationStatusBadge";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "reviewed", label: "Reviewed" },
  { value: "signed", label: "Signed" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

export default function Consultations() {
  const [filter, setFilter] = useState<Filter>("all");

  const { consultations, isLoading, hasPartialError, error } = useAllConsultations();

  const visible = filter === "all" ? consultations : consultations.filter((c) => c.status === filter);

  if (isLoading) {
    return <div className="p-8 text-sm text-muted-foreground animate-pulse">Loading consultations…</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
        Could not load consultations: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto my-4 mb-8 max-w-5xl space-y-6">
      <header className="flex items-baseline gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Consultations</h1>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground tabular-nums">
          {consultations.length}
        </span>
      </header>

      {hasPartialError && (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Some consultations could not be loaded. Reload the page to try again.
        </p>
      )}

      <div role="tablist" aria-label="Filter by status" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          const count = f.value === "all" ? consultations.length : consultations.filter((c) => c.status === f.value).length;
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 touch-manipulation rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-blue focus-visible:ring-offset-2 ${
                isActive
                  ? "border-wc-blue bg-wc-blue text-white"
                  : "border-border bg-card text-muted-foreground hover:border-wc-blue/40 hover:text-foreground"
              }`}
            >
              {f.label} <span className={`tabular-nums ${isActive ? "text-white/80" : "text-muted-foreground"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="neu-card overflow-hidden rounded-2xl border border-border bg-card">
        {visible.length === 0 ? (
          <p className="px-6 py-5 text-sm text-muted-foreground">
            {consultations.length === 0 ? "No consultations yet." : "No consultations with this status."}
          </p>
        ) : (
          visible.map((consultation, i) => (
            <Link
              key={consultation.id}
              to={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
              className={`flex min-w-0 items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wc-blue sm:px-6 ${i === 0 ? "" : "border-t border-border/70"}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{consultation.patient_name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatShortDate(consultation.created_at)}
                </p>
              </div>
              <ConsultationStatusBadge status={consultation.status} />
              <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
