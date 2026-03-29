'use client';

interface StatsOverviewProps {
  agents: any[];
}

export function StatsOverview({ agents }: StatsOverviewProps) {
  const activeCount = agents.filter(a => a.status === 'active').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;
  const errorCount = agents.filter(a => a.status === 'error').length;

  const stats = [
    { label: 'Total Agents', value: agents.length, color: 'text-emerald-400', icon: '🤖' },
    { label: 'Active', value: activeCount, color: 'text-green-400', icon: '▶️' },
    { label: 'Idle', value: idleCount, color: 'text-yellow-400', icon: '⏸️' },
    { label: 'Errors', value: errorCount, color: 'text-red-400', icon: '⚠️' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <span className="text-4xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
