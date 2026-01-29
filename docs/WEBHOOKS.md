# Webhooks

Real-time payment notifications.

---

## Overview

Webhooks notify your backend when payment events occur, enabling async processing and integrations.

---

## Configuration

```typescript
const panda = new Pandax402({
  serviceWallet: wallet,
  pricePerRequest: 0.001,
  webhooks: {
    endpoint: 'https://yourserver.com/webhooks/pandax402',
    secret: process.env.WEBHOOK_SECRET,
    events: ['payment.received', 'payment.failed'],
  },
});
```

---

## Events

### payment.received

Sent when payment is confirmed.

```json
{
  "event": "payment.received",
  "timestamp": 1704067200,
  "data": {
    "signature": "5abc123...",
    "payer": "WalletAddress...",
    "amount": 0.001,
    "endpoint": "/api/premium",
    "requestId": "req_xyz"
  }
}
```

### payment.failed

Sent when payment verification fails.

```json
{
  "event": "payment.failed",
  "timestamp": 1704067200,
  "data": {
    "reason": "INSUFFICIENT_AMOUNT",
    "expected": 0.001,
    "received": 0.0005,
    "endpoint": "/api/premium"
  }
}
```

### access.granted

Sent when access is successfully granted.

```json
{
  "event": "access.granted",
  "timestamp": 1704067200,
  "data": {
    "requestId": "req_xyz",
    "endpoint": "/api/premium",
    "paymentSignature": "5abc123..."
  }
}
```

---

## Verification

Always verify webhook signatures:

```typescript
import { verifyWebhookSignature } from '@pandax402/sdk';

app.post('/webhooks/pandax402', (req, res) => {
  const signature = req.headers['x-pandax402-signature'];
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process event
  const event = req.body;
  console.log('Event:', event.event);
  
  res.status(200).send('OK');
});
```

---

## Retry Policy

Failed webhook deliveries are retried:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failures, the webhook is marked as failed.

---

## Best Practices

1. **Respond quickly** — Return 200 within 5 seconds
2. **Process async** — Queue heavy work for background processing
3. **Verify signatures** — Always validate authenticity
4. **Handle duplicates** — Use requestId for idempotency
5. **Log everything** — Keep records for debugging
