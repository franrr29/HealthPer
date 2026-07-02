import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/services/patients.service";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/format";


//el tipado viene de patient.ts desde el service y se propaga a todo el componente
export default function Patients() {

    //datos que vienen del backend, isLoading y error son estados de la query
    const { data: patients, isLoading, error } = useQuery({
        queryKey: ["patients"],
        queryFn: getPatients,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading patients</div>;
    }

    if (!patients || patients.length === 0) {
        return <div>No patients found</div>;
    }

    return (
        <div>
            <h1>Patients</h1>
            {patients.map((patient) => (
                <div key={patient.id}>
                    <Link to={`/patients/${patient.id}`}>
                        <p>{patient.name}</p>
                        <p>{formatDate(patient.birth_date)}</p>
                        <p>{patient.phone}</p>
                        <p>{patient.gender}</p>
                        <p>{patient.national_id}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}