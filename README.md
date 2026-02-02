# Hedera Hydropower MRV Methodology (DLT Earth / Guardian)

Author: Bikram Biswas (@biswasbikram786)  
Network: Hedera Testnet  
Programme: DLT Earth Bounty  
Status: Live POC, Methodology Submission

---

# Hedera Hydropower MRV Methodology

> **DLT Earth Bounty Submission** | Live on Hedera Testnet

[![Testnet Status](https://img.shields.io/badge/Testnet-Live-success)](https://hashscan.io/testnet/account/0.0.6255927)
[![Bounty Request](https://img.shields.io/badge/Bounty-$5000-blue)](./BOUNTY_REQUEST.md)

A production-ready hydropower MRV (Measurement, Reporting, Verification) methodology deployed on Hedera, featuring device-level DIDs, automated verification, and renewable energy credit issuance.

📄 **[View Bounty Request](./BOUNTY_REQUEST.md)** | 🔗 **[Live Evidence](./EVIDENCE.md)**

---

## Quick Verification

Verify this methodology is live on Hedera Testnet:
1. [Operator Account](https://hashscan.io/testnet/account/0.0.6255927) - All transactions
2. [DID Topic](https://hashscan.io/testnet/topic/0.0.7462776) - Identity registry
3. [REC Token](https://hashscan.io/testnet/token/0.0.7462931) - NFT with 20% royalty



## Executive Summary

This repository documents a **completed, on-chain Proof of Concept** for a
**hydropower-specific Measurement, Reporting, and Verification (MRV) methodology**
implemented on Hedera Testnet.

Unlike generic renewable MRV systems, this methodology is **hydropower-exclusive**
and introduces:

- Device-level DID identities for gateways/turbines
- Signed telemetry anchored to Hedera Consensus Service (HCS)
- Verifier-mediated certification
- Hedera Token Service (HTS) NFTs as Renewable Energy Certificates (RECs)
- On-chain royalties, resale, and retirement

All components are verifiable on HashScan.

---

## Why This Is a New Methodology

Guardian currently supports generic renewable/carbon workflows.
It does **not** provide a hydropower-exclusive MRV lifecycle accounting for:

- Continuous generation
- Flow rate & head height
- Seasonal variability
- Device-bound provenance

This work digitizes a **dedicated hydropower MRV methodology**, qualifying as a
new submission under the DLT Earth Bounty Programme.

---

## Live On-Chain Evidence

### Accounts
- Operator / Dev: 0.0.6255927  
  https://hashscan.io/testnet/account/0.0.6255927
- Supply / Controller: 0.0.6255880  
  https://hashscan.io/testnet/account/0.0.6255880

### DID / Audit Topics
- DID Registry: 0.0.7462776  
- Audit Topic: 0.0.7462600

### NFT Examples
- 0.0.7462931 (20% royalty)
- 0.0.7462932 (15%)
- 0.0.7462933 (10%)

See `evidence/txids.csv` for full lifecycle mapping.

---

## Repository Contents

- `code/` — Reference Node.js scripts used in the POC
- `docs/` — Formal MRV methodology + Guardian alignment
- `evidence/` — Transaction IDs and independent verification steps

---

## Scope

This repository documents:
✔ Methodology  
✔ On-chain proof  
✔ Verification logic  

Production hardening (KMS, automated verifier, IPFS canonicalization) is
explicitly scoped as **bounty deliverables**, not prerequisites.

---

## One-line Summary

> A hydropower-exclusive MRV methodology on Hedera with device DIDs, immutable audit,
> verifier-controlled certification, and tokenized RECs.
>
## References

- Hedera contribution guidance: docs/hedera-contribution-notes.md
- Guardian alignment notes: docs/guardian-alignment.md

