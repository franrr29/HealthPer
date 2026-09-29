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
            Five stages take a consultation from audio to a signed SOAP note, an updated patient memory and a plain-language email to the patient. The doctor reviews and signs; nothing is typed by hand.
          </p>
        </Reveal>

        <div className="relative">
          <div aria-hidden="true" className="absolute inset-x-[6%] top-[164px] hidden h-px bg-gradient-to-r from-transparent via-hp-hair-strong to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delayMs={i * 90}>
                <div className="hp-card group relative overflow-hidden rounded-[20px] border border-hp-hair bg-white shadow-hp-sm">
                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 z-[2] h-0.5 origin-left bg-hp-clinic transition-transform duration-300 ${
                      s.accent ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                  <div className="hp-duo aspect-square">
                    <img src={s.img} alt="" width={600} height={600} loading="lazy" decoding="async" />
                  </div>
                  <div className="relative px-5 pb-5 pt-4">
                    <span aria-hidden="true" className="pointer-events-none absolute right-4 top-2 select-none text-[44px] font-light leading-none text-hp-ink/[0.07]">
                      {s.n}
                    </span>
                    <span className="inline-block rounded-full bg-hp-paper-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-hp-ink-2">
                      {s.tag}
                    </span>
                    <h3 className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.01em]">{s.title}</h3>
                  </div>
                </div>
                <p className="m-0 mt-4 px-1 text-sm leading-relaxed text-hp-ink-2">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
