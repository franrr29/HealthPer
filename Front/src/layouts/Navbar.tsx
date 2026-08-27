import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#metrics", label: "Metrics" },
  { href: "#features", label: "Workflow" },
  { href: "#architecture", label: "Architecture" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <nav className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
        {/* logo e identidad */}
        <Link to="/" className="group flex shrink-0 items-center gap-3 select-none">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-neutral-950/60 p-1.5 backdrop-blur-md transition-colors duration-200 group-hover:border-teal-400/50">
            <img src="/logo.png" alt="HealthPer logo" className="h-full w-full object-contain" />
          </div>
          <span className="hidden font-feature text-lg font-black tracking-tight text-white min-[400px]:inline">
            HealthPer
          </span>
        </Link>

        {/* links de seccion, estilo mono con separadores, solo desktop */}
        <div className="hidden items-center font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-400 sm:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center">
              {i > 0 && <span className="mx-3 text-neutral-600">/</span>}
              <a
                href={link.href}
                className="transition-colors duration-150 hover:text-teal-400"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* boton de accion, siempre visible */}
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-lg bg-teal-400 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-neutral-950 transition-all duration-200 hover:bg-teal-300 sm:px-5 sm:text-xs"
          >
            Try Demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* toggle del menu mobile */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:border-teal-400/50 hover:text-teal-400 sm:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </nav>

      {/* menu mobile: panel tecnico, se despliega debajo de la barra */}
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-xl sm:hidden">
          <nav className="flex flex-col divide-y divide-white/10">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-4 font-mono text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:bg-white/5 hover:text-teal-400"
              >
                <span className="text-teal-500">0{i + 1}</span>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
