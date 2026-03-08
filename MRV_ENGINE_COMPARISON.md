Details Comparison between 3 Different types of engines 


# Comparative Scientific Analysis of Three Hedera Hydropower MRV Engine Generations: Complete Architectural, Mathematical, Implementation, and Operational Evaluation with Production Runtime Verification

**Author**: Bikram Biswas  
**Role**: Full-Stack Blockchain Developer and Principal Architect  
**Project**: Hedera Hydropower Digital MRV Tool  
**Repository**: https://github.com/BikramBiswas786/hedera-hydropower-mrv  
**Live Deployment**: https://hydropower-mrv-19feb26.vercel.app  
**Date**: March 9, 2026  
**Version**: 5.0 — Complete Scientific Edition

---

## Abstract

This research monograph presents an exhaustive comparative analysis of three successive computational verification engine generations that constitute the core algorithmic architecture of the Hedera Hydropower digital Monitoring, Reporting, and Verification (MRV) platform. The three systems under evaluation are: Engine V1, a baseline deterministic validation engine; Engine V1 AI-Enhanced, a multi-factor probabilistic trust scoring engine that serves as the current production default; and Engine V2, a two-tier governance adaptation module that exists as a fully implemented optional extension.

Engine V1 establishes first-principles hydropower physics validation grounded in the power equation P = ρghQη with a tolerance acceptance band of ±15 percent, directly integrated with the UNFCCC ACM0002 Grid-Connected Renewable Electricity Generation carbon accounting methodology. It implements four orthogonal validation layers covering physics fundamentals, temporal continuity, environmental sensor bounds, and statistical outlier detection, creating a deterministic and fully reproducible verification framework suitable for regulatory audit.

Engine V1 AI-Enhanced advances the architecture by replacing binary threshold scoring with continuous differentiable scoring functions across five weighted validation dimensions: physics (weight 0.30), temporal continuity (0.25), environmental bounds (0.20), statistical anomaly detection (0.15), and device consistency (0.10). The weighted composite of these scores produces a single trust value on the interval [0.0, 1.0], which feeds a tri-band decision system: APPROVED for trust scores at or above 0.90, FLAGGED for scores between 0.50 and 0.89, and REJECTED for scores below 0.50. On-chain transaction records on the Hedera Testnet confirm production execution of all three decision pathways.

Engine V2 introduces a meta-governance control layer over the V1 AI-Enhanced scoring pipeline, implementing two operational modes. Mode A, designated Regulator-Strict, applies an elevated auto-approval threshold of 0.97, routes 40 to 60 percent of readings to human review, and applies mandatory sampling audits. Mode B, designated Evidence-Rich, operates at the standard 0.90 threshold with adaptive statistical sampling at 5 to 15 percent accompanied by enriched evidence bundles. Transition between modes is governed by six mandatory graduation criteria and four independent reversion triggers, operationalizing closed-loop risk control rather than static policy.

Quantitative economic modeling across 1,000-reading batches demonstrates automation rates increasing from 40 to 60 percent under V1 Baseline, to 70 to 90 percent under V1 AI-Enhanced, to 90 to 95 percent under V2 Mode B. Per-REC verification costs fall correspondingly from approximately $5 to $8, to $1 to $3, to $0.50 to $1.00, representing a maximum potential reduction of 96.7 percent. Runtime path analysis confirms Engine V1 AI-Enhanced as the production default through the API to Workflow to EngineV1 execution chain. Engine V2 is fully coded as an extension module but requires explicit configuration to enter the default execution path.

---

## 1. Introduction and Problem Statement

### 1.1 Structural Economics of Hydropower MRV

Small and medium hydropower assets, defined broadly as installations between 1 MW and 50 MW of installed capacity, represent approximately 16 percent of global renewable electricity generation capacity by installed base. Despite this substantial physical presence, they account for less than 2 percent of annual Renewable Energy Certificate issuance in voluntary and compliance carbon markets. This disproportionately low participation rate reflects not a lack of legitimate generation but rather the prohibitive economics of conventional Measurement, Reporting, and Verification processes.

Traditional MRV relies on periodic manual review conducted by accredited Validation and Verification Bodies. A VVB engagement for a small hydropower project typically requires an initial site visit, installation of approved metering equipment, establishment of a monitoring plan conforming to the applicable methodology, periodic compilation of generation records, submission of monitoring reports, and VVB review of those reports against methodology requirements. Across this workflow, per-REC verification costs range from $3 to $15 depending on project scale, VVB market positioning, and jurisdictional requirements. Processing latencies from generation event to credit issuance range from 30 to 90 days. For an installation generating 500 kWh per reporting cycle, these economics make carbon market participation structurally unviable.

The aggregate effect is market failure. Carbon markets systematically undercount and underprice actual renewable hydropower generation. Infrastructure investment flows toward larger projects with more favorable unit economics, while small run-of-river installations in regions such as India's northeastern states and Himalayan foothills remain excluded from the carbon economy despite comprising the majority of India's approximately 5,000 small hydropower installations.

### 1.2 The Digital MRV Hypothesis

The emergence of programmable distributed ledger infrastructure, specifically Hedera Hashgraph with its Hedera Consensus Service and Hedera Token Service, creates the technical preconditions for a fundamentally different MRV architecture. Rather than accumulating generation records for periodic batch review, a digital MRV system can ingest continuous telemetry from IoT sensors co-located with a hydropower installation, subject each reading to automated physics-constrained validation in real time, record every verification outcome with cryptographic immutability on a public ledger, and automatically initiate tokenized REC minting for validated readings. The central proposition is that this architecture can reduce per-REC verification costs by 95 to 99 percent relative to traditional VVB-led review while maintaining or exceeding the scientific defensibility of human verification.

Three computational requirements must be met to realize this proposition. The first is rigorous first-principles physics validation capable of detecting and rejecting thermodynamically impossible generation claims without requiring expert human judgment on each reading. The second is granular confidence modeling that exposes degrees of evidence quality rather than collapsing validation outcomes to a binary pass/fail, enabling precise allocation of residual human review capacity to readings where automated confidence is genuinely insufficient. The third is adaptive governance that calibrates automation intensity to empirically demonstrated project reliability rather than applying uniform conservatism regardless of track record.

### 1.3 Research Questions

This monograph addresses eleven research questions organized across four analytical domains. In the domain of scientific validity, the central question is whether all three engine generations preserve ACM0002 methodological invariance under their respective validation transformations, and whether the underlying physics constraints are correctly derived and correctly applied. In the domain of mathematical completeness, the questions concern the full specification of all scoring functions, the scientific justification for weight assignments, and the derivation of decision boundary positions. In the domain of architectural implementation, the questions concern the confirmed runtime execution paths within the production repository, the relationship between the engine generations as implemented code artifacts, and the gap between documented design and confirmed production behavior. In the domain of operational economics, the questions concern precise cost curves at multiple production scales, the conditions under which V2 Mode B economics become realizable, and the temporal trajectory of cost reduction as projects mature through graduation criteria.

---

## 2. Background

### 2.1 The ACM0002 Carbon Accounting Framework

The UNFCCC Consolidated Methodology ACM0002 for Grid-Connected Electricity Generation from Renewable Sources is the foundational carbon accounting standard governing emission reduction calculations for grid-connected hydropower projects. The methodology establishes that emission reductions equal baseline emissions less project emissions less leakage. Baseline emissions represent the quantity of CO2 equivalent that the electricity grid would have emitted to supply an equal quantity of electricity in the absence of the project. Project emissions from run-of-river hydropower are treated as zero under conservative boundary conditions because the project itself produces no combustion or significant process emissions. Leakage is likewise treated as zero under standard run-of-river project scope assumptions.

The practical accounting equation is therefore: emission reductions in tonnes of CO2 equivalent equal generated electricity in megawatt hours multiplied by the applicable grid emission factor in tonnes of CO2 per megawatt hour. For India, the Central Electricity Authority publishes a combined margin grid emission factor of approximately 0.80 tCO2/MWh as of 2025, the value adopted in this implementation. An installation generating 16,800 MWh in a given period therefore generates emission reductions of 13,440 tCO2e, equivalent to 13,440,000 kg CO2e for kilogram-denominated REC issuance purposes.

This accounting framework is methodologically invariant across all three engine generations examined in this paper. The engines differ in how they determine whether a given telemetry reading is trustworthy enough to include in the generation total, not in how they compute emission reductions per verified megawatt hour.

### 2.2 Hydropower Physics Fundamentals

The theoretical electrical output of a hydropower installation is governed by the hydraulic power equation, a direct consequence of conservation of mechanical energy in an incompressible fluid flow system. Power in watts equals the product of fluid density in kilograms per cubic meter, gravitational acceleration in meters per second squared, volumetric flow rate in cubic meters per second, effective hydraulic head in meters, and turbine-generator efficiency as a dimensionless fraction representing the ratio of electrical output to available hydraulic power.

Water density at operational temperatures near 20°C is 1,000 kg/m³ with negligible variation across the temperature range relevant to hydropower operations. Standard gravitational acceleration is 9.81 m/s². Turbine efficiency for modern hydraulic machinery design types — Francis turbines for medium head applications, Kaplan turbines for low head high flow sites, Pelton turbines for high head low flow sites — falls within the range of 0.70 to 0.95 at best efficiency point, with efficiency decreasing at partial load and at load conditions far from design point.

This equation establishes a thermodynamically inviolable ceiling on generation output for any given combination of flow and head. No MRV system that accepts reported generation substantially exceeding this ceiling is scientifically credible, regardless of other supporting evidence. The physics validation layer implemented in all three engine generations implements this ceiling as the primary gating mechanism.

### 2.3 Statistical Anomaly Detection Theory

The statistical validation component across all three engines applies Z-score analysis to detect readings inconsistent with the device's recent operational history. The Z-score for a given reading is defined as the absolute deviation of the current generation value from the rolling window mean, divided by the rolling window standard deviation. Under the assumption that legitimate generation readings from a stable hydropower installation are approximately normally distributed around a slowly varying mean determined by seasonal flow conditions, the probability of a legitimate reading exceeding three standard deviations from the mean is approximately 0.13 percent. Readings with Z-scores above three standard deviations are therefore treated as statistically inconsistent with legitimate operation unless a specific operational explanation is available.

The rolling window of 30 readings provides sufficient observations for reliable mean and standard deviation estimation while remaining short enough to track genuine trend changes such as the onset of dry season low-flow conditions. A minimum of five readings is required before statistical analysis is applied, ensuring that the baseline statistics are not computed from an insufficient sample.

### 2.4 Hedera Infrastructure

The Hedera Consensus Service provides an ordered, tamper-proof, timestamped log of arbitrary messages submitted to a designated topic. Each message submission is assigned a consensus timestamp and sequence number by the Hedera network through Byzantine fault-tolerant gossip consensus, producing an immutable audit record that cannot be modified, deleted, or selectively censored by any single party including the system operator. The Hedera Token Service provides programmatic management of fungible tokens including creation, minting, transfer, and burn operations. Together these services enable the creation of an end-to-end verified chain from raw telemetry through validation outcome to issued REC, every link of which is independently verifiable through the public HashScan explorer.

---

## 3. Materials and Methods

### 3.1 Primary Source Corpus

The analysis synthesizes nine computational artifacts from the production repository. The first group of three documents comprises architectural specifications: ENGINE-V1.md contains the four-layer baseline methodology; ENGINE V1 - Enhanced AI Trust Scoring System.md contains the five-layer weighted scoring mathematics; and ENGINE-V2-TWO-TIER-MODES.md.txt contains the dual-mode governance framework including graduation criteria, reversion triggers, and evidence bundle requirements.

The second group of three artifacts comprises implementation code: Engine V1 Code contains the core physics, temporal, and environmental validation functions; Engine V1 AI Enhanced Codes contains the continuous scoring functions and weighted trust aggregation; and Engine V 2 Codes contains the governance wrapper, mode switching logic, adaptive sampling calculation, and evidence bundle construction.

The third group of three artifacts comprises on-chain evidence: ENGINE V1 - ON-CHAIN IMPLEMENTATION EVIDENCE contains Hedera Testnet transaction receipts demonstrating V1 pipeline execution; ENGINE V1 (enhanced AI version) Evidence Trx contains trust score attestations with component breakdowns recorded on-chain; and ENGINE V2 - ON-CHAIN IMPLEMENTATION EVIDENCE contains mode-specific evidence bundles demonstrating V2 execution.

### 3.2 Analytical Approach

The analysis proceeds through four phases. The first phase reconstructs the production runtime path by tracing execution from the API endpoint through Workflow and engine instantiation, establishing which code paths are exercised by default API submissions. The second phase formalizes the mathematics of each validation layer and scoring function across all three engines, deriving complete specifications with parameter values and scientific justifications. The third phase models verification economics at three production scales: 1,000 readings per batch, 10,000 readings per month, and 120,000 readings per year, using published VVB labor rate assumptions and Hedera network fee schedules. The fourth phase synthesizes findings into a cross-engine comparison and deployment recommendation framework.

### 3.3 Physical Constants and Baseline Parameters

