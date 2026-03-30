const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:18789');
let authenticated = false;

ws.on('open', () => {
  console.log('✓ WebSocket opened');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log('← Received:', JSON.stringify(msg, null, 2));
  
  if (msg.type === 'event' && msg.event === 'connect.challenge') {
    console.log('→ Sending auth...');
    ws.send(JSON.stringify({
      type: 'auth',
      token: 'ac5d17fe490fcc226278b37aea92ec0b074cda0c2d027994',
      nonce: msg.payload.nonce
    }));
  } else if (msg.type === 'event' && msg.event === 'connect.ready') {
    console.log('✓ Authenticated!');
    authenticated = true;
    console.log('→ Sending subagents list request...');
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'subagents',
      params: { action: 'list' }
    }));
  } else if (msg.id === 1) {
    console.log('✓ Got response!');
    console.log(JSON.stringify(msg.result, null, 2));
    ws.close();
  }
});

ws.on('error', (error) => {
  console.error('✗ Error:', error.message);
});

ws.on('close', () => {
  console.log('○ Closed');
  process.exit(0);
});

setTimeout(() => {
  console.log('✗ Timeout');
  ws.close();
  process.exit(1);
}, 10000);
