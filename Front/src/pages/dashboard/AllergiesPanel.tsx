import { ShieldAlert } from "lucide-react";
import type { TopConditions } from "@/types/doctor";

interface AllergiesPanelProps {
  items?: TopConditions["topAllergies"];
}

export function AllergiesPanel({ items }: AllergiesPanelProps) {

  // total para calcular el porcentaje de cada barra
  const allergyTotal = items?.reduce((s, x) => s + x.patientCount, 0) ?? 0;

  return (
    <section id="allergies">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground mb-3">
        <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
          <ShieldAlert className="h-3.5 w-3.5" />
        </span>
        Reported allergies
      </h2>
      <div className="neu-card rounded-2xl bg-card border border-border px-6">
        {items?.map((item, i) => (
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
  );
}
