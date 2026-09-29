import { FileText, PenLine, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsRowProps {
  totalPatients: number;
  totalConsultations: number;
  pendingDrafts: number;
}

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  hint: string;
  highlight?: boolean;
}

function StatCard({ icon: Icon, value, label, hint, highlight }: StatCardProps) {
  return (
    <div
      className={`neu-card rounded-2xl border border-border p-6 ${
        highlight ? "bg-gradient-to-b from-wc-blue/[0.06] to-card" : "bg-card"
      }`}
    >
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${
          highlight ? "bg-wc-blue text-white" : "bg-wc-blue/10 text-wc-blue"
        }`}
      >
        <Icon aria-hidden="true" className="h-4 w-4" />
      </div>
      <div className={`text-3xl font-semibold tracking-tight tabular-nums ${highlight ? "text-wc-blue" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

export function StatsRow({ totalPatients, totalConsultations, pendingDrafts }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard icon={Users} value={totalPatients} label="Patients" hint="Under your care" />
      <StatCard icon={FileText} value={totalConsultations} label="Consultations" hint="Total, all time" />
      <StatCard icon={PenLine} value={pendingDrafts} label="Awaiting signature" hint="Not yet signed" highlight />
    </div>
  );
}
