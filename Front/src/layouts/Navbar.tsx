import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-300 ${
        scrolled ? "top-3" : "top-5"
      }`}
    >
      <nav
        className={`flex w-full max-w-xl items-center justify-between gap-3 rounded-full border border-white/40 bg-[#D3D6CC] pl-2.5 pr-2 py-2 transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-[#6B7268]/25" : "shadow-md shadow-[#6B7268]/15"
        }`}
      >
        {/* logo e identidad */}
        <Link to="/" className="group flex items-center gap-2.5 select-none">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3E4B43] p-1.5 ring-1 ring-inset ring-white/40">
            <img
              src="/logo.png"
              alt="HealthPer logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-feature text-base font-semibold text-[#2B332D]">
            HealthPer
          </span>
        </Link>

        {/* boton de accion */}
        <Link
          to="/login"
          className="group inline-flex items-center gap-2 rounded-full bg-[#3E4B43] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#2B332D]"
        >
          Try Demo
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </nav>
    </header>
  );
}