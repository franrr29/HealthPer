import { useQuery } from "@tanstack/react-query";
import { getDoctorData, getDoctorStats } from "@/services/doctor.service";
import { getPatients } from "@/services/patients.service";

interface ProfileField {
  label: string;
  value?: string;
}

export default function Settings() {
  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ["doctorData"],
    queryFn: getDoctorData,
  });

  const { data: doctorStats } = useQuery({
    queryKey: ["doctorStats"],
    queryFn: getDoctorStats,
  });

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  if (isLoading) {
    return <div className="p-8 text-sm text-muted-foreground animate-pulse">Loading profile…</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
        Could not load your profile: {error.message}
      </div>
    );
  }

  const memberSince = doctor?.created_at
    ? new Date(doctor.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : undefined;

  // solo se muestran los campos que el backend devuelve
  const fields: ProfileField[] = [
    { label: "Full name", value: doctor?.name },
    { label: "Specialty", value: doctor?.specialty },
    { label: "Email", value: doctor?.email },
    { label: "Registration", value: doctor?.license },
    { label: "Medical center", value: doctor?.facility },
    { label: "Member since", value: memberSince },
  ].filter((f) => Boolean(f.value));

  const stats = [
    { label: "Patients", value: patients?.length },
    { label: "Consultations", value: doctorStats?.totalConsultations },
  ].filter((s) => s.value !== undefined);

  return (
    <div className="mx-auto my-4 mb-8 max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your profile information.</p>
      </header>

      <section aria-labelledby="profile-heading" className="neu-card rounded-2xl border border-border bg-card p-6">
        <h2 id="profile-heading" className="mb-4 text-lg font-semibold text-foreground">Profile</h2>
        <dl className="divide-y divide-border/70">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
              <dt className="text-sm text-muted-foreground sm:w-44 sm:shrink-0">{field.label}</dt>
              <dd className="min-w-0 break-words text-sm font-medium text-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {stats.length > 0 && (
        <section aria-label="Practice totals" className="grid grid-cols-2 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="neu-card rounded-2xl border border-border bg-card p-5">
              <div className="text-2xl font-semibold tabular-nums text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
