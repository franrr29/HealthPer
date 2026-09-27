import { Reveal } from "@/components/common/Reveal";
import { Kicker } from "./Welcome";
import { DECISIONS } from "./welcomeData";

export function DecisionsSection() {
  return (
    <section id="decisions" className="relative px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Section 05 / Engineering</Kicker>
            <h2 className="mt-5 font-display text-[28px] font-bold uppercase leading-[1] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,60px)]">
              Decisions,
              <br />
              not defaults.
            </h2>
          </div>
          <p className="max-w-[480px] text-lg leading-relaxed text-bp-text/75 lg:justify-self-end">
            Every choice below was defended in writing. The system reads like an engineering note, not a feature list.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 border-t border-bp-divider sm:grid-cols-2">
          {DECISIONS.map((d, i) => {
            const isRight = i % 2 === 1;
            const isLast = i >= DECISIONS.length - 2;
            return (
              <Reveal
                key={d.n}
                delayMs={i * 70}
                className={`p-8 sm:p-10 ${isLast ? "" : "border-b border-bp-divider"} ${isRight ? "sm:border-l sm:border-bp-divider" : ""}`}
              >
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="font-display text-[52px] font-light leading-[0.8] text-bp-text/25 sm:text-[64px]">{d.n}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bp-accent">{d.cat}</span>
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold uppercase tracking-[-0.01em] sm:text-[30px]">{d.t}</h3>
                <p className="m-0 max-w-[460px] text-sm leading-relaxed text-bp-text/70">{d.b}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
