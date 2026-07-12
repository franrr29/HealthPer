import { useParams, Link } from "react-router-dom";
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
        return <div className="p-8 text-muted-foreground">Loading...</div>;
    }

    if (!patient) {
        return <div className="p-8 text-muted-foreground">Patient not found</div>;
    }

    return (
        <div>
            {/* link para volver al detalle del paciente que estoy editando */}
            <Link to={`/patients/${patient.id}`} className="text-sm text-muted-foreground mb-4 inline-block">
                ← Back to patient
            </Link>

            <h1 className="text-2xl font-bold text-foreground mb-6">Edit Patient</h1>

            <div className="bg-card rounded-2xl shadow-md p-6 border border-border w-full max-w-lg">
                <PatientForm patient={patient} />
            </div>
        </div>
    );
}