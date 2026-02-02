// 03_orchestrator_verify.js
// Hedera Playground — resolve DID → verify signature → replay check → submit AUDITv1 envelope.

// REQUIREMENT: In Playground, install 'tweetnacl' in the Dependencies panel if available.
// If tweetnacl is not available, this script will need a fallback verification approach.

const {
  Client,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  Hbar,
} = require("@hashgraph/sdk");
const nacl = require("tweetnacl");

(async function () {
  const client = Client.forTestnet();

  // === REPLACE THESE PLACEHOLDERS BEFORE RUNNING ===
  const DID = "did:hedera:topic:REPLACE_WITH_TOPIC"; // e.g. did:hedera:topic:0.0.7462776
  const PAYLOAD = "REPLACE_WITH_PAYLOAD_STRING"; // exact JSON string from 02_gateway_sign.js
  const SIG = "REPLACE_WITH_SIGNATURE_BASE64";  // signatureBase64 from gateway script
  const PUB = "REPLACE_WITH_PUBLIC_BASE64";     // GATEWAY_PUBLIC_BASE64 from gateway script
  // =================================================

  if (PAYLOAD === "REPLACE_WITH_PAYLOAD_STRING") {
    console.error("❌ Replace placeholders DID / PAYLOAD / SIG / PUB before running.");
    return;
  }

  globalThis._NONCE_STORE = globalThis._NONCE_STORE || new Set();

  async function resolveDidDoc(did, timeoutMs = 12000) {
    if (!did.startsWith("did:hedera:topic:"))
      throw new Error("Unsupported DID format");
    const topicId = did.split(":").pop();
    const q = new TopicMessageQuery().setTopicId(topicId);

    return new Promise((resolve, reject) => {
      let done = false;
      const subscription = q.subscribe(
        client,
        null,
        (msg) => {
          if (done) return;
          const text = Buffer.from(msg.contents, "utf8").toString();
          try {
            const obj = JSON.parse(text);
            if (obj && (obj.verificationMethod || obj.controller)) {
              done = true;
              if (subscription && subscription.close) subscription.close();
              resolve(obj);
            }
          } catch (e) {
            // ignore
          }
        },
        (err) => {
          if (!done) {
            done = true;
            if (subscription && subscription.close) subscription.close();
            reject(err);
          }
        }
      );

      setTimeout(() => {
        if (!done) {
          done = true;
          if (subscription && subscription.close) subscription.close();
          reject(new Error("Timeout reading DID topic"));
        }
      }, timeoutMs);
    });
  }

  function verifySignature(payloadString, signatureBase64, pubBase64) {
    try {
      const msg = new Uint8Array(Buffer.from(payloadString, "utf8"));
      const sig = new Uint8Array(Buffer.from(signatureBase64, "base64"));
      const pub = new Uint8Array(Buffer.from(pubBase64, "base64"));
      return nacl.sign.detached.verify(msg, sig, pub);
    } catch (e) {
      console.error("Signature verify error:", e);
      return false;
    }
  }

  console.log("Resolving DID document for", DID);
  let didDoc;
  try {
    didDoc = await resolveDidDoc(DID);
  } catch (e) {
    console.error("Failed to resolve DID doc:", e.message || e);
    return;
  }

  console.log("DID doc:", didDoc);
  const didPub = didDoc?.verificationMethod?.[0]?.publicKeyBase64 || PUB;
  if (!didPub) {
    console.error("❌ No public key available for verification.");
    return;
  }

  const ok = verifySignature(PAYLOAD, SIG, didPub);
  console.log("Signature verification:", ok ? "OK ✅" : "FAILED ❌");
  if (!ok) return;

  const parsed = JSON.parse(PAYLOAD);
  const nonce = parsed.nonce;
  const topicId = DID.split(":").pop();

  if (globalThis._NONCE_STORE.has(nonce)) {
    console.error("❌ Replay detected (in-memory).");
    return;
  }

  globalThis._NONCE_STORE.add(nonce);

  const audit = {
    version: "AUDITv1",
    topicId: topicId,
    timestamp: parsed.timestamp,
    kWh: parsed.kWh || null,
    compressed: parsed.compressed,
    nonce: nonce,
    gateway: parsed.gatewayLabel || null,
  };

  const meta = JSON.stringify(audit);

  await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(meta)
    .setMaxTransactionFee(new Hbar(1))
    .execute(client)
    .then((tx) => tx.getReceipt(client));

  console.log("✅ Audit submitted to DID topic:", topicId);
  console.log("HashScan:", "https://hashscan.io/testnet/topic/" + topicId);
  console.log("Done — POC audit flow complete.");
})();
