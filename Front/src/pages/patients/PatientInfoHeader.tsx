import { Link } from "react-router-dom";
import type { Patient } from "@/types/patient";
import { formatDate } from "@/utils/format";

interface PatientInfoHeaderProps {
  patient: Patient;
  onDeleteClick: () => void;
}

export function PatientInfoHeader({ patient, onDeleteClick }: PatientInfoHeaderProps) {

  const patientDetails = [
    { label: "Gender", value: patient.gender },
    { label: "Birth Date", value: formatDate(patient.birth_date) },
    { label: "National ID", value: patient.national_id },
    { label: "Phone Number", value: patient.phone },
  ];

  return (
    <>
      <Link
        to="/patients"
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block"
      >
        ← Back to registry index
      </Link>

      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="font-feature text-2xl font-semibold tracking-tight text-foreground">
          {patient.name}
        </h1>
        <div className="flex gap-2">
          <Link
            to={`/patients/${patient.id}/edit`}
            className="neu-card inline-flex items-center gap-2 bg-card text-foreground rounded-xl px-4 py-2 border border-border text-[11px] font-bold uppercase tracking-wider hover:brightness-95 transition-all duration-200"
          >
            Edit Profile
          </Link>
          <button
            onClick={onDeleteClick}
            className="neu-card inline-flex items-center gap-2 bg-rose-600 text-white rounded-xl px-4 py-2 border border-rose-700/60 text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 transition-all duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {patientDetails.map((item) => (
            <div key={item.label} className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                {item.label}
              </span>
              <span className="text-sm font-medium text-foreground block">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
