import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Cta } from "./Welcome";

const HERO_WORDS = ["listens", "asks", "transcribes", "summarizes", "follows up"];

function RotatingHeroWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    // la palabra ocupa su propio renglon (nada mas comparte linea), asi que el
    // ancho puede variar libremente entre palabras sin provocar saltos de renglon.
    // overflow-hidden solo recorta el deslizamiento horizontal; sin borde, fondo ni sombra
    <span className="relative mt-7 inline-flex min-h-[1.08em] items-center overflow-hidden pb-1 align-baseline text-hp-clinic-deep">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${words[index]}-${index}`}
          initial={{ x: 22, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -10, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap font-bold tracking-[-0.03em] text-hp-clinic-deep will-change-transform"
        >
          {words[index]}
          <span className="ml-0.5 inline-block h-[0.9em] w-px animate-pulse bg-hp-clinic/75 align-[-0.08em]" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Wave() {
  const bars = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const d = Math.sin(i * 0.4) * 0.5 + 0.5;
        // seno con dos frecuencias distintas por barra en vez de Math.random(): determinista
        // (no rompe la regla de pureza de render) pero igual de dispar visualmente.
        const jitterA = Math.sin(i * 12.9898) * 0.5 + 0.5;
        const jitterB = Math.sin(i * 4.1414) * 0.5 + 0.5;
        return {
          height: 12 + d * 60,
          delay: (-jitterA * 1.4).toFixed(2),
          duration: (1 + jitterB * 0.9).toFixed(2),
        };
      }),
    []
  );
  return (
    <div className="flex h-full w-full items-center gap-[2px] sm:gap-[4px]">
      {bars.map((b, i) => (
        <span
          key={i}
          className="hp-wave-bar block min-w-[2px] max-w-[4px] flex-1 origin-center rounded-full bg-current"
          style={{ height: `${b.height}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
        />
      ))}
    </div>
  );
}

export function WelcomeHero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-24 sm:px-8 sm:pb-32">
      <div className="absolute inset-0">
        <img src="/coat.jpg" alt="Doctor in a white coat" width={1920} height={1080} fetchPriority="high" decoding="async" className="h-full w-full -scale-x-100 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-hp-paper via-hp-paper/85 to-hp-paper/40" />
      </div>

      <div className="relative mx-auto max-w-[1360px]">
        <div className="max-w-[640px]">
          <Reveal>
            <h1 className="m-0 text-[40px] font-bold leading-[0.96] tracking-[-0.025em] sm:text-[56px] lg:text-[clamp(40px,4.8vw,76px)]">
              The consultation
              <br />
              assistant that
              <br />
              <RotatingHeroWord words={HERO_WORDS} />
            </h1>
          </Reveal>

          <Reveal delayMs={90}>
            <p className="mt-12 max-w-[520px] text-lg leading-relaxed text-hp-ink-2 sm:text-[19px]">
              Record the visit and get the transcript, a SOAP note ready to review and sign, and a patient history you can question in plain language. Built for doctors who chart after every consultation.
            </p>
          </Reveal>

          <Reveal delayMs={160}>
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Cta href="/login">
                Try Recruiter Preview
                <ArrowRight className="h-3.5 w-3.5" />
              </Cta>
              <Cta href="#workflow" ghost>
                See the pipeline
              </Cta>
            </div>
          </Reveal>

          <Reveal delayMs={230}>
            <div className="mt-10 flex w-full max-w-[520px] items-center gap-3 rounded-2xl border border-hp-hair bg-white px-4 py-4 sm:gap-5 sm:px-5 shadow-hp-sm">
              <div className="flex shrink-0 items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-hp-clinic-deep sm:text-xs sm:tracking-[0.16em]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hp-clinic opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-hp-clinic" />
                </span>
                REC · 00:04:12
              </div>
              <div className="h-14 min-w-0 flex-1 overflow-hidden text-hp-clinic">
                <Wave />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