The following constants and baseline parameters apply throughout the analysis. Water density is taken as 1,000 kg/m³ at 20°C operational temperature. Standard gravitational acceleration is 9.81 m/s². Turbine efficiency bounds are 0.70 as the minimum acceptable and 0.95 as the maximum physical bound for the installed equipment types. The India grid emission factor is 0.80 tCO2/MWh per CEA 2025 publication. Z-score rejection threshold is 3.0 standard deviations, corresponding to a 0.13 percent false positive rate under normal distribution assumptions. Rolling statistical window is 30 readings. Hedera transaction fee is approximately $0.0001 per HCS or HTS transaction.

---

## 4. Production Repository Architecture and Runtime Path

### 4.1 Entry Point and Execution Chain

The production system receives telemetry submissions through a POST endpoint at /api/v1/readings. The request body contains a JSON object with fields for device identifier, ISO 8601 timestamp, flow rate in cubic meters per second, hydraulic head in meters, generated energy in kilowatt hours for the reporting period, turbine efficiency as a decimal fraction, pH value, turbidity in NTU, water temperature in degrees Celsius, and optionally a device profile object with rated maximum flow, maximum head, and nameplate capacity.

Upon receipt of a valid submission, the endpoint instantiates the Workflow class, passing a configured Hedera client, an operator private key, and the designated HCS audit topic identifier as constructor arguments. The Workflow constructor internally creates a new EngineV1 instance, initializing it with the five-layer scoring configuration and threshold parameters. The Workflow then invokes its primary verification method with the submitted telemetry and any available historical readings from the same device retrieved from the application data layer.

This execution chain, confirmed through runtime path analysis, definitively establishes Engine V1 AI-Enhanced as the production default runtime. No default API submission routes through EngineV2 unless the Workflow constructor is modified to instantiate EngineV2 in place of or in addition to EngineV1.

### 4.2 EngineV1 Internal Execution

Within EngineV1, the verification method executes five validation layers in sequence. Each layer receives the relevant subset of the submitted telemetry values and any required historical context, performs its scoring computation, and returns a score value between 0.0 and 1.0 along with diagnostic information identifying the specific factors driving the score. After all five layers have been evaluated, the engine computes the weighted sum of layer scores using the configured weights, rounds the result to four decimal places, and evaluates it against the auto-approval and manual review thresholds to determine the categorical decision. The method returns a result object containing the trust score, the decision category, the individual layer scores, the computed theoretical power, the physics deviation ratio, the Z-score, the emission reductions in tonnes of CO2e, and the REC quantity in kilograms eligible for issuance.

### 4.3 EngineV2 Wrapping Architecture

EngineV2 is implemented as a governance wrapper that accepts a project identifier in addition to the standard engine configuration. When invoked, it first delegates to an EngineV1 instance to obtain the base trust score and layer breakdown, then retrieves the current governance mode assignment for the project identifier, applies mode-specific threshold evaluation and sampling logic, constructs the appropriate evidence bundle, and returns an enriched result containing all V1 outputs plus the governance mode, sampling disposition, and evidence package.

The delegation-based design is architecturally significant because it guarantees that the physics and statistical validation logic executed within EngineV2 is identical to that executed within standalone EngineV1. No verification shortcut is introduced by the governance wrapper. The differences between EngineV1 and EngineV2 outcomes are confined to the governance layer: which readings qualify for auto-approval at the mode-specific threshold, what sampling obligations apply to auto-approved readings, and what evidence must be packaged with the audit record.

---

## 5. Engine Type A — V1 Baseline Deterministic Engine

### 5.1 Design Objectives and Scientific Foundations

Engine V1 Baseline was designed with the single overriding objective of producing verification outcomes that are fully deterministic, reproducible without any algorithmic uncertainty, and defensible to methodological audit by parties with no prior exposure to the platform. Every verification decision must be traceable directly to an explicit documented rule derived from a physical principle or established standard, with no components that require probabilistic interpretation or threshold justification beyond the published parameter values.

The scientific foundation is the recognition that hydropower generation is governed by physical laws that are precisely quantifiable from measured parameters. Given a measured flow rate and head, the conservation of energy principle establishes an absolute ceiling on generation output that cannot be exceeded regardless of operational conditions. This ceiling, computed through the hydraulic power equation, provides a verification criterion of unassailable scientific authority that requires no statistical learning and no engineering judgment: it follows mathematically from the submitted telemetry values.

### 5.2 Layer 1: Physics Validation

The physics validation layer computes the theoretical maximum power output from submitted telemetry and compares it to the reported actual generation. Theoretical output in kilowatts is:



P_theoretical = (ρ × g × Q × H × η) / 1000

where ρ = 1,000 kg/m³, g = 9.81 m/s², Q is reported flow in m³/s, H is reported head in meters, and η is reported efficiency. The deviation ratio is computed as the absolute difference between reported actual generation and theoretical generation, divided by theoretical generation.

In V1 Baseline, the scoring function is binary with respect to a 15 percent tolerance threshold. A deviation ratio at or below 0.15 yields a physics score of 1.0. A deviation ratio exceeding 0.15 yields a physics score of 0.0 and flags the reading for rejection regardless of other layer outcomes.

The 15 percent tolerance accommodates legitimate measurement uncertainty arising from flow meter calibration drift (typically 2 to 5 percent), head measurement transducer tolerance (1 to 3 percent), efficiency curve deviation from design point operation (2 to 8 percent), and transient conditions during governor response events. The aggregate uncertainty budget under conservative compounding reaches approximately 11 to 13 percent, making 15 percent a scientifically justified but not excessively generous tolerance.

### 5.3 Layer 2: Temporal Continuity Enforcement

The temporal continuity layer enforces two physical constraints on sequences of readings from the same device. The first constraint is monotonicity of cumulative energy generation: because hydropower generates energy continuously, the cumulative kilowatt-hour counter must be non-decreasing across consecutive reporting intervals. Any decrease in reported cumulative generation is physically impossible under normal operation and indicates meter reset, data substitution, or replay of a previously submitted reading.

The second constraint is a rate-of-change limit on per-period generation increment. Even under immediate full-load rejection or load acceptance, the physical inertia of the water column in the penstock, the governor response dynamics, and the generator electrical transients limit the rate at which output can change between reporting periods. In V1 Baseline, the rate limit is expressed as a maximum generation increment of 50 percent of the preceding period's generation value between consecutive hourly readings.

In V1 Baseline, temporal scoring is binary. A reading that is monotonically increasing and whose increment does not exceed the rate limit receives a temporal score of 1.0. A reading that fails either constraint receives a temporal score of 0.0.

### 5.4 Layer 3: Environmental Bounds Validation

