/**
 * OpenClaw Gateway WebSocket Client (Server-side)
 * Implements the complete OpenClaw Gateway protocol with authentication
 */

import WebSocket from 'ws';

interface GatewayMessage {
  jsonrpc?: '2.0';
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
  type?: string;
  event?: string;
  payload?: any;
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
      const ws = new WebSocket(this.wsUrl);
      const id = this.generateId();
      let resolved = false;
      let authenticated = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          ws.close();
          reject(new Error('Gateway request timeout'));
        }
      }, 20000);

      const cleanup = () => {
        clearTimeout(timeout);
        if (!resolved) {
          resolved = true;
        }
      };

      ws.on('open', () => {
        console.log('[Gateway] WebSocket opened, waiting for challenge...');
      });

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const msg: GatewayMessage = JSON.parse(data.toString());
          console.log('[Gateway] Received:', JSON.stringify(msg, null, 2));
          
          // Step 1: Handle authentication challenge
          if (msg.type === 'event' && msg.event === 'connect.challenge') {
            console.log('[Gateway] Received challenge, sending auth...');
            ws.send(JSON.stringify({
              type: 'auth',
              token: this.token,
              nonce: msg.payload?.nonce
            }));
            return;
          }

          // Step 2: Handle authentication success
          if (msg.type === 'event' && msg.event === 'connect.ready') {
            console.log('[Gateway] Authenticated! Sending request...');
            authenticated = true;
            ws.send(JSON.stringify({
              jsonrpc: '2.0',
              id,
              method,
              params: params || {}
            }));
            return;
          }

          // Step 3: Handle actual response
          if (authenticated && msg.id === id) {
            console.log('[Gateway] Got response!');
            cleanup();
            ws.close();

            if (msg.error) {
              reject(new Error(msg.error.message || 'Gateway error'));
            } else {
              resolve(msg.result);
            }
          }
        } catch (error) {
          console.error('[Gateway] Parse error:', error);
        }
      });

      ws.on('error', (error) => {
        console.error('[Gateway] WebSocket error:', error);
        if (!resolved) {
          cleanup();
          ws.close();
          reject(new Error(`WebSocket error: ${error.message}`));
        }
      });

      ws.on('close', () => {
        console.log('[Gateway] WebSocket closed');
        if (!resolved) {
          cleanup();
          reject(new Error('WebSocket closed before response'));
        }
      });
    });
  }

  async listSubAgents(): Promise<SubAgentsResponse> {
    try {
      console.log('[Gateway] Listing subagents...');
      const result = await this.sendRequest('subagents', {
        action: 'list',
      });
      
      console.log('[Gateway] Result:', JSON.stringify(result, null, 2));
      
      const agents = result?.subagents || result?.agents || [];
      
      return {
        agents,
        total: agents.length,
      };
    } catch (error: any) {
      console.error('[Gateway] Failed to list subagents:', error);
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
