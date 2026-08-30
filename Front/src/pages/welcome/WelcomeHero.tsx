import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { BlueprintGrid, Crosshair, Kicker, Cta } from "./Welcome";

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
    <span className="relative mt-2 inline-flex min-h-[1.08em] items-center overflow-hidden border border-bp-accent/18 bg-bp-accent/[0.06] px-3 py-1 align-baseline text-bp-accent shadow-[0_10px_30px_rgba(46,107,235,0.12)] sm:px-4 sm:py-1.5">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${words[index]}-${index}`}
          initial={{ x: 22, opacity: 0, clipPath: "inset(0 0 0 100%)" }}
          animate={{ x: 0, opacity: 1, clipPath: "inset(0 0 0 0%)" }}
          exit={{ x: -10, opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap font-black tracking-[-0.03em] text-bp-accent will-change-transform"
        >
          {words[index]}
          <span className="ml-0.5 inline-block h-[0.9em] w-px animate-pulse bg-bp-accent/75 align-[-0.08em]" />
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
    <div className="flex h-full items-center gap-[4px]">
      {bars.map((b, i) => (
        <span
          key={i}
          className="iw-wave-bar block w-[4px] origin-center rounded-none bg-current"
          style={{ height: `${b.height}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
        />
      ))}
    </div>
  );
}

export function WelcomeHero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-24 sm:px-8">
      <BlueprintGrid />
      <Crosshair className="left-10 top-[120px]" />
      <Crosshair className="right-[60px] top-[220px]" />
      <Crosshair className="bottom-10 left-[60%]" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Kicker>SPEC · HP-01 / AMBIENT MEDICAL SCRIBE</Kicker>
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <h1 className="m-0 font-display text-[40px] font-bold uppercase leading-[0.92] tracking-[-0.025em] sm:text-[56px] lg:text-[clamp(40px,4.8vw,76px)]">
                The ambient
                <br />
                copilot that
                <br />
                <RotatingHeroWord words={HERO_WORDS} />
              </h1>
            </Reveal>

            <Reveal delayMs={90}>
              <p className="mt-10 max-w-[520px] text-lg leading-relaxed text-bp-text/75 sm:text-[19px]">
                Record the visit. Get an instant transcript, structured SOAP note, and a running patient memory you can query in plain language.
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
          </div>

          <Reveal delayMs={220} className="lg:justify-self-end">
            <div className="mt-14 flex flex-col items-center gap-3 text-center lg:mt-0 lg:flex-row lg:items-center lg:gap-5 lg:text-left">
              <div className="flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-bp-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bp-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-bp-accent" />
                </span>
                REC · 00:04:12
              </div>
              <div className="h-10.5 w-full max-w-[320px] text-bp-accent-700 lg:max-w-[420px] lg:flex-1">
                <Wave />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
