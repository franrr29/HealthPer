// fondo de la seccion de arquitectura: grilla tecnica fina tipo plano, con marcas
// de esquina. sin blobs, sin dot-grid, sin gradiente violeta -- registro de un
// diagrama de sistema, no de un fondo decorativo generico.
export function FeaturesBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#EDF3FF]" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,27,77,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,27,77,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(120% 90% at 50% 35%, black 25%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 35%, black 25%, transparent 80%)",
        }}
      />

      <svg className="absolute left-6 top-28 h-9 w-9 text-wc-navy/25 sm:left-10 sm:top-32" viewBox="0 0 36 36" fill="none">
        <path d="M1 13V1H13" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg className="absolute bottom-20 right-6 h-9 w-9 text-wc-navy/25 sm:right-10" viewBox="0 0 36 36" fill="none">
        <path d="M35 23V35H23" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
