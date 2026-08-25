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
    iconColor: "text-[#5E7367]",
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
    iconColor: "text-[#3B4A42]",
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
    iconColor: "text-[#9C8A66]",
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
    iconColor: "text-[#535B4F]",
    text: [
      { text: "Each consultation " },
      { text: "merges new observations", strong: true },
      { text: " into existing patient state rather than re-indexing from scratch, keeping LLM context costs predictable." },
    ],
  },
];

export function EngineeringDecisions() {
  return (
    <section className="relative w-full -mt-12 rounded-t-[2.5rem] bg-[#C0C3B8] px-4 py-16 shadow-[0_-16px_40px_rgba(47,59,53,0.12)] sm:-mt-16 sm:rounded-t-[3.5rem] sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">

        <Reveal>
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#6B7268] block mb-1">
              Architecture
            </span>
            <h2 className="font-feature text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Why it's built this way
            </h2>
          </div>
        </Reveal>

        {/* grilla tipo ficha tecnica: 2x2 con divisores reales entre celdas */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#8B9086]/50 bg-white/50">
          <div className="grid grid-cols-1 divide-y divide-[#8B9086]/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {DECISIONS.slice(0, 2).map((decision, index) => (
              <DecisionCell key={decision.title} decision={decision} delayMs={index * 60} />
            ))}
          </div>
          <div className="grid grid-cols-1 divide-y divide-[#8B9086]/50 border-t border-[#8B9086]/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {DECISIONS.slice(2, 4).map((decision, index) => (
              <DecisionCell key={decision.title} decision={decision} delayMs={(index + 2) * 60} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionCell({ decision, delayMs }: { decision: Decision; delayMs: number }) {
  const Icon = decision.icon;
  return (
    <Reveal delayMs={delayMs} durationMs={300}>
      <div className="group h-full p-8 transition-colors duration-300 hover:bg-white/60 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C0C3B8] bg-white shadow-sm transition-colors duration-300 group-hover:border-[#3E4B43]/40">
            <Icon className={`h-4 w-4 ${decision.iconColor}`} strokeWidth={2} />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8B9086]">
            {decision.category}
          </span>
        </div>

        <h3 className="mt-4 font-feature text-lg font-semibold tracking-tight text-foreground">
          {decision.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[#535B4F]">
          {decision.text.map((segment, i) =>
            segment.strong ? (
              <span key={i} className="font-semibold text-foreground">
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
}