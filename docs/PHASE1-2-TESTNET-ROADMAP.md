Phase 1–2 – Verra MIN + Testnet Mini-Tool (Roadmap)

Author: Bikram Biswas  
Repo: https://github.com/BikramBiswas786/hedera-hydropower-mrv  

This document builds on Phase 0 and explains:

- Phase 1 – How to handle the Verra MIN stage (already submitted).  
- Phase 2 – How to turn the Playground demo into a small Testnet mini-tool (Node API) that VVBs and partners can actually use. [file:882]

It assumes Phase 0 is done: clean evidence, labeled `code/playground`, ACM0002 math tests, and integrity/regulatory docs. [file:882]

---

## 1. Phase 1 – Verra MIN Path Already in Motion

You have already taken the key step:

- Submitted **VCS-MIN-v5.0-1 – “Digitized Tool/Revision for ACM0002 – Blockchain-Enabled Digital MRV for Grid-Connected Hydropower Projects.”** [file:882]  
- Attached:  
  - **ACM0002 Alignment Matrix** – digital implementation mapping. [file:882]  
  - **Testnet Evidence Package** including `evidence/txids.csv`. [file:882]  

Verra will process this according to their Methodology Development and Review Process. [file:882]

### 1.1 Message Discipline – What You Must Keep Saying

Whenever you describe this work (emails, docs, calls):

- This is a **digital MRV tool implementing ACM0002**, not a new methodology.  
- It **does not change ACM0002 formulas or scope**; it automates them. [file:882]  
- It is **not yet an approved methodology or Verra-registered project**; it is a Testnet PoC with a submitted MIN and alignment evidence. [file:882]

Do **not** say:

- “Verra-approved software.”  
- “Blockchain methodology.”  
- “Auto-issuing credits.” [file:882]

### 1.2 What Verra Does at MIN Stage

From Verra’s MIN process: [file:882]

- Screens MINs to see if:
  - The idea fits VCS scope and priorities.  
  - It is worth inviting a Concept Note.  
- Possible outcomes:
  - Invite a Concept Note (best).  
  - Ask for clarifications / more detail.  
  - Defer or decline.

There is **no project approval at MIN stage**; it is a methodology/tool idea filter. [file:882]

### 1.3 Your Actions Now (No Extra Coding)

1. **Wait for response (≈2–4 weeks typical).**  
   - Do not spam.  
   - Do not change the core narrative you already gave in the MIN. [file:882]

2. **If they ask questions**, answer using your new docs:
   - `docs/VERRA-GUIDEBOOK.md`  
   - `docs/REGULATORY-STATUS.md`  
   - `docs/DATA-INTEGRITY-DESIGN.md`  
   - `evidence/txids.csv` and its explainer doc. [file:882]

3. **If no response after 3–4 weeks**, send one polite email:
   - “Do you need any additional technical documentation or clarification?” [file:882]

All of Phase 1 is communication and clarity; no new features are required.

---

## 2. Phase 2 – Strengthen Testnet Demo into a Mini-Tool

Goal: Stay on Testnet, but move from bare Playground scripts to a small Node service that VVBs and reviewers can hit. [file:882]

You have already implemented this as `code/service`; this section documents the intended shape.

### 2.1 Wrap Playground Logic Behind an API (Still Testnet)

Design a tiny service:

- `POST /telemetry`  
  - Body: signed payload from gateway (JSON).  
  - Service:
    - Resolves DID from topic.  
    - Verifies signature using DID public key.  
    - Checks nonce to prevent replays.  
    - Writes an `AUDITv1` envelope to an HCS topic. [file:882]

- `GET /mrv-snapshot/:deviceId?period=YYYY-MM`  
  - Returns:
    - Total `EG_MWh` for the period.  
    - `EF_grid_tCO2_per_MWh`.  
    - `BE_tCO2`, `PE_tCO2`, `LE_tCO2`, `ER_tCO2`.  
    - `count` of ingested telemetry points. [file:882]

This is still **Testnet-only**, but now it looks like a real tool, not three scripts.

### 2.2 Connect Node Service to Your Evidence

For each interesting transaction (topic message, token, etc.) that the mini-tool touches:

- Add rows to `evidence/txids.csv` with clear labels like:
  - `TELEMETRY` – gateway payload anchored.  
  - `scenario1dayXXaudit` – `AUDITv1` envelope per day (if written).  
  - Any snapshot-related txid or message. [file:882]

Update your Testnet evidence doc to explain:

- Which rows correspond to:
  - Playground scripts.  
  - Mini-tool service runs (telemetry + snapshot). [file:882]

This keeps your evolving Testnet story tied to a **single** evidence file.

### 2.3 ACM0002 Math Linkage

Ensure that:

- The mini-tool’s snapshot endpoint uses **the same ACM0002 functions** documented and tested in Phase 0.  
- Numeric outputs (e.g., `EG_MWh`, `BE_tCO2`, `ER_tCO2`) can be recomputed manually from:
  - Raw telemetry (kWh).  
  - Grid emission factor.  
  - The formulas and test cases documented in `docs/TEST-RESULTS.md`. [file:882]

This is what gives VVBs and Verra confidence that your API is not a black box.

---

## 3. Summary – Where Phases 1–2 Put You

After Phases 1–2:

- **Verra**:
  - Has your MIN, alignment matrix, and Testnet evidence on file.  
  - May engage you for clarifications or a Concept Note. [file:882]

- **Tech**:
  - Cleaned evidence and fully documented Testnet PoC.  
  - `code/playground` clearly marked as PoC only.  
  - ACM0002 math implemented and tested with documented results.  
  - A Testnet mini-tool API (`POST /telemetry`, `GET /mrv-snapshot/...`) that shows exactly how MRV data flows from meters to chain to ER calculations. [file:882]

At that point, you are ready for:

- **Phase 3** – A canonical Testnet monitoring scenario + Monitoring Report PoC.  
- **Phase 4** – Conversations with one VVB and one hydropower operator about a real pilot when you’re ready to go beyond Testnet. [file:882]

