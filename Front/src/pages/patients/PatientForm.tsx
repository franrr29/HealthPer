import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import type { PatientFormProps } from "@/types/patient";
import { useCreatePatientMutation, useUpdatePatientMutation } from "@/hooks/usePatientMutation";

const labelClass = "font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5";
const inputClass = "neu-inset w-full px-3 py-2 text-sm bg-card/70 rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50";


//componente de formulario para crear o editar un paciente, recibe un paciente opcional como prop para editarlo:
export function PatientForm({ patient }: PatientFormProps) {

  const [name, setName] = useState(patient?.name || "");
  const [birthDate, setBirthDate] = useState(patient?.birth_date || "");
  const [gender, setGender] = useState(patient?.gender || "U");
  const [nationalId, setNationalId] = useState(patient?.national_id || "");
  const [phone, setPhone] = useState(patient?.phone || "");
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();
  const createPatientMutation = useCreatePatientMutation();
  const updatePatientMutation = useUpdatePatientMutation();

  //agarro el estado de la mutation que corresponda segun si es crear o editar
  const activeMutation = patient ? updatePatientMutation : createPatientMutation;

  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    setSaved(false);

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
      }, {
        onSuccess: () => {
          //aviso que se guardo y despues vuelvo al detalle del paciente
          setSaved(true);
          setTimeout(() => navigate(`/patients/${patient.id}`), 800);
        },
      });


    } else {

      // crear paciente nuevo

      createPatientMutation.mutate({
        name,
        birth_date: birthDate,
        gender,
        national_id: nationalId,
        phone,
      }, {
        onSuccess: (newPatient) => {
          //aviso que se guardo y despues voy al detalle del paciente recien creado
          setSaved(true);
          setTimeout(() => navigate(`/patients/${newPatient.id}`), 800);
        },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="birthDate" className={labelClass}>Birth Date</label>
        <input
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="gender" className={labelClass}>Gender</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as "M" | "F" | "X" | "U")}
          className={inputClass}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="X">Other</option>
          <option value="U">Unspecified</option>
        </select>
      </div>

      <div>
        <label htmlFor="nationalId" className={labelClass}>National ID</label>
        <input
          type="text"
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* si la mutation falla muestro el error */}
      {activeMutation.isError && (
        <p className="font-mono text-xs uppercase tracking-wider text-destructive bg-rose-50 border border-rose-200 rounded-lg p-3">
          Something went wrong while saving. Please try again.
        </p>
      )}

      {/* aviso de exito antes de volver al detalle del paciente */}
      {saved && (
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-navy-elevated"><Check className="h-3 w-3 inline" /> Patient saved</p>
      )}

      <button
        type="submit"
        disabled={activeMutation.isPending || saved}
        className="neu-card w-full bg-primary hover:bg-navy-elevated text-white rounded-md px-4 py-2 border border-navy-elevated text-[11px] font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {activeMutation.isPending ? "Saving..." : saved ? "Saved" : "Save"}
      </button>
    </form>
  );
}
