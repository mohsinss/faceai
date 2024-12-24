"use client";

import { useState, useEffect, useRef } from 'react';

const StreamMeasurements = ({ className }) => {
  const [measurements, setMeasurements] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const webSocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const initializeWebSocket = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
      
      // Include API key in URL
      const wsUrl = `wss://api.hume.ai/v0/stream/models?api_key=${apiKey}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setStatus('Connected to measurements stream');
        console.log('Measurements WebSocket connected');
        webSocketRef.current = ws;

        // Send publish message
        ws.send(JSON.stringify({
          "publish": {
            "models": {
              "prosody": {
                "identify_speakers": false,
                "granular_predictions": true
              }
            },
            "stream_window_ms": 1000
          }
        }));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Received measurement:', response);
        
        if (response.type === 'predictions') {
          setMeasurements(prev => [...prev, {
            timestamp: new Date(),
            data: response.predictions
          }]);
        } else if (response.type === 'warning') {
          console.warn('Stream warning:', response.message);
          setStatus(`Warning: ${response.message}`);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError(`WebSocket error: ${error.message}`);
      };

      ws.onclose = () => {
        setStatus('Disconnected from measurements stream');
        console.log('Measurements WebSocket closed');
      };
    } catch (error) {
      console.error('Error initializing measurements:', error);
      setError(`Failed to initialize measurements: ${error.message}`);
    }
  };

  const sendAudioChunk = async (chunk) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        // Updated payload format
        webSocketRef.current.send(JSON.stringify({
          "publish": {
            "data": {
              "file": base64Audio,
              "mime_type": "audio/webm",
              "sample_rate": 48000
            }
          }
        }));
      };
      reader.readAsDataURL(new Blob([chunk]));
    }
  };

  const startMeasuring = async () => {
    try {
      setError(null);
      setStatus('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      setStatus('Microphone access granted');

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        bitsPerSecond: 128000
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          sendAudioChunk(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      await initializeWebSocket();
      mediaRecorder.start(100); // Send chunks every 100ms
    } catch (error) {
      console.error('Error starting measurements:', error);
      setError(`Failed to start measurements: ${error.message}`);
    }
  };

  const stopMeasuring = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    setStatus('Measurements stopped');
  };

  useEffect(() => {
    return () => {
      stopMeasuring();
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Stream Measurements</h2>
      
      {status && (
        <div className="mb-4 text-sm text-blue-600">
          Status: {status}
        </div>
      )}
      
      {error && (
        <div className="mb-4 text-sm text-red-600">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={startMeasuring}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Start Measuring
        </button>
        <button
          onClick={stopMeasuring}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Measuring
        </button>
      </div>

      <div className="space-y-2">
        {measurements.slice(-5).map((measurement, index) => (
          <div key={index} className="bg-gray-50 p-2 rounded">
            <div className="text-sm text-gray-600">
              {measurement.timestamp.toLocaleTimeString()}
            </div>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(measurement.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamMeasurements; 