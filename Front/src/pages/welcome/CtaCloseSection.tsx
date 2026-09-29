import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

function GithubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function CtaCloseSection() {
  return (
    <section id="login" className="py-24 sm:py-32">
      <div className="relative overflow-hidden bg-gradient-to-br from-hp-clinic-ink via-hp-clinic-ink to-hp-clinic-deep px-6 py-28 text-white sm:px-8 sm:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-hp-clinic/35 blur-[120px]"
        />
        <div className="relative mx-auto grid max-w-[1360px] grid-cols-1 items-end gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">/ Try it now</div>
            <h2 className="mt-5 text-[34px] font-bold leading-[1.05] tracking-[-0.015em] text-white sm:text-[48px] lg:text-[clamp(34px,4.2vw,64px)]">
              See the full
              <br />
              <span className="font-normal italic text-hp-clinic-light">workflow</span> in action.
            </h2>
            <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/80">
              One click, no credentials. A sample doctor with three patients, signed consultations and indexed clinical history — ready to explore.
            </p>
          </Reveal>
          <Reveal className="flex flex-col items-start gap-5">
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white bg-white px-9 py-5 text-lg font-bold uppercase tracking-wide text-hp-clinic-deep shadow-hp-md transition-all hover:-translate-y-0.5 hover:bg-hp-clinic-soft hover:shadow-hp-lg sm:w-auto"
            >
              Launch Preview
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/franrr29/HealthPer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <GithubMark />
              Read the code
            </a>
          </Reveal>
        </div>

        <p className="relative mx-auto mt-20 max-w-[1360px] border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          Built with TypeScript · React · Node · MySQL · Groq · Gemini
        </p>
      </div>
    </section>
  );
}
