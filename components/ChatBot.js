"use client";

import { useState, useEffect, useRef } from 'react';

const ChatMessage = ({ message, isUser }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '1rem'
  }}>
    <div style={{
      backgroundColor: isUser ? '#2563eb' : '#f3f4f6',
      color: isUser ? 'white' : '#1f2937',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      maxWidth: '70%',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      <p style={{ fontSize: '0.875rem' }}>{message.content}</p>
      <span style={{ 
        fontSize: '0.75rem', 
        opacity: 0.7,
        marginTop: '0.25rem',
        display: 'block'
      }}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center',
    gap: '4px',
    padding: '8px'
  }}>
    <div style={{
      width: '8px',
      height: '8px',
      backgroundColor: '#9880ff',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both',
      animationDelay: '0s'
    }} />
    <div style={{
      width: '8px',
      height: '8px',
      backgroundColor: '#9880ff',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both',
      animationDelay: '0.16s'
    }} />
    <div style={{
      width: '8px',
      height: '8px',
      backgroundColor: '#9880ff',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both',
      animationDelay: '0.32s'
    }} />
    <span style={{ 
      marginLeft: '8px',
      fontSize: '0.875rem',
      color: '#6b7280'
    }}>
      AI is typing...
    </span>
  </div>
);

export default function ChatBot({ className, analyticsId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch existing conversation
  useEffect(() => {
    const fetchConversation = async () => {
      if (!analyticsId) {
        console.error('No analyticsId provided to ChatBot');
        return;
      }

      try {
        const response = await fetch(`/api/chat?analyticsId=${analyticsId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
            // Set default welcome message if no conversation exists
            const defaultMessage = { 
              content: "Hello! I'm your AI assistant. How can I help you analyze this data?",
              timestamp: new Date(),
              isUser: false 
            };
            setMessages([defaultMessage]);
            // Save the default message to the database
            await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                analyticsId,
                message: defaultMessage.content,
                isInitial: true
              }),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();
  }, [analyticsId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !analyticsId) return;

    const userMessage = { 
      content: newMessage, 
      timestamp: new Date(), 
      isUser: true 
    };

    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analyticsId,
          message: newMessage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = { 
          content: data.aiResponse, 
          timestamp: new Date(), 
          isUser: false 
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // If the request failed, show an error message
        const errorMessage = { 
          content: "Sorry, I couldn't process your message. Please try again.", 
          timestamp: new Date(), 
          isUser: false 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message in the chat
      const errorMessage = { 
        content: "Sorry, there was an error sending your message. Please try again.", 
        timestamp: new Date(), 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md flex flex-col ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
        <p className="text-sm text-gray-600">Ask me anything about your analytics</p>
      </div>
      
      {/* Chat Messages */}
      <div style={{
        flexGrow: 1,
        padding: '1rem',
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} isUser={message.isUser} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isTyping}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 