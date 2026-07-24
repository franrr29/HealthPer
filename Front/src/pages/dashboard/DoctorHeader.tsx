import type { DoctorHeaderProps } from "../../types/doctor";

// Mostrar datos del doctor de la demo
export function DoctorHeader({ doctorData }: DoctorHeaderProps) {
  return (
    <div className="neu-card rounded-2xl bg-card p-5 border border-border/100 transition-all duration-200">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="neu-inset rounded-full p-1 border border-border/60 shrink-0">
            <img
              src="/doctor.png"
              alt={doctorData?.name || "Doctor"}
              className="h-14 w-14 rounded-full object-cover shrink-0"
            />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Recruiter 
            </p>
            <h1 className="text-lg font-extrabold tracking-tight text-foreground">
              {doctorData?.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white border border-blue-700/50 font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
            {doctorData?.specialty}
          </span>
          {doctorData?.license && (
            <span className="px-3 py-1 rounded-full neu-surface border border-border/80 text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-widest">
              Reg: {doctorData.license}
            </span>
          )}
          {doctorData?.facility && (
            <span className="px-3 py-1 rounded-full neu-surface border border-border/80 text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-widest">
              {doctorData.facility}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}