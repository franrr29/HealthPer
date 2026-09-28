import { Reveal } from "@/components/common/Reveal";
import { SectionKicker } from "./Welcome";
import { STEPS } from "./welcomeData";

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative px-6 py-24 sm:px-8 sm:py-32">
      <div className="relative mx-auto max-w-[1360px]">
        <Reveal className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
          <div>
            <SectionKicker>Section 01 / Pipeline</SectionKicker>
            <h2 className="mt-5 text-[32px] font-bold leading-[0.98] tracking-[-0.02em] sm:text-[46px] lg:text-[clamp(34px,4.2vw,64px)]">
              From conversation
              <br />
              to <span className="font-normal italic text-hp-clinic">care.</span>
            </h2>
          </div>
          <p className="max-w-[480px] text-lg leading-relaxed text-hp-ink-2 lg:justify-self-end">
            Five stages turn a live consultation into an indexed patient memory and a plain-language email to the patient. No typing, no context loss.
          </p>
        </Reveal>

        <div className="relative">
          <div aria-hidden="true" className="absolute inset-x-[6%] top-[164px] hidden h-px bg-gradient-to-r from-transparent via-hp-hair-strong to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delayMs={i * 90}>
                <div className="hp-card relative overflow-hidden rounded-[20px] border border-hp-hair bg-white shadow-hp-sm">
                  <div className="hp-duo aspect-square">
                    <img src={s.img} alt={s.title} />
                  </div>
                  <div className="absolute left-3 top-3 z-[2] rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-hp-clinic-deep backdrop-blur-sm">
                    {s.tag}
                  </div>
                  <div className="absolute bottom-2.5 right-3.5 z-[2] text-[40px] font-light leading-none text-white [text-shadow:0_2px_12px_rgba(0,0,0,.25)]">
                    {s.n}
                  </div>
                </div>
                <div className="mt-5 px-1">
                  <div className={`font-mono text-[11px] uppercase tracking-[0.14em] ${s.accent ? "text-hp-clinic-deep" : "text-hp-ink-3"}`}>
                    Stage {s.n}
                  </div>
                  <h3 className="mb-1.5 mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.01em]">{s.title}</h3>
                  <p className="m-0 text-sm leading-relaxed text-hp-ink-2">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
