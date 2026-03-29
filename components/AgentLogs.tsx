'use client';

import { useEffect, useState } from 'react';

interface AgentLogsProps {
  sessionKey: string;
  onClose: () => void;
}

export function AgentLogs({ sessionKey, onClose }: AgentLogsProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/agents/logs?sessionKey=${sessionKey}`);
        const data = await response.json();
        setLogs(data.messages || []);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [sessionKey]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">📝 Agent Logs</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-slate-400 text-center py-10">No logs available</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    log.role === 'user'
                      ? 'bg-blue-900/20 border border-blue-700/50'
                      : log.role === 'assistant'
                      ? 'bg-emerald-900/20 border border-emerald-700/50'
                      : 'bg-slate-700/20 border border-slate-600/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {log.role === 'user' ? '👤' : log.role === 'assistant' ? '🤖' : '⚙️'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-white uppercase">
                          {log.role}
                        </span>
                        {log.timestamp && (
                          <span className="text-xs text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-200 whitespace-pre-wrap">{log.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
