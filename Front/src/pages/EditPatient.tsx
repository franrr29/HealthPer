import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/services/patients.service";
import { PatientForm } from "./PatientForm";


//componente para editar paciente, saca id y hace query para obtnr datos:
export function EditPatient() {

    const { id } = useParams<{ id: string }>();
    
    const { data: patient, isLoading } = useQuery({
        queryKey: ["patient", id],
        queryFn: () => getPatientById(Number(id)),
        //evitar query si no hay id
        enabled: !!id,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!patient) {
        return <div>Patient not found</div>;
    }

    return (
        <div>
            <h1>Edit Patient</h1>
            <PatientForm patient={patient} />
        </div>
    );
}