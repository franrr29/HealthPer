//hook para grabar audio y guardarlo en un archivo:

import { useState, useRef, useEffect } from 'react';

export function useAudioRecorder() {

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const mimeTypeRef = useRef<string>('audio/webm');

    const [error, setError] = useState<string | null>(null);

    function startRecording() {

        setError(null);

        // detectar formato soportado por el navegador
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
        mimeTypeRef.current = mimeType;

        navigator.mediaDevices.getUserMedia({ audio: true })

            //si el usuario permite el acceso al microfono, se crea un mediaRecorder y se empieza a grabar
            .then(stream => {

                const mediaRecorder = new MediaRecorder(stream, { mimeType });
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                //cuando para de grabar, crea un blob con los chunks y lo guarda en el estado
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
                    setAudioBlob(audioBlob);
                };

                mediaRecorder.start();
                setIsRecording(true);
            })

            //si el dr no permite acceso al microf
            .catch(err => {
                console.error('Error accessing microphone:', err);
                setError('Error accessing microphone. Please check your permissions.');
            });
    }

    function stopRecording() {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            //apagar el microfono
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    }

    //limpiar el stream del microfono cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return { isRecording, audioBlob, startRecording, stopRecording, error };
}