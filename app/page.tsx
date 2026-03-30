'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirect to working HTML dashboard
    window.location.href = '/dashboard.html';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: '#0f172a',
      color: '#fff',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '48px',
          marginBottom: '20px'
        }}>🎛️</div>
        <h1 style={{ marginBottom: '10px' }}>Redirecting to Dashboard...</h1>
        <p style={{ color: '#94a3b8' }}>
          If not redirected, <a href="/dashboard.html" style={{ color: '#10b981' }}>click here</a>
        </p>
      </div>
    </div>
  );
}
