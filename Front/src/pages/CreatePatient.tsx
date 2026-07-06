import { PatientForm } from "@/pages/PatientForm";

//unicamente renderiza el formulario de paciente para crear un nuevo paciente
export function CreatePatient() {
  return (
    <div>
      <h1>Create Patient</h1>
      <PatientForm />
    </div>
  );
}