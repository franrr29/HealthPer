import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function CtaCloseSection() {
  return (
    <section id="login" className="py-24 sm:py-32">
      <div className="bg-hp-clinic-ink px-6 py-24 text-white sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-end gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">/ End of spec sheet</div>
            <h2 className="mt-5 text-[34px] font-bold leading-[1.05] tracking-[-0.015em] text-white sm:text-[48px] lg:text-[clamp(34px,4.2vw,64px)]">
              Open the
              <br />
              <span className="font-normal italic text-hp-clinic-light">recruiter</span> preview.
            </h2>
            <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/70">
              One click, no credentials. Sample doctor, three patients, twelve signed consultations pre-loaded and indexed.
            </p>
          </Reveal>
          <Reveal className="flex flex-col items-start gap-3.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 border border-white bg-white px-6.5 py-4.5 text-[17px] font-semibold uppercase tracking-wide text-hp-clinic-deep transition-colors hover:bg-hp-clinic-soft"
            >
              Launch Preview
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/franrr29/HealthPer"
              className="inline-flex items-center gap-2.5 border border-white/25 px-5 py-3.5 text-[15px] font-semibold uppercase tracking-wide text-white/85 transition-colors hover:border-hp-clinic-light hover:text-hp-clinic-light"
            >
              Read the code
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
