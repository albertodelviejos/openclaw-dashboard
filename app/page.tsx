'use client';

import { useEffect, useState } from 'react';
import { AgentCard } from '@/components/AgentCard';
import { StatsOverview } from '@/components/StatsOverview';
import { SpawnAgentModal } from '@/components/SpawnAgentModal';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpawnModal, setShowSpawnModal] = useState(false);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                🎛️ OpenClaw Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Monitor and control your subagents</p>
            </div>
            <button
              onClick={() => setShowSpawnModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>➕</span> Spawn Agent
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <StatsOverview agents={agents} />

        {/* Agents Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Active Agents</h2>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <p className="text-slate-400 mt-4">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-lg">No active agents</p>
              <p className="text-slate-500 text-sm mt-2">Spawn one to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agents.map((agent: any) => (
                <AgentCard key={agent.sessionKey} agent={agent} onRefresh={fetchAgents} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showSpawnModal && (
        <SpawnAgentModal
          onClose={() => setShowSpawnModal(false)}
          onSpawned={() => {
            setShowSpawnModal(false);
            fetchAgents();
          }}
        />
      )}
    </main>
  );
}
