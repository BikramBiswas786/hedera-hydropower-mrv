# Hydropower MRV Methodology (Hedera — POC)

text
# Hydropower MRV Methodology

## Lifecycle Overview

This methodology covers the full hydropower MRV lifecycle: **Measurement → Reporting → Verification → Certification → Retirement**, implemented on Hedera Testnet for the DLT Earth / Guardian bounty.[attached_file:1][web:18]

## 1. Measurement

Hydropower sensors generate raw telemetry per interval:

```json
{
  "kWh": 85,
  "flow": 55,
  "efficiency": 82,
  "rpm": 150,
  "pH": 72,
  "turbidity": 28
}
A gateway compresses these measurements into a fixed 6‑byte binary payload to minimize on‑chain footprint.[attached_file:1]

2. Reporting
The gateway node:

Aggregates sensor data for a defined time window.[attached_file:1]

Compresses values into a hex string (6 bytes).[attached_file:1]

Adds a unique nonce for replay protection.[attached_file:1]

Signs the packet using its Ed25519 private key and DID.[attached_file:1]

Example payload:

json
{
  "did": "did:hedera:topic:0.0.7462776",
  "timestamp": 1738502400000,
  "compressed": "55374f8245e4",
  "kWh": 85,
  "nonce": "847291038472",
  "gatewayLabel": "HydroGateway-1"
}
3. Verification
The orchestrator performs:

Resolve the gateway DID from HCS and fetch the DID Document.[web:33][attached_file:1]

Extract publicKeyBase64 from verificationMethod[0].[attached_file:1]

Verify the Ed25519 signature over the JSON payload.[attached_file:1]

Check that the nonce has not been seen before.[attached_file:1]

Optionally, enforce timestamp bounds and basic sanity checks.[attached_file:1]

javascript
const isValid = nacl.sign.detached.verify(
  payloadBytes,
  signatureBytes,
  publicKeyBytes
);
4. Audit
On successful verification, the orchestrator submits an AUDITv1 envelope to an HCS topic:

json
{
  "version": "AUDITv1",
  "topicId": "0.0.7462776",
  "timestamp": 1738502400000,
  "kWh": 85,
  "compressed": "55374f8245e4",
  "nonce": "847291038472",
  "gateway": "HydroGateway-1"
}
This provides an immutable, timestamp‑ordered audit trail for each verified generation event.[attached_file:1][web:36]

5. Certification
A verifier or registry mints an HTS NFT as a Renewable Energy Certificate (REC):

json
{
  "tokenId": "0.0.7462931",
  "serial": 1,
  "name": "Hydropower REC #1",
  "metadata": "ipfs://QmAuditEnvelopeCID",
  "royalties": [
    { "account": "0.0.LICENSE_HOLDER", "percentage": 0.20 }
  ]
}
The metadata links back to the AUDITv1 envelope (direct JSON or IPFS CID) to preserve traceability.[attached_file:1][web:23]

6. Retirement
To retire a REC and avoid double counting, the NFT is burned:

javascript
await new TokenBurnTransaction()
  .setTokenId(tokenId)
  .setSerials([serial])
  .execute(client);
The burn transaction ID, combined with the audit log, serves as evidence of permanent retirement.[attached_file:1][web:38]

Security Notes
Use account DID as the controller of gateway DIDs (grandfather key model).[attached_file:1]

Treat HCS topics as transport and audit layers, not as root authorities.[attached_file:1][web:33]

Persist nonces across orchestrator instances to prevent replay attacks at scale.[attached_file:1]

Store private keys in KMS/HSM in production environments.[web:23]

Last updated: February 2, 2026

text

***

### FILE: `docs/verification_guide.md`

**Commit message:** `docs: add verification guide`

```markdown
# Verification Guide

This guide explains how a reviewer can independently verify the hydropower MRV POC on Hedera Testnet using HashScan and the repository’s evidence.[attached_file:1][web:23]

## 1. Verify DID Topic

