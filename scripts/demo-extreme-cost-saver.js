require("dotenv").config();
const GatewayAggregator = require("../src/gateway-aggregator");
const AIGuardianVerifier = require("../src/ai-guardian-verifier");
const { buildProjectPeriodRecord } = require("../src/project-aggregator");
const AttestationPublisher = require("../src/attestation-publisher");
const projectProfile = require("../config/project-profile.json");
async function main() {
  console.log("=== Extreme Cost Saver Demo ===");
  const aggregator = new GatewayAggregator();
  const aiVerifier = new AIGuardianVerifier({
    verifierId: process.env.VERIFIER_DID || "did:verifier-demo",
    verifierPrivateKey: process.env.VERIFIER_PRIVATE_KEY_PEM
  });
  const attestationPublisher = new AttestationPublisher();
  const scope = projectProfile.project.scope;
  const turbines = Array.from({ length: 10 }).map(
    (_, i) => `did:turbine-${(i + 1).toString().padStart(3, "0")}`
  );
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  const simulatedDevicePeriods = [];
  for (let h = 0; h < 24; h++) {
    const periodStart = new Date(now - (24 - h) * oneHour).toISOString();
    const periodEnd = new Date(now - (23 - h) * oneHour).toISOString();
    const deviceRecordsForThisPeriod = [];
    for (const tid of turbines) {
      const generatedKwh = 400 + Math.random() * 100;
      const periodRecord = {
        turbineId: tid,
        periodStart,
        periodEnd,
        generatedKwh,
        flowRate: 15 + Math.random() * 2,
        headHeight: 80 + Math.random() * 5,
        pH: 7.1,
        turbidity: 2.0,
        anomalyFlag: false,
        signature: "demo-signature",
        publicKey: "demo-public-key",
        timestamp: periodEnd
      };
      simulatedDevicePeriods.push(periodRecord);
      deviceRecordsForThisPeriod.push(periodRecord);
      if (scope === "device_only" || scope === "device_and_project") {
        await aggregator.handlePeriodRecord(periodRecord);
      }
    }
    if (scope === "project_only" || scope === "device_and_project") {
      const projectRecord = buildProjectPeriodRecord(
        deviceRecordsForThisPeriod,
        projectProfile.project
      );
      await aggregator.handlePeriodRecord(projectRecord);
    }
  }
  console.log(`Simulated ${simulatedDevicePeriods.length} hourly device period records`);
  if (aggregator.mode === "merkle_aggregated") {
    await aggregator.anchorBatch();
  } else {
    console.log('Anchoring mode is "direct"; skipping anchorBatch().');
  }
  const verification = await aiVerifier.verifyPeriodBatch(simulatedDevicePeriods, {});
  console.log("AI Guardian Verification Result:", {
    mode: verification.mode,
    auto_approved: verification.auto_approved,
    flagged: verification.flagged
  });
  // Publish approved attestations to audit topic for Guardian
  for (const att of verification.approvedAttestations || []) {
    await attestationPublisher.publishAttestation(att);
  }
  console.log("=== Demo complete ===");
}
main().catch(console.error);
