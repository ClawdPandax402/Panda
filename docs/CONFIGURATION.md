# Configuration Reference

Complete configuration options for Pandax402.

---

## Server Configuration

### Pandax402 Options

```typescript
interface Pandax402Config {
  // Required
  serviceWallet: string;
  pricePerRequest: number;
  
  // Network
  network?: 'mainnet' | 'devnet';
  rpcEndpoint?: string;
  
  // Verification
  gracePeriod?: number;
  requiredConfirmations?: number;
  
  // Access Tokens
  tokenExpiry?: number;
  tokenSecret?: string;
  
  // Privacy
  logLevel?: 'none' | 'error' | 'info' | 'debug';
  collectMetrics?: boolean;
  
  // Webhooks
  webhooks?: WebhookConfig;
  
  // Caching
  cache?: CacheConfig;
}
```

### Defaults

| Option | Default | Description |
|--------|---------|-------------|
| `network` | `'mainnet'` | Solana network |
| `rpcEndpoint` | Public RPC | Solana RPC URL |
| `gracePeriod` | `30` | Seconds to wait for confirmation |
| `requiredConfirmations` | `1` | Block confirmations required |
| `tokenExpiry` | `0` | Token lifetime (0 = immediate) |
| `logLevel` | `'error'` | Logging verbosity |
| `collectMetrics` | `false` | Enable metrics collection |

---

## Client Configuration

### Pandax402Client Options

```typescript
interface Pandax402ClientConfig {
  // Required
  wallet: WalletAdapter | Keypair;
  
  // Network
  network?: 'mainnet' | 'devnet';
  rpcEndpoint?: string;
  
  // Payment
  autoConfirm?: boolean;
  maxPrice?: number;
  
  // Timeouts
  confirmationTimeout?: number;
  requestTimeout?: number;
  
  // Privacy
  stripHeaders?: boolean;
}
```

### Defaults

| Option | Default | Description |
|--------|---------|-------------|
| `network` | `'mainnet'` | Solana network |
| `autoConfirm` | `false` | Auto-approve payments |
| `maxPrice` | `Infinity` | Max price per request |
| `confirmationTimeout` | `30000` | ms to wait for confirmation |
| `requestTimeout` | `60000` | ms for full request |
| `stripHeaders` | `false` | Remove unnecessary headers |

---

## Agent Configuration

### Pandax402Agent Options

```typescript
interface Pandax402AgentConfig {
  // Required
  wallet: Keypair;
  
  // Network
  network?: 'mainnet' | 'devnet';
  rpcEndpoint?: string;
  
  // Budget
  budgetLimit?: number;
  maxPricePerRequest?: number;
  dailyLimit?: number;
  
  // Security
  allowedDomains?: string[];
  blockedDomains?: string[];
  requireHttps?: boolean;
  
  // Privacy
  privacyMode?: boolean;
  randomizeTimings?: boolean;
  
  // Behavior
  retryAttempts?: number;
  retryDelay?: number;
}
```

### Defaults

| Option | Default | Description |
|--------|---------|-------------|
| `network` | `'mainnet'` | Solana network |
| `budgetLimit` | `Infinity` | Session budget in SOL |
| `maxPricePerRequest` | `Infinity` | Max per request |
| `dailyLimit` | `Infinity` | 24-hour limit |
| `allowedDomains` | `['*']` | Domain whitelist |
| `requireHttps` | `true` | Block HTTP requests |
| `privacyMode` | `false` | Enhanced privacy |
| `retryAttempts` | `3` | Retry count |

---

## Environment Variables

```bash
# Server
PANDAX402_WALLET=<wallet-address>
PANDAX402_NETWORK=mainnet
PANDAX402_RPC=https://rpc-endpoint.com
PANDAX402_PRICE=0.001
PANDAX402_LOG_LEVEL=error

# Webhooks
PANDAX402_WEBHOOK_URL=https://yourserver.com/webhook
PANDAX402_WEBHOOK_SECRET=<secret>

# Agent
PANDAX402_AGENT_BUDGET=1.0
PANDAX402_AGENT_DAILY_LIMIT=10.0
```

```typescript
// Load from environment
const panda = Pandax402.fromEnv();
```

---

## Guard Options

Per-endpoint configuration:

```typescript
panda.guard({
  priceOverride: 0.01,        // Override default price
  requiredConfirmations: 2,   // More confirmations
  bypassHeader: 'X-Admin',    // Admin bypass
  customValidator: async (proof) => {
    // Custom validation logic
    return true;
  },
});
```

---

## Webhook Configuration

```typescript
interface WebhookConfig {
  endpoint: string;
  secret: string;
  events?: WebhookEvent[];
  retries?: number;
  timeout?: number;
}

type WebhookEvent = 
  | 'payment.received'
  | 'payment.failed'
  | 'access.granted'
  | 'access.denied';
```

---

## Cache Configuration

```typescript
interface CacheConfig {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
}
```

### Redis Example

```typescript
import Redis from 'ioredis';

const redis = new Redis();

const panda = new Pandax402({
  serviceWallet: wallet,
  pricePerRequest: 0.001,
  cache: {
    get: (key) => redis.get(key),
    set: (key, value, ttl) => redis.setex(key, ttl, value),
    delete: (key) => redis.del(key),
  },
});
```

### Memory Example

```typescript
const cache = new Map();

const panda = new Pandax402({
  cache: {
    get: async (key) => cache.get(key) || null,
    set: async (key, value, ttl) => {
      cache.set(key, value);
      setTimeout(() => cache.delete(key), ttl * 1000);
    },
    delete: async (key) => cache.delete(key),
  },
});
```
