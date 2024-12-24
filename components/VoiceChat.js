"use client";

import { useState, useRef, useEffect } from 'react';
import { getHumeAccessToken } from '@/libs/humeAuth';

const VoiceChat = ({ className, analyticsId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(''); // Add status for debugging
  const [error, setError] = useState(null); // Add error state
  const webSocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const initializeWebSocket = async () => {
    try {
      setStatus('Getting config...');
      const { configId, apiKey } = await getHumeAccessToken();
      setStatus('Config received. Connecting to WebSocket...');

      // Connect using config_id and api_key
      const wsUrl = new URL('wss://api.hume.ai/v0/evi/chat');
      wsUrl.searchParams.append('config_id', configId);
      wsUrl.searchParams.append('api_key', apiKey);
      wsUrl.searchParams.append('verbose_transcription', 'true');

      const ws = new WebSocket(wsUrl.toString());
      
      ws.onopen = () => {
        setStatus('WebSocket connected');
        console.log('WebSocket connected successfully');
        webSocketRef.current = ws;
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Received message:', response);
        setStatus(`Received message: ${response.type}`);
        
        switch (response.type) {
          case 'chat_metadata':
            console.log('Chat session initialized:', response.chat_id);
            break;
            
          case 'user_message':
            if (response.message?.content) {
              setTranscript(response.message.content);
              if (!response.interim) {
                setMessages(prev => {
                  const filteredMessages = prev.filter(m => !m.interim);
                  return [...filteredMessages, {
                    content: response.message.content,
                    isUser: true,
                    timestamp: new Date(),
                    interim: false
                  }];
                });
              }
            }
            break;
            
          case 'assistant_message':
            if (response.message?.content) {
              setMessages(prev => [...prev, {
                content: response.message.content,
                isUser: false,
                timestamp: new Date(),
                messageId: response.id
              }]);
              setTranscript('');
            }
            break;
            
          case 'audio_output':
            if (response.data) {
              const audio = new Audio(`data:audio/wav;base64,${response.data}`);
              audio.play().catch(error => {
                console.error('Error playing audio:', error);
              });
            }
            break;
            
          case 'assistant_end':
            setIsProcessing(false);
            break;
            
          case 'error':
            const errorMessage = response.data?.message || 
                               response.message || 
                               response.error || 
                               response.data?.error ||
                               'Unknown error occurred';
            setError(`EVI error: ${errorMessage}`);
            console.error('WebSocket error:', response);
            setIsProcessing(false);
            break;
            
          default:
            console.log('Message received:', response);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError(`WebSocket error: ${error.message}`);
        setStatus('WebSocket error occurred');
        setIsProcessing(false);
      };

      ws.onclose = () => {
        setStatus('WebSocket connection closed');
        console.log('WebSocket closed');
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      setError(`Failed to initialize WebSocket: ${error.message}`);
      setStatus('Failed to initialize WebSocket');
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setStatus('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('Microphone access granted');

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        bitsPerSecond: 128000
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setStatus(`Recording chunk: ${audioChunksRef.current.length} chunks collected`);
        }
      };

      mediaRecorder.onstop = async () => {
        setStatus('Processing audio...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        audioChunksRef.current = [];
        
        if (webSocketRef.current?.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            const message = {
              type: 'audio_input',
              data: base64Audio
            };
            
            console.log('Sending audio message of size:', base64Audio.length);
            webSocketRef.current.send(JSON.stringify(message));
            setStatus('Audio sent to server');
          };
          reader.readAsDataURL(audioBlob);
        } else {
          setError('WebSocket not connected');
          setStatus('Failed to send audio: WebSocket not connected');
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      setIsRecording(true);
      await initializeWebSocket();
    } catch (error) {
      console.error('Error starting recording:', error);
      setError(`Failed to start recording: ${error.message}`);
      setStatus('Failed to start recording');
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setStatus('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md flex flex-col ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Voice Assistant</h2>
        <p className="text-sm text-gray-600">Speak with your AI assistant</p>
      </div>

      {/* Status and Error Display */}
      {status && (
        <div className="px-4 py-2 bg-blue-50 text-sm text-blue-700">
          Status: {status}
        </div>
      )}
      {error && (
        <div className="px-4 py-2 bg-red-50 text-sm text-red-700">
          Error: {error}
        </div>
      )}

      {/* Messages Display */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.isUser 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <p className="text-gray-800">{message.content}</p>
            {message.prosody && (
              <div className="text-xs text-gray-500 mt-1">
                Prosody: {JSON.stringify(message.prosody)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="px-4 py-2 bg-yellow-50 text-sm text-yellow-700">
          Live Transcript: {transcript}
        </div>
      )}

      {/* Recording Controls */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span>Processing...</span>
          ) : isRecording ? (
            <>
              <span className="animate-pulse">●</span>
              Stop Recording
            </>
          ) : (
            <>
              <span>🎤</span>
              Start Recording
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceChat; 