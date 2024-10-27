"use client"

import React, { useEffect, useState } from 'react';
import MicrophoneRecorder from './components/MicrophoneRecorder';
import axios from 'axios';

const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY; 
const DEEPGRAM_API_URL = process.env.NEXT_PUBLIC_DEEPGRAM_API_URL;

const Home = () => {
    const [transcription, setTranscription] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionsHistory, setTranscriptionsHistory] = useState([]);

    // Load past transcriptions from localStorage on mount
    useEffect(() => {
        const savedTranscriptions = JSON.parse(localStorage.getItem('transcriptions')) || [];
        setTranscriptionsHistory(savedTranscriptions);
    }, []);

    const handleTranscription = async (audioBlob) => {
        setIsTranscribing(true);
        console.log('key:', DEEPGRAM_API_KEY);
        
        try {
            const response = await axios.post(DEEPGRAM_API_URL, audioBlob, {
                headers: {
                    'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                    'Content-Type': 'audio/wav', // Adjusted to match the format
                },
            });
            console.log('response:', response);

            let transcriptionText = response.data.results.channels[0].alternatives[0].transcript;
            console.log('transcriptionText:', transcriptionText);
            setTranscription(transcriptionText);

            // Save to history and localStorage
            setTranscriptionsHistory((prevHistory) => {
                const newHistory = [...prevHistory, transcriptionText].filter(e => e);;
                localStorage.setItem('transcriptions', JSON.stringify(newHistory));
                return newHistory;
            });
        } catch (error) {
            console.error('Transcription error:', error);
            alert('Error during transcription. Please check your microphone permissions or try again.');
        } finally {
            setIsTranscribing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-6">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Audio Transcription App</h1>
            <MicrophoneRecorder onTranscription={handleTranscription} />
            {isTranscribing && <p className="mt-4 text-blue-600 text-2xl">Transcribing...</p>}
            <div className="mt-6 w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transcription:</h2>
                <p className="text-gray-700 text-lg whitespace-pre-wrap">
                    {transcription || 'No transcription available.'}
                </p>
            </div>
            <div className="mt-6 w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Transcriptions:</h2>
                <ul className="text-gray-700 h-36 text-lg overflow-y-auto">
                    {console.log(transcriptionsHistory)}
                    {transcriptionsHistory.length > 0 ? (
                        transcriptionsHistory.map((item, index) => (
                            <li key={index} className="border-b py-2">{item}</li>
                        ))
                    ) : (
                        <li className="py-2">No past transcriptions available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;
