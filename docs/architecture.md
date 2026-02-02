# Architecture Deep Dive — Hedera Hydropower MRV

## Overview

This system implements a hydropower‑exclusive MRV pipeline on Hedera Testnet: **Gateway DID → signed telemetry → orchestrator verification → AUDITv1 on HCS → REC NFT on HTS**.[attached_file:1][web:23]

## Components

- **Physical Gateways (ZGW‑10 or similar)**  
  Collect hydropower telemetry, compress readings, and sign packets with a local Ed25519 key.[attached_file:1]

- **Gateway DID (HCS Topic)**  
  A DID document stored on a Hedera Consensus Service topic containing the gateway’s `publicKeyBase64` and controlled by an account DID.[web:33][attached_file:1]

- **Operator Account (Grandfather Key)**  
  `did:hedera:account:<accountId>` is the root of trust that controls gateway DID creation, key rotation, and revocation.[attached_file:1]

- **Orchestrator (Verifier)**  
  Resolves gateway DID, obtains its public key, verifies gateway signatures, checks nonces, and submits an **AUDITv1** envelope to HCS.[attached_file:1][web:38]

- **HCS Audit Topic**  
  Immutable, append‑only log of AUDITv1 messages, each linked to a gateway reading and nonce.[attached_file:1][web:36]

- **HTS Renewable Energy Credits (RECs)**  
  Non‑fungible tokens representing verified hydropower generation events, with metadata referencing the audit envelope and optional royalties.[attached_file:1][web:23]

## Data Flow

1. Sensors → gateway → compressed multi‑field reading (kWh, flow, efficiency, RPM, pH, turbidity).[attached_file:1]  
2. Gateway signs a **Master Reading Packet** and includes its DID and nonce.[attached_file:1]  
3. Orchestrator resolves the gateway DID from HCS and extracts `publicKeyBase64`.[web:33][attached_file:1]  
4. Orchestrator verifies the signature and checks the nonce for replay.[attached_file:1]  
5. Orchestrator writes an **AUDITv1** envelope to the audit topic with energy and compression fields.[attached_file:1]  
6. Optionally, an HTS NFT is minted as a REC, referencing the audit envelope in metadata.[attached_file:1][web:38]

## Trust Model

- **Root of trust:** Operator account DID (grandfather key) controls gateway DID lifecycle.[attached_file:1]  
- **Gateway keys are replaceable:** Operator can rotate gateway keys by publishing updated DID documents to the DID topic.[web:33][attached_file:1]  
- **Topics are transport:** HCS topics store DID documents and audit messages but do not replace account‑level authority.[attached_file:1]

## Security Considerations

- Use HSM/KMS for operator keys and production gateway keys.[web:23]  
- Persist nonces in a real database (PostgreSQL/Redis) for horizontal scaling.[attached_file:1]  
- Apply rate‑limiting, input validation, and monitoring to the orchestrator service.[web:23]  
- Store REC metadata in IPFS or similar, keeping only content hashes on‑chain for minimal storage.[attached_file:1][web:23]

_Last updated: February 2, 2026_
