# API Server

This is a tRPC-powered Express server with hot reloading for development.

## Features

- ✅ **Hot Reloading**: Uses tsx --watch for automatic server restart on file changes
- ✅ **tRPC Integration**: Type-safe API with automatic type inference
- ✅ **TypeScript**: Full TypeScript support with strict type checking
- ✅ **Twilio Integration**: Voice token generation and agent status management
- ✅ **CORS Support**: Configured for local development and production

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_API_KEY=your_api_key
TWILIO_API_SECRET=your_api_secret
TWIML_APP_SID=your_twiml_app_sid
```

3. Start the development server with hot reloading:

```bash
npm run dev
```

The server will start at `http://localhost:3001` and automatically restart when you make changes to the code.

## API Endpoints

### tRPC Endpoints

All API endpoints are now available through tRPC at `/trpc`:

- `getToken` - Get Twilio voice token and available numbers
- `updateAgentStatus` - Update agent status (ready, offline, in-call, error)
- `getAgentStatus` - Get status for a specific agent
- `getAllAgentStatuses` - Get status for all agents

### REST Endpoints

- `GET /health` - Health check endpoint

## Usage Examples

### Using tRPC Client

```typescript
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});

// Get token
const tokenData = await trpc.getToken.query();

// Update agent status
await trpc.updateAgentStatus.mutate({
  identity: "Shakeel",
  status: "ready",
});

// Get agent status
const status = await trpc.getAgentStatus.query({ identity: "Shakeel" });
```

### Using React Query (Frontend)

```typescript
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../api/router";

export const trpc = createTRPCReact<AppRouter>();
```

## Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run start` - Start production server

## Project Structure

```
src/
├── index.ts          # Main server file
├── router.ts         # tRPC router definitions
├── types.ts          # TypeScript type definitions
└── client-example.ts # Example client usage
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_API_KEY` - Twilio API key
- `TWILIO_API_SECRET` - Twilio API secret
- `TWIML_APP_SID` - Twilio TwiML app SID
