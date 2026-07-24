import { Navigate } from "react-router-dom";
import { ExternalLink, ChevronRight, Mic, Sparkles, History, FileText, MessageSquare, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "@/layouts/Navbar";
import { FeatureCard } from "./FeatureCard";
import { EngineeringDecisions } from "./EngineeringDecisions";
import { Reveal } from "@/components/common/Reveal";
import { Footer } from "@/layouts/Footer";

const LINKEDIN_URL = "https://www.linkedin.com/in/franrod-dev/";

const FEATURES = [
  {
    step: "01",
    icon: Mic,
    image: "/grabar.png",
    alt: "Voice recording during a consultation",
    title: "AI Audio Capture",
    description:
      "Capture multi-speaker clinical dialogues into high-fidelity transcripts engineered with Whisper.",
  },
  {
    step: "02",
    icon: Sparkles,
    image: "/preguntas.jpg",
    alt: "AI suggested questions while recording is paused",
    title: "Intelligent Pause Insights",
    description:
      "The system monitors silence thresholds to recommend high-yield diagnostic prompts in real time.",
  },
  {
    step: "03",
    icon: History,
    image: "/transcrib.png",
    alt: "Transcribed consultation history",
    title: "Longitudinal Patient Memory",
    description:
      "Vector-indexed medical history. Every encounter dynamically updates the patient's context window.",
  },
  {
    step: "04",
    icon: FileText,
    image: "/processing.png",
    alt: "AI processing a clinical summary",
    title: "SOAP Note Synthesis",
    description:
      "Deterministic LLM pipelines map unstructured conversations into standard SOAP clinical notes.",
  },
  {
    step: "05",
    icon: MessageSquare,
    image: "/summ.png",
    alt: "Text-based question and answer",
    title: "History Search Assistant",
    description:
      "Perform semantic queries against the entire medical record to surface critical background instantly.",
  },
  {
    step: "06",
    icon: Mail,
    image: "/sendMail.jpg",
    alt: "Consultation summary sent to the patient by email",
    title: "Patient Summary Dispatch",
    description:
      "Asynchronous email delivery sends clear, patient-friendly summaries without blocking the main workflow.",
  },
];



export default function Welcome() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1">
        {/* hero section */}
        <section className="relative isolate border-b border-slate-300/80 bg-slate-100 pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
          {/* fondo grid */}
          <div
            aria-hidden="true"
            className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-70"
          />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6 flex flex-col justify-center rounded-2xl border border-slate-300/80 bg-slate-100 p-6 sm:p-8 shadow-[8px_8px_18px_#cbd5e1,-8px_-8px_18px_#ffffff]">
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-tight">
                  Clinical conversations translated into structured medical intelligence.
                </h1>

                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  An ambient AI copilot tailored for medical practice. Stream live ambient audio, cross-reference historical charts via RAG, and sign off on SOAP documentation in seconds.
                </p>

                {/* botones de accion */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#features"
                    className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white border border-slate-800 shadow-[4px_4px_10px_#cbd5e1] hover:bg-slate-800 transition duration-150"
                  >
                    <span>Explore Architecture Pipeline</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col">
                <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-100 shadow-[8px_8px_18px_#cbd5e1,-8px_-8px_18px_#ffffff]">
                  <div className="flex items-center justify-between border-b border-slate-300/60 bg-slate-200/50 px-4 py-2 text-xs text-slate-500 font-mono">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="relative flex-1 overflow-hidden bg-slate-200">
                    <img
                      src="/banner.png"
                      alt="HealthPer consultation workspace UI"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
                <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Ambient processing paired with automated clinical chart generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* banner de metricas y precision */}
        <section className="bg-slate-100 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            {/* titulo introductorio de la seccion */}
            <Reveal>
              <div className="mb-8 text-center sm:text-left">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-1">
                  Performance Metrics
                </span>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Engineered for Clinical Precision
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Real-time benchmarks captured across live consultation runs and automated validation tests.
                </p>
              </div>
            </Reveal>

            <div
              className="relative overflow-hidden rounded-2xl border border-slate-300/80 bg-cover bg-center shadow-[10px_10px_22px_#cbd5e1,-10px_-10px_22px_#ffffff]"
              style={{ backgroundImage: "url('/bannerPrincipal.png')" }}
            >
              <div className="absolute inset-0 bg-slate-950/40" />

              <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[3px] p-6 sm:p-8">
                <div className="grid items-center gap-6 md:grid-cols-12">
                  
                  {/* metric principal */}
                  <div className="md:col-span-5">
                    <p className="font-mono text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                      98.4%
                    </p>

                    <p className="mt-2 text-base font-bold text-white drop-shadow-sm">
                      Clinical Term Precision
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-100">
                      Fine-tuned on complex medical jargon, multi-accent conversations, and domain-specific acronyms.
                    </p>
                  </div>

                  {/* estadisticas secundarias */}
                  <div className="md:col-span-7">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-white/30 bg-white/15 p-4 text-center backdrop-blur-md shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2)]">
                        <p className="font-mono text-2xl font-black text-white">
                          &lt;10s
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-100 font-bold">
                          Latency to SOAP
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/30 bg-white/15 p-4 text-center backdrop-blur-md shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2)]">
                        <p className="font-mono text-2xl font-black text-white">
                          + 136
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-100 font-bold">
                          Encounters Processed
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/30 bg-white/15 p-4 text-center backdrop-blur-md shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2)]">
                        <p className="font-mono text-2xl font-black text-white">
                          Real-time
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-100 font-bold">
                          RAG Memory Sync
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* pipeline de funciones */}
        <section id="features" className="bg-slate-100 py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="max-w-2xl">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-1">
                  System Architecture
                </span>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  End-to-End Processing Pipeline
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  A multi-stage asynchronous system built to convert natural clinical dialogue into structured, queryable data.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delayMs={index * 50} durationMs={300}>
                  <FeatureCard {...feature} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <EngineeringDecisions />

        {/* seccion final de ingenieria */}
        <section className="bg-slate-100 px-4 pb-16 sm:px-6 sm:pb-20">
          <Reveal>
            <div
              className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-100 bg-cover bg-center px-6 py-10 sm:px-8 sm:py-12 shadow-[10px_10px_22px_#cbd5e1,-10px_-10px_22px_#ffffff]"
              style={{ backgroundImage: "url('/bannerFinal.avif')" }}
            >
              <div className="absolute inset-0 bg-slate-950/60" aria-hidden="true" />

              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Interested in the engineering behind HealthPer?
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-slate-200 sm:text-sm sm:leading-relaxed">
                  Thanks for exploring HealthPer. If you'd like to discuss the project,
                   exchange ideas about AI engineering, or explore how I could contribute to your team.
                </p>

                <div className="mt-6">
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 font-sans text-xs font-bold tracking-wide text-white backdrop-blur-md shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-white/80 hover:bg-white/25 hover:shadow-[0_12px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white/90" />
                  </a>
                  
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}