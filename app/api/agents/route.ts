import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3778';

export async function GET() {
  try {
    console.log('Fetching agents from:', GATEWAY_URL);
    
    const response = await fetch(`${GATEWAY_URL}/api/agents`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bridge error:', response.status, errorText);
      throw new Error(`Bridge returned ${response.status}`);
    }

    const data = await response.json();
    console.log('Got agents:', data.total);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch agents', agents: [], total: 0 },
      { status: 500 }
    );
  }
}
