import { Reveal } from "@/components/common/Reveal";
import { SectionKicker } from "./Welcome";

export function ProductSection() {
  return (
    <section className="relative px-6 py-24 sm:px-8 sm:py-32">
      <div className="relative mx-auto max-w-[1360px]">
        <Reveal className="mb-16 max-w-[780px]">
          <SectionKicker>Section 03 / Product</SectionKicker>
          <h2 className="mb-5 mt-5 text-[28px] font-bold leading-[1.02] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,56px)]">
            Real screens,
            <br />
            <span className="font-normal italic text-hp-clinic">not mockups.</span>
          </h2>
          <p className="text-lg leading-relaxed text-hp-ink-2">
            Both panels are screenshots of the running app: the chat answering a question from a patientEvery panel below is a live screenshot of the running app — the AI assistant answering a clinical question, and a patient&apos;s consultation memory.apos;s clinical history, and the consultation record with its accumulated memory.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="hp-card relative flex h-[420px] items-center justify-center rounded-[22px] border border-hp-hair bg-white p-8 shadow-hp-md sm:h-[520px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-hp-paper-2">
              <img
                src="/llmchat.png"
                alt="Chat answering a question about a patient's medications from their clinical history" loading="lazy" decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </Reveal>
          <Reveal delayMs={90} className="hp-card relative flex h-[420px] items-center justify-center rounded-[22px] border border-hp-hair bg-white p-8 shadow-hp-md sm:h-[520px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-hp-paper-2">
              <img
                src="/consulta.png"
                alt="Patient consultation record with incremental patient memory" loading="lazy" decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
