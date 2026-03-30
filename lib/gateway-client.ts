/**
 * OpenClaw Gateway WebSocket Client (Server-side)
 * Implements the OpenClaw Gateway protocol for subagent management
 */

import WebSocket from 'ws';

interface GatewayMessage {
  jsonrpc: '2.0';
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

interface SubAgent {
  id: string;
  status: string;
  task?: string;
  startedAt?: string;
  model?: string;
  [key: string]: any;
}

interface SubAgentsResponse {
  agents: SubAgent[];
  total: number;
}

export class OpenClawGatewayClient {
  private wsUrl: string;
  private token: string;
  private messageId = 0;

  constructor(gatewayUrl: string, token: string) {
    // Convert http/https to ws/wss
    this.wsUrl = gatewayUrl
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');
    this.token = token;
  }

  private generateId(): number {
    return ++this.messageId;
  }

  private async sendRequest(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers: Record<string, string> = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const ws = new WebSocket(this.wsUrl, { headers });
      const id = this.generateId();
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          ws.close();
          reject(new Error('Gateway request timeout'));
        }
      }, 15000);

      ws.on('open', () => {
        const message: GatewayMessage = {
          jsonrpc: '2.0',
          id,
          method,
          params: params || {},
        };
        
        ws.send(JSON.stringify(message));
      });

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const response: GatewayMessage = JSON.parse(data.toString());
          
          if (response.id === id) {
            clearTimeout(timeout);
            resolved = true;
            ws.close();

            if (response.error) {
              reject(new Error(response.error.message || 'Gateway error'));
            } else {
              resolve(response.result);
            }
          }
        } catch (error) {
          clearTimeout(timeout);
          resolved = true;
          ws.close();
          reject(error);
        }
      });

      ws.on('error', (error) => {
        if (!resolved) {
          clearTimeout(timeout);
          resolved = true;
          ws.close();
          reject(new Error(`WebSocket error: ${error.message}`));
        }
      });

      ws.on('close', () => {
        if (!resolved) {
          clearTimeout(timeout);
          resolved = true;
          reject(new Error('WebSocket closed before response'));
        }
      });
    });
  }

  async listSubAgents(): Promise<SubAgentsResponse> {
    try {
      const result = await this.sendRequest('subagents', {
        action: 'list',
      });
      
      const agents = result?.subagents || result?.agents || [];
      
      return {
        agents,
        total: agents.length,
      };
    } catch (error: any) {
      console.error('Failed to list subagents:', error);
      throw error;
    }
  }

  async spawnSubAgent(task: string, options?: any): Promise<any> {
    return this.sendRequest('sessions.spawn', {
      task,
      mode: 'run',
      runtime: 'subagent',
      ...options,
    });
  }

  async killSubAgent(target: string): Promise<any> {
    return this.sendRequest('subagents', {
      action: 'kill',
      target,
    });
  }

  async steerSubAgent(target: string, message: string): Promise<any> {
    return this.sendRequest('subagents', {
      action: 'steer',
      target,
      message,
    });
  }

  async getSessionHistory(sessionKey: string, limit?: number): Promise<any> {
    return this.sendRequest('sessions.history', {
      sessionKey,
      limit: limit || 50,
      includeTools: false,
    });
  }
}
