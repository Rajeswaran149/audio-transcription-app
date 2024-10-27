import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const MicrophoneRecorder = ({ onTranscription }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            audioChunksRef.current = []; // Reset the audio chunks

            recorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                onTranscription(audioBlob);
            };

            recorder.onerror = (event) => {
                console.error('Recorder error:', event.error);
                alert('An error occurred during recording. Please try again.');
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
        } catch (error) {
            console.error('Error accessing the microphone:', error);
            alert('Could not access the microphone. Please check your permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop all tracks
        }
    };

    useEffect(() => {
        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }

        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isRecording]);

    const toggleRecording = () => {
        setIsRecording(prev => !prev);
    };

    return (
        <div>
            <button 
                onClick={toggleRecording} 
                className={`bg-blue-500 hover:${isRecording ? 'bg-red-800' : 'bg-blue-800' } text-white p-2 rounded ${isRecording ? 'bg-red-500' : ''}`}
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
                <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} size="4x" />
            </button>
            {isRecording && <span className="ml-2 text-yellow-300 text-2xl">Recording...</span>}
        </div>
    );
};

export default MicrophoneRecorder;
