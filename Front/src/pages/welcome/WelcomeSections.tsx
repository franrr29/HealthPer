import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { CountUp } from "@/components/common/CountUp";
import { useReveal } from "@/components/common/useReveal";
import { BlueprintGrid, Crosshair, Kicker } from "./Welcome";

const STACK_ITEMS = [
  "Whisper Large-v3",
  "Llama 3.3 · 70B",
  "Gemini Embeddings",
  "Hybrid RAG · RRF",
  "MySQL FULLTEXT",
  "JWT / httpOnly",
  "Resend Delivery",
  "React 19 · TS",
];

const STEPS = [
  { n: "01", title: "Listen", img: "/microfono.jpg", tag: "CAPTURE", desc: "Multi-speaker clinical audio, in the browser." },
  { n: "02", title: "Ask", img: "/generaPreguntas.jpg", tag: "CONTEXT", desc: "Pause and get follow-ups drawn from the patient’s memory.", accent: true },
  { n: "03", title: "Transcribe", img: "/transcribe.jpg", tag: "WHISPER-V3", desc: "Speaker turns and clinical terms preserved." },
  { n: "04", title: "Summarize", img: "/resumen.jpg", tag: "SOAP", desc: "A structured note, review-and-sign." },
  { n: "05", title: "Follow up", img: "/enviaMail.jpg", tag: "RESEND", desc: "Patient-friendly summary in their inbox." },
];

const RETRIEVED = [
  { score: "0.92", text: "Reacts to amoxicillin — documented on 2025-11-04. Switched to azithromycin." },
  { score: "0.87", text: "Seasonal rhinitis — mild, on cetirizine PRN. No respiratory involvement." },
  { score: "0.81", text: "No known drug reactions beyond penicillin family." },
];

const DECISIONS = [
  { n: "01", cat: "Retrieval", t: "Hybrid RAG · RRF fusion", b: "Cosine similarity misses exact terms. Keyword misses paraphrase. Reciprocal Rank Fusion combines both without hand-tuning a weight." },
  { n: "02", cat: "Security", t: "doctor_id in every query", b: "Filtered at the SQL level, not the middleware. Verified by an explicit IDOR test in patients.test.ts." },
  { n: "03", cat: "Resilience", t: "Non-blocking background jobs", b: "Chunking, embedding, memory-merge and email delivery are fired after signing — the clinical workflow never waits." },
  { n: "04", cat: "State", t: "Incremental patient memory", b: "Each summary is merged into the previous memory row by the LLM. Prompt cost stays constant no matter how many visits accumulate." },
  { n: "05", cat: "Storage", t: "No dedicated vector DB", b: "Embeddings live in a MySQL JSON column. Retrieval is always scoped to a single patient — operational simplicity over premature scale." },
  { n: "06", cat: "Auth", t: "JWT in httpOnly cookies", b: "Token out of reach of XSS. A single interceptor retries once against /auth/refresh on a 401 — one endpoint, one moving part." },
];

const TRANSCRIPT_LINES = [
  { s: "DR", t: "How long have the headaches been recurring?" },
  { s: "PT", t: "About three weeks. Usually late afternoon, right behind the eyes." },
  { s: "DR", t: "Anything different around when they started — new medication, sleep, screens?" },
  { s: "PT", t: "I switched to the new antihypertensive on the 4th. Sleep’s the same." },
  { s: "DR", t: "Any nausea or visual disturbance with them?" },
];

