'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import MainNavbar from '@/components/MainNavbar';
import MainSideNavbar from '@/components/MainSideNavbar';

const FeasibilityDetail = () => {
  const params = useParams();
  const [feasibility, setFeasibility] = useState({ 
    title: '', 
    name: '', 
    email: '', 
    description: '',
    generatedEmail: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTag, setNewTag] = useState('');

  const fetchFeasibility = useCallback(async () => {
    try {
      console.log('Fetching feasibility with id:', params.id);
      const response = await fetch(`/api/feasibility?id=${params.id}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch feasibility: ${errorData.error || response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setFeasibility(data);
    } catch (error) {
      console.error('Error fetching feasibility:', error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchFeasibility();
    }
  }, [params.id, fetchFeasibility]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeasibility((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...feasibility,
        _id: params.id
      };
      console.log('Sending data:', dataToSend);

      const response = await fetch(`/api/feasibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save feasibility: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Save response:', data);
      alert(data.message);
    } catch (error) {
      console.error('Error saving feasibility:', error);
      alert(`Failed to save feasibility. ${error.message}`);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: feasibility.title,
          name: feasibility.name,
          email: feasibility.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let emailContent = '';

      // Modified this part to remove the while(true) loop
      let result;
      do {
        result = await reader.read();
        if (result.value) {
          emailContent += decoder.decode(result.value, { stream: true });
          setFeasibility(prev => ({ ...prev, generatedEmail: emailContent }));
        }
      } while (!result.done);

      // Decode any remaining chunks
      emailContent += decoder.decode();
      setFeasibility(prev => ({ ...prev, generatedEmail: emailContent }));

    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFeasibility(prev => ({
        ...prev,
        generatedEmail: prev.generatedEmail ? `${prev.generatedEmail}, ${newTag}` : newTag
      }));
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFeasibility(prev => ({
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
        <div className="flex-grow p-6 ml-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">{feasibility.title}</h1>
            <input
              type="text"
              name="title"
              value={feasibility.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="name"
              value={feasibility.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              value={feasibility.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              value={feasibility.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              rows="4"
            ></textarea>
            <button 
              onClick={handleGenerate}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mb-4"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
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
                {feasibility.generatedEmail?.split(',').map((tag, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeasibilityDetail;