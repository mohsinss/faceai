"use client";

import { useState } from 'react';

export default function AnalyticsCard({ analytics, onDelete, onClick }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '15px',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={onClick}
    >
      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#0070f3' }}>
        {analytics.title || 'Untitled'}
      </h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Created: {new Date(analytics.createdAt).toLocaleDateString()}
      </p>
      {showDelete && (
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}