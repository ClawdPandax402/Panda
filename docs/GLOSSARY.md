# Glossary

Key terms and concepts in Pandax402.

---

## A

### Access Token
A short-lived, cryptographically signed token that grants access to a protected resource after payment verification. In Pandax402, tokens are ephemeral and typically expire immediately after use.

### Agent
An autonomous program that can make payments without human approval for each transaction. Agents are configured with budget limits and domain whitelists for security.

---

## B

### Budget Limit
Maximum amount an agent is allowed to spend in a session. Once exceeded, the agent stops making payments.

---

## D

### Daily Limit
Maximum amount an agent or client can spend in a 24-hour period, separate from the session budget.

### Devnet
Solana's development network for testing. Uses fake SOL that has no real value. Always test on devnet before mainnet.

### Domain Whitelist
List of approved domains an agent is allowed to make paid requests to. Essential security feature to prevent agents from paying unauthorized services.

---

## E

### Ephemeral Access
Access that exists only at the moment of payment and doesn't persist. No sessions, no stored tokens, no state.

---

## F

### Finality
The point at which a blockchain transaction is irreversible. On Solana, single confirmation takes ~400ms, full finality ~13 seconds.

### 402 (HTTP Status)
"Payment Required" — An HTTP status code defined in RFC 7231 but rarely implemented until x402. Pandax402 uses this to signal that payment is needed.

---

## G

### Gatekeeper
The server-side component that enforces payment requirements. In Pandax402, this is the `Pandax402` class that provides middleware for Express and other frameworks.

### Grace Period
Time window allowed for transaction confirmation after a payment is initiated. Accounts for network latency and confirmation delays.

---

## M

### Mainnet
Solana's production network where real SOL is used. Transactions are irreversible and have real monetary value.

### Micropayment
A very small payment, typically fractions of a cent. Pandax402 enables micropayments for API access through low Solana transaction fees.

---

## N

### Non-granted Access
Access model where no pre-approval or permission is required. Access is obtained purely through payment at the moment of request.

---

## P

### Payment Proof
Cryptographic evidence that a payment was made. In Pandax402, this is typically a Solana transaction signature included in the request header.

### Privacy Mode
Agent configuration that enables enhanced privacy features like randomized timing, minimal headers, and request obfuscation.

---

## R

### RPC (Remote Procedure Call)
Interface for communicating with the Solana blockchain. Pandax402 uses RPC to verify transactions and check payment status.

---

## S

### Session Budget
Maximum SOL an agent can spend during a single execution session. Resets when the agent is restarted.

### SOL
Native token of the Solana blockchain. Used for payments in Pandax402.

### SPL Token
Tokens on Solana following the SPL Token standard (like USDC). Future Pandax402 versions will support SPL tokens.

---

## T

### Transaction Signature
Unique identifier for a Solana transaction. Used as proof of payment in the x402 protocol.

---

## V

### Verification
The process of confirming that a payment was made correctly — right amount, right recipient, transaction confirmed on-chain.

---

## W

### Wallet
A Solana account that can hold SOL and SPL tokens. In Pandax402, wallets are used by both clients (payers) and services (recipients).

### Webhook
HTTP callback that notifies your server when payment events occur. Used for async processing and integrations.

---

## X

### x402
The payment protocol that brings HTTP 402 "Payment Required" to life. Pandax402 implements x402 on Solana.

---

## Z

### Zero-Knowledge Proof (ZKP)
Cryptographic method to prove something is true without revealing the underlying data. Future Pandax402 versions will use ZKPs for enhanced payment privacy.
