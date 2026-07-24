import type { ComponentType } from "react";
import { Search, ShieldCheck, Workflow, GitMerge } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

type Segment = { text: string; strong?: boolean };

interface Decision {
  category: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  text: Segment[];
  iconColor: string;
}

const DECISIONS: Decision[] = [
  {
    category: "Data Engine",
    icon: Search,
    title: "Hybrid RAG with RRF Fusion",
    iconColor: "text-blue-500",
    text: [
      { text: "Combines vector embeddings with MySQL FULLTEXT via " },
      { text: "Reciprocal Rank Fusion", strong: true },
      { text: " — dense vectors alone lose exact clinical terminology, while keyword search misses context." },
    ],
  },
  {
    category: "Security & Isolation",
    icon: ShieldCheck,
    title: "Query-Level IDOR Guardrails",
    iconColor: "text-emerald-500",
    text: [
      { text: "Every patient record and transcript query binds " },
      { text: "doctor_id", strong: true },
      { text: " directly inside SQL WHERE clauses to enforce zero-trust access across table JOINs." },
    ],
  },
  {
    category: "Resilience",
    icon: Workflow,
    title: "Non-Blocking Asynchronous Tasks",
    iconColor: "text-amber-500",
    text: [
      { text: "Notification delivery, memory indexing, and background tasks " },
      { text: "never block", strong: true },
      { text: " the core clinical signing flow during provider API latency." },
    ],
  },
  {
    category: "State Management",
    icon: GitMerge,
    title: "Incremental Memory Synthesis",
    iconColor: "text-indigo-500",
    text: [
      { text: "Each consultation " },
      { text: "merges new observations", strong: true },
      { text: " into existing patient state rather than re-indexing from scratch, keeping LLM context costs predictable." },
    ],
  },
];

export function EngineeringDecisions() {
  return (
    <section className="w-full bg-slate-100 px-4 py-16 sm:px-8 sm:py-24">
      {/* contenedor principal neumorfico con borde mas marcado */}
      <div className="mx-auto max-w-5xl rounded-4xl border border-slate-300/80 bg-slate-100 p-6 shadow-[16px_16px_32px_#cbd5e1,-16px_-16px_32px_#ffffff] sm:p-12">
        
        <Reveal>
          <div className="max-w-2xl">
            {/* badge neumorfico rehundido */}
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Why it's built this way
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {DECISIONS.map((decision, index) => {
            const Icon = decision.icon;
            return (
              <Reveal key={decision.title} delayMs={index * 50} durationMs={300}>
                {/* tarjeta neumorfica con bordes mas marcados */}
                <div className="group h-full rounded-2xl border border-slate-300/80 bg-slate-100 p-7 shadow-[8px_8px_18px_#cbd5e1,-8px_-8px_18px_#ffffff] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400/80 hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]">
                  
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                      {decision.category}
                    </span>
                    
                    {/* contenedor de icono neumorfico con borde definido */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300/60 bg-slate-100 shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff] transition-transform duration-300 group-hover:scale-105">
                      <Icon className={`h-5 w-5 ${decision.iconColor}`} strokeWidth={2} />
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-slate-900">
                    {decision.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {decision.text.map((segment, i) =>
                      segment.strong ? (
                        <span key={i} className="font-semibold text-slate-900">
                          {segment.text}
                        </span>
                      ) : (
                        <span key={i}>{segment.text}</span>
                      )
                    )}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}