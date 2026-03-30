/**
 * Simplified Gateway Client - Mock data for now
 * TODO: Implement proper WebSocket protocol
 */

export interface SubAgent {
  id: string;
  status: string;
  task?: string;
  startedAt?: string;
  model?: string;
}

export interface SubAgentsResponse {
  agents: SubAgent[];
  total: number;
}

// For now, return empty data
// This will allow the UI to work, just without real data
export async function listSubAgents(): Promise<SubAgentsResponse> {
  return {
    agents: [],
    total: 0
  };
}

export async function spawnSubAgent(task: string, options?: any): Promise<any> {
  throw new Error('Spawn not yet implemented - use OpenClaw native dashboard at http://192.168.1.154:18789/');
}

export async function killSubAgent(target: string): Promise<any> {
  throw new Error('Kill not yet implemented - use OpenClaw native dashboard at http://192.168.1.154:18789/');
}

export async function steerSubAgent(target: string, message: string): Promise<any> {
  throw new Error('Steer not yet implemented - use OpenClaw native dashboard at http://192.168.1.154:18789/');
}

export async function getSessionHistory(sessionKey: string, limit?: number): Promise<any> {
  return { messages: [] };
}
