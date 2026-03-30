import { NextResponse } from 'next/server';
import { OpenClawGatewayClient } from '@/lib/gateway-client';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target } = body;

    if (!target) {
      return NextResponse.json(
        { error: 'Target agent ID is required' },
        { status: 400 }
      );
    }

    console.log('[API] Killing agent:', target);

    const client = new OpenClawGatewayClient(GATEWAY_URL, GATEWAY_TOKEN);
    const result = await client.killSubAgent(target);
    
    console.log('[API] Kill result:', result);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Error killing agent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to kill agent' },
      { status: 500 }
    );
  }
}
