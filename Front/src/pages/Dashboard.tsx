import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/services/patients.service";
import { getDoctorData, getDoctorStats } from "@/services/doctor.service";

//mostrar todo el dashboard del doctor con sus datos y estadisticas y pacientes
export default function Dashboard() {

  //datos del doctor:
  const { data: doctorData, isLoading: isDoctorLoading, error: doctorError } = useQuery({
    queryKey: ["doctorData"],
    queryFn: getDoctorData,
  });

  //datos de los pacientes:
  const { data: patients, isLoading: isPatientsLoading, error: patientsError } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  //estadisticas del doctor:
  const { data: doctorStats, isLoading: isDoctorStatsLoading, error: doctorStatsError } = useQuery({
    queryKey: ["doctorStats"],
    queryFn: getDoctorStats,
  });

  if (isPatientsLoading || isDoctorLoading || isDoctorStatsLoading) {
    return <div>Loading...</div>;
  }

  const error = patientsError || doctorError || doctorStatsError;

  if (error) {
     return <div>Error: {error.message}</div>;
    }

  return (
    <div>
      <div className="bg-card rounded-2xl shadow-md border border-border p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-4">Welcome back</p>

        <div className="flex items-center gap-4">
          <img
            src="/doctor.png"
            alt={doctorData?.name || "Doctor"}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {doctorData?.name}
            </h1>

            <p className="text-muted-foreground">
              {doctorData?.specialty}
            </p>
          </div>
        </div>
      </div>

      {/* cards con los numeros del doctor */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <div className="bg-card rounded-2xl shadow-md p-6 border border-border flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Total patients
          </p>

          <p className="text-2xl font-bold text-foreground">
            {patients?.length ?? 0}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-md p-6 border border-border flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Total consultations
          </p>

          <p className="text-2xl font-bold text-foreground">
            {doctorStats?.totalConsultations ?? 0}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-md p-6 border border-border flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Pending drafts
          </p>

          <p className="text-2xl font-bold text-foreground">
            {doctorStats?.pendingDrafts ?? 0}
          </p>
        </div>

      </div>

      {/* ultimas 3 consultas */}
      <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Recent consultations
        </p>

        {doctorStats?.recentConsultations.length === 0 ? (
          <p className="text-muted-foreground">No consultations yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {doctorStats?.recentConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between border border-border rounded-2xl p-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {consultation.patient_name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-sm font-medium text-primary uppercase">
                  {consultation.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}