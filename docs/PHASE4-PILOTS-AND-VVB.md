# Phase 4 – From Testnet PoC to Real Pilots and a VVB

Author: Bikram Biswas  
Repo: https://github.com/BikramBiswas786/hedera-hydropower-mrv

This document explains how to use the current Hedera Testnet PoC (mini-tool + Scenario 1) to secure:

- One interested hydropower operator (pilot plant).  
- One VCS-accredited Validation and Verification Body (VVB) willing to explore digital MRV using this tool. [file:882]

It assumes:

- Phase 0 done – clean evidence, ACM0002 tests, integrity + regulatory docs.  
- Phase 1 done – MIN submitted, you are waiting/responding.  
- Phase 2 done – Testnet mini-tool (`POST /telemetry`, `GET /mrv-snapshot`).  
- Phase 3 done – Scenario 1 Monitoring Report with 91 readings for TURBINE-1 in 2026-01. [file:882]

---

## 1. Hydropower operator outreach

### 1.1 What you show

When contacting a plant:

- GitHub repo: open-source Hedera hydropower MRV implementation targeting ACM0002. [web:919][file:882]  
- `docs/Monitoring-Report-Testnet-Scenario1.md`: shows a full month’s MRV story (EG, BE, ER, count=91) with on-chain evidence. [file:882]  
- `evidence/txids.csv`: HashScan-backed index of accounts, topics, tokens, and TELEMETRY txids. [file:882]  

### 1.2 What you say (core pitch)

- This is an ACM0002-style digital MRV tool that:
  - Automates data capture and emission calculations.  
  - Writes an immutable audit trail on Hedera.  
  - Is designed to support Verra projects but is not, by itself, an approved methodology or registered project. [file:882]

### 1.3 What you ask for

At this stage, no real data yet. You ask:

- Would you be open, in principle, to:
  - Run this tool in parallel with your existing MRV system for a limited period?  
  - Share anonymized meter data so the tool can be tuned?  
  - Potentially be the **first** pilot plant in a Verra or similar program using digital MRV? [file:882]

### 1.4 Desired outcome

- An email or letter of interest where the operator:
  - Acknowledges understanding the Testnet PoC and Scenario 1.  
  - States they are open to a future free pilot under ACM0002-style MRV using this tool. [file:882]

---

## 2. VVB outreach

### 2.1 What you send

To one VCS-accredited VVB (renewables focus):

- MIN package summary (VCS-MIN-v5.0-1 “Digitized Tool/Revision for ACM0002”). [file:882]  
- ACM0002 Alignment Matrix mapping digital implementation to methodology sections. [file:882]  
- Testnet Evidence Package including `evidence/txids.csv`. [file:882]  
- `docs/Monitoring-Report-Testnet-Scenario1.md` showing EG/BE/ER with HashScan links. [file:882]

### 2.2 Questions you ask

- For a future ACM0002 hydropower project that uses this tool:
  - What documentation and data formats would you need to validate the project?  
  - How should the digital evidence (HCS logs, txids, signatures, nonces) be presented in your workpapers?  
  - What tests would you run to be comfortable with the tool’s calculations and data trail? [file:882]

### 2.3 Desired outcome

- A short written response or call summary where the VVB:
  - Confirms they understand the digital MRV concept and Testnet PoC.  
  - Lists concrete requirements (docs, procedures, interfaces) for a real project validation. [file:882]

---

## 3. Phase 4 completion criteria

Phase 4 is **done** when:

- You have at least one hydropower operator expressing written interest in a free pilot using this digital MRV tool.  
- You have at least one VVB giving you a written list of requirements for validating a project that uses the tool. [file:882]

Until then, you stay fully on Testnet; no mainnet deployment or real PDD drafting yet. [file:882]
