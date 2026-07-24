import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { askPatientInfo } from "@/services/patients.service";
import type { ChatMessage, PatientChatWidgetProps } from "@/types/patient";

//widget flotante de chat con la IA sobre el historial del paciente
export default function PatientChatWidget({ patientId }: PatientChatWidgetProps) {

  const [isChatOpen, setIsChatOpen] = useState(false);

  const [question, setQuestion] = useState<string>("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  //ref al final de la lista de mensajes, para hacer auto scroll
  const bottomRef = useRef<HTMLDivElement>(null);

  //mutation para preguntar a la IA y guardar el par pregunta respuesta
  const askMutation = useMutation({
    mutationFn: (question: string) => askPatientInfo(patientId, question),
    onSuccess: (answer, question) => {
      setChatMessages((prevMessages) => [...prevMessages, { question, answer }]);
      setQuestion("");
    },
  });

  //cada vez que cambian los mensajes o el estado de carga, scrolleo al fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, askMutation.isPending]);

  //dispara la pregunta si el input no esta vacio
  function handleAskQuestion() {
    if (question.trim() === "") {
      return;
    }
    askMutation.mutate(question);
  }

  //permite enviar con la tecla Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAskQuestion();
    }
  }

  return (
    <>
      {/* estilos de animacion propios del widget */}
      <style>{`
        @keyframes widget-pop {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        .widget-pop { animation: widget-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .bubble-in  { animation: bubble-in 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .typing-dot { animation: dot-bounce 1.2s infinite ease-in-out; }
      `}</style>

      {/* boton flotante (robot) - se ve cuando el chat esta cerrado */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center justify-center p-4 bg-[#0F172A] text-white rounded-2xl shadow-lg shadow-slate-900/20 border border-slate-700/50 hover:brightness-110 hover:bg-[#1E293B] active:brightness-90 transition-transform duration-200"
          aria-label="Open AI assistant"
        >
          <Bot size={24} className="group-hover:rotate-6 transition-transform duration-200 text-sky-400" />
        </button>
      )}

      {/* panel del chat - se ve cuando el chat esta abierto */}
      {isChatOpen && (
        <div className="widget-pop fixed bottom-6 right-6 z-50 w-[90vw] max-w-[380px] h-[620px] max-h-[80vh] bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/80 flex flex-col overflow-hidden">

          {/* header del panel con gradiente */}
          <div className="flex items-center justify-between bg-[#0F172A] text-white px-5 py-4 shadow-sm border-b border-slate-800">
            <div className="flex items-center gap-3">
              {/* avatar del bot */}
              <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-2 border border-slate-700/60 shadow-inner">
                <Bot size={20} className="text-sky-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold tracking-wide text-slate-100">AI Assistant</span>
                  <Sparkles size={13} className="text-sky-400 opacity-90" />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Patient history insights</span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl p-1.5 transition-colors active:scale-95"
              aria-label="Close AI assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* zona de mensajes (scrolleable) */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/20">

            {/* estado vacio: cuando todavia no hay preguntas */}
            {chatMessages.length === 0 && !askMutation.isPending && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3.5 px-4 my-auto">
                <div className="bg-[#0F172A]/10 border border-[#0F172A]/20 rounded-2xl p-4 shadow-sm">
                  <Bot size={32} className="text-[#0F172A]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">How can I help with this patient?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
                    Ask about medical history, lab results, treatments, or recent progress notes.
                  </p>
                </div>
              </div>
            )}

            {/* historial del chat con burbujas */}
            {chatMessages.map((msg, index) => (
              <div key={index} className="flex flex-col gap-3">

                {/* pregunta del doctor: derecha, celeste */}
                <div className="flex justify-end bubble-in">
                  <div className="bg-[#0F172A] text-white rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] shadow-sm">
                    <p className="text-sm leading-relaxed font-normal">{msg.question}</p>
                  </div>
                </div>

               {/* respuesta de la IA: izquierda, con avatar */}
<div className="bubble-in flex items-start justify-start gap-2.5">
  {/* Avatar */}
  <div className="mt-0.5 shrink-0 rounded-xl border border-slate-300 bg-slate-100 p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <Bot size={15} className="text-slate-800 dark:text-slate-200" />
  </div>

  {/* Burbuja */}
  <div
    className="
      max-w-[85%]
      rounded-2xl rounded-tl-xs
      bg-card
      px-4 py-3

      border-2 border-slate-300
      ring-1 ring-slate-200/80
      shadow-sm

      sm:border
      sm:border-border
      sm:ring-0
      sm:shadow-xs

      dark:border-slate-700
      dark:ring-slate-700/40
    "
  >
    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
      {msg.answer}
    </p>
  </div>
</div>
</div>
            ))}

            {/* typing indicator: puntitos mientras el LLM responde */}
            {askMutation.isPending && (
              <div className="flex justify-start items-start gap-2.5 bubble-in">
                <div className="bg-[#0F172A]/10 border border-[#0F172A]/20 rounded-xl p-1.5 shrink-0 mt-0.5">
                  <Bot size={15} className="text-[#0F172A]" />
                </div>
                <div className="bg-card border border-border/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-1.5 h-4">
                    <span className="typing-dot w-2 h-2 bg-[#0F172A]/60 rounded-full" style={{ animationDelay: "0ms" }} />
                    <span className="typing-dot w-2 h-2 bg-[#0F172A]/60 rounded-full" style={{ animationDelay: "200ms" }} />
                    <span className="typing-dot w-2 h-2 bg-[#0F172A]/60 rounded-full" style={{ animationDelay: "400ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* mensaje de error */}
            {askMutation.isError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center bubble-in">
                <p className="text-xs font-medium text-destructive">Something went wrong. Please try again.</p>
              </div>
            )}

            {/* ancla invisible para el auto-scroll */}
            <div ref={bottomRef} />

          </div>

          {/* input + boton de enviar (fijo abajo) */}
          <div className="p-3 border-t border-border/80 bg-card/90 backdrop-blur-md">
            <div className="flex items-center gap-2 bg-background border border-border rounded-2xl p-1.5 focus-within:border-[#0F172A]/50 focus-within:ring-2 focus-within:ring-[#0F172A]/20 transition-all">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="w-full px-3 py-1.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                onClick={handleAskQuestion}
                disabled={askMutation.isPending || !question.trim()}
                className="bg-[#0F172A] text-white rounded-xl p-2.5 shrink-0 shadow-sm hover:bg-[#1E293B] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F172A] disabled:active:scale-100 transition-all"
                aria-label="Send question"
              >
                <Send size={15} className="translate-x-[0.5px]" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}