1. Open the DID topic URL from `evidence/txids.csv` in HashScan.[attached_file:1]  
2. Go to the **Topic Messages** tab and locate the DID Document JSON.[attached_file:1][web:36]  
3. Confirm the `controller` field equals the operator account DID, for example:

```json
{
  "controller": "did:hedera:account:0.0.6255927"
}
Confirm verificationMethod[0].publicKeyBase64 matches the gateway’s public key used in the POC.[attached_file:1]

2. Verify AUDITv1 Envelope
In the same topic (or the designated audit topic), locate an AUDITv1 JSON message.[attached_file:1]

Confirm it contains at least the following fields:

json
{
  "version": "AUDITv1",
  "topicId": "0.0.7462776",
  "kWh": 85,
  "compressed": "55374f8245e4"
}
Cross‑check nonce and gateway fields with the gateway output.[attached_file:1]

3. Verify Signature (Optional)
Using Node.js and tweetnacl:

javascript
const nacl = require("tweetnacl");

const payload = "...";   // exact payloadString from gateway output
const signature = Buffer.from("...", "base64");
const publicKey = Buffer.from("...", "base64");

const isValid = nacl.sign.detached.verify(
  Buffer.from(payload, "utf8"),
  signature,
  publicKey
);

console.log("Valid:", isValid); // true ✅
This confirms the payload was signed by the gateway key declared in the DID Document.[attached_file:1]

4. Verify NFT Metadata
Open the REC token link from evidence/txids.csv in HashScan (token + serial).[attached_file:1]

Inspect the metadata field and decode it if necessary.[web:23]

Confirm it references the correct AUDITv1 envelope (by topic ID, timestamp, or IPFS CID).[attached_file:1]

5. Confirm Lifecycle in evidence/txids.csv
Ensure evidence/txids.csv contains:

Measurement timestamp

DID / audit topic IDs

Audit message transaction ID

Token ID + serial

HashScan URLs for both topic and token[attached_file:1]

These combined records demonstrate a full Measurement → Verification → Certification chain on Testnet.[attached_file:1][web:18]

text

***

### FILE: `docs/grandfather_key_concept.md`

**Commit message:** `docs: add grandfather key concept`

```markdown
# Grandfather Key Concept

## Definition

The **grandfather key** is the operator account DID (`did:hedera:account:<accountId>`) that acts as the root of trust for all gateway device DIDs in this MRV system.[attached_file:1]

## Why It Matters

- **Trust anchor:** The operator account DID is stable and under direct control of the project operator.[attached_file:1]  
- **Key rotation:** Gateway keys can be rotated by updating the DID Document without changing the DID itself.[web:33][attached_file:1]  
- **Revocation:** The operator can revoke or replace gateway keys by publishing a new DID Document on the DID topic.[attached_file:1]

## Example Hierarchy

```text
did:hedera:account:0.0.6255927   (Operator DID, grandfather key)
           │
           └── controls
               did:hedera:topic:0.0.7462776   (Gateway DID)
                        └── verificationMethod.publicKeyBase64
Best Practices
Store the grandfather key in HSM/KMS for production.[web:23]

Use the account DID only as controller, not as a signing key in gateway code.[attached_file:1]

Keep DID Documents small and deterministic to simplify verification.[web:33]

This pattern is compatible with Hedera DID specifications and Guardian‑style digital methodologies.[attached_file:1][web:33]

text

***

## 4. Evidence and meta files

### FILE: `evidence/txids.csv`

**Commit message:** `chore: add evidence template`

```csv
step,measurement_timestamp,measurement_topic,audit_message_txid,audit_message_topic,token_id,token_serial,hashscan_audit_url,hashscan_token_url
hydro-sensor-001|sample-reading,2025-12-16T01:39:32Z,REPLACE_TOPIC_ID,REPLACE_TXID,REPLACE_TOPIC_ID,REPLACE_TOKEN_ID,REPLACE_SERIAL,https://hashscan.io/testnet/topic/REPLACE_TOPIC_ID,https://hashscan.io/testnet/token/REPLACE_TOKEN_ID?serial=REPLACE_SERIAL
