// 01_deploy_did.js
// Hedera Playground — create a DID topic + publish DID Document
// 1) Set Playground network: Testnet
// 2) Configure your operator in the Playground UI
// 3) Run this once, then update publicKeyBase64 after you have gateway key

const {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  Hbar,
} = require("@hashgraph/sdk");

(async function () {
  const client = Client.forTestnet();
  console.log(
    "Operator:",
    client.operatorAccountId ? client.operatorAccountId.toString() : "(NOT SET)"
  );

  // Create DID topic (gateway DID registry)
  const tx = await new TopicCreateTransaction()
    .setTopicMemo("Hydropower Gateway DID Registry")
    .setMaxTransactionFee(new Hbar(1))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId.toString();
  const did = `did:hedera:topic:${topicId}`;

  console.log("✅ DID Topic created:", topicId);

  // Minimal DID Document — you will re‑publish with real gateway public key later
  const didDocument = {
    "@context": "https://www.w3.org/ns/did/v1",
    id: did,
    controller: `did:hedera:account:${client.operatorAccountId}`, // grandfather key
    verificationMethod: [
      {
        id: `${did}#key-1`,
        type: "Ed25519VerificationKey2018",
        controller: `did:hedera:account:${client.operatorAccountId}`,
        publicKeyBase64: "REPLACE_WITH_GATEWAY_PUBLIC_BASE64",
      },
    ],
    created: new Date().toISOString(),
  };

  const msgTx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(didDocument))
    .setMaxTransactionFee(new Hbar(1))
    .execute(client);

  await msgTx.getReceipt(client);

  console.log("✅ DID Document published (with placeholder key).");
  console.log("DID:", did);
  console.log("HashScan (topic): https://hashscan.io/testnet/topic/" + topicId);
  console.log(
    "⚠️ After you know the real gateway publicKeyBase64, rerun this script with that value."
  );
})();