The environmental bounds layer validates three water quality parameters measured by sensors co-located with the installation: pH, turbidity in NTU, and water temperature in degrees Celsius. These measurements serve dual validation purposes. As direct physical evidence of active water flow through the turbine, they corroborate the reported generation event: a completely inactive installation would not produce plausible water quality readings consistent with active flow conditions. As sensor health indicators, anomalous values suggest broader instrument reliability issues that may affect the primary generation measurement.

Acceptable operating envelopes are derived from the water quality characteristics of operational run-of-river hydropower sites in Indian Himalayan and northeastern river systems. pH must fall within 6.5 to 8.5, representing neutral to slightly alkaline conditions typical of snowmelt and monsoon-influenced rivers. Turbidity must fall within 0 to 50 NTU, representing clear to slightly turbid conditions consistent with moderate suspended sediment. Temperature must fall within 0 to 30°C, spanning the operational range from near-freezing winter snowmelt through peak summer conditions.

Environmental scoring in V1 Baseline applies cumulative penalty deductions from a base score of 1.0: pH violation deducts 0.4, turbidity exceedance deducts 0.3, and temperature violation deducts 0.2. A reading with all three violations receives an environmental score of 0.1.

### 5.5 Layer 4: Statistical Outlier Rejection

The statistical layer detects generation values inconsistent with the device's recent operating history using Z-score analysis. The rolling window mean and standard deviation are computed from the most recent 30 readings. The Z-score for the current reading is its absolute deviation from this mean divided by the standard deviation. In V1 Baseline, the decision is binary at the 3.0 standard deviation threshold: Z-scores at or below 3.0 receive a statistical score of 1.0, and Z-scores above 3.0 receive a score of 0.0.

### 5.6 ACM0002 Emissions Calculation

For readings passing validation, V1 Baseline computes emission reductions as follows. Baseline emissions in tCO2e equal generated energy in MWh multiplied by the India grid emission factor of 0.80 tCO2/MWh. Project emissions are zero. Leakage is zero. Emission reductions equal baseline emissions. REC quantity in kg CO2e equals emission reductions multiplied by 1,000. All values are preserved to six decimal places of precision.

### 5.7 Strengths and Limitations

The defining strength of Engine V1 Baseline is absolute methodological transparency. Every verification decision is the deterministic output of published rules applied to submitted values. An external auditor can reproduce any outcome exactly given only the telemetry and the rule set. This makes V1 Baseline optimally suited to regulatory engagement contexts where methodological simplicity and binary reproducibility are paramount concerns.

The primary limitation is informational inefficiency. A reading with a 1 percent physics deviation and a reading with a 14.9 percent physics deviation receive identical treatment: both pass, and both contribute to REC issuance at the same rate. This binary treatment fails to communicate differential evidence quality, precluding risk-proportionate review allocation and preventing downstream processes from directing human attention toward readings where genuine uncertainty exists. A secondary limitation is the abrupt discontinuity at threshold boundaries: a pH of 8.49 passes cleanly while a pH of 8.51 triggers full penalty, even though the physical difference falls within sensor noise. These limitations motivated the development of Engine V1 AI-Enhanced.

---

## 6. Engine Type B — V1 AI-Enhanced Trust Scoring Engine (Production Default)

### 6.1 Design Philosophy

Engine V1 AI-Enhanced addresses the core limitation of binary verification by transforming the verification problem from hypothesis testing at fixed thresholds to continuous confidence estimation across the full evidence space. The guiding insight is that verification quality is a continuous property of the evidence provided, not a binary property. A reading with a 2 percent physics deviation, a Z-score of 0.3, and all environmental parameters well within bounds carries substantially more verification confidence than a reading with a 13 percent physics deviation, a Z-score of 2.4, and a slightly elevated turbidity. A scientifically sophisticated MRV system should expose this difference rather than collapsing both readings to an identical pass outcome.

The advancement from V1 Baseline to V1 AI-Enhanced is formally a shift from hypothesis testing to Bayesian confidence estimation. Where V1 Baseline asks whether each reading is consistent with physics and operational norms at a fixed threshold, V1 AI-Enhanced asks how consistent each reading is across the full range of evidence dimensions, producing a composite confidence measure that can be communicated to downstream processes and used to direct human attention proportionately to actual uncertainty.

### 6.2 Layer 1: Physics Validation with Continuous Scoring

V1 AI-Enhanced retains the same theoretical power computation as V1 Baseline but replaces the binary threshold with a linear penalty function. The physics score is:


PhysicsScore = max(0.0, 1.0 - deviation_ratio)
This function produces a score of 1.0 for zero deviation, 0.85 for 15 percent deviation, 0.70 for 30 percent deviation, and 0.0 for deviations of 100 percent or more. The gradient of this function is constant at -1.0 per unit of deviation ratio, meaning that each additional percentage point of physics deviation reduces the physics score by exactly one percentage point. This linear formulation eliminates the step discontinuity at the 15 percent boundary, ensures that small measurement errors near boundary conditions do not produce large outcome changes, and provides a natural penalty gradient that propagates the severity of physics discrepancy into the composite trust score in a well-calibrated manner.

### 6.3 Layer 2: Temporal Continuity with Stepped Scoring

The temporal continuity layer in V1 AI-Enhanced retains the hard monotonicity constraint: any decrease in cumulative generation still produces a temporal score of 0.0 because backward movement in the cumulative counter remains physically impossible under any legitimate operating condition. The rate-of-change assessment, however, is restructured into a stepped scoring function that distinguishes between degrees of rate exceedance.

A reading that is monotonically increasing and whose generation increment falls within 50 percent of the preceding period's generation value receives a temporal score of 1.0, reflecting full confidence in temporal consistency. A reading that is monotonically increasing but whose increment falls between 50 and 75 percent of the preceding period's value receives a temporal score of 0.8, acknowledging that while elevated, such rates are physically possible during rapid load acceptance events and do not by themselves warrant rejection. A reading whose increment exceeds 75 percent of the preceding value receives a temporal score of 0.0, since sustained generation increases at this rate exceed the physical ramp capability of hydropower governor systems.

This stepped formulation better reflects the physical reality that rate-of-change violations exist on a continuous spectrum of plausibility. A 51 percent rate change is marginally unusual while a 100 percent rate change is physically implausible, and the scoring architecture communicates this distinction.

### 6.4 Layer 3: Environmental Bounds with Continuous Penalty Accumulation

The environmental bounds layer retains the same penalty deduction structure as V1 Baseline (pH violation deducts 0.4, turbidity excess deducts 0.3, temperature violation deducts 0.2) but the interpretation changes fundamentally within the continuous scoring framework. In V1 AI-Enhanced, the environmental score of 0.6 produced by a single pH violation does not directly determine the verification outcome. It contributes 20 percent of the composite trust score, meaning that an environmental score of 0.6 contributes 0.12 to the final trust value. If the remaining layers produce strong scores — for example, physics at 0.95, temporal at 1.0, statistical at 0.9, and device consistency at 1.0 — the composite trust score would be 0.87, routing the reading to FLAGGED for human review rather than automatically rejecting it.

