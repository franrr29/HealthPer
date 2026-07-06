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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <br />
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="birthDate">Birth Date</label>
        <br />
        <input
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="gender">Gender</label>
        <br />
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="X">Other</option>
          <option value="U">Unspecified</option>
        </select>
      </div>

      <br />

      <div>
        <label htmlFor="nationalId">National ID</label>
        <br />
        <input
          type="text"
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="phone">Phone</label>
        <br />
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <br />

      <button type="submit">Save</button>
    </form>
  );
}