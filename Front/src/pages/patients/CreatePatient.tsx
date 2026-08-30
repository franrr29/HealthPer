import { Link } from "react-router-dom";
import { PatientForm } from "./PatientForm";

export function CreatePatient() {
  return (
    <div className="max-w-lg mx-auto my-4 mb-8 space-y-6 transition-all duration-300 ease-in-out">
      <Link
        to="/patients"
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block"
      >
        ← Back to patients
      </Link>

      <div className="border-b border-border pb-4">
        <h1 className="font-feature text-2xl font-semibold tracking-tight text-foreground">
          Create Patient
        </h1>
      </div>

      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 transition-all duration-200">
        <PatientForm />
      </div>
    </div>
  );
}