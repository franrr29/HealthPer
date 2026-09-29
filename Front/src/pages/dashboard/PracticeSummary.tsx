import { ChevronDown } from "lucide-react";
import type { TopConditions } from "@/types/doctor";
import { ChronicConditionsPanel } from "./ChronicConditionsPanel";
import { AllergiesPanel } from "./AllergiesPanel";

interface PracticeSummaryProps {
  topConditions?: TopConditions;
}

export function PracticeSummary({ topConditions }: PracticeSummaryProps) {
  return (
    <details id="practice-summary" className="group neu-card rounded-2xl border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-blue [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-lg font-semibold text-foreground">Practice summary</span>
          <span className="block text-sm text-muted-foreground">Most frequent chronic conditions and reported allergies across your patients</span>
        </span>
        <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
        <ChronicConditionsPanel items={topConditions?.topChronicDiseases} />
        <AllergiesPanel items={topConditions?.topAllergies} />
      </div>
    </details>
  );
}
