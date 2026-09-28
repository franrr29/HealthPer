import { Play } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { SectionKicker } from "./Welcome";

export function StackSection() {
  return (
    <section id="stack" className="relative border-y border-hp-hair bg-hp-paper-2 px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="mb-18 max-w-[780px]">
          <SectionKicker>Section 02 / Live surface</SectionKicker>
          <h2 className="mb-5 mt-5 text-[28px] font-bold leading-[1.02] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,56px)]">
            A patient&apos;s memory,
            <br />
            <span className="font-normal italic text-hp-clinic">queryable</span> in plain language.
          </h2>
          <p className="text-lg leading-relaxed text-hp-ink-2">
            Signed consultations are chunked, embedded, and indexed. Ask a question — retrieval fuses cosine similarity and MySQL FULLTEXT through
            Reciprocal Rank Fusion.
          </p>
        </Reveal>

        <Reveal className="relative border border-hp-hair bg-white p-3">
          <div className="absolute left-6 top-6 z-10 flex items-center gap-2 border border-hp-hair-strong bg-white/95 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-hp-clinic-deep">
            <Play className="h-3 w-3 fill-current" />
            Watch the demo
          </div>
          <video
            src="/demo.mp4#t=1"
            poster="/demo-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="w-full border border-hp-hair"
          />
        </Reveal>
      </div>
    </section>
  );
}
