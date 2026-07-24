import { GitBranch, Globe, ArrowUpRight } from "lucide-react";


//solo renderiza en welcome
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-6 sm:px-4">
      <div className="mx-auto max-w-6xl border-t border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-6 shadow-2xl backdrop-blur-xl sm:rounded-t-[28px] sm:border-x sm:p-8">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          
          {/* marca */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="logo healthper"
                className="h-10 w-10 rounded-2xl border border-white/10 object-cover shadow-inner"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold tracking-tight text-white">
                HealthPer
              </h3>
              <p className="text-xs font-medium text-white">
                AI-powered clinical platform
              </p>
            </div>
          </div>

          {/* enlaces */}
          <nav className="flex items-center justify-center gap-3 text-sm">
            <a
              href="https://github.com/franrr29"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 font-medium text-white transition-all hover:border-white/30 hover:bg-white/[0.08]"
            >
              <GitBranch className="h-4 w-4" />
              <span>GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>

            <a
              href="https://franrodev.online"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 font-medium text-white transition-all hover:border-white/30 hover:bg-white/[0.08]"
            >
              <Globe className="h-4 w-4" />
              <span>Portfolio</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>
          </nav>

          {/* copyright */}
          <p className="text-xs font-medium text-white">
            © {currentYear} HealthPer · Francisco Rodríguez
          </p>

        </div>
      </div>
    </footer>
  );
}