import type { DoctorHeaderProps } from "../../types/doctor";

// muestra datos del doctor de la demo
export function DoctorHeader({ doctorData, pendingCount = 0 }: DoctorHeaderProps) {
  return (
    <div className="neu-card rounded-2xl bg-card border border-border p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/doctor.png"
            alt={doctorData?.name || "Doctor"}
            className="h-14 w-14 rounded-full object-cover shrink-0 border border-border"
          />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-foreground">
              {doctorData?.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {pendingCount > 0 ? (
                <>
                  You have <span className="text-wc-blue font-semibold">{pendingCount} consultations</span> waiting for your signature.
                </>
              ) : (
                "No consultations waiting for your signature."
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="px-3 py-1 rounded-full bg-wc-blue text-white text-xs font-semibold">
            {doctorData?.specialty}
          </span>
          {doctorData?.license && (
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              Reg: {doctorData.license}
            </span>
          )}
          {doctorData?.facility && (
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {doctorData.facility}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
