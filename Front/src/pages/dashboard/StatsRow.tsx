interface StatsRowProps {
  totalPatients: number;
  totalConsultations: number;
  pendingDrafts: number;
}

// tarjetas de estadisticas principales con mayor separacion
export function StatsRow({ totalPatients, totalConsultations, pendingDrafts }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="rounded-2xl border border-slate-100 p-6 shadow-sm/50 transition-all hover:border-slate-200 hover:shadow-sm">
        <h2 className="text-xs font-bold tracking-wide text-slate-400 uppercase mb-3">Total patients</h2>
        <p className="text-4xl font-black tabular-nums text-slate-800">{totalPatients}</p>
      </div>

      <div className="rounded-2xl border border-slate-100 p-6 shadow-sm/50 transition-all hover:border-slate-200 hover:shadow-sm">
        <h2 className="text-xs font-bold tracking-wide text-slate-400 uppercase mb-3">Total consultations</h2>
        <p className="text-4xl font-black tabular-nums text-slate-800">{totalConsultations}</p>
      </div>

      <div className="rounded-2xl border border-slate-100 p-6 shadow-sm/50 transition-all hover:border-slate-200 hover:shadow-sm">
        <h2 className="text-xs font-bold tracking-wide text-slate-400 uppercase mb-3">Pending drafts</h2>
        <p className="text-4xl font-black tabular-nums text-slate-800">{pendingDrafts}</p>
      </div>
    </div>
  );
}
