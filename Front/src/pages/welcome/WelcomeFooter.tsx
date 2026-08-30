import { BlueprintGrid } from "./Welcome";

export function WelcomeFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-bp-divider bg-bp-bg px-6 py-16 sm:px-8 sm:py-20">
      <BlueprintGrid className="opacity-40" />

      <div className="relative mx-auto max-w-[1360px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-16">
          {/* Brand & Clinical Context */}
          <div className="max-w-[420px]">
            <div className="flex items-center gap-3 font-display text-base font-extrabold uppercase tracking-[0.08em] text-bp-text">
              <span className="relative inline-block h-[26px] w-[26px] border border-bp-text/80 bg-bp-bg shadow-sm">
                <span className="absolute inset-x-0 top-0 h-px bg-bp-accent/60" />
                <span className="absolute inset-y-0 left-0 w-px bg-bp-accent/40" />
                <span className="absolute inset-y-0 right-0 w-px bg-bp-text/20" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-bp-text/20" />
                <span className="absolute inset-[4px] bg-bp-accent" />
              </span>
              Healthper<span className="text-bp-accent">.ai</span>
            </div>
            
            <p className="mt-4 text-sm leading-relaxed text-bp-text/75">
              Advanced <strong className="font-semibold text-bp-text">ambient clinical documentation</strong>, real-time patient memory integration, and recruiter-ready engineering architecture built for modern medical workflows.
            </p>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-bp-text/45">
              HP-01 &middot; Clinical System Case Study by <strong className="font-bold text-bp-text/70">Francisco Rodriguez</strong>
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-bp-text/90">
              <span className="text-bp-accent">01.</span> Architecture
            </p>
            <div className="mt-5 flex flex-col gap-3.5 text-sm text-bp-text/75">
              <a href="#workflow" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent">
                <span className="font-mono text-xs text-bp-accent/60">/</span> <strong className="font-medium">Workflow Engine</strong>
              </a>
              <a href="#stack" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent">
                <span className="font-mono text-xs text-bp-accent/60">/</span> <strong className="font-medium">System Core</strong>
              </a>
              <a href="#decisions" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent">
                <span className="font-mono text-xs text-bp-accent/60">/</span> <strong className="font-medium">Clinical Decisions</strong>
              </a>
              <a href="#metrics" className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent">
                <span className="font-mono text-xs text-bp-accent/60">/</span> <strong className="font-medium">Performance Benchmarks</strong>
              </a>
            </div>
          </div>

          {/* External Links Section */}
          <div>
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-bp-text/90">
              <span className="text-bp-accent">02.</span> Resources
            </p>
            <div className="mt-5 flex flex-col gap-3.5 text-sm text-bp-text/75">
              <a
                href="https://healthper.online"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent"
              >
                <span className="font-mono text-xs text-bp-accent/60">&rarr;</span> <strong className="font-medium">Live Application</strong>
              </a>
              <a
                href="https://github.com/franrr29/HealthPer"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent"
              >
                <span className="font-mono text-xs text-bp-accent/60">&rarr;</span> <strong className="font-medium">Source Repository</strong>
              </a>
              <a
                href="https://github.com/franrr29"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent"
              >
                <span className="font-mono text-xs text-bp-accent/60">&rarr;</span> <strong className="font-medium">GitHub Profile</strong>
              </a>
              <a
                href="https://www.linkedin.com/in/franrod-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 transition-colors hover:border-bp-accent/50 hover:text-bp-accent"
              >
                <span className="font-mono text-xs text-bp-accent/60">&rarr;</span> <strong className="font-medium">LinkedIn Network</strong>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-bp-divider pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bp-text/50">
            &copy; 2026 Healthper Systems. <strong className="font-bold text-bp-text/70">All clinical rights reserved.</strong>
          </span>

          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bp-text/50 transition-colors hover:text-bp-accent"
          >
            <span>Back to top</span>
            <span className="transition-transform group-hover:-translate-y-0.5 font-bold">&uarr;</span>
          </a>
        </div>
      </div>
    </footer>
  );
}