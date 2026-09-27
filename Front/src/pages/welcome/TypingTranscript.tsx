import { useEffect, useState } from "react";
import { useReveal } from "@/components/common/useReveal";
import { TRANSCRIPT_LINES } from "./welcomeData";

export function TypingTranscript() {
  const { ref, visible } = useReveal();
  const [lines, setLines] = useState<{ speaker: string; text: string; done: boolean }[]>([]);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const run = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setLines(TRANSCRIPT_LINES.map((l) => ({ speaker: l.s, text: l.t, done: true })));
        return;
      }
      for (let li = 0; li < TRANSCRIPT_LINES.length; li++) {
        if (cancelled) return;
        const line = TRANSCRIPT_LINES[li];
        setLines((prev) => [...prev, { speaker: line.s, text: "", done: false }]);
        for (let ci = 0; ci < line.t.length; ci++) {
          if (cancelled) return;
          await new Promise((r) => {
            timeoutId = setTimeout(r, 18 + Math.random() * 26);
          });
          setLines((prev) => {
            const next = [...prev];
            next[li] = { ...next[li], text: line.t.slice(0, ci + 1) };
            return next;
          });
        }
        setLines((prev) => {
          const next = [...prev];
          next[li] = { ...next[li], done: true };
          return next;
        });
        await new Promise((r) => {
          timeoutId = setTimeout(r, 600);
        });
      }
    };

    run();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [visible]);

  return (
    <div ref={ref} className="min-h-[320px] font-sans text-[15px] leading-relaxed">
      {lines.map((l, i) => (
        <div key={i} className="mb-4.5">
          <span
            className={`mono mr-2 inline-block w-9 font-mono text-[11px] tracking-[0.14em] ${
              l.speaker === "DR" ? "text-bp-accent" : "text-bp-text/55"
            }`}
          >
            {l.speaker}
          </span>
          <span className={l.done ? "" : "iw-caret"}>{l.text}</span>
        </div>
      ))}
    </div>
  );
}
