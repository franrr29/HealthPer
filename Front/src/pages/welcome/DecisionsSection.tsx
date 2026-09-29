import { Reveal } from "@/components/common/Reveal";
import { SectionKicker } from "./Welcome";
import { DECISIONS } from "./welcomeData";

export function DecisionsSection() {
  return (
    <section id="decisions" className="relative px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
          <div>
            <SectionKicker>Section 05 / Engineering</SectionKicker>
            <h2 className="mt-5 text-[28px] font-bold leading-[1.02] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,56px)]">
              Decisions,
              <br />
              not defaults.
            </h2>
          </div>
          <p className="max-w-[480px] text-lg leading-relaxed text-hp-ink-2 lg:justify-self-end">
            Every choice below was defended in writing. The system reads like an engineering note, not a feature list.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {DECISIONS.map((d, i) => (
            <Reveal
              key={d.n}
              delayMs={i * 70}
              className="hp-card rounded-[20px] border border-l-4 border-hp-hair-strong border-l-hp-clinic bg-hp-paper-2 p-7 shadow-hp-md sm:p-9"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="rounded-full bg-hp-clinic px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  {d.cat}
                </span>
                <span aria-hidden="true" className="text-[44px] font-light leading-none text-hp-clinic/25">{d.n}</span>
              </div>
              <h3 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.01em] sm:text-[26px]">{d.t}</h3>
              <p className="m-0 max-w-[460px] text-sm leading-relaxed text-hp-ink-2">{d.b}</p>
              <p className="mb-0 mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-hp-ink-2">{d.tag}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
