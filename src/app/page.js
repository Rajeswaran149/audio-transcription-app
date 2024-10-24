"use client"

import React, { useState } from 'react';
import MicrophoneRecorder from './components/MicrophoneRecorder';
import axios from 'axios';

const DEEPGRAM_API_KEY = `${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`; 
const DEEPGRAM_API_URL = `${process.env.NEXT_PUBLIC_DEEPGRAM_API_URL}`;

const Home = () => {
    const [transcription, setTranscription] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);

    const handleTranscription = async (audioBlob) => {
        setIsTranscribing(true);
        console.log('key:',DEEPGRAM_API_KEY)
        try {
            console.log('first')
            const response = await axios.post(DEEPGRAM_API_URL, audioBlob, {
                headers: {
                    'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                    'Content-Type': 'audio/wav',
                },
            });
            console.log('response:',response)

            const transcriptionText = response.data.results.channels[0].alternatives[0].transcript;
            console.log('transcriptionText :',transcriptionText)
            setTranscription(transcriptionText);
        } catch (error) {
            console.error('Transcription error:', error);
            alert('Error during transcription. Please try again.');
        } finally {
            setIsTranscribing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Audio Transcription App</h1>
            <MicrophoneRecorder onTranscription={handleTranscription} />
            {isTranscribing && <p>Transcribing...</p>}
            <div className="mt-6 w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transcription:</h2>
                <p className="text-gray-700 text-lg whitespace-pre-wrap">
                    {transcription || 'No transcription available.'}
                </p>
            </div>
        </div>
    );
};

export default Home;
