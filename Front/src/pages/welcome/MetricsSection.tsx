import { Reveal } from "@/components/common/Reveal";
import { CountUp } from "@/components/common/CountUp";
import { BlueprintGrid, Crosshair } from "./Welcome";

export function MetricsSection() {
  return (
    <section id="metrics" className="relative overflow-hidden bg-bp-accent-900 px-6 py-20 text-white/90 sm:px-8 sm:py-28">
      <BlueprintGrid dark />
      <Crosshair className="left-15 top-15 text-white/35" />
      <Crosshair className="right-15 top-15 text-white/35" />
      <Crosshair className="bottom-15 left-15 text-white/35" />
      <Crosshair className="bottom-15 right-15 text-white/35" />

      <div className="relative mx-auto max-w-[1140px]">
        <Reveal className="mb-14 flex items-center gap-3.5 font-display text-[11px] uppercase tracking-[0.18em] text-white/55">
          <span className="h-px flex-1 bg-white/20" />
          Section 04 / Benchmarks — validated on 136+ trial encounters
        </Reveal>

        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">/A · TRANSCRIPTION ACCURACY</div>
            <div className="mt-4 font-display text-[72px] leading-none text-white sm:text-[104px] lg:text-[clamp(88px,10vw,160px)]">
              <CountUp value={98.4} decimals={1} />
              <span className="text-bp-accent-300">%</span>
            </div>
            <p className="mt-6 max-w-[420px] text-[16px] leading-relaxed text-white/70">
              Whisper Large-v3 via Groq, benchmarked against physician-reviewed ground truth on multi-speaker clinical audio.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-col border-t border-white/[0.18]">
              <div className="flex items-baseline justify-between border-b border-white/[0.14] py-5.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Pipeline latency</span>
                <span className="font-display text-[36px] leading-none text-white sm:text-[44px]">
                  &lt;<CountUp value={10} suffix="s" />
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.14] py-5.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Trial encounters</span>
                <span className="font-display text-[36px] leading-none text-white sm:text-[44px]">
                  <CountUp value={136} suffix="+" />
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.14] py-5.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Chart-time saved</span>
                <span className="font-display text-[36px] leading-none text-white sm:text-[44px]">
                  <CountUp value={62} suffix="%" />
                </span>
              </div>
              <div className="flex items-baseline justify-between py-5.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Memory sync</span>
                <span className="font-display text-[36px] italic leading-none text-white sm:text-[44px]">realtime</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
