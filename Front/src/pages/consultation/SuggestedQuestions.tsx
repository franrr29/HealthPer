import { Sparkles, MessageCircleQuestion, Mic } from "lucide-react";

interface Props {
    questions: { question: string; reason: string }[];
    onContinue: () => void;
    onFinalize: () => void;
}

export default function SuggestedQuestions({ questions, onContinue, onFinalize }: Props) {

    return (
        <div className="space-y-4">
            {/* contenedor scrolleable con preguntas */}
            <div className="max-h-80 overflow-y-auto rounded-lg bg-[#F2EEE3] p-4 space-y-3 border border-[#C0C3B8]">
                <div className="flex items-center gap-1.5 sticky top-0 bg-[#F2EEE3]/95 backdrop-blur-sm pb-2 -mx-1 px-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#5E7367]" />
                    <span className="font-display text-[11px] font-bold uppercase tracking-widest text-[#6B7268]">
                        AI suggested questions
                    </span>
                </div>
                {questions.map((q, index) => (
                    <div
                        key={index}
                        className="rounded-lg bg-white px-5 py-4 border border-[#C0C3B8] hover:shadow-sm transition-shadow duration-200"
                    >
                        <div className="flex items-start gap-2.5">
                            <MessageCircleQuestion className="h-4 w-4 text-[#5E7367] mt-0.5 shrink-0" />
                            <p className="font-display text-sm font-bold text-foreground leading-snug">
                                {q.question}
                            </p>
                        </div>
                        <p className="text-xs font-medium text-[#6B7268] leading-relaxed mt-2 pl-[26px]">
                            {q.reason}
                        </p>
                    </div>
                ))}
            </div>

            {/* acciones */}
            <div className="flex gap-2.5">
                <button
                    onClick={onContinue}
                    className="neu-card bg-card text-foreground hover:brightness-95 rounded-xl px-4 py-2 border border-border text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
                >
                    <Mic className="h-3.5 w-3.5" />
                    Continue recording
                </button>
                <button
                    onClick={onFinalize}
                    className="neu-card bg-[#2F3B35] hover:bg-[#3B4A42] text-white rounded-md px-4 py-2 border border-[#3B4A42] text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                    Finalize consultation
                </button>
            </div>
        </div>
    );
}
