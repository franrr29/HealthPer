import { PatientForm } from "@/pages/PatientForm";
import { Link } from "react-router-dom";

//unicamente renderiza el formulario de paciente para crear un nuevo paciente
export function CreatePatient() {
  return (
    <div>
      {/* link para volver a la lista de pacientes */}
      <Link to="/patients" className="text-sm text-muted-foreground mb-4 inline-block">
        ← Back to patients
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Create Patient</h1>

      <div className="bg-card rounded-2xl shadow-md p-6 border border-border max-w-lg">
        <PatientForm />
      </div>
    </div>
  );
}