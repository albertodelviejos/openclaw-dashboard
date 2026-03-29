import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3777';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, agentId, runtime, label, model } = body;

    if (!task) {
      return NextResponse.json(
        { error: 'task is required' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (GATEWAY_TOKEN) {
      headers['Authorization'] = `Bearer ${GATEWAY_TOKEN}`;
    }

    const payload: any = {
      task,
      mode: 'session',
      runtime: runtime || 'subagent',
    };

    if (agentId) payload.agentId = agentId;
    if (label) payload.label = label;
    if (model) payload.model = model;

    const response = await fetch(`${GATEWAY_URL}/api/v1/sessions/spawn`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Gateway returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error spawning agent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to spawn agent' },
      { status: 500 }
    );
  }
}
