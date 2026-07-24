import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/services/patients.service";
import { PatientForm } from "./PatientForm";


// componente editar paciente, saca id y busca datos
export function EditPatient() {

    const { id } = useParams<{ id: string }>();

    const { data: patient, isLoading } = useQuery({
        queryKey: ["patient", id],
        queryFn: () => getPatientById(Number(id)),
        // no ejecuta si no hay id
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="p-8 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-pulse">
                Loading patient...
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Patient not found
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto my-4 mb-8 space-y-6 transition-all duration-300 ease-in-out">
            {/* volver al detalle del paciente */}
            <Link
                to={`/patients/${patient.id}`}
                className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block"
            >
                ← Back to patient
            </Link>

            <div className="border-b border-border pb-4">
                <h1 className="font-display text-2xl font-bold tracking-tight text-black">Edit Patient</h1>
            </div>

            <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 transition-all duration-200">
                <PatientForm patient={patient} />
            </div>
        </div>
    );
}