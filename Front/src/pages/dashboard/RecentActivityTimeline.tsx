import type { RecentActivity } from "@/types/doctor";

interface RecentActivityTimelineProps {
  activities?: RecentActivity[];
  isLoading: boolean;
}

export function RecentActivityTimeline({ activities, isLoading }: RecentActivityTimelineProps) {
  return (
    <section id="recent-activity">
      <h2 className="text-lg font-semibold text-foreground mb-3">Recent activity</h2>
      <div className="neu-card rounded-2xl bg-card border border-border p-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
        ) : (
          <div className="relative pl-5">
            <span aria-hidden="true" className="absolute left-1 top-2 bottom-2 w-px bg-border" />
            {activities?.slice(0, 3).map((activity, i, arr) => (
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
  );
}
