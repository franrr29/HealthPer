import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/services/patients.service";
import { Link } from "react-router-dom";
import { calculateAge } from "@/utils/format";
import { UserPlus } from "lucide-react";

// Avatares estáticos según género
const MALE_AVATARS = ["/paciente1.png", "/paciente3.png", "/paciente5.png"];
const FEMALE_AVATARS = ["/paciente2.png", "/paciente4.png"];

// Rota la imagen según el índice del registro
function getPatientAvatar(gender: string, index: number) {
  if (gender === "F") {
    return FEMALE_AVATARS[index % FEMALE_AVATARS.length];
  }
  return MALE_AVATARS[index % MALE_AVATARS.length];
}

export default function Patients() {
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  if (isLoading) {
    return (
      <div className="p-8 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-pulse">
        Loading patients...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-rose-300 bg-rose-50/50 text-destructive text-xs font-semibold rounded-xl flex justify-between items-center neu-surface">
        <span>Error loading patients: {error.message}</span>
        <button
          onClick={() => window.location.reload()}
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="max-w-5xl mx-auto my-4 mb-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            Patients
          </h1>
          <Link
            to="/patients/new"
            className="neu-card inline-flex items-center gap-2 bg-slate-900 text-white rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-border hover:bg-slate-800 transition-all duration-200"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Create New Patient
          </Link>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground py-4">
          No patients found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-4 mb-8 space-y-6 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
            Patients Directory
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
            {patients.length} Registered Patients
          </p>
        </div>
        <Link
          to="/patients/new"
          className="neu-card inline-flex items-center gap-2 bg-slate-900 text-white rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border border-slate-800 hover:brightness-110 transition-all duration-200 shadow-sm"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Create New Patient
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient, index) => (
          <Link
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="neu-card rounded-2xl bg-card p-5 border border-border flex flex-col items-center text-center transition-all duration-200 hover:brightness-95"
          >
            <div className="relative mb-3">
              <img
                src={getPatientAvatar(patient.gender, index)}
                alt={patient.name}
                className="w-16 h-16 rounded-full object-cover neu-surface border border-border/80 p-0.5"
              />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <p className="text-sm font-bold text-foreground tracking-tight mb-4 border-b border-border/80 pb-2.5 w-full truncate">
              {patient.name}
            </p>

            <div className="w-full space-y-2.5 text-left">
              <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Age
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {calculateAge(patient.birth_date)} years
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Gender
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {patient.gender}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Phone
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {patient.phone}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  ID
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {patient.national_id}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}