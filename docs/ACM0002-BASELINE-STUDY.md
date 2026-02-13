# ACM0002 Baseline Study (Phase 0 – Testnet POC)
## 1. Purpose and scope
This document provides a simplified ACM0002-style baseline assessment for the hydropower dMRV demonstration on Hedera Testnet. It is intended **only** as a Phase 0 template for digital MRV tooling and does not replace a project-specific PDD or full methodology application.
## 2. Project and system description (conceptual)
- Technology: Grid-connected hydropower plant (run-of-river or reservoir-type) supplying electricity to an existing regional grid.  
- MRV scope: Net electricity delivered to the grid (MWh), monitored digitally and anchored on Hedera Testnet via DID-signed telemetry, HCS audit messages, and REC NFTs.  
- Geographic / regulatory specifics: Intentionally abstracted in this POC; a real project would specify country, grid region, and applicable regulations.
For this Phase 0 POC, the MRV pipeline and ACM0002 equations are implemented and tested, while project-specific details remain placeholders.
## 3. Baseline scenario analysis
### 3.1 Identified plausible scenarios
For a typical grid-connected hydropower project, realistic alternatives include:
1. Continuation of current grid supply without the project (status quo).  
2. Construction or dispatch of additional fossil-fuel-based generation (e.g., coal or gas plant) to meet the same demand.  
3. Addition of another renewable project of similar scale (e.g., wind or solar) instead of this hydropower plant.  
In ACM0002-style applications, the baseline is usually “continuation of current grid mix,” represented by a combined margin grid emission factor.
### 3.2 Baseline scenario selection
For this POC, the **baseline scenario** is:
> Electricity supplied by the existing grid generation mix, without the hydropower project.
Rationale (conceptual):
- The grid has sufficient demand growth and non-zero marginal fossil generation, so new renewable electricity effectively displaces a share of fossil-based generation.  
- A dedicated fossil plant alternative is not modeled explicitly here; instead, the combined margin EF is used to approximate the carbon intensity of displaced grid electricity.  
- This is consistent with the intent of ACM0002, but a real project would need a full alternatives and barrier analysis in the PDD.
## 4. Grid emission factor assumption
### 4.1 Parameter and notation
The grid emission factor is denoted \(EF_{grid,CM,y}\) in ACM0002 and expressed in tCO₂/MWh.
For this Phase 0 POC:
- A fixed example value is used:  
  - \(EF_{grid,CM,y} = 0.8\) tCO₂/MWh (combined margin, illustrative).  
- This value is configurable in the MRV service via `CONFIG.gridEmissionFactor` (or `GRIDEF` env var).
### 4.2 Justification and limitations
- The value 0.8 tCO₂/MWh is a plausible order-of-magnitude for carbon-intensive grids but is **not** tied to a specific country or year.  
- In production, \(EF_{grid,CM,y}\) must be derived using approved grid emission factor tools or official datasets for the project grid, consistent with ACM0002 guidance.  
- For this Testnet demonstration, the purpose is to ensure that the digital MRV stack correctly applies the baseline formula once a project-specific EF is provided.
## 5. Baseline emissions calculation example
Given:
- Annual net electricity supplied to the grid by the project:  
  \(EG_{PJ,y} = 10{,}000\) MWh.  
- Grid emission factor:  
  \(EF_{grid,CM,y} = 0.8\) tCO₂/MWh.  
Baseline emissions:
\[
BE_y = EG_{PJ,y} · EF_{grid,CM,y} = 10{,}000 · 0.8 = 8{,}000 \text{ tCO₂}
\]
This matches the ACM0002 math implemented in the MRV service (`computeAcm0002`) and the unit tests recorded in `docs/TEST-RESULTS.md`.
## 6. Relationship to the MRV service and evidence
- The MRV service aggregates cumulative electricity generation (MWh) per device and applies the same baseline equation to compute \(BE_y\).  
- Test cases using 10,000 MWh and EF = 0.8 tCO₂/MWh are implemented in `src/tests/acm0002.test.ts`, with results captured in `docs/TEST-RESULTS.md`.  
- HashScan evidence (HCS messages and REC NFTs) in `evidence/txids.csv` and `docs/Testnet-Evidence.md` provides a transparent trail from telemetry to baseline/ER outputs, but does not by itself constitute a full baseline study for a real project.
> **Phase 0 caveat:** A real project must prepare a full baseline section in its PDD using official ACM0002 and grid EF tooling. This document is a simplified template aligning the digital MRV logic with those expectations.
