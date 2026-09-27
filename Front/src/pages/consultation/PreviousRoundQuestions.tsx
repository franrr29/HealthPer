import { ListChecks } from "lucide-react";
import type { SuggestedQuestion } from "@/types/suggestedQuestions";

interface PreviousRoundQuestionsProps {
  questions: SuggestedQuestion[];
}

export default function PreviousRoundQuestions({ questions }: PreviousRoundQuestionsProps) {

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="max-h-80 overflow-y-auto rounded-lg bg-muted p-4 space-y-3 border border-border">
      <div className="flex items-center gap-1.5 sticky top-0 bg-muted/95 backdrop-blur-sm pb-2 -mx-1 px-1">
        <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-display text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Questions to address
        </span>
      </div>
      {questions.map((q, i) => (
        <div
          key={i}
          className="rounded-lg bg-white px-5 py-4 border border-border hover:shadow-sm transition-shadow duration-200"
        >
          <p className="font-display text-sm font-bold text-foreground leading-snug">{q.question}</p>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed mt-2">{q.reason}</p>
        </div>
      ))}
    </div>
  );
}
