import { useQuery } from "@tanstack/react-query";
import { getPatientById, getAllConsultations,patientMemory } from "@/services/patients.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/utils/format";
import { useDeletePatientMutation } from "@/hooks/usePatientMutation";
import { createConsultation } from "@/services/consultations.service";


//component que muestra detalles del paciente:
export default function PatientDetails() {

  const { id } = useParams<{ id: string }>();

  const patientId = Number(id);

  //para traer la info del paciente por su id:
  const {data: patient,isLoading,error,} = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: !!id,
  });


  //traer la memoria del paciente por su id y doctor_id, con verificacion de IDOR:
  const {data: memory,isLoading: memoryLoading,error: memoryError,} = useQuery({
    queryKey: ["memory", patientId],
    queryFn: () => patientMemory(patientId),
    enabled: !!id,
  });


  //para eliminar un paciente llamoo al hook de useDeletePatientMutation
  const deleteMutation = useDeletePatientMutation();


  //para navegar a otra pagina despues de eliminar el paciente
  const navigate= useNavigate();

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

  if (consultationsError ) {
    return <div>Error loading consultations</div>;
  }

  if (memoryError) {
    return <div>Error loading memory</div>;
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


       {memory && (

          <div>

            <h3>Patient Memory</h3>

            <p>{memory}</p>

          </div>
        )}


       {consultations && consultations.length > 0 ? (

        <ul>

          {consultations.map((consultation) => (

            <li key={consultation.id}>

              {formatDate(consultation.created_at)} - {consultation.status}


              { consultation.ai_summary && <p>AI Summary: {consultation.ai_summary}</p>}

            
            </li>

          ))}

        </ul>
      ) : (
        <p>No consultations found for this patient.</p>
      )}

      <Link to={`/patients/${patient.id}/edit`}>Edit Patient</Link>

      <button onClick={() => {

        if (window.confirm("Are you sure you want to delete this patient?")) {

          deleteMutation.mutate(patient.id, {
             //navego a patients asi no queda en la pagina de detalles del paciente que ya no existe
            onSuccess: () => {
              navigate("/patients");
            }
          });
          
        } 
      }}>Delete Patient</button>


      
     <button onClick={() => {
      createConsultation(patient.id)
      .then((newConsultation) => {
        //navego a la pagina de la nueva consulta creada
        navigate(`/patients/${patient.id}/consultations/${newConsultation.id}`)
      })
      .catch((error) => {
        console.error("Error creating consultation:", error);
        alert("Error creating consultation");
      });
  }}
>
  Create New Consultation
</button>


    </div>
  );
}