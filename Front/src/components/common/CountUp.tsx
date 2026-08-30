import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// cuenta desde 0 hasta el valor final cuando entra al viewport, en vez de aparecer
// ya escrito -- el detalle que usan los scribes clinicos de referencia en sus stats
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", durationMs = 1400, className = "" }: CountUpProps) {
  const { ref, visible } = useReveal();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setDisplay(value * easeOutCubic(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
