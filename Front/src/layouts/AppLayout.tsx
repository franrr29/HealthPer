import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";
import { BlueprintGrid } from "@/pages/welcome/Welcome";

const EASE = [0.22, 1, 0.36, 1] as const;

const SIDEBAR_PANEL =
  "bg-[linear-gradient(165deg,rgba(29,31,32,1)_0%,rgba(8,11,37,0.98)_100%)]";

const navItems = [
  { to: "/dashboard", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", end: false, icon: Users, label: "Patients" },
];

function NavItem({ item, layoutId, onClick }: { item: (typeof navItems)[number]; layoutId: string; onClick?: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className="group relative flex items-center gap-3 px-3.5 py-3 md:py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 border border-bp-accent/35 border-l-2 border-l-bp-accent-300 bg-bp-accent/14 shadow-[inset_0_1px_2px_rgba(46,107,235,0.2)]"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className={`relative z-10 flex items-center gap-3 ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
            <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-bp-accent-300" : "text-white/40 group-hover:text-white/60"}`} aria-hidden="true" />
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function Brand() {
  return (
    <div className="relative mb-8 flex w-fit items-center gap-3 px-1 pr-8">
      <span className="relative inline-block h-[22px] w-[22px] shrink-0 border border-white/80">
        <span className="absolute inset-x-0 top-0 h-px bg-bp-accent-300/60" />
        <span className="absolute inset-y-0 left-0 w-px bg-bp-accent-300/35" />
        <span className="absolute inset-[3px] bg-bp-accent" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="font-display text-base font-bold uppercase tracking-[0.12em] text-white">Healthper</span>
        <span className="mt-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-white/35">
          Clinical workspace
        </span>
      </div>
    </div>
  );
}

function SidebarNav({ layoutId, onNavClick }: { layoutId: string; onNavClick?: () => void }) {
  return (
    <>
      <Brand />
      <div className="relative mb-3 px-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
        Navigation
      </div>
      <nav className="relative flex flex-col gap-1.5">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} layoutId={layoutId} onClick={onNavClick} />
        ))}
      </nav>
    </>
  );
}

function SidebarFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="relative mt-auto flex flex-col gap-4 border-t border-white/10 pt-4">
      <button
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2.5 border border-red-500/30 bg-red-500/[0.04] px-3 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-red-400 transition-all duration-150 hover:border-red-500/60 hover:bg-red-500/10"
      >
        <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Log out
      </button>
    </div>
  );
}

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[linear-gradient(180deg,rgba(245,245,245,1),rgba(238,242,250,0.92))] font-sans antialiased text-bp-text">
      {/* desktop sidebar */}
      <aside
        className={`relative hidden w-64 shrink-0 flex-col overflow-hidden border-r border-white/8 px-5 py-6 shadow-[10px_0_28px_rgba(8,11,37,0.14)] md:flex ${SIDEBAR_PANEL}`}
      >
        <BlueprintGrid dark className="opacity-25" />
        <SidebarNav layoutId="sidebar-active-pill-desktop" />
        <SidebarFooter onLogout={handleLogout} />
      </aside>

      {/* main content area */}
      <div className="relative flex flex-1 flex-col min-w-0">
        {/* mobile header */}
        <header
          className={`relative flex h-14 shrink-0 items-center justify-between overflow-hidden border-b border-white/8 px-4 md:hidden ${SIDEBAR_PANEL}`}
        >
          <BlueprintGrid dark className="opacity-20" />

          <div className="relative flex items-center gap-2.5">
            <span className="relative inline-block h-[18px] w-[18px] border border-white/80">
              <span className="absolute inset-[2px] bg-bp-accent" />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.1em] text-white">
              Healthper
            </span>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative p-1.5 text-white/80 transition-colors hover:text-white"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </header>

        {/* mobile off-canvas drawer */}
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
                className="fixed inset-0 z-40 bg-[rgba(10,14,30,0.35)] backdrop-blur-sm md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: EASE }}
                className={`fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-[360px] flex-col overflow-hidden rounded-r-[28px] border-r border-white/8 px-6 py-8 shadow-[16px_0_50px_rgba(0,0,0,0.4)] md:hidden ${SIDEBAR_PANEL}`}
              >
                <BlueprintGrid dark className="opacity-25" />

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="absolute right-5 top-6 z-10 p-1 text-white/60 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.05, ease: EASE }}
                  className="relative flex flex-1 flex-col"
                >
                  <SidebarNav layoutId="sidebar-active-pill-mobile" onNavClick={() => setMenuOpen(false)} />
                  <SidebarFooter
                    onLogout={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
