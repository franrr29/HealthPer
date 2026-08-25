import { Navigate } from "react-router-dom";
import { ExternalLink, ChevronRight, Mic, Sparkles, History, FileText, MessageSquare, Mail } from "lucide-react";
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
    icon: Mic,
    image: "/grabar.png",
    alt: "Voice recording during a consultation",
    title: "Live Audio Capture",
    description:
      "Stream ambient clinical audio in real time. The system captures multi-speaker dialogue ready for downstream processing by Whisper.",
  },
  {
    step: "02",
    icon: Sparkles,
    image: "/preguntas.jpg",
    alt: "AI suggested questions while recording is paused",
    title: "Context-Aware Suggested Questions",
    description:
      "Pause the session and instantly receive AI-generated follow-up questions drawn from the patient's full history and the current conversation.",
  },
  {
    step: "03",
    icon: History,
    image: "/transcrib.png",
    alt: "Transcribed consultation text",
    title: "Precision Transcription",
    description:
      "Stop the recording and the entire session is transcribed with high accuracy, preserving clinical terminology and speaker turns.",
  },
  {
    step: "04",
    icon: FileText,
    image: "/processing.png",
    alt: "AI processing a clinical summary",
    title: "SOAP Note Generation",
    description:
      "The transcription is processed through a deterministic LLM pipeline that maps unstructured dialogue into a standard SOAP clinical note.",
  },
  {
    step: "05",
    icon: MessageSquare,
    image: "/summ.png",
    alt: "Text-based question and answer",
    title: "Medical History Assistant",
    description:
      "Run semantic queries against the patient's entire medical record to surface relevant background before, during, or after a consultation.",
  },
  {
    step: "06",
    icon: Mail,
    image: "/sendMail.jpg",
    alt: "Consultation summary sent to the patient by email",
    title: "Patient Summary by Email",
    description:
      "Send a clear, patient-friendly summary of the consultation directly to the patient's inbox without blocking the clinical workflow.",
  },
];



