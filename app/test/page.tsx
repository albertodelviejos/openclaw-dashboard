'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(d => {
        console.log('Got data:', d);
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error('Error:', e);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Test Page</h1>
      {loading && <p>Loading...</p>}
      {data && (
        <div>
          <p>Total agents: {data.total}</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
