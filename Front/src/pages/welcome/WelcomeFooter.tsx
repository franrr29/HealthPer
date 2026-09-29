export function WelcomeFooter() {
  return (
    <footer className="relative bg-hp-clinic-ink px-6 py-16 sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-[1360px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-16">
          {/* Brand & Clinical Context */}
          <div className="max-w-[420px]">
            <div className="flex items-center gap-3 text-base font-extrabold uppercase tracking-[0.08em] text-white">
              <span className="relative inline-flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-gradient-to-br from-hp-clinic to-hp-clinic-deep shadow-hp-sm">
                <span className="text-sm font-bold leading-none text-white">✦</span>
              </span>
              Healthper<span className="text-hp-clinic-light">.ai</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              <strong className="font-semibold text-white">Consultation documentation</strong> for doctors: audio transcription, SOAP summaries, incremental patient memory and a chat over the clinical history. Portfolio project with a full-stack, tested architecture.
            </p>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/65">
              HP-01 &middot; Clinical System Case Study by <strong className="font-bold text-white/70">Francisco Rodriguez</strong>
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white">
              <span className="text-hp-clinic-light">01.</span> Architecture
            </p>
            <div className="mt-5 flex flex-col gap-3.5 text-sm text-white/70">
              <a href="#workflow" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light">
                <span className="font-mono text-xs text-hp-clinic-light/60">/</span> <strong className="font-medium">Workflow Engine</strong>
              </a>
              <a href="#stack" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light">
                <span className="font-mono text-xs text-hp-clinic-light/60">/</span> <strong className="font-medium">System Core</strong>
              </a>
              <a href="#decisions" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light">
                <span className="font-mono text-xs text-hp-clinic-light/60">/</span> <strong className="font-medium">Clinical Decisions</strong>
              </a>
              <a href="#metrics" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light">
                <span className="font-mono text-xs text-hp-clinic-light/60">/</span> <strong className="font-medium">Performance Benchmarks</strong>
              </a>
            </div>
          </div>

          {/* External Links Section */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white">
              <span className="text-hp-clinic-light">02.</span> Resources
            </p>
            <div className="mt-5 flex flex-col gap-3.5 text-sm text-white/70">
              <a
                href="https://healthper.online"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light"
              >
                <span className="font-mono text-xs text-hp-clinic-light/60">&rarr;</span> <strong className="font-medium">Live Application</strong>
              </a>
              <a
                href="https://github.com/franrr29/HealthPer"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light"
              >
                <span className="font-mono text-xs text-hp-clinic-light/60">&rarr;</span> <strong className="font-medium">Source Repository</strong>
              </a>
              <a
                href="https://github.com/franrr29"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light"
              >
                <span className="font-mono text-xs text-hp-clinic-light/60">&rarr;</span> <strong className="font-medium">GitHub Profile</strong>
              </a>
              <a
                href="https://www.linkedin.com/in/franrod-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-hp-clinic-light/50 hover:text-hp-clinic-light"
              >
                <span className="font-mono text-xs text-hp-clinic-light/60">&rarr;</span> <strong className="font-medium">LinkedIn Network</strong>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
            &copy; 2026 Healthper Systems. <strong className="font-bold text-white/70">All clinical rights reserved.</strong>
          </span>

          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-hp-clinic-light"
          >
            <span>Back to top</span>
            <span className="font-bold transition-transform group-hover:-translate-y-0.5">&uarr;</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
