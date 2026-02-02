// orchestrator_playground.js
// Run in Hedera Playground (Testnet).
const {
  Client,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenType,
  CustomRoyaltyFee,
  PrivateKey
} = require("@hashgraph/sdk");

const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

(async function() {
  const client = Client.forTestnet();

  // --- Replace these with exact values copied from gateway run & deploy run ---
  const DID = "did:hedera:topic:REPLACE_WITH_TOPIC"; // DID printed by deploy_playground.js
  const PAYLOAD = `REPLACE_WITH_PAYLOAD_STRING`;     // exact JSON string from gate output
  const SIG = "REPLACE_WITH_SIGNATURE_BASE64";      // signatureBase64 from gateway output
  const PUB = "REPLACE_WITH_PUBLIC_BASE64";         // gateway public key base64

  if (PAYLOAD === "REPLACE_WITH_PAYLOAD_STRING") {
    console.error("Please replace placeholders in this file with the payload/signature/pub printed by gateway_playground.js");
    return;
  }

  // Helper: resolve DID doc by reading the first message on the DID topic
  async function resolveDidDoc(did) {
    const topicId = did.split(":").pop();
    return new Promise((resolve, reject) => {
      const sub = new TopicMessageQuery().setTopicId(topicId);
      let done = false;
      sub.subscribe(client, null, (msg) => {
        if (done) return;
        done = true;
        const text = Buffer.from(msg.contents, "utf8").toString();
        try { resolve(JSON.parse(text)); } catch(e) { reject(e); }
      }, (err) => reject(err));
      setTimeout(()=> { if (!done) reject(new Error("Timeout reading DID topic")); }, 10000);
    });
  }

  // Verify signature (payloadString, signature base64, pub base64)
  function verifySignature(payloadString, signatureBase64, pubBase64) {
    const msg = nacl.util.decodeUTF8(payloadString);
    const sig = nacl.util.decodeBase64(signatureBase64);
    const pub = nacl.util.decodeBase64(pubBase64);
    return nacl.sign.detached.verify(msg, sig, pub);
  }

  console.log("Resolving DID doc for", DID);
  const didDoc = await resolveDidDoc(DID);
  console.log("DID doc:", didDoc);

  // choose public key (prefer DID doc)
  const didPub = (didDoc && didDoc.verificationMethod && didDoc.verificationMethod[0] && didDoc.verificationMethod[0].publicKeyBase64) || PUB;

  if (!didPub) {
    console.error("No public key found to verify signature.");
    return;
  }

  const ok = verifySignature(PAYLOAD, SIG, didPub);
  console.log("Signature verification result:", ok);
  if (!ok) {
    console.error("❌ INVALID SIGNATURE — aborting");
    return;
  }

  // Simple replay check: read DID topic messages and look for nonce (best effort)
  const parsed = JSON.parse(PAYLOAD);
  const nonce = parsed.nonce;
  const topicId = DID.split(":").pop();

  // Try scanning messages for nonce
  let replay = false;
  try {
    replay = await new Promise((resolve) => {
      const sub = new TopicMessageQuery().setTopicId(topicId);
      let found = false;
      sub.subscribe(client, null, (msg) => {
        const text = Buffer.from(msg.contents, "utf8").toString();
        if (text.includes(nonce)) {
          found = true;
          resolve(true);
        }
      }, (err) => {
        // ignore
      });
      setTimeout(()=> resolve(false), 8000);
    });
  } catch (e) {
    replay = false;
  }

  if (replay) {
    console.error("❌ Replay detected (nonce already present) — aborting");
    return;
  }

  // Submit audit meta to DID topic (demo)
  const meta = `${topicId.replace(/\./g,'')}|${parsed.timestamp}|${parsed.compressed}|${nonce}`;
  console.log("Submitting audit meta:", meta);
  await new TopicMessageSubmitTransaction({ topicId, message: meta }).execute(client).then(tx => tx.getReceipt(client));
  console.log("✅ Audit message submitted to DID topic:", topicId);

  // Create NFT (for demo: create a new token) with 5% royalty to operator
  console.log("Creating NFT token (demo)...");
  const royalty = new CustomRoyaltyFee().setFeeCollectorAccountId(client.operatorAccountId).setNumerator(5).setDenominator(100);

  const tokenTx = await new TokenCreateTransaction()
    .setTokenName("HydroCert-POC")
    .setTokenSymbol("HYDROPOC")
    .setTokenType(TokenType.NonFungibleUnique)
    .setTreasuryAccountId(client.operatorAccountId)
    .setSupplyKey(PrivateKey.generateED25519().publicKey) // demo supply key
    .setCustomFees([royalty])
    .execute(client);

  const tokenId = (await tokenTx.getReceipt(client)).tokenId.toString();
  console.log("Token created:", tokenId);

  // Mint NFT with small metadata string
  const mintTx = await new TokenMintTransaction().setTokenId(tokenId).setMetadata([Buffer.from(meta)]).execute(client);
  const mintReceipt = await mintTx.getReceipt(client);
  const serial = mintReceipt.serials[0].toString();
  console.log("Minted NFT serial:", serial);
  console.log("NFT link:", `https://hashscan.io/testnet/token/${tokenId}?serial=${serial}`);

})();
