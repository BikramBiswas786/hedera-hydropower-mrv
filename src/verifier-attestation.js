const crypto = require("crypto");
class VerifierAttestation {
  constructor(verifierId, verifierPrivateKeyPem) {
    this.verifierId = verifierId;
    this.verifierPrivateKey = verifierPrivateKeyPem
      ? crypto.createPrivateKey(verifierPrivateKeyPem)
      : null;
  }
  createAttestation(turbineId, telemetryHash, validationResult, recAmount) {
    const attestationId = `att_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const attestation = {
      attestationId,
      verifierId: this.verifierId,
      turbineId,
      telemetryHash,
      verificationStatus: validationResult.isValid ? "APPROVED" : "REJECTED",
      checks: {
        signatureValid: true,
        deviceRegistered: true,
        dataWithinRange: validationResult.checks.physics.isValid,
        anomalyDetected: validationResult.checks.anomaly.isAnomaly,
        policyCompliant: validationResult.isValid
      },
      recAmount: validationResult.isValid ? recAmount : 0,
      timestamp: new Date().toISOString(),
      rejectionReasons: validationResult.rejectionReasons
    };
    if (this.verifierPrivateKey) {
      const attestationString = JSON.stringify(attestation);
      const signature = crypto
        .createSign("sha256")
        .update(attestationString)
        .sign(this.verifierPrivateKey, "hex");
      attestation.verifierSignature = signature;
    } else {
      attestation.verifierSignature = "demo-no-signature";
    }
    return attestation;
  }
}
module.exports = VerifierAttestation;