export default function Welcome() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F2EEE3] font-sans text-foreground antialiased">
      <Navbar />

      <main className="flex-1">
        {/* hero section: foto de fondo, fija en el viewport mientras el resto de la pagina se desliza encima */}
        <section className="fixed inset-x-0 top-0 z-0 flex h-screen w-full flex-col justify-center overflow-hidden pb-16 sm:justify-end sm:pb-24">
          {/* foto de fondo, sin tinte para que se vea natural */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: "url('/banner.jpg')" }}
          />

          {/* degrade solo en la base, para legibilidad del texto sin cubrir el video */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2F3B35]/90 via-[#2F3B35]/25 to-transparent"
          />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#DDE6E0]/80 mb-4 block">
              Clinical AI Copilot
            </span>

            <h1 className="font-feature text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              The AI medical copilot that
              <br className="hidden lg:block" />
              {" "}
              <RotatingText words={["captures", "questions", "transcribes", "summarizes", "delivers"]} />
            </h1>

            <p className="mt-5 mx-auto max-w-md text-base leading-relaxed text-[#EDF2EE]/80">
              An ambient AI copilot for medical consultations. Capture live audio, get context-aware suggested questions from the patient's history, generate SOAP notes automatically, and send a clear summary straight to the patient's inbox.
            </p>

            {/* botones de accion */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#features"
                className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#2F3B35] hover:bg-[#F2EEE3] transition duration-150"
              >
                <span>See How It Works</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* espaciador: ocupa el lugar del hero fijo para que el resto del contenido arranque debajo */}
        <div aria-hidden="true" className="h-screen w-full" />

        {/* todo el contenido restante se desliza por encima del hero fijo (z-10 > z-0) */}
        <div className="relative z-10">

        {/* banner de metricas y precision: primera seccion que cubre el hero. Sin fondo propio detras a proposito: el hueco de la esquina redondeada deja ver el video fijo, ese es el efecto de reveal buscado */}
        <section className="rounded-t-[2.5rem] bg-[#F2EEE3] px-4 py-12 shadow-[0_-16px_40px_rgba(47,59,53,0.15)] sm:rounded-t-[3.5rem] sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            {/* titulo introductorio de la seccion */}
            <Reveal>
              <div className="mb-8 text-center sm:text-left">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#6B7268] block mb-1">
                  Performance Metrics
                </span>
                <h2 className="font-feature text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Engineered for Clinical Precision
                </h2>
                <p className="mt-1 text-sm text-[#535B4F]">
                  Real-time benchmarks captured across live consultation runs and automated validation tests.
                </p>
              </div>
            </Reveal>

            <div
              className="relative overflow-hidden rounded-lg border border-[#C0C3B8] bg-cover bg-center"
              style={{ backgroundImage: "url('/bannerPrincipal.png')" }}
            >
              <div className="absolute inset-0 bg-[#2F3B35]/70" />

              <div className="relative p-6 sm:p-8">
                <div className="grid items-center gap-6 md:grid-cols-12">

                  {/* metric principal */}
                  <div className="md:col-span-5">
                    <p className="font-feature text-4xl sm:text-5xl font-semibold tracking-tight text-[#E9DEC8]">
                      98.4%
                    </p>

                    <p className="mt-2 text-sm sm:text-base font-semibold text-white">
                      Clinical Term Precision
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#EDF2EE]/80">
                      Fine-tuned on complex medical jargon, multi-accent conversations, and domain-specific acronyms.
                    </p>
                  </div>

                  {/* estadisticas secundarias */}
                  <div className="md:col-span-7">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="rounded-md border border-white/15 p-2 sm:p-4 text-center">
                        <p className="font-feature text-lg sm:text-2xl font-semibold text-white">
                          &lt;10s
                        </p>
                        <p className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-wider text-[#EDF2EE]/80 font-bold">
                          Latency to SOAP
                        </p>
                      </div>

                      <div className="rounded-md border border-white/15 p-2 sm:p-4 text-center">
                        <p className="font-feature text-lg sm:text-2xl font-semibold text-white">
                          +136
                        </p>
                        <p className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-wider text-[#EDF2EE]/80 font-bold">
                          Encounters
                        </p>
                      </div>

                      <div className="rounded-md border border-white/15 p-2 sm:p-4 text-center">
                        <p className="font-feature text-lg sm:text-2xl font-semibold text-white break-words">
                          Real-time
                        </p>
                        <p className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-wider text-[#EDF2EE]/80 font-bold">
                          RAG Sync
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* fondo solido a partir de aca: evita que las esquinas redondeadas de las secciones siguientes dejen ver el video fijo de atras */}
        <div className="bg-[#F2EEE3]">

        {/* pipeline de funciones: panel propio en verde forestal, ancho completo, para romper la monotonia del ivory y darle ritmo a la pagina */}
        <section id="features" className="relative -mt-10 overflow-hidden rounded-t-[2.5rem] bg-[#2F3B35] py-16 shadow-[0_-16px_40px_rgba(47,59,53,0.2)] sm:-mt-14 sm:rounded-t-[3.5rem] sm:py-24">
          {/* textura decorativa: rayas medicas cruzadas, muy sutiles, para que el verde no se sienta plano */}
          <div aria-hidden="true" className="medical-crosshatch pointer-events-none absolute inset-0" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="max-w-2xl text-center sm:mx-auto">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#E9DEC8]/80 block mb-1">
                  Consultation Workflow
                </span>
                <h2 className="font-feature text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  From Live Audio to Patient Inbox
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#EDF2EE]/70">
                  A step-by-step pipeline that captures the consultation, suggests questions in real time, transcribes, summarizes, and delivers the result to the patient.
                </p>
              </div>
            </Reveal>

            <div className="mt-16">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delayMs={index * 60} durationMs={400}>
                  <FeatureCard {...feature} isLast={index === FEATURES.length - 1} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <EngineeringDecisions />

        {/* seccion final de ingenieria: panel completo con esquinas redondeadas, igual que el resto de secciones */}
        <section
          className="relative -mt-10 overflow-hidden rounded-[2.5rem] bg-cover bg-center px-4 py-20 shadow-[0_-16px_40px_rgba(47,59,53,0.15)] sm:-mt-14 sm:rounded-[3.5rem] sm:px-6 sm:py-28"
          style={{ backgroundImage: "url('/bannerFinal.avif')" }}
        >
          <div className="absolute inset-0 bg-[#2F3B35]/80" aria-hidden="true" />

          <Reveal>
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-feature text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Interested in the engineering behind HealthPer?
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-[#EDF2EE]/80 sm:text-sm sm:leading-relaxed">
                Thanks for exploring HealthPer. If you'd like to discuss the project,
                 exchange ideas about AI engineering, or explore how I could contribute to your team.
              </p>

              <div className="mt-6">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[#E9DEC8]/40 bg-white/5 px-5 py-2.5 font-sans text-xs font-bold tracking-wide text-white transition-colors duration-200 hover:border-[#E9DEC8]/70 hover:bg-white/10"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#E9DEC8]" />
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* spacer real (no margin) para separar del footer sin riesgo de colapso de margenes */}
        <div className="h-12 sm:h-16" />

        </div>
        </div>
      </main>

      {/* bg propio: sin esto, el hueco de la esquina redondeada del footer podria dejar ver la foto fija de atras durante el scroll */}
      <div className="relative z-10 bg-[#F2EEE3]">
        <Footer />
      </div>
    </div>
  );
}