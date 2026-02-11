# DLT Earth Bounty Submission

## Title

Add Hydropower MRV POC — Hedera Testnet (Playground)

## Summary

This repository adds a hydropower‑exclusive MRV methodology demonstrating:

- Device‑signed telemetry anchored to HCS as **AUDITv1** messages
- DID‑on‑topic for gateway identity with an operator account as controller
- Ed25519 signature verification and nonce‑based replay protection
- HTS NFT issuance as Renewable Energy Credits (RECs) referencing audit envelopes

All artifacts are verifiable on Hedera Testnet via HashScan.

### ⚠️ Important Regulatory Correction

Previous versions of documentation incorrectly referenced **VM0040** (Methodology for Greenhouse Gas Capture and Utilization in Plastic Materials). 

**VM0040 is NOT applicable to hydropower or renewable energy projects.**

This POC now correctly uses **Verra ACM0002 v22.0** (Grid-connected electricity generation from renewable sources) as the appropriate methodology for hydropower MRV.

For full details, see: `docs/REGULATORY_NOTES.md`

## Repository

GitHub: https://github.com/BikramBiswas786/hedera-hydropower-mrv

## Live Testnet Evidence (Example)

See `evidence/txids.csv` for the latest canonical transaction and topic IDs.

## Acceptance Criteria

- ✅ DID Document on HCS with `controller: did:hedera:account:`
- ✅ AUDITv1 messages visible on the audit topic
- ✅ NFT minted with metadata referencing the audit envelope
- ✅ Evidence (txids) included in repository
- ✅ Correct methodology (ACM0002) documented and aligned with Verra standards

## Bounty Request

Amount: **$5,000 USD**

### Deliverables

1. Automated verifier microservice (Node.js) with DID resolution, signature checks, nonce DB, and NFT minting.
2. IPFS canonicalization of audit envelopes to minimize on‑chain storage.
3. KMS‑backed supply key demo (AWS / GCP).
4. Comprehensive tests and documentation, including replay/tamper scenarios.
5. Guardian‑compatible policy schema and sample rule set aligned with ACM0002 methodology.
6. Regulatory compliance documentation clarifying correct methodology usage.

## Technical Architecture

### Core Components

1. **IoT Gateway Layer**
   - Device telemetry collection from hydropower monitoring equipment
   - Ed25519 signature generation for data integrity
   - Nonce-based replay attack prevention

2. **Hedera Integration**
   - HCS topics for audit trail and DID documents
   - HTS for REC token issuance
   - Verifiable on-chain evidence

3. **Verification Service**
   - Automated signature verification
   - DID resolution and controller validation
   - ACM0002 methodology compliance checks

4. **Carbon Credit Issuance**
   - NFT-based RECs with immutable metadata
   - Reference to audit envelope and methodology
   - Integration-ready for Guardian policy engine

## Methodology Alignment

This POC demonstrates compliance with:

- **Verra ACM0002 v22.0**: Grid-connected electricity generation from renewable sources
- **Applicability**: Small-scale hydropower projects (≤15 MW)
- **Monitoring Requirements**: Real-time generation data, grid displacement calculations
- **Baseline & Additionality**: Demonstrated through project documentation

## Timeline

Estimated 2–4 weeks from funding approval.

## Contact

**Bikram Biswas**  
GitHub: @BikramBiswas786  
Email: biswasbikram786@gmail.com  
Location: Balurghat, West Bengal, India

## Additional Resources

- Technical Documentation: `/docs`
- Evidence Files: `/evidence`
- Code Examples: `/code`
- Regulatory Notes: `/docs/REGULATORY_NOTES.md`
