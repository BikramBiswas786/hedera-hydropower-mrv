# Phase 5 – From Pilot Interest to Full Verra Project Path

Author: Bikram Biswas  
Repo: https://github.com/BikramBiswas786/hedera-hydropower-mrv

This document explains how, once you have:

- One interested hydropower operator (pilot).  
- One interested VVB with defined requirements.  

you move toward a Verra ACM0002 project using this digital MRV tool, from PDD drafting to validation, registration, and credit issuance. [file:882]

It builds directly on the Verra Guidebook (`docs/VERRA-GUIDEBOOK.md`). [file:882]

---

## 1. Move from Testnet PoC to real plant data

### 1.1 Decide the technical deployment

With the operator and VVB, decide whether to:

- Keep the same architecture but:
  - Continue on Testnet for a shadow MRV run, or  
  - Switch to Hedera mainnet for production data anchoring. [file:882]

Clarify:

- Which meters and devices will be represented as DIDs.  
- How often telemetry is sent (e.g., daily net exports).  
- How long data and signatures must be stored off-chain in addition to HCS logs. [file:882]

### 1.2 Keep ACM0002 logic unchanged

- Reuse the same ACM0002 baseline and ER logic tested in Testnet (Phase 0) for the real plant.  
- Only change the data source from synthetic EG to real net generation from the plant. [file:882]

---

## 2. PDD drafting under ACM0002

With the operator, consultant, and VVB:

1. Draft a PDD that:
   - Uses ACM0002 for applicability, baseline, EF source, additionality, leakage, safeguards. [file:882]  
   - Describes your digital MRV tool inside the monitoring plan:
     - Device identification via DIDs.  
     - Signed telemetry payloads and nonces.  
     - HCS topics as audit log.  
     - ACM0002 formulas as implemented (refer to Alignment Matrix and tests). [file:882]

2. Attach:
   - ACM0002 Alignment Matrix (digital mapping).  
   - Testnet Evidence + any early mainnet evidence showing the tool actually runs. [file:882]

---

## 3. Validation and registration

### 3.1 VVB validation

The VVB should:

- Check ACM0002 compliance:
  - Baseline setup and EF choices.  
  - Additionality.  
  - Leakage and safeguards. [file:882]  

- Test the digital MRV tool:
  - Recompute baseline and ER for sample periods and compare with tool outputs.  
  - Sample txids from your evidence index and confirm real messages on a Hedera explorer.  
  - Confirm signatures, nonces, and DID resolution work as documented in `DATA-INTEGRITY-DESIGN.md`. [file:882]

If satisfied, the VVB issues a validation report.

### 3.2 Verra project registration

- Verra reviews the PDD + validation report and, if satisfied, registers the project under ACM0002 with your tool referenced in the monitoring plan. [file:882]

At this stage, the tool is a named digital MRV component in a registered project, but credits are not issued yet.

---

## 4. Monitoring, verification, and credits

### 4.1 Periodic monitoring

Over each monitoring period (e.g., one year):

- Gateways send signed telemetry from the plant.  
- Your system:
  - Ingests data.  
  - Anchors events on HCS (or mainnet).  
  - Applies ACM0002 formulas to compute BE, PE, LE, ER.  
  - Logs uncertainty and QA/QC events. [file:882]

### 4.2 Monitoring report

You generate monitoring reports similar in structure to `Monitoring-Report-Testnet-Scenario1.md`, but with real plant data:

- Total MWh, EF values, BE, PE, LE, ER.  
- Uncertainty and QA/QC handling.  
- Representative txids and (optionally) IPFS hashes for underlying records. [file:882]

### 4.3 Verification and issuance

- The VVB verifies:
  - Calculations vs ACM0002 requirements.  
  - Data trail vs digital MRV logs and on-chain evidence. [file:882]  

- If satisfied, the VVB issues a verification report and Verra issues credits against the verified ERs. [file:882]

Only **after** this point can you accurately say:

> “This Hedera-based digital MRV tool was used in a Verra-registered ACM0002 hydropower project to generate issued credits.” [file:882]

Until then, your honest status remains:

> “An open, ACM0002-style digital MRV tool with a live Hedera Testnet proof-of-concept and a Methodology Idea Note submitted to Verra, designed to support future Verra projects but not yet used in an approved project.” [file:882]
