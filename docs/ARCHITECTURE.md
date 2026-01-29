# Pandax402 Architecture

Technical architecture and design decisions.

---

## Overview

Pandax402 implements the x402 payment protocol on Solana, enabling HTTP-native micropayments for API access control. The architecture prioritizes privacy, security, and seamless developer experience.

```
┌──────────────────────────────────────────────────────────────────┐
│                         Pandax402 Stack                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌────────────┐     ┌────────────┐     ┌────────────┐          │
│   │   Client   │     │  Gatekeeper│     │  Service   │          │
│   │   (SDK)    │────►│   (Panda)  │────►│  (Your API)│          │
│   └────────────┘     └────────────┘     └────────────┘          │
│         │                   │                   │                │
│         │                   │                   │                │
│   ┌─────▼───────────────────▼───────────────────▼─────┐         │
│   │                   Solana Network                   │         │
│   │  ┌─────────────────────────────────────────────┐  │         │
│   │  │  • SPL Token Transfers                      │  │         │
│   │  │  • Transaction Verification                 │  │         │
│   │  │  • Finality Confirmation                    │  │         │
│   │  └─────────────────────────────────────────────┘  │         │
│   └────────────────────────────────────────────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Payment Protocol Layer

Implements HTTP 402 "Payment Required" semantics.

```
Request Flow:

1. Client → Service: GET /resource
2. Service → Client: 402 Payment Required
   {
     "x402": {
       "wallet": "...",
       "amount": 0.001,
       "network": "mainnet",
       "accepts": ["SOL", "USDC"]
     }
   }
3. Client → Solana: Transfer funds
4. Client → Service: GET /resource
   X-Payment-Proof: <signature>
5. Service → Client: 200 OK + data
```

### 2. Verification Engine

On-chain payment verification with zero trust assumptions.

```
Verification Pipeline:

┌─────────────────┐
│ Payment Proof   │
│ (Signature)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Signature Check │──► Invalid? → 401 Unauthorized
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Amount Check    │──► Insufficient? → 402 Payment Required
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Recipient Check │──► Wrong wallet? → 400 Bad Request
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Finality Check  │──► Pending? → Wait or 202 Accepted
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Access Granted  │──► 200 OK
└─────────────────┘
```

### 3. Privacy Layer

Zero-knowledge design principles.

| Aspect | Traditional | Pandax402 |
|--------|-------------|-----------|
| Identity | Required | Not collected |
| API Keys | Stored | None |
| Usage Logs | Detailed | Minimal |
| Tracking | Extensive | None |
| Analytics | User-level | Aggregate only |

### 4. Agent Runtime

Autonomous payment execution for machine-to-machine commerce.

```
Agent Architecture:

┌─────────────────────────────────────────────┐
│              Pandax402Agent                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐    ┌─────────────┐        │
│  │   Budget    │    │   Domain    │        │
│  │   Manager   │    │  Whitelist  │        │
│  └──────┬──────┘    └──────┬──────┘        │
│         │                  │               │
│         ▼                  ▼               │
│  ┌──────────────────────────────────┐      │
│  │        Payment Executor          │      │
│  │  • Auto-sign transactions        │      │
│  │  • Verify service authenticity   │      │
│  │  • Enforce spending limits       │      │
│  └──────────────────────────────────┘      │
│                    │                       │
│                    ▼                       │
│  ┌──────────────────────────────────┐      │
│  │        Privacy Shield            │      │
│  │  • Randomized timing             │      │
│  │  • Request obfuscation           │      │
│  │  • Minimal metadata              │      │
│  └──────────────────────────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Security Model

### Trust Assumptions

1. **Solana network is secure** — Transaction finality is guaranteed
2. **Cryptographic primitives are sound** — Ed25519 signatures are unforgeable
3. **No trusted third parties** — All verification is on-chain

### Attack Surface Analysis

| Vector | Mitigation |
|--------|------------|
| Replay attacks | One-time payment proofs with nonces |
| Double-spend | Wait for transaction finality |
| Man-in-the-middle | Signature verification on-chain |
| Credential theft | No credentials to steal |
| Privilege escalation | No privileges to escalate |

### Key Security Properties

```
┌─────────────────────────────────────────────┐
│           Security Properties               │
├─────────────────────────────────────────────┤
│                                             │
│  Confidentiality                            │
│  └─► No identity data collected             │
│  └─► No request logging by default          │
│  └─► Privacy-preserving proofs              │
│                                             │
│  Integrity                                  │
│  └─► On-chain verification                  │
│  └─► Cryptographic signatures               │
│  └─► Immutable transaction records          │
│                                             │
│  Availability                               │
│  └─► Decentralized Solana network           │
│  └─► No central point of failure            │
│  └─► Graceful degradation                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Data Flow

### Standard Request

```
Time ──────────────────────────────────────────────────►

Client                Panda                 Service
  │                     │                      │
  │─── GET /data ──────►│                      │
  │                     │                      │
  │◄── 402 + pricing ───│                      │
  │                     │                      │
  │─── Pay on Solana ───┼──────────────────────│
  │                     │                      │
  │─── GET + proof ────►│                      │
  │                     │─── verify on-chain ──│
  │                     │◄── confirmed ────────│
  │                     │                      │
  │                     │─── forward request ─►│
  │                     │◄── response ─────────│
  │◄── 200 + data ──────│                      │
  │                     │                      │
```

### Agent Automated Flow

```
Time ──────────────────────────────────────────────────►

Agent                 Panda                 Service
  │                     │                      │
  │─── GET /data ──────►│                      │
  │                     │                      │
  │◄── 402 + pricing ───│                      │
  │                     │                      │
  │─── [Budget OK?] ────│                      │
  │    [Domain OK?]     │                      │
  │                     │                      │
  │─── Auto-pay ────────┼──────────────────────│
  │                     │                      │
  │─── GET + proof ────►│                      │
  │                     │─── verify ──────────►│
  │◄── 200 + data ──────│◄─────────────────────│
  │                     │                      │
  │─── [Update budget]  │                      │
  │                     │                      │
```

---

## Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Verification latency | ~200ms | Dependent on Solana RPC |
| Payment confirmation | ~400ms | Single confirmation |
| Full finality | ~13s | 32 confirmations |
| Memory overhead | <10MB | Per middleware instance |
| Concurrent requests | 10,000+ | Limited by Solana RPC |

---

## Integration Patterns

### Express.js

```typescript
const panda = new Pandax402({ ... });
app.use('/api/premium', panda.guard());
```

### Serverless Functions

```typescript
export default panda.wrap(async (req, res) => {
  // Handler code
});
```

### Agent Deployment

```typescript
const agent = new Pandax402Agent({
  wallet: keypair,
  budgetLimit: 0.5,
  allowedDomains: ['api.trusted.com']
});

await agent.execute({ url: '...' });
```
