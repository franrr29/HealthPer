import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatients, getPatientsNeedingFollowUp } from "@/services/patients.service";
import { getDoctorData, getDoctorStats, getTopConditions, getRecentActivities } from "@/services/doctor.service";
import { getPendingConsultations } from "@/services/consultations.service";
import { DoctorHeader } from "./DoctorHeader";
import { HeartPulse, ShieldAlert } from "lucide-react";

const statusStyles: Record<string, { text: string; bg: string; dot: string }> = {
  signed: { text: "text-white", bg: "bg-emerald-600 border-emerald-700/60", dot: "bg-emerald-300" },
  reviewed: { text: "text-white", bg: "bg-blue-600 border-blue-700/60", dot: "bg-blue-300" },
  draft: { text: "text-slate-950", bg: "bg-amber-400 border-amber-500/60", dot: "bg-amber-900" },
};

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

  const { data: recentActivities, isLoading: isRecentActivitiesLoading } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: getRecentActivities,
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
      <div className="p-8 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-pulse">
        Loading dashboard metrics...
      </div>
    );
  }

  const error = patientsError || doctorError || doctorStatsError;

  if (error) {
    return (
      <div className="p-6 border border-rose-300 bg-rose-50/50 text-destructive text-xs font-semibold rounded-xl flex justify-between items-center neu-surface">
        <span>Error loading dashboard data: {error.message}</span>
        <button
          onClick={() => window.location.reload()}
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-4 mb-8 space-y-6 transition-all duration-300 ease-in-out">
      <DoctorHeader doctorData={doctorData} />

      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 transition-all duration-200">
        <div className="grid grid-cols-3 divide-x divide-border/80 text-center">
          <div className="space-y-1">
            <span className="block text-3xl font-bold text-foreground tracking-tight">
              {patients?.length ?? 0}
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
              Total Patients
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl font-bold text-foreground tracking-tight">
              {doctorStats?.totalConsultations ?? 0}
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
              Consultations
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl font-bold text-amber-600 tracking-tight">
              {doctorStats?.pendingDrafts ?? 0}
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600/80 block">
              Pending Drafts
            </span>
          </div>
        </div>
      </div>

      <div
        id="pending-signatures"
        className="neu-card rounded-2xl bg-amber-50/40 p-5 border border-amber-300/80 space-y-5 transition-all duration-200"
      >
        <div className="flex items-center justify-between border-b border-amber-200/90 pb-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-amber-950">
            Pending Signatures
          </h3>
          <span className="px-3 py-1 rounded-full bg-amber-400 border border-amber-500/80 text-amber-950 font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
            {pendingConsultations?.length ?? 0}
          </span>
        </div>

        {pendingConsultations?.length === 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-wider text-amber-800/80 py-2">
            No pending signatures 🎉
          </p>
        ) : (
          <ul className="space-y-3">
            {pendingConsultations?.slice(0, 3).map((consultation) => (
              <li
                key={consultation.consultation_id}
                className="rounded-xl overflow-hidden neu-surface border border-amber-200/80 transition-all duration-150"
              >
                <div className="bg-card/80 p-4 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {consultation.patient_name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                      Waiting for signature
                    </p>
                  </div>
                </div>
                <div className="bg-amber-400/90 border-t border-amber-500/30 px-4 py-1.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-slate-950">
                  Pending
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          id="recent-consultations"
          className="lg:col-span-2 neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-5 transition-all duration-200"
        >
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground border-b border-border/80 pb-3">
            Recent Consultations
          </h3>

          {doctorStats?.recentConsultations.length === 0 ? (
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground py-2">
              No recent consultations.
            </p>
          ) : (
            <ul className="space-y-3">
              {doctorStats?.recentConsultations.map((consultation) => (
                <li key={consultation.id}>
                  <Link
                    to={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
                    className="block rounded-xl overflow-hidden neu-surface border border-border/80 hover:brightness-95 transition-all duration-150"
                  >
                    <div className="p-4 flex min-w-0 items-center gap-3">
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${
                          statusStyles[consultation.status]?.dot ?? "bg-slate-300"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {consultation.patient_name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                          {new Date(consultation.created_at).toLocaleDateString("en-US")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-1.5 border-t font-mono text-[9px] font-extrabold uppercase tracking-widest ${
                        statusStyles[consultation.status]?.bg ?? "bg-slate-800 border-slate-900"
                      } ${statusStyles[consultation.status]?.text ?? "text-white"}`}
                    >
                      {consultation.status}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          id="recent-activity"
          className="neu-card rounded-2xl bg-card p-5 border border-border/80 space-y-5 transition-all duration-200"
        >
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground border-b border-border/80 pb-3">
            Recent Activity
          </h3>

          {isRecentActivitiesLoading ? (
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground animate-pulse py-2">
              Loading...
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivities?.slice(0, 3).map((activity) => (
                <li
                  key={activity.consultation_id}
                  className="rounded-xl overflow-hidden neu-surface border border-border/80 transition-all duration-150"
                >
                  <div className="p-3 flex justify-between items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {activity.patient_name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                      {new Date(activity.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1.5 border-t font-mono text-[9px] font-extrabold uppercase tracking-widest ${
                      statusStyles[activity.status]?.bg ?? "bg-slate-800 border-slate-900"
                    } ${statusStyles[activity.status]?.text ?? "text-white"}`}
                  >
                    {activity.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          id="chronic-conditions"
          className="neu-card rounded-2xl bg-blue-50/40 p-5 border border-blue-200/80 space-y-5 transition-all duration-200"
        >
          <div className="flex justify-between items-center border-b border-blue-200/90 pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-blue-700" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-blue-950">
                Chronic Conditions
              </h3>
            </div>
            <span className="px-3 py-0.5 rounded-full bg-blue-600 border border-blue-700/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              {topConditions?.topChronicDiseases.length ?? 0}
            </span>
          </div>

          <ul className="divide-y divide-blue-200/70">
            {topConditions?.topChronicDiseases.map((item) => (
              <li
                key={item.condition}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    {item.condition}
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-700 tabular-nums">
                  {item.patientCount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="allergies"
          className="neu-card rounded-2xl bg-rose-50/40 p-5 border border-rose-200/80 space-y-5 transition-all duration-200"
        >
          <div className="flex justify-between items-center border-b border-rose-200/90 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-700" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-rose-950">
                Reported Allergies
              </h3>
            </div>
            <span className="px-3 py-0.5 rounded-full bg-rose-600 border border-rose-700/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              {topConditions?.topAllergies.length ?? 0}
            </span>
          </div>

          <ul className="divide-y divide-rose-200/70">
            {topConditions?.topAllergies.map((item) => (
              <li
                key={item.allergy}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-rose-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    {item.allergy}
                  </span>
                </div>
                <span className="text-lg font-bold text-rose-700 tabular-nums">
                  {item.patientCount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}