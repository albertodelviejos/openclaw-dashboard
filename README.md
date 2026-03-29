# 🎛️ OpenClaw Dashboard

Real-time dashboard for monitoring and controlling OpenClaw subagents.

## Features

- 📊 **Real-time monitoring** - Auto-refresh every 3 seconds
- 🤖 **Agent management** - Spawn, kill, and steer agents
- 📝 **View logs** - Full conversation history for each agent
- 📈 **Stats overview** - Active, idle, and error counts
- 🎨 **Beautiful UI** - Dark theme with glassmorphism

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your OpenClaw Gateway details:

```env
OPENCLAW_GATEWAY_URL=http://localhost:3777
OPENCLAW_GATEWAY_TOKEN=your-token-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
vercel
```

Add environment variables in Vercel dashboard:
- `OPENCLAW_GATEWAY_URL`
- `OPENCLAW_GATEWAY_TOKEN`

## API Endpoints

- `GET /api/agents` - List all agents
- `POST /api/agents/spawn` - Spawn new agent
- `POST /api/agents/kill` - Kill an agent
- `POST /api/agents/steer` - Send message to agent
- `GET /api/agents/logs` - Get agent conversation history

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **OpenClaw Gateway API** - Backend integration

## License

MIT
