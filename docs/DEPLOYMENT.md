# Deployment Guide

Deploying Pandax402-protected services to production.

---

## Pre-Deployment Checklist

- [ ] Network set to `mainnet`
- [ ] Production wallet configured
- [ ] Wallet has SOL for rent
- [ ] RPC endpoint is production-grade
- [ ] Logging configured (without sensitive data)
- [ ] Error handling in place
- [ ] Monitoring set up

---

## Environment Configuration

```bash
# Production environment variables
SOLANA_WALLET=<your-mainnet-wallet>
SOLANA_NETWORK=mainnet
SOLANA_RPC=https://your-rpc-provider.com
WEBHOOK_SECRET=<random-secret>
```

```typescript
const panda = new Pandax402({
  serviceWallet: process.env.SOLANA_WALLET,
  network: process.env.SOLANA_NETWORK as 'mainnet',
  rpcEndpoint: process.env.SOLANA_RPC,
  pricePerRequest: 0.001,
});
```

---

## Platform Guides

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SOLANA_WALLET=${SOLANA_WALLET}
      - SOLANA_NETWORK=mainnet
      - SOLANA_RPC=${SOLANA_RPC}
```

### AWS Lambda

```typescript
import { Pandax402 } from '@pandax402/sdk';

const panda = new Pandax402({
  serviceWallet: process.env.SOLANA_WALLET,
  network: 'mainnet',
});

export const handler = panda.wrapLambda(async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ data: 'Premium content' }),
  };
});
```

### Vercel

```typescript
// api/premium.ts
import { Pandax402 } from '@pandax402/sdk';

const panda = new Pandax402({
  serviceWallet: process.env.SOLANA_WALLET!,
  network: 'mainnet',
});

export default panda.wrapVercel(async (req, res) => {
  res.json({ data: 'Premium content' });
});
```

### Cloudflare Workers

```typescript
import { Pandax402 } from '@pandax402/sdk/cloudflare';

const panda = new Pandax402({
  serviceWallet: SOLANA_WALLET,
  network: 'mainnet',
});

export default {
  async fetch(request: Request, env: Env) {
    return panda.handleRequest(request, async () => {
      return new Response(JSON.stringify({ data: 'Premium' }));
    });
  },
};
```

---

## RPC Providers

Recommended production RPC providers:

| Provider | Pros | Considerations |
|----------|------|----------------|
| Helius | Fast, reliable | Paid plans |
| QuickNode | Global | Paid plans |
| Triton | High throughput | Paid plans |
| GenesysGo | Solana-focused | Paid plans |

```typescript
const panda = new Pandax402({
  rpcEndpoint: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
});
```

---

## Scaling

### Horizontal Scaling

Pandax402 is stateless. Scale horizontally without coordination:

```
                    ┌─────────────┐
                    │   Load      │
                    │  Balancer   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  Instance 1 │ │  Instance 2 │ │  Instance 3 │
    │   (Panda)   │ │   (Panda)   │ │   (Panda)   │
    └─────────────┘ └─────────────┘ └─────────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                    ┌──────▼──────┐
                    │   Solana    │
                    │   Network   │
                    └─────────────┘
```

### Caching RPC Responses

```typescript
import { Redis } from 'ioredis';

const redis = new Redis();

const panda = new Pandax402({
  serviceWallet: wallet,
  cache: {
    get: (key) => redis.get(key),
    set: (key, value, ttl) => redis.setex(key, ttl, value),
  },
});
```

---

## Monitoring

### Health Check

```typescript
app.get('/health', async (req, res) => {
  const solanaHealth = await panda.checkConnection();
  
  res.json({
    status: solanaHealth ? 'healthy' : 'degraded',
    solana: solanaHealth,
    timestamp: Date.now(),
  });
});
```

### Metrics

```typescript
import { Counter, Histogram } from 'prom-client';

const paymentCounter = new Counter({
  name: 'pandax402_payments_total',
  help: 'Total payments received',
});

const verificationLatency = new Histogram({
  name: 'pandax402_verification_seconds',
  help: 'Payment verification latency',
});

panda.on('payment:received', () => paymentCounter.inc());
panda.on('verification:complete', ({ duration }) => {
  verificationLatency.observe(duration / 1000);
});
```

---

## Security

### Wallet Security

1. **Never expose private keys** in code or logs
2. **Use environment variables** for wallet configuration
3. **Rotate wallets** if compromise suspected
4. **Monitor wallet activity** for unexpected transactions

### Network Security

1. **Use HTTPS** for all endpoints
2. **Validate all inputs** before processing
3. **Rate limit** at network level for DDoS protection
4. **Log without sensitive data**
