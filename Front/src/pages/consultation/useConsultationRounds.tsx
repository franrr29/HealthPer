import { useState, useEffect } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import api from '../../services/api';
import type { SuggestedQuestion } from '@/types/suggestedQuestions';

type RoundPhase = 'idle' | 'recording' | 'analyzing' | 'reviewing' | 'done';


export default function useConsultationRounds(patientId: number, consultationId: number) {

    const [roundPhase, setRoundPhase] = useState<RoundPhase>('idle');
    const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
    const [previousQuestions, setPreviousQuestions] = useState<SuggestedQuestion[]>([]);
    const [fullTranscript, setFullTranscript] = useState<string>('');

    const { audioBlob, startRecording, stopRecording, error } = useAudioRecorder();


    function startRound() {
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
        stopRecording();
        setRoundPhase('done');
    }


    useEffect(() => {

        if (!audioBlob || roundPhase !== 'analyzing') return;

        const processRound = async () => {
            
            try {
                // transcribir el audio de esta ronda
                const formData = new FormData();
                formData.append('audio', audioBlob);
                const transcription = await api.post(`/consultations/${consultationId}/transcribe`, formData);

                // acumular con rondas anteriores
                const updatedTranscript = fullTranscript + ' ' + transcription.data.transcription; setFullTranscript(updatedTranscript);

                // pedir preguntas sugeridas al llm
                const questionsResponse = await api.post('/consultations/suggest-questions', {
                    transcript: updatedTranscript,
                    patient_id: patientId,
                });

                setSuggestedQuestions(questionsResponse.data.questions);
                setRoundPhase('reviewing');

            } catch (error) {
                console.error('Error processing round:', error);
                setRoundPhase('recording');
            }
        };

        processRound();
    }, [audioBlob]);


    return {
        roundPhase,
        previousQuestions,
        suggestedQuestions,
        fullTranscript,
        startRound,
        stopRound,
        finalizeRound,
        error,
    };
}