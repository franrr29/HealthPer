import type { DoctorHeaderProps } from "../../types/doctor";

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 19) return "Good afternoon";
  return "Good evening";
}

// muestra datos del doctor de la demo
export function DoctorHeader({ doctorData }: DoctorHeaderProps) {
  return (
    <div className="neu-card rounded-2xl bg-card border border-border p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/doctor.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover shrink-0 border border-border"
          />
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground [text-wrap:balance]">
              {doctorData?.name}
            </h1>
            {doctorData?.specialty && (
              <p className="mt-0.5 text-sm font-medium text-wc-blue">{doctorData.specialty}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
