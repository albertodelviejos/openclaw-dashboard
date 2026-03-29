import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (GATEWAY_TOKEN) {
      headers['x-openclaw-token'] = GATEWAY_TOKEN;
    }

    // Use sessions_list to get ALL agent sessions (not just subagents)
    const response = await fetch(`${GATEWAY_URL}/tool/sessions_list`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        limit: 50,
        messageLimit: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gateway error:', response.status, errorText);
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();
    
    // Transform sessions into agents format
    const agents = (data.sessions || []).map((session: any) => ({
      sessionKey: session.key,
      label: session.key.split(':')[1] || session.key, // Extract agent name from key
      agentId: session.key.split(':')[1],
      status: session.status === 'running' ? 'active' : 'idle',
      model: session.model,
      runtime: 'agent-session',
      created: session.startedAt,
      task: session.displayName,
      tokens: session.totalTokens,
      cost: session.estimatedCostUsd,
      channel: session.channel,
    }));
    
    return NextResponse.json({
      agents,
      total: agents.length,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents', agents: [] },
      { status: 500 }
    );
  }
}
