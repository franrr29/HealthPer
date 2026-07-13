import { useQuery } from "@tanstack/react-query";
import { getPatientById, getAllConsultations, patientMemory } from "@/services/patients.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/utils/format";
import { useDeletePatientMutation } from "@/hooks/usePatientMutation";
import { createConsultation } from "@/services/consultations.service";
import { useState } from "react";
import PatientChatWidget from "./ChatPatientMessage";


//component que muestra detalles del paciente:
export default function PatientDetails() {

  const { id } = useParams<{ id: string }>();

  const patientId = Number(id);

  //controla si se muestra el modal de confirmacion de borrado
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //error al crear una consulta nueva
  const [createError, setCreateError] = useState<string | null>(null);


  //para traer la info del paciente por su id:
  const {data: patient,isLoading,error,} = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: !!id,
  });


  //traer la memoria del paciente por su id y doctor_id, con verificacion de IDOR:
  const {data: memory,error: memoryError,} = useQuery({
    queryKey: ["memory", patientId],
    queryFn: () => patientMemory(patientId),
    enabled: !!id,
  });



  //para eliminar un paciente llamoo al hook de usedeletepatientMut
  const deleteMutation = useDeletePatientMutation();


  //para navegar a otra pagina despues de eliminar el paciente
  const navigate= useNavigate();

  //para traer todas las consultas del paciente por su id:
  const {data: consultations,isLoading: consultationsLoading,error: consultationsError,} = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: () => getAllConsultations(patientId),
    enabled: !!id,
  });


  //borra el paciente y navega a la lista
  function handleDelete() {
    deleteMutation.mutate(patient!.id, {
      onSuccess: () => {
        navigate("/patients");
      }
    });
  }

  //crea una consulta nueva y navega a su flujo
  function handleCreateConsultation() {
    setCreateError(null);
    createConsultation(patient!.id)
      .then((newConsultation) => {
        navigate(`/patients/${patient!.id}/consultations/${newConsultation.id}`);
      })
      .catch((error) => {
        console.error("Error creating consultation:", error);
        setCreateError("Error creating consultation");
      });
  }

  if (isLoading || consultationsLoading) {
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-destructive">Error loading patient details</div>;
  }

  if (consultationsError ) {
    return <div className="p-8 text-destructive">Error loading consultations</div>;
  }

  if (memoryError) {
    return <div className="p-8 text-destructive">Error loading memory</div>;
  }

  if (!patient) {
    return <div className="p-8 text-muted-foreground">Patient not found</div>;
  }

  return (
    <div>
      {/* link para volver a la lista */}
      <Link to="/patients" className="text-sm text-muted-foreground mb-4 inline-block">
        ← Back to patients
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
        <div className="flex gap-3">
          <Link to={`/patients/${patient.id}/edit`} className="bg-card text-foreground rounded-xl px-5 py-2.5 border border-border shadow-sm font-medium">
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-destructive text-white rounded-xl px-5 py-2.5 shadow-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {/* datos del paciente */}
      <div className="bg-card rounded-2xl shadow-md p-6 border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Gender</p>
            <p className="text-base text-foreground">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Birth Date</p>
            <p className="text-base text-foreground">{formatDate(patient.birth_date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">National ID</p>
            <p className="text-base text-foreground">{patient.national_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
            <p className="text-base text-foreground">{patient.phone}</p>
          </div>
        </div>
      </div>

      {/* memoria del paciente */}
      {memory && (
        <div className="bg-card rounded-2xl shadow-md p-6 border border-border mb-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Patient Memory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Summary</p>
              <p className="text-base text-foreground">{memory.master_summary?.summary}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Follow Up</p>
              <p className="text-base text-foreground">{memory.master_summary?.follow_up}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Chronic Diseases</p>
              <p className="text-base text-foreground">{memory.chronic_diseases?.join(", ") || "None"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Allergies</p>
              <p className="text-base text-foreground">{memory.allergies?.join(", ") || "None"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Medications</p>
              <p className="text-base text-foreground">{memory.medications?.join(", ") || "None"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Recurrent Symptoms</p>
              <p className="text-base text-foreground">{memory.recurrent_symptoms?.join(", ") || "None"}</p>
            </div>
          </div>
        </div>
      )}

      {/* consultas */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Consultations</h2>
        <button
          onClick={handleCreateConsultation}
          className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium"
        >
          New Consultation
        </button>
      </div>

      {createError && <p className="text-sm text-destructive mb-3">{createError}</p>}

      {consultations && consultations.length > 0 ? (
        <ul>
          {consultations.map((consultation) => (
            <li key={consultation.id} className="bg-card rounded-xl p-4 border border-border shadow-sm mb-3">
              <p className="text-sm text-muted-foreground">{formatDate(consultation.created_at)}</p>
              <p className={`text-sm font-medium ${consultation.status === "signed" ? "text-green-600" : "text-yellow-600"}`}>
                {consultation.status}
              </p>
              {consultation.ai_summary && <p className="text-base text-foreground mt-1">{consultation.ai_summary.summary}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No consultations found for this patient.</p>
      )}

      {/* modal de confirmacion para borrar paciente */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-md p-6 border border-border w-full max-w-sm">
            <h3 className="text-lg font-bold text-foreground mb-2">Delete patient</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete {patient.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}
                className="bg-card text-foreground rounded-xl px-5 py-2.5 border border-border shadow-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-white rounded-xl px-5 py-2.5 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <PatientChatWidget patientId={patient.id} />
      </div>
        );
      }