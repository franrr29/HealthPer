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
        return <div className="p-8 text-[#718096]">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error loading patients</div>;
    }

    if (!patients || patients.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-[#2D3748] mb-6">Patients</h1>
                <p className="text-sm text-[#718096]">No patients found</p>
                <Link to="/patients/new" className="inline-block mt-4 bg-[#3B9ECF] text-white rounded-xl px-5 py-2.5 shadow-sm font-medium">
                    Create New Patient
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#2D3748]">Patients</h1>
                <Link to="/patients/new" className="bg-[#3B9ECF] text-white rounded-xl px-5 py-2.5 shadow-sm font-medium">
                    Create New Patient
                </Link>
            </div>

            {/* lista de pacientes */}
            {patients.map((patient) => (
                <div key={patient.id} className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm mb-3">
                    <Link to={`/patients/${patient.id}`}>
                        <p className="text-base text-[#2D3748] font-medium">{patient.name}</p>
                        <p className="text-sm text-[#718096]">{formatDate(patient.birth_date)}</p>
                        <p className="text-sm text-[#718096]">{patient.phone}</p>
                        <p className="text-sm text-[#718096]">{patient.gender} — {patient.national_id}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}