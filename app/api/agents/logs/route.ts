import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionKey = searchParams.get('sessionKey');

    if (!sessionKey) {
      return NextResponse.json(
        { error: 'sessionKey required' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (GATEWAY_TOKEN) {
      headers['x-openclaw-token'] = GATEWAY_TOKEN;
    }

    const response = await fetch(`${GATEWAY_URL}/tool/sessions_history`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sessionKey,
        limit: 50,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gateway error:', response.status, errorText);
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      messages: data.messages || [],
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs', messages: [] },
      { status: 500 }
    );
  }
}
