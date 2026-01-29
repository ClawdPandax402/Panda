# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at Pandax402. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Send a detailed report to the maintainers via private channels
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Resolution Timeline**: Depends on severity

### Severity Levels

| Severity | Description | Target Resolution |
|----------|-------------|-------------------|
| Critical | Payment bypass, fund theft | 24-48 hours |
| High | Access control bypass | 7 days |
| Medium | Information disclosure | 30 days |
| Low | Minor issues | Next release |

## Security Best Practices

When using Pandax402:

1. **Keep dependencies updated** — Run `npm audit` regularly
2. **Use mainnet for production** — Devnet is for testing only
3. **Verify wallet addresses** — Double-check service wallet configuration
4. **Monitor transactions** — Set up alerts for unusual payment patterns
5. **Implement rate limiting** — Even with payment gating, protect against spam

## Security by Design

Pandax402 is built with security as a core principle:

- **No stored credentials** — Nothing to leak
- **Cryptographic verification** — All payments verified on-chain
- **Ephemeral access tokens** — Expire immediately after use
- **Trustless architecture** — No central authority to compromise

## Acknowledgments

We appreciate the security research community. Responsible disclosure helps keep Pandax402 and its users safe.
