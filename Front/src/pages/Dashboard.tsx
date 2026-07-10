import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/services/patients.service";
import { getDoctorData } from "@/services/doctor.service";

export default function Dashboard() {

  //datos del doctor:
  const { data: doctorData, isLoading: isDoctorLoading, error: doctorError } = useQuery({
    queryKey: ["doctorData"],
    queryFn: getDoctorData,
  });

  //datos de los pacientes:
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  const initials =
    doctorData?.name
      ?.split(" ")
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "DR";

  if (isLoading || isDoctorLoading) {
    return <div>Loading...</div>;
  }

  if (error || doctorError) {
    return (
      <div>
        Error:{" "}
        {(error || doctorError) instanceof Error
          ? (error || doctorError).message
          : "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] p-6 mb-6">
        <p className="text-sm text-[#718096] mb-4">Welcome back</p>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-lg">
            {initials}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#2D3748]">
              {doctorData?.name}
            </h1>

            <p className="text-[#718096]">
              {doctorData?.specialty}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-[#E2E8F0] w-fit">
        <p className="text-sm font-medium text-[#718096] uppercase tracking-wide mb-1">
          Total patients
        </p>

        <p className="text-2xl font-bold text-[#2D3748]">
          {patients?.length ?? 0}
        </p>
      </div>
    </div>
  );
}