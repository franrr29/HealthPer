import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatients, getPatientsNeedingFollowUp } from "@/services/patients.service";
import { getDoctorData, getDoctorStats, getTopConditions } from "@/services/doctor.service";
import { getPendingConsultations } from "@/services/consultations.service";
import { DoctorHeader } from "./DoctorHeader";
import { StatsRow } from "./StatsRow";
import { PendingSignatures } from "./PendingSignatures";
import { RecentConsultationsList } from "./RecentConsultationsList";
import { PendingBanner } from "./PendingBanner";
import { PracticeSummary } from "./PracticeSummary";

export default function Dashboard() {

  //datos del doctor
  const { data: doctorData, isLoading: isDoctorLoading, error: doctorError } = useQuery({
    queryKey: ["doctorData"],
    queryFn: getDoctorData,
  });

  //datos estadisticas de pacientes, consultas y demas
  const { data: patients, isLoading: isPatientsLoading, error: patientsError } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  //datos estadisticas de consultas, pacientes y demas
  const { data: doctorStats, isLoading: isDoctorStatsLoading, error: doctorStatsError } = useQuery({
    queryKey: ["doctorStats"],
    queryFn: getDoctorStats,
  });

  //condiciones cronicas y alergias
  const { data: topConditions } = useQuery({
    queryKey: ["topConditions"],
    queryFn: getTopConditions,
  });

  useQuery({
    queryKey: ["patientsNeedingFollowUp"],
    queryFn: getPatientsNeedingFollowUp,
  });

  const { data: pendingConsultations } = useQuery({
    queryKey: ["pendingConsultations"],
    queryFn: getPendingConsultations,
  });

  const location = useLocation();

  useEffect(() => {
    if (location.hash && !isPatientsLoading && !isDoctorLoading && !isDoctorStatsLoading) {
      const el = document.getElementById(location.hash.slice(1));
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location, isPatientsLoading, isDoctorLoading, isDoctorStatsLoading]);

  if (isPatientsLoading || isDoctorLoading || isDoctorStatsLoading) {
    return (
      <div className="p-8 text-sm text-muted-foreground animate-pulse">
        Loading dashboard metrics...
      </div>
    );
  }

  const error = patientsError || doctorError || doctorStatsError;

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-medium flex justify-between items-center">
        <span>Error loading dashboard data: {error.message}</span>
        <button
          onClick={() => window.location.reload()}
          className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-4 mb-8 space-y-8 transition-all duration-300 ease-in-out">
      <DoctorHeader doctorData={doctorData} />

      <PendingBanner count={pendingConsultations?.length ?? 0} />

      <StatsRow
        totalPatients={patients?.length ?? 0}
        totalConsultations={doctorStats?.totalConsultations ?? 0}
        pendingDrafts={doctorStats?.pendingDrafts ?? 0}
      />

      <PendingSignatures consultations={pendingConsultations} />

      <RecentConsultationsList consultations={doctorStats?.recentConsultations} />

      <PracticeSummary topConditions={topConditions} />
    </div>
  );
}
