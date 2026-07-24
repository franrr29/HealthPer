import { Sparkles, MessageCircleQuestion } from "lucide-react";

interface Props {
    questions: { question: string; reason: string }[];
    onContinue: () => void;
    onFinalize: () => void;
}

export default function SuggestedQuestions({ questions, onContinue, onFinalize }: Props) {

    return (
        <div className="space-y-4">
            {/* contenedor scrolleable con preguntas */}
            <div className="max-h-80 overflow-y-auto rounded-2xl bg-slate-50/70 p-4 space-y-3 border border-slate-200/70 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.04),inset_-1px_-1px_4px_rgba(255,255,255,0.6)]">
                <div className="flex items-center gap-1.5 sticky top-0 bg-slate-50/95 backdrop-blur-sm pb-2 -mx-1 px-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-display text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        AI suggested questions
                    </span>
                </div>
                {questions.map((q, index) => (
                    <div
                        key={index}
                        className="rounded-2xl bg-white px-5 py-4 border border-slate-100 shadow-[3px_3px_9px_rgba(17,34,64,0.06),-3px_-3px_9px_rgba(255,255,255,0.7)] hover:shadow-[4px_4px_11px_rgba(17,34,64,0.09),-4px_-4px_11px_rgba(255,255,255,0.8)] transition-shadow duration-200"
                    >
                        <div className="flex items-start gap-2.5">
                            <MessageCircleQuestion className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <p className="font-display text-sm font-bold text-slate-900 leading-snug">
                                {q.question}
                            </p>
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed mt-2 pl-[26px]">
                            {q.reason}
                        </p>
                    </div>
                ))}
            </div>

            {/* acciones */}
            <div className="flex gap-2.5">
                <button
                    onClick={onContinue}
                    className="neu-card bg-card text-foreground hover:brightness-95 rounded-xl px-4 py-2 border border-border text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                    Continue recording
                </button>
                <button
                    onClick={onFinalize}
                    className="neu-card bg-slate-900 hover:brightness-110 text-white rounded-xl px-4 py-2 border border-slate-700/60 text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                    Finalize consultation
                </button>
            </div>
        </div>
    );
}