This treatment is scientifically appropriate because environmental sensor malfunctions are operationally common in field deployments and do not necessarily impugn the primary generation measurement. A pH sensor that has drifted out of calibration is a maintenance finding requiring corrective action, but it does not by itself constitute evidence of generation fraud if the physics and temporal layers are both strongly passing. The continuous scoring framework allows the verification system to communicate this nuance rather than treating all sensor anomalies as equivalent invalidating events.

### 6.5 Layer 4: Statistical Anomaly Detection with Z-Score Continuum

The statistical layer in V1 AI-Enhanced replaces the binary 3-sigma threshold with a five-band continuous mapping from Z-score to statistical score, providing fine-grained discrimination across the anomaly detection continuum.

A Z-score at or below 1.0 standard deviations produces a statistical score of 1.0, indicating that the reading falls within the normal variance band for this device's recent operating history. A Z-score between 1.0 and 2.0 produces a score of 0.8, acknowledging slightly elevated variance that is statistically acceptable but worth noting. A Z-score between 2.0 and 2.5 produces a score of 0.5, indicating moderate anomalous behavior warranting investigative attention. A Z-score between 2.5 and 3.0 produces a score of 0.2, indicating high concern falling just below the hard rejection boundary. A Z-score above 3.0 produces a score of 0.0, which at the 15 percent statistical weight drives the composite trust score substantially toward the REJECTED band.

This granular mapping ensures that readings with Z-scores in the 2.0 to 3.0 range are consistently routed to human review through their contribution to a FLAGGED composite score, rather than being either silently approved or summarily rejected. The 2.5 to 3.0 range in particular — readings that are highly suspicious but not conclusively anomalous — is handled with particular care by this scoring structure, producing scores (0.2 × 0.15 = 0.03 contribution to trust) that reliably drive composite trust into the FLAGGED band when physics and temporal scores are themselves not strongly favorable.

### 6.6 Layer 5: Device Consistency Checking

The device consistency layer is introduced in V1 AI-Enhanced with no predecessor in V1 Baseline. It validates reported operational parameters against the device's registered capacity profile maintained in the platform's device registry. Four conditions are evaluated.

First, if reported flow rate exceeds the device's maximum rated flow, the score is reduced by 0.3, reflecting that operating above rated flow is physically implausible for a fixed-geometry turbine installation. Second, if reported hydraulic head exceeds the maximum rated head, the score is reduced by 0.2, since head substantially exceeding design specification indicates either sensor error or site conditions inconsistent with the registered installation. Third, if reported generation exceeds the nameplate capacity, the score is reduced by 0.4, the most severe penalty applied in this layer, because generation above rated capacity is strictly impossible for a correctly rated installation and is the most direct indicator of inflated generation claims. Fourth, if reported turbine efficiency falls outside the physically bounded range of 0.70 to 0.95, the score is reduced by 0.2.

The device consistency layer provides an anti-fraud check orthogonal to physics validation. Where physics validation asks whether the combination of flow and head can theoretically produce the reported generation, device consistency asks whether the reported flow, head, and efficiency are consistent with the specific device's known operational envelope. A fraudulent submission that inflates flow rate to justify higher generation might pass physics validation while failing device consistency if the inflated flow exceeds the device's rated maximum.

### 6.7 Trust Score Computation

The composite trust score is the weighted linear combination of the five layer scores:


TrustScore = 0.30 × PhysicsScore
+ 0.25 × TemporalScore
+ 0.20 × EnvironmentalScore
+ 0.15 × StatisticalScore
+ 0.10 × DeviceConsistencyScore

The weights sum to 1.0 and reflect a deliberate prioritization hierarchy grounded in scientific reasoning about the relative specificity of each layer as a fraud or error indicator. Physics receives the highest weight because thermodynamic law violations are the most unambiguous indicators of data invalidity. Temporal continuity receives the second-highest weight because monotonicity violations and rate spikes are highly specific to data replay and timestamp manipulation attacks. Environmental bounds receive a substantial but secondary weight reflecting their role as corroborating evidence. Statistical anomaly detection receives a supporting weight recognizing its value for detecting gradual drift alongside its susceptibility to false positives during genuine seasonal variation. Device consistency receives the smallest weight as the most context-dependent layer, its effectiveness contingent on the accuracy and currency of the device registry.

### 6.8 Tri-Band Decision Stratification

The composite trust score is evaluated against two configured threshold parameters. Readings with trust scores at or above the auto-approval threshold of 0.90 receive the APPROVED decision, triggering immediate HTS token minting for the computed REC quantity and HCS audit logging of the full verification record including all five layer scores and their inputs. Readings with trust scores between the manual review threshold of 0.50 and the auto-approval threshold of 0.90 receive the FLAGGED decision, suspending REC issuance and routing the reading with its complete derivation log to the human review queue. Readings with trust scores below 0.50 receive the REJECTED decision, discarding the reading and recording specific rejection reasons derived from the layer scores in the HCS audit trail.

The threshold values of 0.90 and 0.50 are not arbitrary. The auto-approval threshold of 0.90 requires that the composite evidence across all five layers, weighted by their relative specificity as fraud indicators, reaches a level consistent with high confidence in reading validity. Given that the physics layer alone carries 30 percent weight, achieving a 0.90 composite trust score requires that the physics deviation is modest (a physics score of 0.90 corresponds to a 10 percent deviation) combined with strong performance on the remaining layers. The manual review threshold of 0.50 represents the boundary below which the weight of negative evidence is sufficiently high that the reading is more likely to represent invalid data than legitimate generation, warranting discard rather than human review.

---

## 7. Engine Type C — V2 Two-Tier Governance Module

### 7.1 Scientific and Operational Innovation

Engine V2 represents a qualitatively distinct architectural contribution relative to the V1 generations. Where both V1 variants define a single verification policy applied uniformly to all readings regardless of operational context, V2 introduces the principle that optimal verification policy is context-dependent. This principle has a clear scientific basis: the appropriate intensity of human review for a reading from a device with twelve months of verified operation and a 0.5 percent anomaly rate should differ from the appropriate intensity for a reading from a device two weeks into its first operational period. Applying identical review intensity to both contexts either over-invests human resources in the mature case (reducing the economic value of automation) or under-invests in the new case (accepting elevated fraud risk during the period of highest vulnerability).

