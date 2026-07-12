import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/services/patients.service";
import { Link } from "react-router-dom";
import { calculateAge } from "@/utils/format";

//fotos que hay en la carpeta public, separadas por genero
const fotosHombres = ["/paciente1.png", "/paciente3.png", "/paciente5.png"];
const fotosMujeres = ["/paciente2.png", "/paciente4.png"];

//devuelve una foto segun el genero del paciente, van rotando con el index
function getFotoPaciente(gender: string, index: number) {
    if (gender === "F") {
        return fotosMujeres[index % fotosMujeres.length];
    }
    return fotosHombres[index % fotosHombres.length];
}


export default function Patients() {

    //datos que vienen del backend, isLoading y error son estados de la query
    const { data: patients, isLoading, error } = useQuery({
        queryKey: ["patients"],
        queryFn: getPatients,
    });

    if (isLoading) {
        return <div className="p-8 text-muted-foreground">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-destructive">Error loading patients</div>;
    }

    if (!patients || patients.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">Patients</h1>
                <p className="text-sm text-muted-foreground">No patients found</p>
                <Link to="/patients/new" className="inline-block mt-4 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium">
                    Create New Patient
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Patients</h1>
                <Link to="/patients/new" className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium">
                    Create New Patient
                </Link>
            </div>

            {/* lista de pacientes en fila de 3 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {patients.map((patient, index) => (
                    <Link
                        key={patient.id}
                        to={`/patients/${patient.id}`}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col items-center text-center hover:shadow-md hover:border-primary transition"
                    >
                        {/* foto del paciente segun su genero */}
                        <img
                            src={getFotoPaciente(patient.gender, index)}
                            alt={patient.name}
                            className="w-16 h-16 rounded-full object-cover mb-3"
                        />

                        <p className="text-base text-foreground font-medium mb-3">{patient.name}</p>

                        {/* datos con label a la izquierda para que se distingan del valor */}
                        <div className="w-full flex flex-col gap-1 text-left">
                            <p className="text-sm">
                                <span className="text-muted-foreground">Age: </span>
                                <span className="text-foreground">{calculateAge(patient.birth_date)} years</span>
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Gender: </span>
                                <span className="text-foreground">{patient.gender}</span>
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Phone: </span>
                                <span className="text-foreground">{patient.phone}</span>
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">ID: </span>
                                <span className="text-foreground">{patient.national_id}</span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}