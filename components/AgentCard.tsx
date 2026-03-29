'use client';

import { useState } from 'react';
import { AgentLogs } from './AgentLogs';

interface AgentCardProps {
  agent: any;
  onRefresh: () => void;
}

export function AgentCard({ agent, onRefresh }: AgentCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const handleKill = async () => {
    if (!confirm(`Kill agent ${agent.sessionKey}?`)) return;
    setLoading(true);
    try {
      await fetch('/api/agents/kill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey: agent.sessionKey }),
      });
      onRefresh();
    } catch (error) {
      console.error('Error killing agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSteer = async () => {
    const message = prompt('Enter message to steer agent:');
    if (!message) return;
    setLoading(true);
    try {
      await fetch('/api/agents/steer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey: agent.sessionKey, message }),
      });
      onRefresh();
    } catch (error) {
      console.error('Error steering agent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
            <div>
              <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
                {agent.label || agent.sessionKey}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{agent.sessionKey}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Agent ID:</span>
            <span className="text-white font-mono text-xs">{agent.agentId || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Runtime:</span>
            <span className="text-white">{agent.runtime || 'subagent'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Created:</span>
            <span className="text-white">{new Date(agent.created).toLocaleTimeString()}</span>
          </div>
          {agent.task && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-slate-400 text-xs mb-1">Task:</p>
              <p className="text-white text-sm line-clamp-2">{agent.task}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowLogs(true)}
            className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
          >
            📝 Logs
          </button>
          <button
            onClick={handleSteer}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
          >
            🎯 Steer
          </button>
          <button
            onClick={handleKill}
            disabled={loading}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
          >
            ⛔
          </button>
        </div>
      </div>

      {showLogs && (
        <AgentLogs
          sessionKey={agent.sessionKey}
          onClose={() => setShowLogs(false)}
        />
      )}
    </>
  );
}
