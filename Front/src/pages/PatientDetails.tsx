import { useQuery } from "@tanstack/react-query";
import { getPatientById, getAllConsultations } from "@/services/patients.service";
import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/format";

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();

  const patientId = Number(id);

  //para traer la info del paciente por su id:
  const {data: patient,isLoading,error,
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: !!id,
  });

  //para traer todas las consultas del paciente por su id:
  const {data: consultations,isLoading: consultationsLoading,error: consultationsError,} = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: () => getAllConsultations(patientId),
    enabled: !!id,
  });

  if (isLoading || consultationsLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading patient details</div>;
  }

  if (consultationsError) {
    return <div>Error loading consultations</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div>
      <h1>Patient: {patient.name}</h1>
      <p>Gender: {patient.gender}</p>
      <p>Birth Date: {formatDate(patient.birth_date)}</p>
      <p>National ID: {patient.national_id}</p>
      <p>Phone: {patient.phone}</p>

      <h2>Consultations</h2>
       {consultations && consultations.length > 0 ? (
        <ul>
          {consultations.map((consultation) => (
            <li key={consultation.id}>
              {formatDate(consultation.created_at)} - {consultation.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No consultations found for this patient.</p>
      )}
    </div>
  );
}