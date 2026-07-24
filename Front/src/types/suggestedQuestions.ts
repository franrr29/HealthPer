export interface SuggestedQuestion {
    question: string;
    reason: string;
}

export interface Props {
    questions: { question: string; reason: string }[];
    onContinue: () => void;
    onFinalize: () => void;
}

