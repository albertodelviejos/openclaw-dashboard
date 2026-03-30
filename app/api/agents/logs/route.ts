import { NextResponse } from 'next/server';
import { OpenClawGatewayClient } from '@/lib/gateway-client';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionKey = searchParams.get('sessionKey');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!sessionKey) {
      return NextResponse.json(
        { error: 'Session key is required' },
        { status: 400 }
      );
    }

    console.log('[API] Fetching logs for session:', sessionKey);

    const client = new OpenClawGatewayClient(GATEWAY_URL, GATEWAY_TOKEN);
    const result = await client.getSessionHistory(sessionKey, limit);
    
    console.log('[API] Got', result?.messages?.length || 0, 'messages');
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Error fetching logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs', messages: [] },
      { status: 500 }
    );
  }
}
