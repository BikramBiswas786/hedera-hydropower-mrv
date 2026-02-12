\# Regulatory Status



The "Hedera Hydropower dMRV" implementation in this repository is a \*\*digital MRV tool\*\* designed to demonstrate how ACM0002-style emission reductions can be computed and anchored on Hedera Testnet.\[file:451]\[web:396]



It is not:



\- An approved Verra methodology.

\- A registered Verra project.

\- A system that can issue Verified Carbon Units (VCUs) on its own.\[file:451]\[web:538]



Under the VCS Program, Verra approves methodologies (such as ACM0002 for grid-connected renewable electricity) and individual projects that apply those methodologies and pass validation and verification by an accredited VVB.\[web:396]\[web:538]



This tool:



\- Implements ACM0002 baseline and emission reduction calculations for hydropower generation data via `code/mrv-service/src/acm0002.ts`.\[file:451]

\- Accepts telemetry (deviceId, MWh, timestamp, nonce), enforces nonce-based replay protection, and anchors a SHA-256 hash of each accepted message to Hedera Consensus Service topic `0.0.7462776` using Testnet operator `0.0.6255927`.\[file:451]

\- Exposes an HTTP snapshot endpoint that returns ACM0002 baseline emissions and emission reductions for a given device based on telemetry seen in the current process.\[file:451]



The current deployment is:



\- Testnet-only (Hedera Testnet, not mainnet).

\- Intended for pilots, technical review, and evidence packages, not for production issuance of carbon credits.\[file:451]



Any production use would require a registered project, an applicable approved methodology, validation and verification, and integration with a production registry or issuance platform.\[web:538]\[file:451]