Engine V2 formalizes this principle through a governance control layer that mediates between the trust score output of EngineV1 and the verification workflow actions. The governance layer does not alter how trust scores are computed — the five-layer physics-through-consistency pipeline is absolutely identical whether executed within standalone EngineV1 or via EngineV2's delegation. It alters exclusively how trust scores are translated into verification actions: which readings qualify for automated approval at the mode-specific threshold, what sampling obligations apply to approved readings, and what evidence must accompany each audit record.

### 7.2 Mode A — Regulator-Strict Operation

Mode A is designed for deployments in their early operational phase, regulatory pilot contexts, or situations where achieving regulatory acceptance requires demonstrating conservative oversight posture as a precondition for trust building. Its parameters are calibrated to maintain direct human reviewer visibility over the majority of verification outcomes while accumulating the operational evidence base required for subsequent graduation to Mode B.

The auto-approval threshold in Mode A is set at 0.97, substantially above the standard 0.90 threshold used in V1 AI-Enhanced. Only readings for which the five-layer composite trust score reaches 0.97 or above are eligible for automated approval — these are readings for which all validation dimensions are performing strongly, physics deviation is minimal, temporal behavior is clean, environmental sensors are within bounds, statistical profile is tight, and device capacity is not being approached. The practical effect is that a much larger fraction of readings in a real deployment — including many readings that would be APPROVED under standard V1 AI-Enhanced thresholds — are routed to human review.

In addition to the elevated threshold, Mode A applies a 30 percent random sampling audit to readings that do cross the 0.97 auto-approval threshold. This creates a two-stage oversight architecture: even among the highest-confidence automated approvals, approximately one in three is selected for post-approval human review to validate that the automated pipeline is performing correctly. Furthermore, the first 100 readings from any newly registered device are unconditionally routed to mandatory human review regardless of trust score, establishing an empirical baseline for the device's operational characteristics before any automated approvals are granted.

Mode A tightens the underlying physics tolerance to ±20 percent and the temporal rate limit to ±40 percent compared to the V1 defaults of ±15 percent and ±50 percent respectively, providing additional conservatism at the scoring input level. Expected auto-approval rates under stable Mode A operation are 40 to 60 percent. Estimated per-REC verification cost is $3 to $5 given the elevated human review intensity.

### 7.3 Mode B — Evidence-Rich Operation

Mode B is designed for mature deployments with established operational track records, where the accumulated evidence base supports significantly reduced direct review intensity without compromising the overall quality of the audit trail. Its parameters are calibrated to maximize automated throughput while maintaining statistical auditability through comprehensive evidence packaging accompanying each batch.

The auto-approval threshold in Mode B returns to the standard 0.90 level. The key innovation is not in the scoring threshold but in the sampling architecture applied to approved readings. The baseline sampling rate is 5 percent of auto-approved readings, selected through cryptographic random sampling. This rate is elevated by an additional 5 percentage points for projects less than six months post-graduation (creating a graduated entry into full Mode B operation) and by an additional 10 percentage points if any reading with a trust score below 0.50 has been submitted within the preceding 30 days. Under stable mature operation with no recent anomalies, the effective sampling rate is 5 percent.

For readings falling within the trust score band of 0.70 to 0.89, Mode B applies 100 percent targeted human review, recognizing that readings in this range carry genuine verification uncertainty despite nominally passing the FLAGGED threshold. Below 0.70, the reading is automatically rejected with full logging regardless of mode.

The defining characteristic of Mode B is its evidence bundle requirement for every auto-approved reading. The bundle must contain the complete derivation log showing all five layer scores and their input values, five randomly selected readings from the device's recent history with complete sensor data for cross-reference, a statistical summary of the current rolling window including mean, standard deviation, minimum, maximum, and distribution of Z-scores, and a comparison of current period performance against the device's long-run operational baseline. This bundle is attached to the HCS audit record, ensuring that any auditor examining any auto-approved reading from any Mode B device finds comprehensive supporting evidence that enables verification of the automated decision without requiring full re-execution of the pipeline.

Expected auto-approval rates under stable Mode B operation are 90 to 95 percent. Estimated per-REC verification cost is $0.50 to $1.00.

### 7.4 Graduation Criteria (Mode A to Mode B)

Transition from Mode A to Mode B requires simultaneous satisfaction of six objective criteria, all of which must be met at the time graduation is formally requested. This all-or-nothing structure prevents gaming of individual metrics and ensures comprehensive operational maturity.

The first criterion requires at least six consecutive months of verified operation since first submission, ensuring exposure to at least one major seasonal variation cycle and accumulation of sufficient operational history for robust statistical characterization.

The second criterion requires that the anomaly rate over the preceding 90 days has been below 2 percent. Anomaly rate is defined as the fraction of submitted readings receiving a trust score below 0.50. This criterion ensures that Mode B graduation is not granted to projects experiencing significant volumes of suspicious or invalid readings in their recent history.

The third criterion requires written approval from the designated VVB, confirming that the human oversight body has reviewed the operational record and formally endorses the transition to reduced sampling intensity. This criterion preserves a human judgment gate within the otherwise algorithmic governance framework, ensuring that automated graduation logic does not override VVB professional judgment.

The fourth criterion requires that no device maintenance event has occurred within the preceding 30 days. A maintenance event is defined as any physical replacement, calibration service, firmware update, or configuration change to any instrument contributing to the generation measurement chain. Post-maintenance periods require re-establishment of the operational baseline under Mode A review intensity.

The fifth criterion requires data quality completeness at or above 95 percent over the preceding 90 days, measured as the fraction of expected telemetry submissions actually received with all required sensor fields populated with plausible values. Insufficient data density undermines the statistical foundation for evidence-rich operation.

The sixth criterion requires zero unresolved regulatory findings. Any outstanding compliance issue from prior VVB review, regulatory inspection, or exchange audit must be fully resolved and closed before graduation can proceed.

### 7.5 Reversion Triggers (Mode B to Mode A)

Mode B reversion to Mode A is triggered by any single one of four conditions. The asymmetry between graduation (all-required) and reversion (any-sufficient) reflects the asymmetric risk structure: while operational maturity must be demonstrated comprehensively across all dimensions, any single significant adverse signal is sufficient to restore conservative oversight while the signal is investigated.

The first reversion trigger activates when more than 5 percent of readings in any rolling 7-day window receive trust scores below 0.50. This spike detection mechanism responds to sudden deterioration in reading quality suggesting equipment failure, environmental disturbance, or fraud initiation.

The second trigger activates upon detection of calibration drift in any primary measurement instrument, assessed through cross-validation of redundant or co-located sensor readings against expected physical relationships. Systematic calibration drift is particularly insidious because it produces consistently biased readings that may pass statistical tests (since the bias is systematic rather than anomalous) while generating systematically inflated or deflated generation claims.

