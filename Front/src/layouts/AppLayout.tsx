import { useState } from "react";
import { NavLink, Outlet, useNavigate, type NavLinkRenderProps } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { to: "/dashboard", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", end: false, icon: Users, label: "Patients" },
];

function linkClass({ isActive }: NavLinkRenderProps) {
  return `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
    isActive
      ? "bg-white/95 text-[#115E59] font-semibold"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;
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
    <div className="flex h-screen w-full overflow-hidden bg-[#F5F5F5] font-sans antialiased text-foreground">
      {/* desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-navy px-4 py-6 md:flex border-r border-white/10">
        {/* Brand Container */}
        <div className="mb-8 flex items-center gap-3 px-2">
          {/* Logo Box */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 border border-white/10 p-1.5">
            <img
              src="/logo.png"
              alt="HealthPer Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <span className="font-feature text-lg font-semibold tracking-tight text-white">
            HealthPer
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-700 rounded-md transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      {/* main content area */}
      <div className="relative flex flex-1 flex-col min-w-0">
        {/* mobile header */}
        <header className="flex h-14 shrink-0 items-center justify-between bg-navy px-4 md:hidden border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 border border-white/10 p-1">
              <img
                src="/logo.png"
                alt="HealthPer Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-feature text-base font-semibold text-white">
              HealthPer
            </span>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="p-1.5 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </header>

        {/* mobile dropdown menu */}
        {menuOpen && (
          <div className="absolute inset-x-0 top-14 z-30 bg-navy p-4 space-y-4 md:hidden border-b border-white/10 shadow-lg">
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-white/10 pt-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-700 rounded-md transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}