//hook para grabar audio y guardarlo en un archivo:

import { useState, useRef } from 'react';

export function useAudioRecorder() {

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [error, setError] = useState<string | null>(null);

    function startRecording() {

        setError(null);
        navigator.mediaDevices.getUserMedia({ audio: true })

        //si el usuario permite el acceso al micrfono, se crea un mediaRecorder y se empieza a grabar
            .then(stream => {

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                //para cuando para grabar, se crea un blob con los chunks de audio y se guarda en el estado
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
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
            //aca apago el microf
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    }

    return { isRecording, audioBlob, startRecording, stopRecording, error };
}