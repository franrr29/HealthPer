import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { BlueprintGrid } from "./Welcome";

export function CtaCloseSection() {
  return (
    <section className="relative overflow-hidden bg-bp-text px-6 py-28 text-bp-bg sm:px-8 sm:py-40">
      <BlueprintGrid dark />
      <div className="relative mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 items-end gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">/ End of spec sheet</div>
            <h2 className="mt-5 font-display text-[34px] font-bold uppercase leading-[1] tracking-[-0.015em] text-bp-bg sm:text-[48px] lg:text-[clamp(34px,4.2vw,68px)]">
              Open the
              <br />
              <span className="font-normal italic text-bp-accent-300">recruiter</span> preview.
            </h2>
            <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/70">
              One click, no credentials. Sample doctor, three patients, twelve signed consultations pre-loaded and indexed.
            </p>
          </Reveal>
          <Reveal className="flex flex-col items-start gap-3.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 border border-bp-bg bg-bp-bg px-6.5 py-4.5 font-display text-[17px] font-semibold uppercase tracking-wide text-bp-text transition-colors hover:bg-bp-accent-100"
            >
              Launch Preview
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/franrr29/HealthPer"
              className="inline-flex items-center gap-2.5 border border-white/25 px-5 py-3.5 font-display text-[15px] font-semibold uppercase tracking-wide text-white/85 transition-colors hover:border-bp-accent hover:text-bp-accent-300"
            >
              Read the code
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
