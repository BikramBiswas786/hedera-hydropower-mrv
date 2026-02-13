const { Client, TopicMessageSubmitTransaction, Hbar } = require("@hashgraph/sdk");
class AttestationPublisher {
  constructor() {
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_KEY;
    if (!operatorId || !operatorKey) {
      throw new Error("Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY");
    }
    this.client = Client.forTestnet().setOperator(operatorId, operatorKey);
    this.auditTopicId = process.env.HEDERA_AUDIT_TOPIC;
    if (!this.auditTopicId) {
      throw new Error("Missing HEDERA_AUDIT_TOPIC");
    }
  }
  async publishAttestation(attestation) {
    const tx = new TopicMessageSubmitTransaction()
      .setTopicId(this.auditTopicId)
      .setMessage(JSON.stringify(attestation))
      .setMaxTransactionFee(new Hbar(2));
    const res = await tx.execute(this.client);
    const receipt = await res.getReceipt(this.client);
    console.log("[AttestationPublisher] HCS status:", receipt.status.toString());
    return receipt;
  }
}
module.exports = AttestationPublisher;
