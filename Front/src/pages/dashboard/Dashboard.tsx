import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatients, getPatientsNeedingFollowUp } from "@/services/patients.service";
import { getDoctorData, getDoctorStats, getTopConditions, getRecentActivities } from "@/services/doctor.service";
import { getPendingConsultations } from "@/services/consultations.service";
import { DoctorHeader } from "./DoctorHeader";
import { HeartPulse, ShieldAlert, Users, FileText, PenLine } from "lucide-react";

const statusPill: Record<string, string> = {
  signed: "bg-emerald-100 text-emerald-700",
  reviewed: "bg-wc-blue/10 text-wc-blue",
  draft: "bg-amber-100 text-amber-700",
};

// saca las iniciales de un nombre para el avatar
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

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

  // total para calcular el porcentaje de cada barra
  const chronicTotal = topConditions?.topChronicDiseases.reduce((s, x) => s + x.patientCount, 0) ?? 0;
  const allergyTotal = topConditions?.topAllergies.reduce((s, x) => s + x.patientCount, 0) ?? 0;

  return (
    <div className="max-w-5xl mx-auto my-4 mb-8 space-y-8 transition-all duration-300 ease-in-out">
      <DoctorHeader doctorData={doctorData} pendingCount={pendingConsultations?.length ?? 0} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="neu-card rounded-2xl bg-card border border-border p-6">
          <div className="w-9 h-9 rounded-xl bg-wc-blue/10 flex items-center justify-center text-wc-blue mb-4">
            <Users className="h-4 w-4" />
          </div>
          <div className="text-3xl font-semibold text-foreground tracking-tight">
            {patients?.length ?? 0}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Patients under care</div>
        </div>

        <div className="neu-card rounded-2xl bg-card border border-border p-6">
          <div className="w-9 h-9 rounded-xl bg-wc-blue/10 flex items-center justify-center text-wc-blue mb-4">
            <FileText className="h-4 w-4" />
          </div>
          <div className="text-3xl font-semibold text-foreground tracking-tight">
            {doctorStats?.totalConsultations ?? 0}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Consultations</div>
        </div>

        <div className="neu-card rounded-2xl bg-gradient-to-b from-wc-blue/[0.06] to-card border border-border p-6">
          <div className="w-9 h-9 rounded-xl bg-wc-blue flex items-center justify-center text-white mb-4">
            <PenLine className="h-4 w-4" />
          </div>
          <div className="text-3xl font-semibold text-wc-blue tracking-tight">
            {doctorStats?.pendingDrafts ?? 0}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Awaiting signature</div>
        </div>
      </div>

      <section id="pending-signatures">
        <h2 className="text-lg font-semibold text-foreground mb-3">Pending signatures</h2>
        <div className="neu-card rounded-2xl bg-card border border-border overflow-hidden">
          {pendingConsultations?.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-5">No pending signatures</p>
          ) : (
            pendingConsultations?.slice(0, 3).map((consultation, i) => (
              <div
                key={consultation.consultation_id}
                className={`px-6 py-4 flex items-center gap-4 ${i === 0 ? "" : "border-t border-border/70"}`}
              >
                <div className="w-9 h-9 rounded-full bg-wc-blue/10 flex items-center justify-center text-wc-blue font-semibold text-xs shrink-0">
                  {initials(consultation.patient_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {consultation.patient_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Waiting for signature</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-wc-blue/10 text-wc-blue shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-wc-blue" />
                  Awaiting
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section id="recent-consultations" className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent consultations</h2>
          <div className="neu-card rounded-2xl bg-card border border-border overflow-hidden">
            {doctorStats?.recentConsultations.length === 0 ? (
              <p className="text-sm text-muted-foreground px-6 py-5">No recent consultations.</p>
            ) : (
              doctorStats?.recentConsultations.map((consultation, i) => (
                <Link
                  key={consultation.id}
                  to={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
                  className={`flex min-w-0 items-center gap-3 px-6 py-4 hover:bg-muted/60 transition-colors ${i === 0 ? "" : "border-t border-border/70"}`}
                >
                  <span
                    className={`h-2 w-2 flex-shrink-0 rounded-full ${
                      consultation.status === "signed" ? "bg-emerald-500" : consultation.status === "reviewed" ? "bg-wc-blue" : "bg-amber-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {consultation.patient_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(consultation.created_at).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusPill[consultation.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {consultation.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section id="recent-activity">
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent activity</h2>
          <div className="neu-card rounded-2xl bg-card border border-border p-6">
            {isRecentActivitiesLoading ? (
              <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
            ) : (
              <div className="relative pl-5">
                <span aria-hidden="true" className="absolute left-1 top-2 bottom-2 w-px bg-border" />
                {recentActivities?.slice(0, 3).map((activity, i, arr) => (
                  <div key={activity.consultation_id} className={`relative ${i === arr.length - 1 ? "" : "pb-5"}`}>
                    <span
                      className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ${
                        i === 0 ? "bg-wc-blue ring-4 ring-wc-blue/15" : "bg-card border-2 border-border"
                      }`}
                    />
                    <p className="text-sm font-semibold text-foreground truncate">
                      {activity.patient_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(activity.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section id="chronic-conditions">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground mb-3">
            <span className="w-7 h-7 rounded-lg bg-wc-blue/10 flex items-center justify-center text-wc-blue">
              <HeartPulse className="h-3.5 w-3.5" />
            </span>
            Chronic conditions
          </h2>
          <div className="neu-card rounded-2xl bg-card border border-border px-6">
            {topConditions?.topChronicDiseases.map((item, i) => (
              <div key={item.condition} className={`flex items-center gap-4 py-4 ${i === 0 ? "" : "border-t border-border/70"}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{item.condition}</div>
                  <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-wc-blue"
                      style={{ width: `${chronicTotal ? Math.round((item.patientCount / chronicTotal) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <div className="text-xl font-semibold text-wc-blue tabular-nums">{item.patientCount}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="allergies">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground mb-3">
            <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
            Reported allergies
          </h2>
          <div className="neu-card rounded-2xl bg-card border border-border px-6">
            {topConditions?.topAllergies.map((item, i) => (
              <div key={item.allergy} className={`flex items-center gap-4 py-4 ${i === 0 ? "" : "border-t border-border/70"}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{item.allergy}</div>
                  <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${allergyTotal ? Math.round((item.patientCount / allergyTotal) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <div className="text-xl font-semibold text-amber-700 tabular-nums">{item.patientCount}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
