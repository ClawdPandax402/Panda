# Frequently Asked Questions

---

## General

### What is Pandax402?

Pandax402 is a payments and access control primitive for Solana. It implements the x402 payment protocol, enabling HTTP-native micropayments for API access without accounts, keys, or trust.

### Why the name "Pandax402"?

The panda represents the friendly, approachable wrapper around powerful payment infrastructure. 402 refers to the HTTP status code "Payment Required" — a standard that was defined but rarely used until now.

### Is this a cryptocurrency or token?

No. Pandax402 is infrastructure software. It uses SOL (and eventually SPL tokens) for payments, but it is not a token itself.

---

## Technical

### How does payment verification work?

1. Client makes a request
2. Server returns 402 with payment details
3. Client pays on Solana
4. Client retries with transaction signature
5. Server verifies on-chain and grants access

All verification happens on-chain. No trust required.

### What happens if the payment fails?

The client receives an error. No access is granted. The server never exposes data without confirmed payment.

### How fast is payment confirmation?

- Single confirmation: ~400ms
- Full finality: ~13 seconds

Most use cases only need single confirmation.

### Can I use tokens other than SOL?

SPL token support is on the roadmap. Currently, only SOL is supported.

---

## Privacy

### What data do you collect?

Nothing. Pandax402 is designed to not collect identity data.

### Can services track my requests?

Services only see that a valid payment was made. They don't receive identity information unless you provide it in your request body.

### Are payments anonymous?

Payments are pseudonymous. Wallet addresses are visible on-chain, but they're not linked to identity unless you link them yourself.

---

## Agents

### What is an agent?

An autonomous program that can make payments without human approval for each transaction. Useful for bots, AI systems, and automated pipelines.

### Is it safe to give an agent my wallet?

Never give an agent your main wallet. Create a dedicated wallet with limited funds and strict budget controls.

### Can I limit what an agent pays for?

Yes. You can set:
- Maximum price per request
- Session budget limits
- Daily spending caps
- Domain whitelists

---

## Business

### How much does Pandax402 cost?

The SDK is open source and free. You only pay Solana transaction fees (~$0.00025 per transaction).

### Can I use this for my business?

Yes. MIT licensed. Use it however you want.

### What about refunds?

Pandax402 doesn't handle refunds at the protocol level. That's between you and your users, using standard Solana transfers.

---

## Troubleshooting

### I'm getting "Payment Required" but I paid

Check:
1. Transaction confirmed on-chain
2. Correct wallet received payment
3. Correct amount sent
4. Proof header included in retry request

### Agent budget exceeded but I set a high limit

Check if you hit the daily limit, not just the session limit.

### Payments work on devnet but not mainnet

Ensure:
1. Network configuration is set to 'mainnet'
2. Wallet has real SOL, not devnet SOL
3. RPC endpoint supports mainnet
