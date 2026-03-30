import { NextResponse } from 'next/server';
import { OpenClawGatewayClient } from '@/lib/gateway-client';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function GET() {
  try {
    console.log('[API] Fetching agents from:', GATEWAY_URL);
    
    const client = new OpenClawGatewayClient(GATEWAY_URL, GATEWAY_TOKEN);
    const data = await client.listSubAgents();
    
    console.log('[API] Got agents:', data.total);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API] Error fetching agents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch agents', agents: [], total: 0 },
      { status: 500 }
    );
  }
}
