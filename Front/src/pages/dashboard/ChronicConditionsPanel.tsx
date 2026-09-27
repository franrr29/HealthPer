import { HeartPulse } from "lucide-react";
import type { TopConditions } from "@/types/doctor";

interface ChronicConditionsPanelProps {
  items?: TopConditions["topChronicDiseases"];
}

export function ChronicConditionsPanel({ items }: ChronicConditionsPanelProps) {

  // total para calcular el porcentaje de cada barra
  const chronicTotal = items?.reduce((s, x) => s + x.patientCount, 0) ?? 0;

  return (
    <section id="chronic-conditions">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground mb-3">
        <span className="w-7 h-7 rounded-lg bg-wc-blue/10 flex items-center justify-center text-wc-blue">
          <HeartPulse className="h-3.5 w-3.5" />
        </span>
        Chronic conditions
      </h2>
      <div className="neu-card rounded-2xl bg-card border border-border px-6">
        {items?.map((item, i) => (
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
  );
}
