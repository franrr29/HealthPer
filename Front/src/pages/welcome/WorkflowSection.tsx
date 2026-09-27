import { Reveal } from "@/components/common/Reveal";
import { BlueprintGrid, Kicker } from "./Welcome";
import { STEPS } from "./welcomeData";

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32">
      <BlueprintGrid className="opacity-40" />
      <div className="relative mx-auto max-w-[1360px]">
        <Reveal className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Section 01 / Pipeline</Kicker>
            <h2 className="mt-5 font-display text-[32px] font-bold uppercase leading-[0.95] tracking-[-0.02em] sm:text-[46px] lg:text-[clamp(34px,4.2vw,68px)]">
              From conversation
              <br />
              to <span className="font-normal italic text-bp-accent">care.</span>
            </h2>
          </div>
          <p className="max-w-[480px] text-lg leading-relaxed text-bp-text/75 lg:justify-self-end">
            Five stages turn a live consultation into an indexed patient memory and a plain-language email to the patient. No typing, no context loss.
          </p>
        </Reveal>

        <div className="relative">
          <div aria-hidden="true" className="absolute inset-x-0 top-[128px] hidden h-px bg-bp-divider lg:block" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delayMs={i * 90}>
                <div className="relative border border-bp-divider">
                  <div className="iw-duo aspect-square">
                    <img src={s.img} alt={s.title} />
                  </div>
                  <div className="absolute left-2.5 top-2.5 z-[2] border border-white/20 bg-black/40 px-2 py-1 font-display text-[11px] uppercase tracking-[0.14em] text-white">
                    {s.tag}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 z-[2] font-display text-[42px] font-light leading-none text-white">{s.n}</div>
                </div>
                <div className="mt-5">
                  <div className={`font-mono text-[11px] uppercase tracking-[0.14em] ${s.accent ? "text-bp-accent" : "text-bp-text/50"}`}>
                    Stage {s.n}
                  </div>
                  <h3 className="mb-1.5 mt-1.5 font-display text-[28px] font-bold uppercase leading-tight tracking-[-0.01em]">{s.title}</h3>
                  <p className="m-0 text-sm leading-relaxed text-bp-text/70">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
