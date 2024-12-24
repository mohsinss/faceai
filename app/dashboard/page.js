"use client";


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashNav from "./DashNav";
import FeasibilityCard from '@/components/FeasibilityCard';

export default function Dashboard() {
  const router = useRouter();
  const [feasibilities, setFeasibilities] = useState([]);

  useEffect(() => {
    fetchFeasibilities();
  }, []);

  const fetchFeasibilities = async () => {
    try {
      const response = await fetch('/api/feasibility');
      if (!response.ok) {
        throw new Error('Failed to fetch feasibilities');
      }
      const data = await response.json();
      setFeasibilities(data);
    } catch (error) {
      console.error('Error fetching feasibilities:', error);
      // Optionally, show an error message to the user
    }
  };

  const formatObjectId = (id) => {
    // Remove any non-hexadecimal characters
    return id.replace(/[^0-9a-fA-F]/g, '');
  };

  const handleCreateResume = async () => {
    try {
      const response = await fetch('/api/feasibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Resume' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create a new resume');
      }

      const data = await response.json();

      if (!data.documentId) {
        throw new Error('Invalid response from server: missing documentId');
      }

      const formattedId = formatObjectId(data.documentId);

      router.push(`/dashboard/feasibility/${formattedId}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Error creating resume. Please try again.');
    }
  };
  
  const handleDeleteFeasibility = async (id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await fetch('/api/feasibility', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      fetchFeasibilities();
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#333' }}>
      <DashNav />
      <section style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Resumes</h1>
          <div>
            <span style={{ marginRight: '10px' }}>Documents Created: 1/18</span>
            <span>Sort: <a href="#" style={{ color: '#0070f3', textDecoration: 'underline' }}>Date</a> A-Z</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '10px' }}>Default (1/18)</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#e0e0e0',
                width: '200px',
                height: '150px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px',
                cursor: 'pointer'
              }} onClick={handleCreateResume}>
                <span style={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}>+ Resume</span>
              </div>
              <div style={{
                backgroundColor: '#e0e0e0',
                width: '200px',
                height: '150px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}>+ CV</span>
              </div>
            </div>
          </div>
          <div style={{
            backgroundColor: '#fff',
            width: '300px',
            height: '200px',
            borderRadius: '10px',
            padding: '10px',
            color: '#333',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {/* <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Mohsin Aljoaithen</h3>
            <p style={{ marginBottom: '10px' }}>Professional Title</p>
            <p style={{ marginBottom: '10px' }}>Email: maljoaithen@gmail.com</p>
            <p style={{ marginBottom: '10px' }}>Location: Riyadh, Saudi Arabia</p>
            <p>Modified on: 18 May 2024</p> */}
          </div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '10px' }}>My Content</h2>
          <p>Your place for the data you use most often.</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}>
          {feasibilities.map((feasibility) => (
            <FeasibilityCard
              key={feasibility._id}
              feasibility={feasibility}
              onDelete={() => handleDeleteFeasibility(feasibility._id)}
              onClick={() => router.push(`/dashboard/feasibility/${feasibility._id}`)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}