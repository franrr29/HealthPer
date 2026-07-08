import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useParams } from "react-router-dom";
import { transcribeAudio, summarizeConsultation } from "@/services/consultations.service";
import { useEffect, useState } from "react";
import EditSummary from "./EditSummary";


//component que muestra el flujo de la consulta para que el dr grabe y pare audio:
export default function ConsultationFlow() {
    const { consultationId, patientId } = useParams<{ consultationId: string, patientId: string }>();
    const consultationIdNumber = Number(consultationId);
    const patientIdNumber = Number(patientId);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const { isRecording, audioBlob, startRecording, stopRecording, error } = useAudioRecorder();
    

    //se ejecuta al parar de grabar, para enviar el audio a la api y transcribirlo
    useEffect(() => {
        if (audioBlob) {
            
            setIsTranscribing(true);
            //cuando se para la grabacion, se envia el audio a la api para transcribirlo
            transcribeAudio(consultationIdNumber, audioBlob)

                .then(transcription => {
                    setTranscription(transcription);
                    setIsTranscribing(false);
                })

                .catch(err => {
                    console.error('Error transcribing audio:', err);
                    setTranscriptionError('Error transcribing audio');
                    setIsTranscribing(false);
                });
        }
    }, [audioBlob, consultationIdNumber]);

    return (

        <div>
            <h1>Consultation Flow</h1>
            <p>Patient ID: {patientIdNumber}</p>
            <p>Consultation ID: {consultationIdNumber}</p>

            {transcription &&  (
                <div>
                    <h2>Transcription</h2>
                    <p>{transcription}</p>
                </div>
            )}



        <button onClick={startRecording} disabled={isRecording}>
            Start recording consultation
        </button>



        <button onClick={stopRecording} disabled={!isRecording}>
            Stop recording consultation
        </button>



       { transcription && !loadingSummary && !summary &&

        <button disabled={loadingSummary} onClick={() => {
            
            setLoadingSummary(true);
            summarizeConsultation(consultationIdNumber)

                .then(summary => {
                    setSummary(summary);
                    setLoadingSummary(false);
                })

                .catch(err => {
                    console.error('Error summarizing consultation:', err);
                    setSummaryError('Error summarizing consultation');
                    setLoadingSummary(false);
                });
        }}>Summarize Consultation</button>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isTranscribing && <p>Transcribing audio...</p>}

        {transcriptionError && <p style={{ color: 'red' }}>{transcriptionError}</p>}

        {loadingSummary && <p>Loading summary...</p>}

        {summaryError && <p style={{ color: 'red' }}>{summaryError}</p>}


        {summary && (
            <div>
                <h2>Summary</h2>
                <EditSummary consultationId={consultationIdNumber} summary={summary} />
            </div>
        )}
         </div>
    )
}