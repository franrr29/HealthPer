import { GitBranch, Globe, ArrowUpRight } from "lucide-react";


//solo renderiza en welcome
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-neutral-950 px-4 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.5fr_1fr]">

          {/* marca */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="logo healthper"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h3 className="font-feature text-lg font-semibold tracking-tight text-white">
                HealthPer
              </h3>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              AI-powered clinical platform that turns ambient consultation audio into structured, patient-ready documentation.
            </p>
          </div>

          {/* enlaces */}
          <div className="sm:justify-self-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Connect
            </span>
            <nav className="mt-4 flex flex-col items-start gap-3">
              <a
                href="https://github.com/franrr29"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-sm font-medium text-neutral-300 transition-colors hover:text-teal-400"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3 w-3 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-400" />
              </a>

              <a
                href="https://franrodev.online"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-sm font-medium text-neutral-300 transition-colors hover:text-teal-400"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Portfolio</span>
                <ArrowUpRight className="h-3 w-3 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-400" />
              </a>
            </nav>
          </div>
        </div>

        {/* copyright */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs font-medium text-neutral-500">
            © {currentYear} HealthPer · Francisco Rodríguez
          </p>
        </div>
      </div>
    </footer>
  );
}
