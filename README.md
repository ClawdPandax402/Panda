# Pandax402

<p align="center">
  <strong>Cute outside. Nuclear reactor inside.</strong>
</p>

<p align="center">
  A payments + access control primitive for Solana.<br/>
  Pay to access. Access exists only at the moment of payment.<br/>
  No accounts. No permissions. No trust.
</p>

---

## What is Pandax402?

Pandax402 is **not** a meme coin.

Pandax402 sits at the intersection of:

- **x402 Payments** — HTTP-native crypto payments
- **Non-granted Access Management** — No pre-approval, no keys shared
- **Privacy-preserving execution**
- **Machine-to-machine commerce**

The panda is the friendly wrapper — a guardian and gatekeeper that makes powerful infrastructure feel approachable.

---

## Core Philosophy

```
Pay to access.
Access exists only at the moment of payment.
No accounts. No permissions. No trust.
```

Traditional access control requires:
- Creating accounts
- Managing permissions
- Sharing API keys
- Trust relationships

Pandax402 eliminates all of this. Access is instantaneous, ephemeral, and cryptographically verified through payment.

---

## How It Works

### x402 Payment Protocol

Pandax402 implements the x402 payment protocol — bringing HTTP 402 "Payment Required" to life on Solana.

```
Client                    Service
  │                          │
  │──── Request resource ───►│
  │                          │
  │◄─── 402 + payment info ──│
  │                          │
  │──── Payment proof ──────►│
  │                          │
  │◄─── Access granted ──────│
  │                          │
```

### Non-granted Access

Unlike traditional API keys or OAuth tokens:

- **No pre-registration** — No accounts to create
- **No key management** — No secrets to rotate or leak
- **No permission grants** — No admin approval required
- **Instant access** — Pay and access in the same transaction

### Privacy-Preserving

- Zero-knowledge payment proofs
- No identity required
- No tracking or analytics
- Access exists only in the moment

---

## Use Cases

### API Monetization
Charge per-request for premium APIs without subscription friction.

### Content Gating
Unlock articles, videos, or downloads with instant micropayments.

### Machine-to-Machine Commerce
Enable autonomous agents to pay for services programmatically.

### Rate Limiting Alternative
Replace arbitrary rate limits with economic signals.

### Premium Features
Offer pay-per-use premium features without account walls.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Pandax402                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   Client    │───►│  Gatekeeper │───►│   Service   │ │
│  │             │    │   (Panda)   │    │             │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│         │                  │                  │        │
│         │                  │                  │        │
│         ▼                  ▼                  ▼        │
│  ┌─────────────────────────────────────────────────┐   │
│  │                 Solana Network                   │   │
│  │                                                  │   │
│  │  • Payment verification                          │   │
│  │  • Access token issuance                         │   │
│  │  • Transaction finality                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Installation

```bash
npm install @pandax402/sdk
```

### Basic Usage

```typescript
import { Pandax402 } from '@pandax402/sdk';

// Initialize the gatekeeper
const panda = new Pandax402({
  serviceWallet: 'YOUR_SOLANA_WALLET',
  pricePerRequest: 0.001, // SOL
});

// Protect an endpoint
app.get('/premium-data', panda.guard(), (req, res) => {
  res.json({ data: 'Premium content unlocked!' });
});
```

### Client-Side Payment

```typescript
import { Pandax402Client } from '@pandax402/sdk';

const client = new Pandax402Client({
  wallet: userWallet,
});

// Make a paid request
const response = await client.fetch('https://api.example.com/premium-data');
```

---

## Configuration

| Option | Type | Description |
|--------|------|-------------|
| `serviceWallet` | `string` | Solana wallet address to receive payments |
| `pricePerRequest` | `number` | Price in SOL per request |
| `gracePeriod` | `number` | Seconds to allow for transaction confirmation |
| `network` | `'mainnet' \| 'devnet'` | Solana network to use |

---

## Security

Pandax402 is designed with security as a first principle:

- **No stored credentials** — Nothing to leak
- **Cryptographic verification** — Payments verified on-chain
- **Ephemeral access** — Access tokens expire immediately
- **No trust required** — Trustless by design

---

## Roadmap

- [x] Core x402 payment protocol
- [x] Solana integration
- [ ] Multi-token support (SPL tokens)
- [ ] Subscription-based access
- [ ] SDK for multiple languages
- [ ] Zero-knowledge proofs for enhanced privacy
- [ ] Cross-chain support

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Pandax402</strong><br/>
  The friendly gatekeeper for the permissionless economy.
</p>
