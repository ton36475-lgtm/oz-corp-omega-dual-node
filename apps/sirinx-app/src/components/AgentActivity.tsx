'use client'

import React from 'react';
import { useWebSocket } from '../utils/websocket';

interface AgentStatus {
  agentId: string;
  status: 'idle' | 'working' | 'error';
  lastActivity: string;
  currentTask?: string;
}

export const AgentActivity: React.FC = () => {
  const { lastMessage, isConnected } = useWebSocket('ws://localhost:3002/api/ws'); // Assuming WebSocket runs on sirinx-app port
  const [agentStatuses, setAgentStatuses] = React.useState<Record<string, AgentStatus>>({});

  React.useEffect(() => {
    if (lastMessage && lastMessage.type === 'agent_status_update') {
      const newStatus: AgentStatus = lastMessage.payload;
      setAgentStatuses(prev => ({
        ...prev,
        [newStatus.agentId]: newStatus,
      }));
    }
  }, [lastMessage]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Real-time Agent Activity</h2>
      {!isConnected && <p className="text-red-400">WebSocket Disconnected. Displaying static data.</p>}
      <div className="space-y-4">
        {Object.values(agentStatuses).length === 0 && isConnected && (
          <p className="text-gray-400">Waiting for agent activity...</p>
        )}
        {Object.values(agentStatuses).length === 0 && !isConnected && (
          <p className="text-gray-400">No real-time data. Connect WebSocket to see live updates.</p>
        )}
        {Object.values(agentStatuses).map(agent => (
          <div key={agent.agentId} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
            <div>
              <p className="font-semibold text-white">{agent.agentId}</p>
              <p className="text-sm text-gray-400">{agent.currentTask || 'No active task'}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${agent.status === 'working' ? 'bg-emerald-500/20 text-emerald-400' : agent.status === 'idle' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                {agent.status.toUpperCase()}
              </span>
              <p className="text-xs text-gray-500 mt-1">{new Date(agent.lastActivity).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
