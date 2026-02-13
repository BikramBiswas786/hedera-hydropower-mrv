const crypto = require("crypto");
const projectProfile = require("../config/project-profile.json");
const AnomalyDetector = require("./anomaly-detector");
const VerifierAttestation = require("./verifier-attestation");
class AIGuardianVerifier {
  constructor({ verifierId, verifierPrivateKey }) {
    this.cfg = projectProfile.ai_verifier;
    this.enabled = this.cfg.enabled;
    this.threshold = this.cfg.auto_approve_threshold || 0.9;
    this.anomalyDetector = new AnomalyDetector();
    this.attester = new VerifierAttestation(verifierId, verifierPrivateKey);
  }
  async verifyPeriodBatch(periodTelemetryBatch, acm0002Context = {}) {
    if (!this.enabled) {
      return {
        mode: "human_only",
        auto_approved: 0,
        flagged: periodTelemetryBatch.length,
        approvedAttestations: [],
        flaggedItems: periodTelemetryBatch
      };
    }
    let autoApproved = 0;
    const approvedAttestations = [];
    const flaggedItems = [];
    for (const t of periodTelemetryBatch) {
      const validation = this.anomalyDetector.validateTelemetry(t, null, []);
      const acmChecks = this.runACM0002Checks(t, acm0002Context);
      const score = this.calculateTrustScore(validation, acmChecks);
      if (score >= this.threshold && validation.isValid && acmChecks.isCompliant) {
        const hash = this.hashTelemetry(t);
        const att = this.attester.createAttestation(
          t.turbineId || t.projectId,
          hash,
          validation,
          t.generatedKwh || t.totalKwh || 0
        );
        approvedAttestations.push(att);
        autoApproved++;
      } else {
        flaggedItems.push({ telemetry: t, validation, acmChecks });
      }
    }
    return {
      mode: "ai_assisted",
      auto_approved: autoApproved,
      flagged: flaggedItems.length,
      approvedAttestations,
      flaggedItems
    };
  }
  runACM0002Checks(telemetry, ctx) {
    // DEMO: everything compliant
    return { isCompliant: true, details: {} };
  }
  calculateTrustScore(validation, acmChecks) {
    // DEMO: full trust
    return 1.0;
  }
  hashTelemetry(t) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(t))
      .digest("hex");
  }
}
module.exports = AIGuardianVerifier;
