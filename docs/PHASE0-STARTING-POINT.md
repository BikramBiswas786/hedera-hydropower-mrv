\# Phase 0 – Starting Point



This document describes the starting point for the hydropower MRV proof-of-concept at the time the Phase 0 evidence package is assembled.\[file:451]



\## Repository structure (relevant parts)



\- `code/mrv-service/`: TypeScript microservice implementing ACM0002 calculations, telemetry ingestion, and HCS anchoring.

\- `evidence/txids.csv`: CSV file containing device IDs, nonces, message hashes, and Hedera Testnet transaction IDs for telemetry anchors.

\- `docs/`: Markdown documentation, including regulatory status, data integrity design, test results, and testnet evidence.\[file:451]



\## Network and configuration



For this Phase 0 deployment:



\- Network: Hedera Testnet.

\- Operator account: `0.0.6255927`.

\- Operator key: Testnet private key held locally by the developer (not committed to the repository).

\- HCS topic: `0.0.7462776` used to anchor telemetry hashes.\[file:451]\[web:541]



These values are configured via environment variables before starting the service, for example:



```powershell

$env:HEDERA\_OPERATOR\_ID = "0.0.6255927"

$env:HEDERA\_OPERATOR\_KEY = "<private key>"

$env:HEDERA\_TOPIC\_ID = "0.0.7462776"

$env:GRID\_EF = "0.8"

npm start

Functional starting point

At Phase 0 the system can:



Accept simple telemetry payloads for a hydropower device, enforce nonce ordering, and compute ACM0002 baseline and emission reductions in-memory.



Submit SHA-256 hashes of accepted telemetry messages to Hedera Consensus Service and record the resulting transaction IDs in evidence/txids.csv.



Expose an HTTP snapshot endpoint that returns current MWh, baseline emissions, and emission reductions for each device in the running process.\[file:451]\[web:411]\[web:541]\[web:546]



Out of scope for Phase 0

The following are explicitly out of scope at this stage:



Mainnet deployment or integration with any production registry.



Automated calculation of grid emission factors from external data sources.



Full project lifecycle management, issuance, or retirement of carbon credits.



Formal validation or verification under any carbon standard.\[file:451]\[web:538]



text



Save and close.



\*\*\*



Once all three are saved, run this to quickly list them and confirm sizes > 0:



```powershell

Get-ChildItem .\\docs

