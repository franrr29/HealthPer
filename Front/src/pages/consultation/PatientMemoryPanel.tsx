import { Brain } from "lucide-react";

const memoryToneStyles = {
  blue: { box: "bg-blue-100/90 border border-blue-300/80", label: "text-blue-700", value: "text-blue-950" },
  rose: { box: "bg-rose-100/90 border border-rose-300/80", label: "text-rose-700", value: "text-rose-950" },
  neutral: { box: "bg-card/70 border border-border/60", label: "text-muted-foreground", value: "text-foreground" },
};

interface PatientMemoryPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memory: any;
}

export default function PatientMemoryPanel({ memory }: PatientMemoryPanelProps) {

  const memoryMeta = [
    { label: "Chronic Diseases", data: memory?.chronic_diseases, tone: "blue" as const },
    { label: "Allergies", data: memory?.allergies, tone: "rose" as const },
    { label: "Active Medications", data: memory?.medications, tone: "neutral" as const },
    { label: "Recurrent Symptoms", data: memory?.recurrent_symptoms, tone: "neutral" as const },
  ];

  return (
    <div className="neu-card rounded-2xl bg-blue-50/40 p-5 border border-blue-200/80 space-y-5 transition-all duration-200">
      <div className="flex items-center justify-between border-b border-blue-200/90 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-700" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-blue-950">
            Patient History
          </h3>
        </div>
        <span className="px-3 py-0.5 rounded-full bg-blue-600 border border-blue-700/60 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
          Context
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700/70 block">
            Master Summary
          </span>
          <p className="text-xs text-slate-800 leading-relaxed">
            {memory.master_summary}
          </p>
        </div>
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700/70 block">
            Follow-Up Strategy
          </span>
          <p className="text-xs text-slate-800 leading-relaxed">
            {memory.master_summary?.follow_up}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-blue-200/60">
        {memoryMeta.map((meta) => {
          const tone = memoryToneStyles[meta.tone];
          return (
            <div
              key={meta.label}
              className={`rounded-md p-2.5 space-y-1 shadow-sm transition-shadow duration-200 ${tone.box}`}
            >
              <span className={`font-mono text-[10px] font-bold uppercase tracking-widest block ${tone.label}`}>
                {meta.label}
              </span>
              <span className={`text-xs font-semibold block truncate ${tone.value}`}>
                {meta.data?.join(", ") || "None recorded"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
