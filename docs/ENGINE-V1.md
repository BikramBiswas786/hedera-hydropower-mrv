# ENGINE V1 – Hydropower MRV Core
ENGINE V1 is the fixed, Verra-aligned MRV engine. Execution knobs never change its logic.
## Methodology
- Based on ACM0002 mapping and alignment matrix (see `ACM0002-Alignment-Matrix.docx`).
- Telemetry schema: turbineId (DID), flowRate, headHeight, capacityFactor, pH, turbidity, generatedKwh, timestamps, signature, publicKey.
## Identity & Data
- Device DIDs and verifier DIDs on DID topic `0.0.7462776`.
- Telemetry and attestations on audit topic `0.0.7462600`.
- REC tokens: `0.0.7462931`, `0.0.7462932`, `0.0.7462933`.
## Verification
- AnomalyDetector: physics (ρ g Q H), temporal consistency, environmental bounds, Z-score anomalies.
- VerifierAttestation: APPROVED/REJECTED with reasons, signed by verifier key.
## Issuance
- Guardian policy watches audit topic for valid attestations and mints HTS REC NFTs with royalties.
## Cost & Evidence
- Legacy MRV ≈ 10 USD/REC.
- dMRV via ENGINE V1 ≈ 0.50 USD/REC (95% savings) based on 90-day testnet simulator results.
- Testnet account `0.0.6255927`, topics and tokens verifiable on HashScan.
ENGINE V1 is the reference implementation. All project knobs (scope, anchoring, batching, AI) change only *how* and *where* data is anchored and reviewed, not the MRV logic itself.
