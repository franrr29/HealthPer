import { Navigate } from "react-router-dom";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "@/layouts/Navbar";
import { FeatureCard } from "./FeatureCard";
import { EngineeringDecisions } from "./EngineeringDecisions";
import { Reveal } from "@/components/common/Reveal";
import { Footer } from "@/layouts/Footer";
import { RotatingText } from "@/components/common/RotatingText";

const LINKEDIN_URL = "https://www.linkedin.com/in/franrod-dev/";

const FEATURES = [
  {
    step: "01",
    image: "/grabar.png",
    alt: "Voice recording during a consultation",
    title: "Live audio capture",
    description: "Stream ambient clinical audio in real time. The system captures multi-speaker dialogue ready for downstream processing by Whisper.",
  },
  {
    step: "02",
    image: "/preguntas.jpg",
    alt: "AI suggested questions while recording is paused",
    title: "Context-aware suggested questions",
    description: "Pause the session and instantly get follow-up questions drawn from the patient's history and the current conversation.",
  },
  {
    step: "03",
    image: "/transcrib.png",
    alt: "Transcribed consultation text",
    title: "Precision transcription",
    description: "Stop the recording and the entire session is transcribed with high accuracy, preserving clinical terminology and speaker turns.",
  },
  {
    step: "04",
    image: "/processing.png",
    alt: "AI processing a clinical summary",
    title: "SOAP note generation",
    description: "The transcription runs through a deterministic pipeline that maps unstructured dialogue into a standard SOAP clinical note.",
  },
  {
    step: "05",
    image: "/summ.png",
    alt: "Text-based question and answer",
    title: "Medical history assistant",
    description: "Run semantic queries against the patient's entire medical record to surface relevant background before, during, or after a visit.",
  },
  {
    step: "06",
    image: "/sendMail.jpg",
    alt: "Consultation summary sent to the patient by email",
    title: "Patient summary by email",
    description: "Send a clear, patient-friendly summary of the consultation straight to the patient's inbox without blocking the clinical workflow.",
  },
];

export default function Welcome() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-sans text-foreground antialiased selection:bg-teal-500/20 selection:text-teal-900">
      <main className="flex-1">
        
        {/* HERO FULL-WIDTH EDGE-TO-EDGE */}
        <section className="relative isolate w-full overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-center scale-105" style={{ backgroundImage: "url('/banner.jpg')" }} />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/30" />

          {/* navbar y titulo en flujo normal, nunca se pueden superponer sin importar el alto de la ventana */}
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
            <Navbar />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
            <div className="max-w-3xl">

              <h1 className="font-feature text-5xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl lg:leading-[1.02]">
                The AI medical copilot that <br />
                <RotatingText words={["captures", "questions", "transcribes", "summarizes", "delivers"]} />
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-neutral-300 font-normal">
                An ambient intelligence layer for modern clinical practice. Real-time audio ingestion, cross-referenced patient history, deterministic SOAP generation, and secure patient dispatch.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#features"
                  className="group inline-flex items-center gap-3 rounded-xl bg-teal-400 px-7 py-4 text-xs font-bold uppercase tracking-widest text-neutral-950 shadow-xl shadow-teal-400/10 hover:bg-teal-300 hover:scale-[1.02] transition-all duration-200"
                >
                  <span>Explore Workflow</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* METRICS */}
        <section id="metrics" className="px-4 py-16 sm:px-8 sm:py-24 bg-white border-b border-neutral-200/60">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-12 max-w-3xl">
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-teal-600 block mb-3">
                  Validated benchmarks
                </span>
                <h2 className="font-feature text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                  Zero tolerance for clinical error
                </h2>
              </div>
            </Reveal>

            <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center">
              <Reveal className="min-w-0 lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-neutral-200 shadow-xl bg-neutral-100 max-w-xs lg:max-w-none">
                  <img
                    src="/stethoscopeFlatlay.jpg"
                    alt="Stethoscope precision"
                    className="aspect-[4/5] w-full object-cover sm:aspect-[3/4] hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Reveal>

              <Reveal delayMs={80} className="min-w-0 lg:col-span-7">
                <p className="font-feature text-6xl font-black leading-none tracking-tighter text-neutral-900 sm:text-7xl">
                  98.4%
                </p>

                <p className="mt-5 max-w-md text-base text-neutral-600 sm:text-lg">
                  Transcription accuracy on specialized medical vocabulary. Trained across dense clinical lexicons and multi-accent conversations.
                </p>

                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-neutral-200 pt-6">
                  <div>
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Pipeline latency
                    </dt>
                    <dd className="mt-1 font-feature text-2xl font-bold text-neutral-900">
                      Under 10s
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Trial encounters
                    </dt>
                    <dd className="mt-1 font-feature text-2xl font-bold text-neutral-900">
                      136+
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Memory sync
                    </dt>
                    <dd className="mt-1 font-feature text-2xl font-bold text-neutral-900">
                      Real-time
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="relative overflow-hidden bg-cover bg-center bg-fixed py-20 sm:py-28"
          style={{ backgroundImage: "url('/doctor.jpg')" }}
        >
          {/* bg-fixed: el tamano del fondo se calcula contra el viewport, no contra el alto total de la seccion */}
          <div aria-hidden="true" className="absolute inset-0 bg-neutral-950/55" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-8">
            <Reveal>
              <div className="max-w-2xl sm:mx-auto sm:text-center mb-14">
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-teal-400 block mb-3">
                  Consultation workflow
                </span>
                <h2 className="font-feature text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  From live audio to patient inbox
                </h2>
                <p className="mt-4 text-base text-neutral-400">
                  Six steps, each one handled automatically while the doctor stays focused on the patient.
                </p>
              </div>
            </Reveal>

            <div>
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delayMs={index * 60} durationMs={400}>
                  <FeatureCard {...feature} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <EngineeringDecisions />

        {/* CTA: unica seccion en teal solido, para que el color de marca cierre la pagina con fuerza */}
        <section className="bg-teal-700 px-4 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-mono text-xs font-bold tracking-widest uppercase text-teal-200 block mb-4">
                Get in touch
              </span>
              <h2 className="font-feature text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Interested in the engineering behind HealthPer?
              </h2>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-teal-50/90">
                Thanks for exploring HealthPer. Let's connect to discuss architecture decisions, distributed AI pipelines, or software engineering collaboration.
              </p>

              <div className="mt-10">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-teal-800 transition-transform duration-200 hover:scale-105"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      <Footer />
    </div>
  );
}