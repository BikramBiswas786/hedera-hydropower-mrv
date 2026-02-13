# Monitoring Plan (Phase 0 – Hedera Hydropower dMRV)
## 1. Purpose and scope
This monitoring plan describes how key parameters for the hydropower dMRV Testnet implementation are measured, recorded, and anchored on Hedera. It is modeled on ACM0002-style monitoring plans but simplified for a digital MRV POC.
The focus is on **data flows and integrity** (DIDs, signatures, nonces, HCS audit, REC NFTs) rather than detailed metering hardware specifications for a particular plant.
## 2. Monitored parameters
### 2.1 Core parameters
| ID  | Parameter                               | Unit    | Description                                                   | Source                     | Usage                                       |
| --- | --------------------------------------- | ------- | ------------------------------------------------------------- | -------------------------- | ------------------------------------------- |
| MP1 | Net electricity to grid per interval    | MWh     | Energy delivered during the reporting interval.              | Meter/gateway telemetry    | Aggregated to compute \(EG_{PJ,y}\) and ER. |
| MP2 | Logical device identifier (`deviceId`)  | –       | Identifier for meter/gateway (e.g., `TURBINE-1`).            | Gateway configuration      | Links telemetry to physical assets and DID. |
| MP3 | Timestamp (`timestamp`)                 | ISO8601 | Time when the reading is taken or reported.                  | Gateway clock              | Ordering, sanity checks, audit reconstruction. |
| MP4 | Nonce (`nonce`)                         | integer | Strictly increasing sequence number per device.              | Gateway                    | Replay protection.                          |
### 2.2 Optional sensor parameters
Examples (if included in gateway payloads):
- Energy in kWh per interval (`kWh`)  
- Water flow (`flow`)  
- Turbine/generator efficiency (`efficiency`)  
- Turbine speed (`rpm`)  
- Water pH (`pH`)  
- Turbidity (`turbidity`)  
These support richer telemetry and potential future safeguards but are not used in ACM0002 math in Phase 0.
## 3. Measurement methods and devices (conceptual)
- Each physical meter or turbine is associated with a logical `deviceId` and, in this POC, a corresponding gateway DID (`did:hedera:topic:<topicId>`).  
- The gateway aggregates meter data over a fixed interval and constructs a compact telemetry packet.  
For a real project, the PDD must specify meter accuracy class, calibration interval, and responsible party; those details are left to project-specific docs.
## 4. Data flow and frequency
### 4.1 Logical data flow
1. Sensors/meters record raw electrical and process variables at the hydropower plant.  
2. A gateway aggregates readings per interval, builds telemetry JSON (`deviceId`, `mwh`/`kWh`, `timestamp`, `nonce`, and optional parameters), and signs it with an Ed25519 private key.  
3. The signed payload is sent to the orchestrator / MRV service (e.g., `POST /telemetry` or `POST /verify`).  
4. The orchestrator verifies the signature using the gateway public key from the DID Document, checks the nonce, and, if valid, submits an `AUDITv1` envelope to the Hedera Consensus Service topic.  
5. Optionally, a REC NFT (HTS) is minted whose metadata references the audit envelope or its IPFS CID.  
6. MRV snapshots (`GET /mrv-snapshot/:deviceId`) compute baseline emissions and emission reductions using ACM0002 equations and the cumulative MWh.
### 4.2 Measurement and reporting frequency
- Telemetry interval: configurable at the gateway (e.g., every 5–15 minutes); not hard-coded in this POC.  
- MRV snapshot frequency: on demand (e.g., daily or weekly) via the MRV service; annual reporting periods are defined in the project’s PDD.  
- DID and key lifecycle events are logged as HCS messages and referenced in evidence files.
## 5. Data integrity and QA/QC
Key digital QA/QC mechanisms:
- Device identity and control: each gateway DID is controlled by an operator account DID, providing a root of trust for device keys.  
- Signature verification: every telemetry payload is signed with the gateway’s private key and verified against the DID Document before audit submission.  
- Replay protection: per-device nonce must increase strictly; stale or duplicate nonces are rejected.  
- Immutable audit trail: each successful verification results in an `AUDITv1` message on HCS, visible via HashScan and forming a timestamped audit log.
Classical ACM0002 QA/QC checks (backup meters, missing data handling, etc.) are not implemented in code here and must be added per project.
## 6. Responsibilities and records
- Plant operator: maintains physical meters, performs calibrations, ensures gateway configuration matches plant topology.  
- MRV operator / integrator: maintains the Hedera-based dMRV service, manages DID lifecycle and nonce persistence, and curates `evidence/txids.csv` and related docs.  
- Verifier (VVB): uses this monitoring plan, the Verification Guide, and HashScan URLs to confirm that measurements, on-chain audit messages, and MRV outputs are consistent.
This monitoring plan is intentionally concise and generic; for a real project, it should be extended with plant-specific hardware details, calibration certificates, and precise responsibilities.
