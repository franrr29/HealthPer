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
      <div
        className={`w-full transition-all duration-300 ${
          scrolled ? "max-w-lg" : "max-w-xl"
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-full border border-white/10 bg-slate-950/70 backdrop-blur-xl transition-all duration-300 ${
            scrolled ? "px-5 py-2 shadow-lg" : "px-6 py-2.5 shadow-md"
          }`}
        >
          {/* logo e identidad */}
          <Link to="/" className="group flex items-center gap-3 select-none">
            <img
              src="/logo.png"
              alt="HealthPer logo"
              className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-base font-semibold text-white transition-colors group-hover:text-sky-200">
              HealthPer
            </span>
          </Link>

          {/* boton de accion */}
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:border-transparent hover:bg-sky-500 hover:text-white hover:shadow-md active:scale-95"
          >
            Let's Try Demo
            <ArrowRight className="h-4 w-4 text-sky-200 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
          </Link>
        </nav>
      </div>
    </header>
  );
}