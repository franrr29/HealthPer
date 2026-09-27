import { Search } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { BlueprintGrid, Crosshair, Kicker } from "./Welcome";
import { TypingTranscript } from "./TypingTranscript";
import { RETRIEVED } from "./welcomeData";

export function StackSection() {
  return (
    <section id="stack" className="relative border-y border-bp-divider bg-bp-neutral-100 px-6 py-24 sm:px-8 sm:py-32">
      <Crosshair className="left-10 top-10" />
      <Crosshair className="right-10 top-10" />
      <Crosshair className="bottom-10 left-10" />
      <Crosshair className="bottom-10 right-10" />

      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-18 max-w-[780px]">
          <Kicker>Section 02 / Live surface</Kicker>
          <h2 className="mb-5 mt-5 font-display text-[28px] font-bold uppercase leading-[1] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,60px)]">
            A patient&apos;s memory,
            <br />
            <span className="font-normal italic text-bp-accent">queryable</span> in plain language.
          </h2>
          <p className="text-lg leading-relaxed text-bp-text/75">
            Signed consultations are chunked, embedded, and indexed. Ask a question — retrieval fuses cosine similarity and MySQL FULLTEXT through
            Reciprocal Rank Fusion.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Transcript plate */}
          <Reveal className="relative border border-bp-divider bg-bp-bg p-7">
            <div className="mb-6 flex items-center justify-between">
              <Kicker>Transcript</Kicker>
            </div>
            <TypingTranscript />
          </Reveal>

          {/* Query plate */}
          <Reveal className="relative overflow-hidden border border-bp-divider bg-bp-accent-900 p-7 text-white/90">
            <BlueprintGrid dark className="opacity-50" />

            <div className="relative">
              <Kicker dark>Query</Kicker>
              <div className="mt-5.5 flex items-center gap-2.5 border border-white/20 bg-white/[0.04] px-4 py-3.5">
                <Search className="h-3.5 w-3.5" />
                <span className="font-mono text-[13px] text-white/90">Any allergies flagged in the last 12 months?</span>
              </div>

              <div className="mt-6">
                <div className="flex flex-col gap-2.5">
                  {RETRIEVED.map((r) => (
                    <div key={r.score} className="flex gap-3 border border-white/[0.14] bg-white/[0.03] p-3">
                      <span className="font-mono text-[11px] text-bp-accent-300">{r.score}</span>
                      <span className="text-sm leading-relaxed">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6.5 grid grid-cols-2 gap-5 border-t border-white/[0.14] pt-5">
                <div>
                  <div className="mt-1 font-display text-[22px]">Cosine + FULLTEXT</div>
                </div>
                <div>
                  <div className="mt-1 font-display text-[22px]">Llama 3.3 70B</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
