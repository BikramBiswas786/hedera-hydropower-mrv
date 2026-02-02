// deploy_playground.js
// Run in Hedera Playground (select Testnet and set operator in UI)
const { Client, TopicCreateTransaction, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

(async function() {
  const client = Client.forTestnet();

  console.log("Creating DID topic on Hedera Testnet...");
  const tx = await new TopicCreateTransaction()
    .setTopicMemo("Hydropower Gateway DID Registry")
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId.toString();
  console.log("✅ DID Topic created:", topicId);

  // Minimal DID Document (dev): publicKey placeholder to be replaced with gateway pubBase64 if you have one
  const didDocument = {
    "@context": "https://www.w3.org/ns/did/v1",
    id: `did:hedera:topic:${topicId}`,
    controller: `did:hedera:account:${client.operatorAccountId}`,
    verificationMethod: [
      {
        id: `did:hedera:topic:${topicId}#key-1`,
        type: "Ed25519VerificationKey2018",
        controller: `did:hedera:account:${client.operatorAccountId}`,
        publicKeyBase64: "REPLACE_WITH_GATEWAY_PUBLIC_BASE64"
      }
    ],
    created: new Date().toISOString()
  };

  console.log("Publishing DID document to topic...");
  await new TopicMessageSubmitTransaction({ topicId, message: JSON.stringify(didDocument) })
    .execute(client)
    .then(tx => tx.getReceipt(client));

  console.log("✅ DID Document published. DID:", `did:hedera:topic:${topicId}`);
  console.log("HashScan topic:", `https://hashscan.io/testnet/topic/${topicId}`);
})();