function TypingTranscript() {
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

export function WelcomeSections() {
  return (
    <>
      {/* MARQUEE */}
      <section className="overflow-hidden border-b border-bp-divider py-7">
        <div className="iw-marquee flex gap-14 whitespace-nowrap font-display text-xl font-semibold uppercase tracking-[0.06em] text-bp-text/65">
          {[0, 1].map((rep) => (
            <span key={rep} className="flex gap-14">
              {STACK_ITEMS.map((item) => (
                <span key={item}>◆ {item}</span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32">
        <BlueprintGrid className="opacity-40" />
        <div className="relative mx-auto max-w-[1360px]">
          <Reveal className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
            <div>
              <Kicker>Section 01 / Pipeline</Kicker>
              <h2 className="mt-5 font-display text-[32px] font-bold uppercase leading-[0.95] tracking-[-0.02em] sm:text-[46px] lg:text-[clamp(34px,4.2vw,68px)]">
                From conversation
                <br />
                to <span className="font-normal italic text-bp-accent">care.</span>
              </h2>
            </div>
            <p className="max-w-[480px] text-lg leading-relaxed text-bp-text/75 lg:justify-self-end">
              Five stages turn a live consultation into an indexed patient memory and a plain-language email to the patient. No typing, no context loss.
            </p>
          </Reveal>

          <div className="relative">
            <div aria-hidden="true" className="absolute inset-x-0 top-[128px] hidden h-px bg-bp-divider lg:block" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delayMs={i * 90}>
                  <div className="relative border border-bp-divider">
                    <div className="iw-duo aspect-square">
                      <img src={s.img} alt={s.title} />
                    </div>
                    <div className="absolute left-2.5 top-2.5 z-[2] border border-white/20 bg-black/40 px-2 py-1 font-display text-[11px] uppercase tracking-[0.14em] text-white">
                      {s.tag}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 z-[2] font-display text-[42px] font-light leading-none text-white">{s.n}</div>
                  </div>
                  <div className="mt-5">
                    <div className={`font-mono text-[11px] uppercase tracking-[0.14em] ${s.accent ? "text-bp-accent" : "text-bp-text/50"}`}>
                      Stage {s.n}
                    </div>
                    <h3 className="mb-1.5 mt-1.5 font-display text-[28px] font-bold uppercase leading-tight tracking-[-0.01em]">{s.title}</h3>
                    <p className="m-0 text-sm leading-relaxed text-bp-text/70">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE PANEL */}
      <section id="stack" className="relative border-y border-bp-divider bg-bp-neutral-100 px-6 py-24 sm:px-8 sm:py-32">
        <Crosshair className="left-10 top-10" />
        <Crosshair className="right-10 top-10" />
        <Crosshair className="bottom-10 left-10" />
        <Crosshair className="bottom-10 right-10" />

        <div className="mx-auto max-w-[1360px]">
          <Reveal className="mb-18 max-w-[780px]">
            <Kicker>Section 02 / Live surface</Kicker>
            <h2 className="mb-5 mt-5 font-display text-[28px] font-bold uppercase leading-[1] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,60px)]">
              A patient&apos;s memory,
              <br />
              <span className="font-normal italic text-bp-accent">queryable</span> in plain language.
            </h2>
            <p className="text-lg leading-relaxed text-bp-text/75">
              Signed consultations are chunked, embedded, and indexed. Ask a question — retrieval fuses cosine similarity and MySQL FULLTEXT through
              Reciprocal Rank Fusion.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[1.05fr_1fr]">
            {/* Transcript plate */}
            <Reveal className="relative border border-bp-divider bg-bp-bg p-7">
              <div className="mb-6 flex items-center justify-between">
                <Kicker>Transcript</Kicker>
              </div>
              <TypingTranscript />
            </Reveal>

            {/* Query plate */}
            <Reveal className="relative overflow-hidden border border-bp-divider bg-bp-accent-900 p-7 text-white/90">
              <BlueprintGrid dark className="opacity-50" />

              <div className="relative">
                <Kicker dark>Query</Kicker>
                <div className="mt-5.5 flex items-center gap-2.5 border border-white/20 bg-white/[0.04] px-4 py-3.5">
                  <Search className="h-3.5 w-3.5" />
                  <span className="font-mono text-[13px] text-white/90">Any allergies flagged in the last 12 months?</span>
                </div>

                <div className="mt-6">
                  <div className="flex flex-col gap-2.5">
                    {RETRIEVED.map((r) => (
                      <div key={r.score} className="flex gap-3 border border-white/[0.14] bg-white/[0.03] p-3">
                        <span className="font-mono text-[11px] text-bp-accent-300">{r.score}</span>
                        <span className="text-sm leading-relaxed">{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6.5 grid grid-cols-2 gap-5 border-t border-white/[0.14] pt-5">
                  <div>
                    <div className="mt-1 font-display text-[22px]">Cosine + FULLTEXT</div>
                  </div>
                  <div>
                    <div className="mt-1 font-display text-[22px]">Llama 3.3 70B</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRODUCT: capturas reales de la app -- no mockups. */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32">
        <BlueprintGrid className="opacity-30" />
        <div className="relative mx-auto max-w-[1360px]">
          <Reveal className="mb-16 max-w-[780px]">
            <Kicker>Section 03 / Product</Kicker>
            <h2 className="mb-5 mt-5 font-display text-[28px] font-bold uppercase leading-[1] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,60px)]">
              Real screens,
              <br />
              <span className="font-normal italic text-bp-accent">not mockups.</span>
            </h2>
            <p className="text-lg leading-relaxed text-bp-text/75">
              Every panel below is a live screenshot of the running app — the AI assistant answering a clinical question, and a patient&apos;s consultation memory.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal className="relative flex h-[420px] items-center justify-center border border-bp-divider bg-bp-neutral-100 p-6 sm:h-[520px]">
              <img
                src="/llmchat.png"
                alt="AI assistant answering a clinical question about a patient's medications"
                className="max-h-full max-w-full object-contain"
              />
            </Reveal>
            <Reveal delayMs={90} className="relative flex h-[420px] items-center justify-center border border-bp-divider bg-bp-neutral-100 p-6 sm:h-[520px]">
              <img
                src="/consulta.png"
                alt="Patient consultation record with clinical intelligence memory"
                className="max-h-full max-w-full object-contain"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* METRICS */}
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

      {/* DECISIONS */}
      <section id="decisions" className="relative px-6 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1360px]">
          <Reveal className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
            <div>
              <Kicker>Section 05 / Engineering</Kicker>
              <h2 className="mt-5 font-display text-[28px] font-bold uppercase leading-[1] tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(30px,3.6vw,60px)]">
                Decisions,
                <br />
                not defaults.
              </h2>
            </div>
            <p className="max-w-[480px] text-lg leading-relaxed text-bp-text/75 lg:justify-self-end">
              Every choice below was defended in writing. The system reads like an engineering note, not a feature list.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 border-t border-bp-divider sm:grid-cols-2">
            {DECISIONS.map((d, i) => {
              const isRight = i % 2 === 1;
              const isLast = i >= DECISIONS.length - 2;
              return (
                <Reveal
                  key={d.n}
                  delayMs={i * 70}
                  className={`p-8 sm:p-10 ${isLast ? "" : "border-b border-bp-divider"} ${isRight ? "sm:border-l sm:border-bp-divider" : ""}`}
                >
                  <div className="mb-5 flex items-baseline gap-4">
                    <span className="font-display text-[52px] font-light leading-[0.8] text-bp-text/25 sm:text-[64px]">{d.n}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bp-accent">{d.cat}</span>
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-bold uppercase tracking-[-0.01em] sm:text-[30px]">{d.t}</h3>
                  <p className="m-0 max-w-[460px] text-sm leading-relaxed text-bp-text/70">{d.b}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA CLOSE */}
      <section className="relative overflow-hidden bg-bp-text px-6 py-28 text-bp-bg sm:px-8 sm:py-40">
        <BlueprintGrid dark />
        <div className="relative mx-auto max-w-[1360px]">
          <div className="grid grid-cols-1 items-end gap-14 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">/ End of spec sheet</div>
              <h2 className="mt-5 font-display text-[34px] font-bold uppercase leading-[1] tracking-[-0.015em] text-bp-bg sm:text-[48px] lg:text-[clamp(34px,4.2vw,68px)]">
                Open the
                <br />
                <span className="font-normal italic text-bp-accent-300">recruiter</span> preview.
              </h2>
              <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/70">
                One click, no credentials. Sample doctor, three patients, twelve signed consultations pre-loaded and indexed.
              </p>
            </Reveal>
            <Reveal className="flex flex-col items-start gap-3.5">
              <Link
                to="/login"
                className="inline-flex items-center gap-2.5 border border-bp-bg bg-bp-bg px-6.5 py-4.5 font-display text-[17px] font-semibold uppercase tracking-wide text-bp-text transition-colors hover:bg-bp-accent-100"
              >
                Launch Preview
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/franrr29/HealthPer"
                className="inline-flex items-center gap-2.5 border border-white/25 px-5 py-3.5 font-display text-[15px] font-semibold uppercase tracking-wide text-white/85 transition-colors hover:border-bp-accent hover:text-bp-accent-300"
              >
                Read the code
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
