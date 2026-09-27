import { Reveal } from "@/components/common/Reveal";
import { BlueprintGrid, Kicker } from "./Welcome";

export function ProductSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32">
      <BlueprintGrid className="opacity-30" />
      <div className="relative mx-auto max-w-[1360px]">
        <Reveal className="mb-16 max-w-[780px]">
          <Kicker>Section 03 / Product</Kicker>
          <h2 className="mb-5 mt-5 font-display text-[28px] font-bold uppercase leading-[1] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,60px)]">
            Real screens,
            <br />
            <span className="font-normal italic text-bp-accent">not mockups.</span>
          </h2>
          <p className="text-lg leading-relaxed text-bp-text/75">
            Every panel below is a live screenshot of the running app — the AI assistant answering a clinical question, and a patient&apos;s consultation memory.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="relative flex h-[420px] items-center justify-center border border-bp-divider bg-bp-neutral-100 p-6 sm:h-[520px]">
            <img
              src="/llmchat.png"
              alt="AI assistant answering a clinical question about a patient's medications"
              className="max-h-full max-w-full object-contain"
            />
          </Reveal>
          <Reveal delayMs={90} className="relative flex h-[420px] items-center justify-center border border-bp-divider bg-bp-neutral-100 p-6 sm:h-[520px]">
            <img
              src="/consulta.png"
              alt="Patient consultation record with clinical intelligence memory"
              className="max-h-full max-w-full object-contain"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