The third trigger activates upon any maintenance event as defined above. Post-maintenance operation requires re-validation of instrument accuracy and re-establishment of the operational baseline before Mode B review intensity can resume.

The fourth trigger activates upon any regulatory finding or compliance action by a VVB, exchange operator, or regulatory body that calls into question the quality or integrity of the project's verification record.

---

## 8. ACM0002 Integration and Methodological Invariance

### 8.1 Accounting Computation (Identical Across All Engines)

The ACM0002 emissions accounting module is implemented as a standalone function called identically by all three engine execution paths after trust score computation and decision determination. For any reading receiving the APPROVED decision, the accounting module computes baseline emissions as generated energy in MWh multiplied by 0.80 tCO2/MWh. Project emissions are set to zero. Leakage is set to zero. Emission reductions equal baseline emissions. REC quantity equals emission reductions multiplied by 1,000 for kilogram denomination.

The mathematical invariance of this module across all three engines is not incidental but architecturally enforced. The governance and scoring architecture of each engine determines which readings are eligible for REC issuance through the trust threshold evaluation, but it has no effect on how much is issued per approved megawatt hour. This separation ensures that changes to governance architecture cannot introduce systematic biases in emissions accounting. An installation producing 100 MWh of verified generation receives precisely the same REC quantity whether verified under V1 Baseline, V1 AI-Enhanced, or V2 Mode B, provided the generation reading passes the applicable trust threshold.

This invariance is critical for regulatory credibility. Carbon credit methodologies require that accounting logic be fixed, documented, and immutable across the verification period. The modular separation of accounting from governance ensures that this requirement is met structurally, not merely by convention.

---

## 9. Hedera Integration Architecture

### 9.1 HCS Audit Logging

Every verification outcome generates an HCS message containing a JSON payload with the complete verification record: device identifier, timestamp, categorical decision, numeric trust score, individual layer scores, input telemetry values, computed theoretical power, physics deviation ratio, Z-score, emission reductions, and REC quantity. FLAGGED and REJECTED decisions additionally include specific failure reason codes with quantitative values. The submitted message produces an immutable receipt with a transaction ID, consensus timestamp with nanosecond precision, and sequence number within the topic.

For Mode B Evidence-Rich operation under Engine V2, the HCS payload additionally includes the complete evidence bundle: derivation log, historical sensor samples, statistical summary, and baseline comparison. This enriches the audit record without compromising its immutability, since the Hedera Consensus Service does not permit modification of submitted messages.

### 9.2 HTS REC Minting

For APPROVED readings, the verification pipeline submits an HTS token minting transaction creating new tokens in the HREC token class, with quantity equal to the computed REC amount in kilograms of CO2e. The transaction memo records the corresponding HCS audit sequence number, creating an explicit and publicly verifiable provenance link from issued token to verification record. The minting transaction receipt, containing its own transaction ID and consensus timestamp, is returned in the API response to the submitting device.

---

## 10. Cross-Engine Comparative Analysis

### 10.1 Eleven-Dimension Comparative Matrix

The following table provides a systematic comparison across all eleven analytical dimensions. All claims are grounded in production runtime analysis, code artifact review, and on-chain evidence examination.

| Dimension | V1 Baseline | V1 AI-Enhanced (Default) | V2 Two-Tier (Module) |
|---|---|---|---|
| Science core methodology | ACM0002 + 4-layer physics constraints | Same core + 5-layer weighted aggregation | Same core + governance control layer |
| Decision model architecture | Binary threshold gating | Continuous [0,1] score + tri-band outcomes | Mode-stratified dual threshold + sampling |
| Layer count and scoring type | 4 layers, binary scoring | 5 layers, continuous functions | 5 layers + governance meta-layer |
| Auto-approval rate (stable operation) | 40 to 60 percent | 70 to 90 percent | 90 to 95 percent (Mode B) |
| Human review strategy | Broad manual fallback on threshold failure | Trust-interval targeted (0.50 to 0.89 band) | Mode-dependent adaptive with sampling |
| Physics tolerance handling | Binary at ±15% | Linear penalty: max(0, 1 - deviation_ratio) | Mode A: ±20%; Mode B: ±15% inherited |
| Temporal scoring | Binary at 50% rate limit | Stepped: 1.0 / 0.8 / 0.0 across rate bands | Same as V1 AI-Enhanced, mode-adjusted |
| Statistical scoring | Binary at Z = 3.0 | Five-band continuum from Z ≤ 1.0 to Z > 3.0 | Same as V1 AI-Enhanced |
| Graduation logic | None | None | Six criteria, all required simultaneously |
| Reversion logic | None | None | Four triggers, any one sufficient |
| Per-REC verification cost (stable operation) | $5 to $8 | $1 to $3 | $0.50 to $5 (mode-dependent) |
| On-chain evidence richness | Outcome + rejection reasons | Full decision-path derivation log | Evidence-rich bundles + statistical packaging |
| Production repository status | Conceptual specification | Active production default | Fully coded extension module |

---

## 11. Economic Modeling

### 11.1 Cost Driver Analysis

Verification cost per REC consists of three components. VVB labor for human review is by far the dominant cost driver at all scales. A full reading review requiring examination of telemetry values, physics calculation verification, sensor records, and comparison to historical baseline requires approximately 15 minutes of VVB analyst time at a professional rate of $100 per hour, yielding approximately $25 per fully reviewed reading. A statistical sampling review of an auto-approved reading using the Mode B evidence bundle — examining the derivation log and checking the statistical summary without full recalculation — requires approximately 3 minutes at the same rate, yielding approximately $5 per sampled reading. Hedera network fees for HCS message submission and HTS token minting amount to approximately $0.0001 per transaction, negligible relative to labor costs at all scales.

### 11.2 Batch-Level Economics (1,000 Readings)

Under V1 Baseline conditions with 40 percent auto-approval, a batch of 1,000 readings requires 600 full manual reviews at $25 each plus 400 automated approvals at zero marginal labor cost. Labor total is $15,000. Adding Hedera fees of $0.10 yields a total verification cost of $15,000.10. Assuming each reading represents on average 0.5 MWh of generation and 1,000 readings span a diverse acceptance profile, approximate REC output per 1,000 readings at 40 percent approval is 200 MWh of verified generation yielding 160,000 kg CO2e in RECs. Approximate per-REC cost at this scale is $15,000 / 160,000 kg = $0.09/kg or $94/tonne CO2e.

Under V1 AI-Enhanced conditions with 85 percent auto-approval, 850 readings are auto-approved and 150 are manually reviewed. Labor total is $3,750. Total cost is $3,750.10. REC output rises to approximately 340 MWh at higher approval rates. Per-tonne cost falls to approximately $24/tonne CO2e, representing a 74 percent reduction from V1 Baseline.

