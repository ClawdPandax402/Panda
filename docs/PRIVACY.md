# Privacy in Pandax402

Privacy is not a feature — it's the foundation.

---

## Philosophy

Traditional access control systems require identity. Pandax402 requires only payment.

```
Traditional Model:
  Who are you? → Prove it → Grant access → Log everything

Pandax402 Model:
  Pay → Access → Forget
```

---

## Privacy by Design

### What We Don't Collect

| Data Point | Traditional APIs | Pandax402 |
|------------|------------------|-----------|
| Email | Required | Never |
| Name | Often required | Never |
| IP Address | Logged | Not stored |
| Device ID | Tracked | Never |
| User agent | Logged | Not stored |
| Request history | Detailed logs | None |
| Usage patterns | Analytics | None |
| Geographic data | Often tracked | Never |

### What Exists On-Chain

The only permanent record is the Solana transaction:

```
Transaction Record:
├── Sender wallet (pseudonymous)
├── Recipient wallet (service provider)
├── Amount transferred
├── Timestamp
└── Memo (optional, client-controlled)
```

This is the **minimum viable information** for payment verification.

---

## Privacy Features

### 1. Ephemeral Access Tokens

Access tokens exist only for the duration of a single request.

```
Lifecycle:

  Payment verified ──► Token generated ──► Request processed ──► Token destroyed
        │                    │                    │                    │
        └──────── Milliseconds ────────────────────────────────────────┘
```

No token storage. No session persistence. No state.

### 2. Request Unlinkability

Sequential requests from the same wallet cannot be correlated by the service.

```
Request 1: Wallet A ──► Service ──► Response
Request 2: Wallet A ──► Service ──► Response
Request 3: Wallet A ──► Service ──► Response

Service perspective:
  Request 1: Valid payment ✓
  Request 2: Valid payment ✓
  Request 3: Valid payment ✓
  
  Correlation: Impossible without on-chain analysis
```

### 3. Zero-Knowledge Proofs (Roadmap)

Future versions will support ZK proofs for payment verification:

```
Current: "I paid 0.001 SOL to wallet X at time T"
Future:  "I made a valid payment" (no amount, wallet, or time revealed)
```

### 4. Agent Privacy Mode

Agents can enable enhanced privacy features:

```typescript
const agent = new Pandax402Agent({
  wallet: keypair,
  privacyMode: true  // Enables:
                     // - Randomized request timing
                     // - Request batching
                     // - Decoy transactions
});
```

---

## Threat Model

### Protected Against

| Threat | Protection |
|--------|------------|
| Service tracking users | No identity collected |
| Cross-service correlation | Wallet pseudonymity |
| Request timing analysis | Randomized delays (agent mode) |
| Metadata inference | Minimal headers |
| Historical analysis | No logs retained |

### Not Protected Against

| Threat | Limitation |
|--------|------------|
| On-chain analysis | Transactions are public |
| Wallet clustering | Advanced blockchain analytics |
| Network-level surveillance | Beyond protocol scope |
| Compromised client | Client security responsibility |

---

## Best Practices

### For Service Providers

```
DO:
✓ Use Pandax402 defaults (privacy-preserving)
✓ Disable request logging
✓ Minimize response metadata
✓ Accept multiple payment tokens

DON'T:
✗ Add tracking parameters
✗ Require additional identity
✗ Log wallet addresses
✗ Correlate requests
```

### For Users

```
DO:
✓ Use fresh wallets for sensitive requests
✓ Enable agent privacy mode when available
✓ Verify service privacy policies
✓ Use VPN/Tor for network privacy

DON'T:
✗ Reuse wallets across sensitive services
✗ Include identifying info in request bodies
✗ Trust services claiming "enhanced privacy" without verification
```

### For Agent Developers

```typescript
// Privacy-conscious agent configuration
const agent = new Pandax402Agent({
  wallet: generateFreshKeypair(),  // Don't reuse
  privacyMode: true,
  allowedDomains: ['trusted.api'],  // Explicit whitelist
  budgetLimit: 0.1,  // Limit exposure
});
```

---

## Comparison

### vs. API Keys

| Aspect | API Keys | Pandax402 |
|--------|----------|-----------|
| Identity required | Yes | No |
| Revocation tracking | Yes | N/A |
| Usage logging | Detailed | None |
| Cross-service linking | Possible | Wallet-only |

### vs. OAuth

| Aspect | OAuth | Pandax402 |
|--------|-------|-----------|
| Account required | Yes | No |
| Scope persistence | Yes | Per-request |
| Consent records | Stored | None |
| Token refresh | Tracked | N/A |

### vs. Session Cookies

| Aspect | Cookies | Pandax402 |
|--------|---------|-----------|
| State persistence | Yes | None |
| Cross-request linking | Yes | No |
| Device fingerprinting | Common | Impossible |
| GDPR consent | Required | N/A |

---

## Compliance

### GDPR

Pandax402 is GDPR-friendly by design:

- **No personal data collection** — Nothing to protect
- **No consent required** — No data processing
- **Right to erasure** — Nothing to erase
- **Data portability** — No data to port

### CCPA

Similar compliance by absence:

- **No sale of personal information** — None collected
- **No opt-out required** — No tracking to opt out of

---

## Future Enhancements

1. **Zero-Knowledge Payment Proofs**
   - Prove payment validity without revealing details
   
2. **Mixnet Integration**
   - Route payments through privacy mixers
   
3. **Stealth Addresses**
   - One-time receiving addresses per request
   
4. **Confidential Transactions**
   - Hide payment amounts on-chain

---

<p align="center">
<em>Privacy is not about hiding. It's about agency.</em>
</p>
