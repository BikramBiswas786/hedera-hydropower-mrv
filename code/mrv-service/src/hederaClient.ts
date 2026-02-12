import { Client, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import crypto from "crypto";
import { CONFIG } from "./config";

const client = Client.forName(CONFIG.network);
if (CONFIG.operatorId && CONFIG.operatorKey) {
  client.setOperator(CONFIG.operatorId, CONFIG.operatorKey);
}

export interface AnchorResult {
  transactionId: string;
  messageHashHex: string;
}

export async function anchorTelemetry(payload: unknown): Promise<AnchorResult> {
  if (!CONFIG.topicId) {
    throw new Error("HEDERA_TOPIC_ID not configured");
  }

  const json = JSON.stringify(payload);
  const hash = crypto.createHash("sha256").update(json).digest("hex");

  const tx = await new TopicMessageSubmitTransaction({
    topicId: CONFIG.topicId,
    message: Buffer.from(hash, "hex")
  }).execute(client);

  await tx.getReceipt(client);

  return {
    transactionId: tx.transactionId.toString(),
    messageHashHex: hash
  };
}
