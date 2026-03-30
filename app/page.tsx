'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        
        if (data.error) {
          setError('Error conectando con OpenClaw Gateway. El protocolo WebSocket necesita implementación adicional.');
          setIsConnected(false);
        } else {
          setIsConnected(true);
        }
      } catch (err) {
        setError('No se pudo conectar con el servidor');
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            OpenClaw Dashboard
          </h1>
          <p className="text-slate-300">Control de Agentes AI</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard title="Total Agents" value="0" subtitle="En desarrollo" />
          <StatCard title="Estado" value={isConnected ? "Conectado" : "Desconectado"} subtitle={isConnected ? "Gateway OK" : "WebSocket pendiente"} />
          <StatCard title="Dashboard Nativo" value="Activo" subtitle="http://192.168.1.154:18789/" />
        </div>

        {error && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">⚠️ Implementación Pendiente</h3>
            <p className="text-slate-300 mb-4">{error}</p>
            <p className="text-slate-400 text-sm">
              Para usar todas las funcionalidades ahora, accede al dashboard nativo de OpenClaw:
            </p>
            <a 
              href="http://192.168.1.154:18789/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Abrir Dashboard Nativo →
            </a>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">🚀 Estado del Proyecto</h2>
          <div className="space-y-4">
            <Feature done title="UI Diseñada" description="Interfaz moderna con glassmorphism" />
            <Feature done title="API Routes" description="Endpoints Next.js configurados" />
            <Feature done title="Red Local" description="Accesible desde cualquier dispositivo" />
            <Feature pending title="Protocolo WebSocket" description="Implementación del protocolo de OpenClaw Gateway" />
            <Feature pending title="Gestión de Agentes" description="Spawn, Kill, Steer en tiempo real" />
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>Dashboard accesible en: <code className="bg-slate-800 px-2 py-1 rounded">http://192.168.1.154:3000</code></p>
          <p className="mt-2">Dashboard Nativo: <code className="bg-slate-800 px-2 py-1 rounded">http://192.168.1.154:18789</code></p>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-slate-500 text-sm">{subtitle}</p>
    </div>
  );
}

function Feature({ done, title, description }: { done?: boolean; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-green-500' : 'bg-slate-600'
      }`}>
        {done ? '✓' : '○'}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
