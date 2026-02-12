\# Data Integrity Design



This section describes how the hydropower MRV service uses Hedera Consensus Service (HCS) and basic cryptography to provide tamper-evident evidence for renewable electricity generation data.\[file:451]\[web:541]



\## Objectives



\- Prove that specific telemetry messages (deviceId, timestamp, MWh, nonce) existed at or before a given time.

\- Detect tampering with stored telemetry logs by comparing them against hashes anchored on HCS.

\- Prevent simple replay attacks at the MRV service boundary.\[file:451]\[web:541]\[web:549]



\## Architecture



1\. The plant gateway or SCADA adapter sends telemetry to the MRV service via `POST /telemetry` with a JSON payload that includes:

&nbsp;  - `deviceId` (e.g., `TURBINE-1`)

&nbsp;  - `timestamp`

&nbsp;  - `mwh` (MWh generated over the interval)

&nbsp;  - `nonce` (monotonically increasing integer per device).\[file:451]\[web:549]



2\. The MRV service:

&nbsp;  - Validates the payload.

&nbsp;  - Checks that the `nonce` is strictly greater than the last seen nonce for that device (nonce-based replay protection).

&nbsp;  - Computes a SHA-256 hash of the canonical telemetry JSON.

&nbsp;  - Submits the hash as an HCS message to topic `0.0.7462776` using operator `0.0.6255927` on Hedera Testnet.\[file:451]\[web:541]\[web:545]



3\. Hedera Consensus Service acts as a decentralized notary, assigning an immutable consensus timestamp and sequence number to each message, and mirror nodes store the ordered log of messages for later audit.\[web:541]\[web:546]



4\. The MRV service records the resulting transaction ID, topic ID, deviceId, nonce, and message hash in `evidence/txids.csv`, which can be cross-checked against HashScan and mirror node queries.\[file:451]\[web:541]



\## Integrity Properties



\- \*\*Immutability of anchors\*\*: Once a hash is written to HCS, it becomes part of an append-only, tamper-proof log, meaning any attempt to alter history would be detectable.\[web:541]\[web:542]

\- \*\*Detectable log tampering\*\*: If local telemetry logs are modified, their recomputed hashes will not match the hashes recorded on HCS for the same timestamps and nonces.\[file:451]

\- \*\*Replay protection\*\*: Nonce replay protection (using a “number used once” per device) ensures that old telemetry messages cannot simply be resubmitted to the MRV service to forge additional generation.\[file:451]\[web:545]\[web:549]



\## Scope and Limitations



\- The design provides strong evidence that specific telemetry records existed at or before their consensus timestamps and have not been silently modified since.

\- It does not prevent false data from entering the system at the source; assuring the correctness of plant-side measurements requires additional controls (calibrated meters, audits, and plant-level QA/QC processes).\[file:451]\[web:540]



