import { NextResponse } from 'next/server';
import { OpenClawGatewayClient } from '@/lib/gateway-client';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, model, thinking } = body;

    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      );
    }

    console.log('[API] Spawning agent with task:', task);

    const client = new OpenClawGatewayClient(GATEWAY_URL, GATEWAY_TOKEN);
    const result = await client.spawnSubAgent(task, { model, thinking });
    
    console.log('[API] Spawn result:', result);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Error spawning agent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to spawn agent' },
      { status: 500 }
    );
  }
}