Under V2 Mode B conditions with 92 percent auto-approval, 920 readings are auto-approved. Of these, 5 percent baseline sampling routes 46 readings to sample review at $5 each: $230 in sampling labor. Additionally, readings with trust scores between 0.70 and 0.89 — estimated at approximately 8 percent of submissions or 80 readings — are subject to 100 percent targeted review at $25 each: $2,000 in targeted labor. Total labor is $2,230. Blockchain fees add $0.10. Total cost is $2,230.10. Per-tonne cost at 920 approved readings representing approximately 368 MWh: approximately $6,700/368,000 kg = $0.018/kg or $18/tonne CO2e. At peak Mode B efficiency with near-zero anomaly rates and 95 percent auto-approval, costs approach $500 per batch and approximately $3/tonne CO2e.

### 11.3 Annual Scale Projections

At 10,000 readings per month, an approximate throughput for a 5 MW installation reporting every 3 hours, annual processing volume is 120,000 readings. Annual verification cost under V1 Baseline is approximately $1,800,000. Under V1 AI-Enhanced it is approximately $450,000. Under V2 Mode B at peak efficiency it is approximately $60,000. The transition from V1 Baseline to V2 Mode B represents potential annual savings of approximately $1,740,000 at this scale, constituting the fundamental economic case for full engine progression.

---

## 12. Production Implementation Status Verification

The following statements represent the confirmed implementation status within the current repository state:

Engine V1 AI-Enhanced is confirmed as the production default runtime path. The Workflow class imports and instantiates EngineV1. The telemetry API endpoint creates Workflow, routing all API submissions through the EngineV1 execution path. The EngineV1 implementation uses graduated continuous scoring functions across all five validation layers, confirmed by the presence of fractional layer scores in on-chain evidence records. Weighted aggregation applies the documented 30/25/20/15/10 percent weights. Tri-band decisions route readings to APPROVED, FLAGGED, or REJECTED pathways, all three of which have on-chain transaction records confirming production execution.

Engine V2 governance module is confirmed as fully implemented code. The EngineV2 class exists with complete Mode A and Mode B parameter sets, mode state management by project identifier, adaptive sampling calculation, evidence bundle construction, graduation criteria evaluation, and reversion trigger monitoring. EngineV2 correctly delegates to EngineV1 for trust score computation, inheriting the complete five-layer scoring pipeline. On-chain evidence records confirm V2 execution in at least Mode A and Mode B scenarios.

Engine V2 is confirmed as not the default API execution path. The standard Workflow constructor does not instantiate EngineV2. Activating V2 governance for API traffic requires explicit modification of the Workflow instantiation to use EngineV2 with the appropriate project identifier configuration.

---

## 13. Scientific Validity and Threats

### 13.1 Validity Strengths

The primary validity strength of the overall architecture is its grounding in physical laws that are not subject to empirical uncertainty or methodological dispute. The hydraulic power equation is a consequence of conservation of energy whose validity is independent of statistical assumptions, training data, or model calibration. Any MRV system that enforces this constraint as its primary gate inherits the scientific authority of thermodynamic law.

Additional strengths include the transparent publication of all threshold values, weight assignments, and decision boundaries enabling complete methodological reproducibility; the structural separation of the ACM0002 accounting module from the governance and scoring architecture ensuring accounting invariance across engine generations; the immutable on-chain audit trail providing third-party verifiable evidence for all verification outcomes; and the explicit graduation and reversion governance framework in Engine V2 providing objective criteria for regulatory engagement.

### 13.2 Threats and Limitations

The primary threat to external validity is the scenario-based nature of the available evidence. On-chain records demonstrate correct pipeline execution for specific tested scenarios but do not constitute a longitudinal multi-site benchmark across the full distribution of operational conditions. Performance metrics such as 97.8 percent approval rates and 0.95 average trust scores reflect controlled test dataset behavior rather than projected production performance across seasonal variation and equipment degradation.

A secondary threat concerns the assumptions underlying statistical anomaly detection. Z-score analysis against a 30-reading rolling window assumes approximate stationarity within the window. Genuine seasonal flow transitions — the onset of monsoon season increasing flow by 3 to 5 times within a few days — can generate elevated Z-scores for legitimate readings during the transition period as the rolling window mean adjusts to the new regime. This is a known limitation of Z-score-based anomaly detection in non-stationary time series, and it can produce false FLAGGED outcomes during legitimate transition events. Adaptive window sizing or explicit regime change detection could address this limitation in future versions.

A third limitation concerns the cost modeling assumptions. VVB labor rates of $25 per full review and $5 per sampling review are based on market rate estimates for professional review services. Actual rates vary significantly by jurisdiction, VVB firm, and market conditions, meaning that the precise cost curves presented should be treated as illustrative envelopes rather than guaranteed performance bounds.

---

## 14. Practical Deployment Recommendations

### 14.1 For New Projects and Pilot Deployments

New projects and regulatory pilots should deploy with Engine V2 in Mode A configuration or, equivalently, with Engine V1 AI-Enhanced using conservative thresholds. Mode A's elevated auto-approval threshold of 0.97 and mandatory sampling regime provides regulatory agencies and VVBs with the direct oversight visibility needed to build confidence in the automated pipeline's correctness without requiring acceptance of automation in principle. The first 100 readings per device under mandatory review provide the operational evidence base for device behavior that supports eventual graduation.

Projects should from the outset collect and retain all operational metrics required for graduation evaluation: anomaly rates by 30-day rolling window, data quality completeness percentages, device maintenance logs, and VVB review records. Structuring data collection to support graduation from the beginning of operation avoids retrospective data reconstruction challenges.

### 14.2 For Mature, Stable Fleet Deployments

Projects with six or more months of verified operation, anomaly rates below 2 percent, and VVB endorsement should pursue formal Mode B graduation to capture the substantial cost and throughput advantages of evidence-rich operation. Graduation should be accompanied by deployment of robust anomaly monitoring infrastructure to detect reversion triggers promptly, since delayed detection of an anomaly spike or calibration event can result in a period of Mode B operation on data that should have been under Mode A oversight.

After graduation, anomaly rate monitoring should be conducted on a continuous basis with automatic alert escalation at threshold approach (3 percent anomaly rate as warning, 5 percent as automatic reversion). Evidence bundle generation should be validated through periodic full audit reconstruction to confirm that the bundled evidence is sufficient for a VVB to independently verify a sampled reading without platform access.

### 14.3 For Methodology and Policy Stakeholders

The V1 immutability principle — the commitment to fixed ACM0002 accounting logic and fixed physics validation equations — should be treated as the non-negotiable scientific core of the platform
