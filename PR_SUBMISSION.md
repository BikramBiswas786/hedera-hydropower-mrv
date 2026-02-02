# DLT Earth Bounty Submission

## Title

Add Hydropower MRV POC — Hedera Testnet (Playground)

## Summary

This repository adds a hydropower‑exclusive MRV methodology demonstrating:

- Device‑signed telemetry anchored to HCS as **AUDITv1** messages  
- DID‑on‑topic for gateway identity with an operator account as controller  
- Ed25519 signature verification and nonce‑based replay protection  
- HTS NFT issuance as Renewable Energy Credits (RECs) referencing audit envelopes[attached_file:1][web:18]

All artifacts are verifiable on Hedera Testnet via HashScan.[attached_file:1][web:23]

## Repository

GitHub: https://github.com/BikramBiswas786/hedera-hydropower-mrv

## Live Testnet Evidence (Example)

See `evidence/txids.csv` for the latest canonical transaction and topic IDs.[attached_file:1]

## Acceptance Criteria

- ✅ DID Document on HCS with `controller: did:hedera:account:<accountId>`  
- ✅ AUDITv1 messages visible on the audit topic  
- ✅ NFT minted with metadata referencing the audit envelope  
- ✅ Evidence (txids) included in repository[attached_file:1][web:18]

## Bounty Request

Amount: **$5,000 USD**

### Deliverables

1. Automated verifier microservice (Node.js) with DID resolution, signature checks, nonce DB, and NFT minting.[attached_file:1]  
2. IPFS canonicalization of audit envelopes to minimize on‑chain storage.[attached_file:1][web:23]  
3. KMS‑backed supply key demo (AWS / GCP).[attached_file:1]  
4. Comprehensive tests and documentation, including replay/tamper scenarios.[attached_file:1]  
5. Guardian‑compatible policy schema and sample rule set.[attached_file:1]

## Timeline

Estimated 2–4 weeks from funding approval.[attached_file:1]

## Contact

**Bikram Biswas**  
GitHub: @BikramBiswas786  
Email: biswasbikram786@gmail.com  
Location: Balurghat, West Bengal, India[attached_file:1]
