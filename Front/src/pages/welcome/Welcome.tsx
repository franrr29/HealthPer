import { Link } from "react-router-dom";
import { WelcomeHero } from "./WelcomeHero";
import { WelcomeSections } from "./WelcomeSections";
import { WelcomeNavbar } from "./WelcomeNavbar";
import { WelcomeFooter } from "./WelcomeFooter";

// estilos compartidos por todo el rediseno "Industry" (blueprint): grilla de fondo,
// marcas de mira, duotono de fotos, marquee, cursor de tipeo -- una sola hoja para
// que el hero y las secciones (en otros archivos) usen las mismas clases .iw-*.
const IW_STYLES = `
  .iw-grid {
    background-image:
      linear-gradient(to right, color-mix(in srgb, var(--color-bp-text) 8%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--color-bp-text) 8%, transparent) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(120% 90% at 50% 40%, black 30%, transparent 85%);
    -webkit-mask-image: radial-gradient(120% 90% at 50% 40%, black 30%, transparent 85%);
    animation: iw-bp-drift 60s linear infinite;
  }
  .iw-grid-dark {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
  }
  @keyframes iw-bp-drift { from { background-position: 0 0, 0 0; } to { background-position: 480px 0, 0 480px; } }

  .iw-crosshair { width: 14px; height: 14px; color: color-mix(in srgb, var(--color-bp-text) 40%, transparent); }
  .iw-crosshair::before, .iw-crosshair::after { content: ""; position: absolute; background: currentColor; }
  .iw-crosshair::before { left: 50%; top: 0; bottom: 0; width: 1px; transform: translateX(-50%); }
  .iw-crosshair::after { top: 50%; left: 0; right: 0; height: 1px; transform: translateY(-50%); }

  .iw-duo { position: relative; overflow: hidden; }
  .iw-duo img { display: block; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); }
  .iw-duo::after { content: ""; position: absolute; inset: 0; background: var(--color-bp-accent); mix-blend-mode: color; pointer-events: none; }
  .iw-duo::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--color-bp-accent-900) 55%, transparent)); z-index: 1; pointer-events: none; }

  .iw-wave-bar { animation-name: iw-wave; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
  @keyframes iw-wave { 0%, 100% { height: 12%; opacity: .5; } 50% { height: 100%; opacity: 1; } }

  .iw-marquee { animation: iw-marquee-scroll 40s linear infinite; }
  @keyframes iw-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .iw-caret::after { content: "\\258c"; margin-left: 2px; color: var(--color-bp-accent); animation: iw-blink 1s steps(1) infinite; }
  @keyframes iw-blink { 50% { opacity: 0; } }
`;

export function BlueprintGrid({ dark, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`iw-grid pointer-events-none absolute -inset-px ${dark ? "iw-grid-dark" : ""} ${className}`}
    />
  );
}

export function Crosshair({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`iw-crosshair absolute ${className}`} />;
}

export function PlateCorners({ dark }: { dark?: boolean }) {
  const color = dark ? "bg-white/55" : "bg-bp-text/55";
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute h-3 w-3 ${
            pos === "tl" ? "-left-1.5 -top-1.5" : pos === "tr" ? "-right-1.5 -top-1.5" : pos === "bl" ? "-left-1.5 -bottom-1.5" : "-right-1.5 -bottom-1.5"
          }`}
        >
          <span className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 ${color}`} />
          <span className={`absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 ${color}`} />
        </span>
      ))}
    </>
  );
}

export function Kicker({ children, dark, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 font-display text-xs font-medium uppercase tracking-[0.14em] ${
        dark ? "text-white/60" : "text-bp-text/60"
      } ${className}`}
    >
      <span className={`h-px w-6 ${dark ? "bg-white/60" : "bg-bp-text/60"}`} />
      {children}
    </div>
  );
}

export function Cta({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  ghost,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: React.ReactNode;
  ghost?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2.5 border px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const solid = "border-bp-accent bg-bp-accent text-bp-bg hover:bg-bp-accent-700";
  const outline = "border-bp-divider bg-transparent text-bp-text hover:border-bp-accent hover:text-bp-accent";
  const cls = `${base} ${ghost ? outline : solid} ${className}`;
  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link to={href} className={cls}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export default function Welcome() {
  // overflow-x-clip (no "hidden"): recorta el scroll lateral sin crear un scroll
  // container -- overflow-x:hidden en un ancestro fuerza overflow-y a "auto" y
  // eso rompe el position:sticky del nav contra el viewport. "clip" evita ese acople.
  return (
    <div className="min-h-screen overflow-x-clip bg-bp-bg font-sans text-bp-text antialiased">
      <style>{IW_STYLES}</style>
      <WelcomeNavbar />

      <WelcomeHero />
      <WelcomeSections />
      <WelcomeFooter />
    </div>
  );
}
