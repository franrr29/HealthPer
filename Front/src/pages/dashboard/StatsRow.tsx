import { FileText, PenLine, Users } from "lucide-react";

interface StatsRowProps {
  totalPatients: number;
  totalConsultations: number;
  pendingDrafts: number;
}

export function StatsRow({ totalPatients, totalConsultations, pendingDrafts }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="neu-card rounded-2xl bg-card border border-border p-6">
        <div className="w-9 h-9 rounded-xl bg-wc-blue/10 flex items-center justify-center text-wc-blue mb-4">
          <Users className="h-4 w-4" />
        </div>
        <div className="text-3xl font-semibold text-foreground tracking-tight">
          {totalPatients}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Patients under care</div>
      </div>

      <div className="neu-card rounded-2xl bg-card border border-border p-6">
        <div className="w-9 h-9 rounded-xl bg-wc-blue/10 flex items-center justify-center text-wc-blue mb-4">
          <FileText className="h-4 w-4" />
        </div>
        <div className="text-3xl font-semibold text-foreground tracking-tight">
          {totalConsultations}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Consultations</div>
      </div>

      <div className="neu-card rounded-2xl bg-gradient-to-b from-wc-blue/[0.06] to-card border border-border p-6">
        <div className="w-9 h-9 rounded-xl bg-wc-blue flex items-center justify-center text-white mb-4">
          <PenLine className="h-4 w-4" />
        </div>
        <div className="text-3xl font-semibold text-wc-blue tracking-tight">
          {pendingDrafts}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Awaiting signature</div>
      </div>
    </div>
  );
}
