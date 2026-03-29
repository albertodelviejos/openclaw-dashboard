import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3777';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function POST(request: Request) {
  try {
    const { sessionKey, message } = await request.json();

    if (!sessionKey || !message) {
      return NextResponse.json(
        { error: 'sessionKey and message required' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (GATEWAY_TOKEN) {
      headers['Authorization'] = `Bearer ${GATEWAY_TOKEN}`;
    }

    const response = await fetch(`${GATEWAY_URL}/api/v1/subagents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'steer',
        target: sessionKey,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error steering agent:', error);
    return NextResponse.json(
      { error: 'Failed to steer agent' },
      { status: 500 }
    );
  }
}
