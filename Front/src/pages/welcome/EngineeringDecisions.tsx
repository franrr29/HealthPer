import { Reveal } from "@/components/common/Reveal";

type Segment = { text: string; strong?: boolean };

interface Decision {
  category: string;
  title: string;
  text: Segment[];
}

const DECISIONS: Decision[] = [
  {
    category: "Data engine",
    title: "Hybrid RAG with RRF fusion",
    text: [
      { text: "Combines vector embeddings with MySQL FULLTEXT via " },
      { text: "Reciprocal Rank Fusion", strong: true },
      { text: ". Dense vectors alone lose exact clinical terminology, keyword search alone misses context." },
    ],
  },
  {
    category: "Security",
    title: "Query-level access control",
    text: [
      { text: "Every patient record and transcript query binds " },
      { text: "doctor_id", strong: true },
      { text: " directly inside the SQL WHERE clause, enforced across every table join, not just at the route level." },
    ],
  },
  {
    category: "Resilience",
    title: "Non-blocking background tasks",
    text: [
      { text: "Notification delivery, memory indexing and other side effects " },
      { text: "never block", strong: true },
      { text: " the clinical signing flow while waiting on a provider API." },
    ],
  },
  {
    category: "State",
    title: "Incremental memory synthesis",
    text: [
      { text: "Each consultation " },
      { text: "merges new observations", strong: true },
      { text: " into the patient's existing state instead of re-indexing from scratch, keeping LLM context costs predictable." },
    ],
  },
];

export function EngineeringDecisions() {
  return (
    <section id="architecture" className="relative -mt-12 w-full rounded-t-[2.5rem] bg-white px-4 py-20 sm:-mt-16 sm:rounded-t-[4rem] sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-widest text-teal-600">
            Architecture
          </span>
          <h2 className="font-feature text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Why it's built this way
          </h2>
        </Reveal>

        <div className="mt-14">
          {DECISIONS.map((decision, index) => (
            <Reveal key={decision.title} delayMs={index * 70} durationMs={350}>
              <div className="grid gap-3 border-t border-neutral-200 py-9 first:border-t-0 sm:grid-cols-12 sm:gap-8 sm:py-10">
                <div className="sm:col-span-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {decision.category}
                  </span>
                  <h3 className="mt-2 font-feature text-xl font-bold text-neutral-900">
                    {decision.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 sm:col-span-8 sm:text-base">
                  {decision.text.map((segment, i) =>
                    segment.strong ? (
                      <span key={i} className="font-semibold text-neutral-900">
                        {segment.text}
                      </span>
                    ) : (
                      <span key={i}>{segment.text}</span>
                    )
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
