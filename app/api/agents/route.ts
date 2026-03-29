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

    // Use the subagents tool format
    const response = await fetch(`${GATEWAY_URL}/tool/subagents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        action: 'list',
        recentMinutes: 30
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gateway error:', response.status, errorText);
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to include both active and recent
    const allAgents = [
      ...(data.active || []),
      ...(data.recent || [])
    ];
    
    return NextResponse.json({
      agents: allAgents,
      total: data.total || 0,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents', agents: [] },
      { status: 500 }
    );
  }
}
