import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useParams, useNavigate } from "react-router-dom";
import { transcribeAudio, summarizeConsultation, signConsultation } from "@/services/consultations.service";
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
    const [signing, setSigning] = useState(false);
    const [signError, setSignError] = useState<string | null>(null);
    //aviso de exito al firmar antes de navegar
    const [signSuccess, setSignSuccess] = useState(false);


    const navigate = useNavigate();


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
            <h1 className="text-2xl font-bold text-foreground mb-2">Consultation</h1>
            <p className="text-sm text-muted-foreground mb-6">Patient ID: {patientIdNumber} — Consultation ID: {consultationIdNumber}</p>

            {/* paso 1: grabacion */}
            <div className="bg-card rounded-2xl shadow-md p-6 border border-border mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">1. Recording</p>
                    {/* puntito rojo que titila mientras se graba */}
                    {isRecording && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-sm text-red-500 font-medium">REC</span>
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={startRecording}
                        disabled={isRecording || isTranscribing}
                        className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start recording
                    </button>
                    <button
                        onClick={stopRecording}
                        disabled={!isRecording}
                        className="bg-card text-foreground rounded-xl px-5 py-2.5 border border-border shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Stop recording
                    </button>
                </div>
                {error && <p className="text-sm text-destructive mt-3">{error}</p>}
                {isTranscribing && <p className="text-sm text-muted-foreground mt-3">Transcribing audio...</p>}
                {transcriptionError && <p className="text-sm text-destructive mt-3">{transcriptionError}</p>}
            </div>

            {/* paso 2: transcripcion */}
            {transcription && (
                <div className="bg-card rounded-2xl shadow-md p-6 border border-border mb-6">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">2. Transcription</p>
                    <p className="text-base text-foreground">{transcription}</p>

                    {!loadingSummary && !summary && (
                        <button
                            disabled={loadingSummary}
                            onClick={() => {
                                setLoadingSummary(true);
                                summarizeConsultation(consultationIdNumber)
                                    .then(summary => {
                                        setSummary(JSON.stringify(summary, null, 2));
                                        setLoadingSummary(false);
                                    })
                                    .catch(err => {
                                        console.error('Error summarizing consultation:', err);
                                        setSummaryError('Error summarizing consultation');
                                        setLoadingSummary(false);
                                    });
                            }}
                            className="mt-4 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Summarize
                        </button>
                    )}
                    {loadingSummary && <p className="text-sm text-muted-foreground mt-3">Loading summary...</p>}
                    {summaryError && <p className="text-sm text-destructive mt-3">{summaryError}</p>}
                </div>
            )}

            {/* paso 3: resumen y firma */}
            {summary && (
                <div className="bg-card rounded-2xl shadow-md p-6 border border-border mb-6">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">3. Summary</p>
                    <EditSummary consultationId={consultationIdNumber} summary={summary} />

                    <div className="mt-4">
                        {signSuccess ? (
                            //aviso verde de exito antes de redirigir
                            <p className="text-sm text-green-600 font-medium">Consultation signed successfully. Redirecting...</p>
                        ) : signing ? (
                            <p className="text-sm text-muted-foreground">Signing consultation...</p>
                        ) : (
                            <button
                                onClick={() => {
                                    // Firma la consulta y la guarda en la base de datos
                                    setSigning(true);
                                    signConsultation(consultationIdNumber)
                                        .then(() => {
                                            //muestro el aviso de exito y navego despues de un momento
                                            setSignSuccess(true);
                                            setTimeout(() => {
                                                navigate(`/patients/${patientId}`);
                                            }, 1200);
                                        })
                                        .catch((err) => {
                                            console.error("Error signing consultation:", err);
                                            setSignError("Error signing consultation");
                                            setSigning(false);
                                        });
                                }}
                                className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium"
                            >
                                Sign Consultation
                            </button>
                        )}
                        {signError && <p className="text-sm text-destructive mt-3">{signError}</p>}
                    </div>
                </div>
            )}
        </div>
    )
}