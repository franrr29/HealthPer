import { useReveal } from "./useReveal";

// envuelve cualquier contenido y lo hace aparecer con un fade + subida suave al scrollear
export function Reveal({children,delayMs = 0,durationMs = 700,className = "",
}: {children: React.ReactNode;delayMs?: number;durationMs?: number;className?: string;}) {
  
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      // cuando visible pasa a true, sube a su lugar y se muestra con fade
      className={`motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{
        transition: `opacity ${durationMs}ms ease-out ${delayMs}ms, transform ${durationMs}ms ease-out ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
