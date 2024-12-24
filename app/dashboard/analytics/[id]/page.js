'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import MainNavbar from '@/components/MainNavbar';
import MainSideNavbar from '@/components/MainSideNavbar';
import ChatBot from '@/components/ChatBot';
import VoiceChat from '@/components/VoiceChat';

const AnalyticsDetail = () => {
  const params = useParams();
  const [analytics, setAnalytics] = useState({ 
    title: '', 
    name: '', 
    email: '', 
    description: '',
    generatedEmail: ''
  });
  const [newTag, setNewTag] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      console.log('Fetching analytics with id:', params.id);
      const response = await fetch(`/api/analytics?id=${params.id}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch analytics: ${errorData.error || response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchAnalytics();
    }
  }, [params.id, fetchAnalytics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnalytics((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...analytics,
        _id: params.id
      };
      console.log('Sending data:', dataToSend);

      const response = await fetch(`/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save analytics: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Save response:', data);
      alert(data.message);
    } catch (error) {
      console.error('Error saving analytics:', error);
      alert(`Failed to save analytics. ${error.message}`);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: analytics.title,
          name: analytics.name,
          email: analytics.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let emailContent = '';

      let result;
      do {
        result = await reader.read();
        if (result.value) {
          emailContent += decoder.decode(result.value, { stream: true });
          setAnalytics(prev => ({ ...prev, generatedEmail: emailContent }));
        }
      } while (!result.done);

      emailContent += decoder.decode();
      setAnalytics(prev => ({ ...prev, generatedEmail: emailContent }));

    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setAnalytics(prev => ({
        ...prev,
        generatedEmail: prev.generatedEmail ? `${prev.generatedEmail}, ${newTag}` : newTag
      }));
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setAnalytics(prev => ({
      ...prev,
      generatedEmail: prev.generatedEmail
        .split(',')
        .map(t => t.trim())
        .filter(tag => tag !== tagToDelete)
        .join(', ')
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <MainSideNavbar />
      <div className="flex flex-col flex-grow">
        <MainNavbar />
        <div className="flex flex-grow p-6 ml-16 space-x-6">
          {/* Chat Interfaces */}
          <div className="w-1/2 flex flex-col space-y-6">
            <ChatBot className="flex-1" analyticsId={params.id} />
            <VoiceChat className="flex-1" analyticsId={params.id} />
          </div>

          Analytics Form Section
          {/* <div className="w-1/2 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">{analytics.title}</h1>
            <input
              type="text"
              name="title"
              value={analytics.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="name"
              value={analytics.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              value={analytics.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              value={analytics.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              rows="4"
            ></textarea>
            <button 
              onClick={handleGenerate}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mb-4"
            >
              Generate
            </button>
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.generatedEmail?.split(',').map((tag, index) => (
                  tag.trim() && (
                    <div
                      key={index}
                      className="group relative inline-flex items-center bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {tag.trim()}
                      <button
                        onClick={() => handleDeleteTag(tag.trim())}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>
            <button 
              onClick={handleSubmit} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDetail;

// Add this CSS to your global styles or as a styled-component
const styles = `
  .dot-typing {
    position: relative;
    left: -9999px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #9880ff;
    color: #9880ff;
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    animation: dot-typing 1.5s infinite linear;
  }

  @keyframes dot-typing {
    0% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    16.667% {
      box-shadow: 9984px -10px 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    33.333% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    50% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px -10px 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    66.667% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    83.333% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px -10px 0 0 #9880ff;
    }
    100% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
  }
`;

// Add this to your global CSS file
const globalStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .overflow-y-auto::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .overflow-y-auto {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`; 