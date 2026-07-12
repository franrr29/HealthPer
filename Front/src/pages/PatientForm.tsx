import { useState } from "react";
import type { PatientFormProps } from "@/types/patient";
import { useCreatePatientMutation, useUpdatePatientMutation } from "@/hooks/usePatientMutation";



//componente de formulario para crear o editar un paciente, recibe un paciente opcional como prop para editarlo:
export function PatientForm({ patient }: PatientFormProps) {

  const [name, setName] = useState(patient?.name || "");
  const [birthDate, setBirthDate] = useState(patient?.birth_date || "");
  const [gender, setGender] = useState(patient?.gender || "U");
  const [nationalId, setNationalId] = useState(patient?.national_id || "");
  const [phone, setPhone] = useState(patient?.phone || "");

  const createPatientMutation = useCreatePatientMutation();
  const updatePatientMutation = useUpdatePatientMutation();

  //agarro el estado de la mutation que corresponda segun si es crear o editar
  const activeMutation = patient ? updatePatientMutation : createPatientMutation;

  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (patient) {

      // actualizar paciente existente

      updatePatientMutation.mutate({
       id: patient.id,
         patientData: {
          name,
          birth_date: birthDate,
          gender,
          national_id: nationalId,
          phone,
        }
      });


    } else {

      // crear paciente nuevo

      createPatientMutation.mutate({
        name,
        birth_date: birthDate,
        gender,
        national_id: nationalId,
        phone,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary mt-1"
        />
      </div>

      <div>
        <label htmlFor="birthDate" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Birth Date</label>
        <input
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground focus:outline-none focus:border-primary mt-1"
        />
      </div>

      <div>
        <label htmlFor="gender" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Gender</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground focus:outline-none focus:border-primary mt-1"
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="X">Other</option>
          <option value="U">Unspecified</option>
        </select>
      </div>

      <div>
        <label htmlFor="nationalId" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">National ID</label>
        <input
          type="text"
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary mt-1"
        />
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary mt-1"
        />
      </div>

      {/* si la mutation falla muestro el error */}
      {activeMutation.isError && (
        <p className="text-sm text-destructive">
          Something went wrong while saving. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={activeMutation.isPending}
        className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {activeMutation.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}