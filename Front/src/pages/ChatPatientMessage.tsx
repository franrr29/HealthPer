import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, X, Send } from "lucide-react";
import { askPatientInfo } from "@/services/patients.service";
import type { ChatMessage, PatientChatWidgetProps } from "@/types/patient";


//widget flotante de chat con la IA sobre el historial del paciente
export default function PatientChatWidget({ patientId }: PatientChatWidgetProps) {

  const [isChatOpen, setIsChatOpen] = useState(false);

  const [question, setQuestion] = useState<string>("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  //ref al final de la lista de mensajes, para hacer auto-scroll
  const bottomRef = useRef<HTMLDivElement>(null);


  //mutation para preguntar a la IA y guardar el par pregunta-respuesta
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
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-4px); opacity: 1; }
        }
        .widget-pop { animation: widget-pop 0.25s ease-out; }
        .bubble-in  { animation: bubble-in 0.2s ease-out; }
        .typing-dot { animation: dot-bounce 1.2s infinite ease-in-out; }
      `}</style>

      {/* boton flotante (robot) - se ve cuando el chat esta cerrado */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full p-4 shadow-lg shadow-primary/30 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200"
          aria-label="Open AI assistant"
        >
          <Bot size={26} />
        </button>
      )}

      {/* panel del chat - se ve cuando el chat esta abierto */}
      {isChatOpen && (
        <div className="widget-pop fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm h-[70vh] bg-card rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden">

          {/* header del panel con gradiente */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary/85 text-white px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              {/* avatar del bot */}
              <div className="bg-white/20 rounded-full p-1.5">
                <Bot size={18} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">AI Assistant</span>
                <span className="text-[11px] text-white/80">Patient history</span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close AI assistant"
            >
              <X size={20} />
            </button>
          </div>

          {/* zona de mensajes (scrolleable) */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background/40">

            {/* estado vacio: cuando todavia no hay preguntas */}
            {chatMessages.length === 0 && !askMutation.isPending && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className="bg-primary/10 rounded-full p-4">
                  <Bot size={36} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground max-w-[80%]">
                  Ask anything about this patient's history.
                </p>
              </div>
            )}

            {/* historial del chat con burbujas */}
            {chatMessages.map((msg, index) => (
              <div key={index} className="flex flex-col gap-3">

                {/* pregunta del doctor: derecha, celeste */}
                <div className="flex justify-end bubble-in">
                  <div className="bg-primary text-white rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%] shadow-sm">
                    <p className="text-sm leading-relaxed">{msg.question}</p>
                  </div>
                </div>

                {/* respuesta de la IA: izquierda, con avatar */}
                <div className="flex justify-start items-end gap-2 bubble-in">
                  <div className="bg-primary/10 rounded-full p-1.5 shrink-0">
                    <Bot size={16} className="text-primary" />
                  </div>
                  <div className="bg-muted text-foreground rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%] shadow-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.answer}</p>
                  </div>
                </div>

              </div>
            ))}

            {/* typing indicator: puntitos mientras el LLM responde */}
            {askMutation.isPending && (
              <div className="flex justify-start items-end gap-2 bubble-in">
                <div className="bg-primary/10 rounded-full p-1.5 shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" style={{ animationDelay: "0ms" }} />
                    <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" style={{ animationDelay: "200ms" }} />
                    <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" style={{ animationDelay: "400ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* mensaje de error */}
            {askMutation.isError && (
              <p className="text-sm text-destructive text-center">Something went wrong. Please try again.</p>
            )}

            {/* ancla invisible para el auto-scroll */}
            <div ref={bottomRef} />

          </div>

          {/* input + boton de enviar (fijo abajo) */}
          <div className="flex gap-2 p-3 border-t border-border bg-card">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="border border-border rounded-full px-4 py-2.5 flex-1 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
            <button
              onClick={handleAskQuestion}
              disabled={askMutation.isPending || !question.trim()}
              className="bg-primary text-white rounded-full p-2.5 shadow-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send question"
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}