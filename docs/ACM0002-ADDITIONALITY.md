# ACM0002 Additionality (Phase 0 – Illustrative Only)
## 1. Purpose and disclaimer
This document provides an **illustrative** view of how additionality could be assessed for a grid-connected hydropower project using ACM0002 and comparable Verra/UNFCCC guidance. It is **not** a complete additionality demonstration for any specific project.
The current Hedera Testnet dMRV implementation focuses on digital MRV, data integrity, and correct application of ACM0002 equations; project-level additionality must be established separately in a formal PDD.
## 2. Additionality approaches (conceptual)
In ACM0002-style hydropower projects, additionality is typically demonstrated using:
- Investment analysis: compare project IRR or NPV against a benchmark or alternative scenarios.  
- Barrier analysis: show non-financial barriers (technical, institutional, regulatory) that would prevent the project without carbon revenue.  
- Common practice analysis: show that similar projects are not already common in the region without carbon finance.  
This POC does not implement these tests in code; it offers only a narrative template and a simple numerical illustration.
## 3. Illustrative investment analysis example
### 3.1 Assumptions (simplified)
For illustration only, consider a small hydropower plant with:
- Installed capacity: 5 MW.  
- Capacity factor: 50 %.  
- Annual generation \(EG_{PJ,y}\): \(5 · 0.5 · 8{,}760 ≈ 21{,}900\ \text{MWh/year}\).  
- Electricity tariff: 60 USD/MWh.  
- CAPEX: 15 million USD.  
- OPEX: 300,000 USD/year.  
- Project lifetime: 20 years.  
- Discount rate / benchmark: 10 % (example).  
These values are placeholders and must be replaced with real project data in a PDD.
### 3.2 Cash flow sketch (without carbon revenue)
- Annual revenue from electricity:  
  21,900 MWh·year × 60 USD/MWh = 1,314,000 USD/year.  
- Annual OPEX: 300,000 USD/year.  
- Net operating cash flow (before financing and taxes, simplified):  
  ≈ 1,014,000 USD/year.  
An IRR can be computed using the initial CAPEX and the annual cash flows; if the resulting IRR is **below** a sectoral benchmark or typical investor hurdle rate, additionality could be argued under an investment analysis.
This POC does **not** compute IRR in code or claim any additionality conclusion; it only shows how such a calculation might be framed by a project developer.
### 3.3 Impact of carbon revenue (illustrative)
If verified emission reductions \(ER_y\) are generated and sold as credits, carbon revenue might:
- Increase annual cash flows.  
- Potentially lift IRR over the benchmark, supporting an argument that the project is only attractive with carbon finance.  
However, assessing this requires project-specific assumptions about carbon prices, contract structures, and risk, which are out of scope here.
## 4. How the dMRV tool fits into additionality
- The Hedera-based dMRV system ensures that **generation data** and resulting \(ER_y\) values are transparent, tamper-evident, and verifiable (DIDs, signatures, HCS, NFTs).  
- This strengthens confidence in the **quantity** of emission reductions, but it does **not** determine whether those reductions are additional.  
- Additionality must still be demonstrated via a methodology-compliant PDD, independent validation, and registry approval.  
In other words, this dMRV POC is a **data integrity and quantification tool** that could be used in an additionality-positive project but does not itself provide the additionality proof.
## 5. How a project would extend this template
A real project using this stack would:
1. Populate a full additionality analysis section in its PDD using actual CAPEX/OPEX/tariff data and regulatory context.  
2. Include references to the dMRV tool only as supporting infrastructure for monitoring and reporting, not as the basis for additionality.  
3. Ensure that any baseline and additionality choices (e.g., EF, scenarios, benchmarks) used in the PDD match the parameters configured in the MRV service.
This document should be treated as a **Phase 0 narrative template** and starting point for future pilots, not as a final additionality demonstration.
