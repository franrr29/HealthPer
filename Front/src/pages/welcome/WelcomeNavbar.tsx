import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_LINKS = [
  { href: "#workflow", label: "Workflow" },
  { href: "#stack", label: "System" },
  { href: "#decisions", label: "Decisions" },
  { href: "#metrics", label: "Benchmarks" },
];

export function WelcomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-bp-divider bg-bp-bg/92 backdrop-blur-md md:backdrop-blur-none">
        <div className="mx-auto grid max-w-[1360px] grid-cols-[auto_1fr_auto] items-center gap-8 px-6 py-3.5 sm:px-8">
          <a href="#top" className="flex shrink-0 items-center gap-3 font-display text-base font-bold uppercase tracking-[0.08em]">
            <span className="relative inline-block h-[24px] w-[24px] border border-bp-text/75 bg-bp-bg">
              <span className="absolute inset-[3px] bg-bp-accent" />
            </span>
            <span className="flex items-center gap-3">
              <span>Healthper</span>
              <span className="hidden h-4 w-px bg-bp-divider md:block" />
              <span className="hidden font-mono text-[10px] font-medium tracking-[0.18em] text-bp-text/42 md:block">Clinical AI Portfolio</span>
            </span>
          </a>

          <div className="hidden items-center justify-center gap-2 sm:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full border border-transparent px-4 py-2 font-display text-sm font-medium uppercase tracking-[0.08em] text-bp-text/72 transition-colors hover:border-bp-divider hover:bg-bp-neutral-100 hover:text-bp-text"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-self-end">
            <Link
              to="/login"
              className="hidden items-center gap-2.5 rounded-full border border-bp-accent/35 bg-bp-accent px-4.5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-wide text-bp-bg shadow-[0_10px_24px_rgba(46,107,235,0.18)] transition-colors hover:bg-bp-accent-700 sm:inline-flex"
            >
              Recruiter Preview
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="-mr-2 flex h-11 w-11 items-center justify-center sm:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[rgba(10,14,30,0.35)] backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed left-0 top-0 z-50 flex max-h-[calc(100vh-2rem)] w-[85%] max-w-[360px] flex-col overflow-hidden rounded-r-[28px] border-r border-bp-divider bg-bp-bg px-6 py-8 shadow-[16px_0_50px_rgba(0,0,0,0.25)] sm:hidden"
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="absolute right-5 top-6 z-10 p-1 text-bp-text/55 transition-colors hover:text-bp-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <a href="#top" onClick={() => setMenuOpen(false)} className="mb-8 flex w-fit items-center gap-3 pr-10">
                <span className="relative inline-block h-[24px] w-[24px] border border-bp-text/75 bg-bp-bg">
                  <span className="absolute inset-[3px] bg-bp-accent" />
                </span>
                <span className="font-display text-base font-bold uppercase tracking-[0.08em]">Healthper</span>
              </a>

              <div className="flex flex-col divide-y divide-bp-divider">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3.5 font-display text-sm font-medium uppercase tracking-[0.08em]"
                  >
                    {l.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-6 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-bp-accent bg-bp-accent px-4 py-3.5 text-center font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-bp-bg"
                >
                  Recruiter Preview <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
