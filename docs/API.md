# Pandax402 API Reference

Complete API documentation for the Pandax402 SDK.

---

## Server-Side API

### `Pandax402`

The main gatekeeper class for protecting endpoints.

```typescript
import { Pandax402 } from '@pandax402/sdk';

const panda = new Pandax402(config);
```

#### Configuration

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `serviceWallet` | `string` | Yes | - | Solana wallet address for receiving payments |
| `pricePerRequest` | `number` | Yes | - | Price in SOL per request |
| `network` | `'mainnet' \| 'devnet'` | No | `'mainnet'` | Solana network |
| `gracePeriod` | `number` | No | `30` | Seconds to wait for transaction confirmation |
| `tokenExpiry` | `number` | No | `0` | Access token lifetime in seconds (0 = immediate) |

#### Methods

##### `guard(options?)`

Returns Express middleware that enforces payment.

```typescript
app.get('/api/premium', panda.guard(), handler);

// With options
app.get('/api/expensive', panda.guard({ 
  priceOverride: 0.01,
  requiredConfirmations: 1 
}), handler);
```

##### `verify(paymentProof)`

Manually verify a payment proof.

```typescript
const isValid = await panda.verify({
  signature: 'tx_signature_here',
  payer: 'payer_wallet_address',
  amount: 0.001
});
```

##### `generatePaymentRequest()`

Generate payment details for clients.

```typescript
const paymentInfo = panda.generatePaymentRequest();
// Returns: { wallet, amount, memo, network }
```

---

## Client-Side API

### `Pandax402Client`

Client SDK for making paid requests.

```typescript
import { Pandax402Client } from '@pandax402/sdk';

const client = new Pandax402Client(config);
```

#### Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `wallet` | `WalletAdapter` | Yes | Solana wallet adapter instance |
| `autoConfirm` | `boolean` | No | Auto-confirm payment prompts |
| `maxPrice` | `number` | No | Maximum price willing to pay per request |

#### Methods

##### `fetch(url, options?)`

Make a paid HTTP request.

```typescript
const response = await client.fetch('https://api.example.com/data');
const data = await response.json();
```

##### `setMaxPrice(amount)`

Set maximum acceptable price.

```typescript
client.setMaxPrice(0.01); // Max 0.01 SOL per request
```

##### `getBalance()`

Check wallet SOL balance.

```typescript
const balance = await client.getBalance();
```

---

## Agent API

### `Pandax402Agent`

Autonomous agent for automated payment flows.

```typescript
import { Pandax402Agent } from '@pandax402/sdk';

const agent = new Pandax402Agent(config);
```

#### Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `wallet` | `Keypair` | Yes | Solana keypair for signing |
| `budgetLimit` | `number` | No | Maximum SOL to spend per session |
| `allowedDomains` | `string[]` | No | Whitelist of allowed service domains |
| `privacyMode` | `boolean` | No | Enable enhanced privacy features |

#### Methods

##### `execute(task)`

Execute a paid task autonomously.

```typescript
const result = await agent.execute({
  url: 'https://api.example.com/process',
  method: 'POST',
  body: { data: 'payload' }
});
```

##### `setBudget(amount)`

Update session budget.

```typescript
agent.setBudget(1.0); // 1 SOL max
```

##### `getSpent()`

Get total SOL spent in current session.

```typescript
const spent = agent.getSpent();
```

---

## Events

### Server Events

```typescript
panda.on('payment:received', (event) => {
  console.log('Payment from:', event.payer);
  console.log('Amount:', event.amount);
});

panda.on('payment:failed', (event) => {
  console.log('Failed:', event.reason);
});

panda.on('access:granted', (event) => {
  console.log('Access granted:', event.requestId);
});
```

### Client Events

```typescript
client.on('payment:initiated', (event) => {
  console.log('Paying:', event.amount, 'SOL');
});

client.on('payment:confirmed', (event) => {
  console.log('Confirmed:', event.signature);
});
```

---

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| `E001` | `PAYMENT_REQUIRED` | No payment proof provided |
| `E002` | `INVALID_SIGNATURE` | Transaction signature invalid |
| `E003` | `INSUFFICIENT_AMOUNT` | Payment amount too low |
| `E004` | `EXPIRED_PROOF` | Payment proof expired |
| `E005` | `WALLET_ERROR` | Wallet connection failed |
| `E006` | `NETWORK_ERROR` | Solana network unreachable |
| `E007` | `BUDGET_EXCEEDED` | Agent budget limit reached |

---

## TypeScript Types

```typescript
interface PaymentProof {
  signature: string;
  payer: string;
  amount: number;
  timestamp: number;
  memo?: string;
}

interface AccessToken {
  token: string;
  expires: number;
  scope: string[];
}

interface PaymentRequest {
  wallet: string;
  amount: number;
  network: 'mainnet' | 'devnet';
  memo: string;
}
```
