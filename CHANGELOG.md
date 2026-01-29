# Changelog

All notable changes to Pandax402 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Core x402 payment protocol implementation
- Solana mainnet and devnet support
- `Pandax402` server-side gatekeeper middleware
- `Pandax402Client` for client-side payment flows
- Zero-knowledge payment proof verification
- Ephemeral access token generation
- Privacy-preserving request handling
- Agent-compatible payment automation
- Configurable pricing per endpoint
- Transaction grace period settings
- Comprehensive TypeScript types

### Security
- Cryptographic payment verification on-chain
- No credential storage by design
- Immediate token expiration after use

## [0.9.0] - 2024-01-01

### Added
- Beta release for testing
- Devnet-only support
- Basic payment flow implementation
- Initial SDK structure

### Changed
- Simplified configuration API
- Improved error messages

### Fixed
- Transaction confirmation race conditions
- Wallet connection edge cases

## [0.8.0] - 2023-12-15

### Added
- Alpha release
- Proof of concept implementation
- Core architecture design

---

[1.0.0]: https://github.com/Pandax402/Panda/releases/tag/v1.0.0
[0.9.0]: https://github.com/Pandax402/Panda/releases/tag/v0.9.0
[0.8.0]: https://github.com/Pandax402/Panda/releases/tag/v0.8.0
