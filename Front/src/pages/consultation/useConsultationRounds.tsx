import { useState, useEffect } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import api from '../../services/api';
import type { SuggestedQuestion } from '@/types/suggestedQuestions';

export type RoundPhase = 'idle' | 'recording' | 'analyzing' | 'finalizing' | 'reviewing' | 'done';

const TRANSCRIPTION_ERROR = 'Failed to process audio. Try again.';
const SUGGESTED_QUESTIONS_ERROR = 'Audio transcribed, but the suggested questions could not be loaded.';


export default function useConsultationRounds(patientId: number, consultationId: number) {

    const [roundPhase, setRoundPhase] = useState<RoundPhase>('idle');
    const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
    const [previousQuestions, setPreviousQuestions] = useState<SuggestedQuestion[]>([]);
    const [fullTranscript, setFullTranscript] = useState<string>('');
    const [roundError, setRoundError] = useState<string | null>(null);

    const { audioBlob, startRecording, stopRecording, error } = useAudioRecorder();


    function startRound() {
        setRoundError(null);
        setPreviousQuestions(suggestedQuestions);
        setSuggestedQuestions([]);
        setRoundPhase('recording');
        startRecording();
    }

    function stopRound() {
        stopRecording();
        setRoundPhase('analyzing');
    }

    function finalizeRound() {
        // the recorder is only active while recording, its last audio still has to be transcribed
        if (roundPhase === 'recording') {
            stopRecording();
            setRoundPhase('finalizing');
            return;
        }

        // nothing pending to transcribe when coming from reviewing or idle
        if (roundPhase === 'reviewing' || roundPhase === 'idle') {
            setRoundPhase('done');
        }
    }


    // runs only when a new audioBlob is produced, not on phase changes
    useEffect(() => {

        if (!audioBlob || (roundPhase !== 'analyzing' && roundPhase !== 'finalizing')) return;

        const isFinalizing = roundPhase === 'finalizing';

        const processRound = async () => {

            try {
                // transcribir el audio de esta ronda
                const formData = new FormData();
                formData.append('audio', audioBlob);
                const transcription = await api.post(`/consultations/${consultationId}/transcribe`, formData);

                // acumular con rondas anteriores
                const updatedTranscript = fullTranscript + ' ' + transcription.data.transcription;
                setFullTranscript(updatedTranscript);

                // the doctor is done, so no suggested questions are needed
                if (isFinalizing) {
                    setRoundPhase('done');
                    return;
                }

                // pedir preguntas sugeridas al llm
                try {
                    const questionsResponse = await api.post('/consultations/suggest-questions', {
                        transcript: updatedTranscript,
                        patient_id: patientId,
                    });

                    setSuggestedQuestions(questionsResponse.data.questions);
                } catch (questionsError) {
                    // the transcript is already saved, so recording again would not help
                    console.error('Error loading suggested questions:', questionsError);
                    setRoundError(SUGGESTED_QUESTIONS_ERROR);
                }

                setRoundPhase('reviewing');

            } catch (transcriptionError) {
                console.error('Error processing round:', transcriptionError);
                setRoundError(TRANSCRIPTION_ERROR);

                // a closing consultation has no state worth going back to
                setRoundPhase(isFinalizing ? 'done' : 'reviewing');
            }
        };

        processRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioBlob]);


    return {
        roundPhase,
        previousQuestions,
        suggestedQuestions,
        fullTranscript,
        roundError,
        startRound,
        stopRound,
        finalizeRound,
        error,
    };
}
