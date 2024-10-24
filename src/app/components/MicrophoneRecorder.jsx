import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const MicrophoneRecorder = ({ onTranscription }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const toggleRecording = () => {
        setIsRecording(prev => !prev);
    };

    useEffect(() => {
        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log('Stream:', stream);
                
                const recorder = new MediaRecorder(stream);
                console.log('Recorder:', recorder);
                
                audioChunksRef.current = [];

                recorder.ondataavailable = event => {
                    audioChunksRef.current.push(event.data);
                };

                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    onTranscription(audioBlob);
                };

                recorder.onerror = event => {
                    console.error('Recorder error:', event.error);
                };

                recorder.start();
                mediaRecorderRef.current = recorder;
            } catch (error) {
                console.error('Error accessing the microphone:', error);
                alert('Could not access the microphone. Please check your permissions.');
            }
        };

        if (isRecording) {
            startRecording();
        } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current = null; // Clear the reference
            }
        };
    }, [isRecording, onTranscription]);

    return (
        <div>
            <button 
                onClick={toggleRecording} 
                className={`bg-blue-500 text-white p-2 rounded ${isRecording ? 'bg-red-500' : ''}`}
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
                <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} size="2x" />
            </button>
            {isRecording && <span> Recording...</span>}
        </div>
    );
};

export default MicrophoneRecorder;
