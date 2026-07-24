import { useEffect, useRef, useState } from "react";

// cuando es elemento entra al viewport, lo hace aparecer con un fade + subida suave
export function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    // el observer avisa cuando el elemento entra al viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.15 } 
    );

    observer.observe(el);

    // limpio el observer al desmontar asi no queda colgado
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}