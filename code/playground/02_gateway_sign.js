// 02_gateway_sign.js
// Hedera Playground — generate gateway Ed25519 keypair, build compressed reading,
// sign Master Reading Packet, log payload + signature.

// Run in Playground. Each run creates a fresh in‑memory gateway key.
// For real deployments, key persistence is required (KMS/HSM).

const { PrivateKey } = require("@hashgraph/sdk");

(function () {
  const gatewayPriv = PrivateKey.generateED25519();
  const pubBase64 = Buffer.from(gatewayPriv.publicKey.toBytes()).toString(
    "base64"
  );

  console.log("=== GATEWAY IDENTITY ===");
  console.log("GATEWAY_PUBLIC_BASE64:", pubBase64);
  console.log(
    "GATEWAY_PRIVATE_FINGERPRINT:",
    gatewayPriv.toString().slice(0, 16) + "..."
  );
  console.log(
    "⚠️ Save this public key — paste it into 01_deploy_did.js (publicKeyBase64)."
  );
  console.log("");

  const now = Date.now();
  const hour = new Date(now).getUTCHours();
  const isPeak = hour >= 8 && hour <= 18;

  const kWh = Math.floor((isPeak ? 75 : 35) + Math.random() * 25);
  const flow = Math.floor((isPeak ? 55 : 48) + Math.random() * 10);
  const eff = Math.floor(75 + Math.random() * 15);
  const rpm = Math.floor((isPeak ? 150 : 130) + Math.random() * 20);
  const pH = Math.floor(69 + Math.random() * 6);
  const turb = Math.floor(12 + Math.random() * 38);

  const buf = Buffer.from([
    kWh & 0xff,
    flow & 0xff,
    eff & 0xff,
    Math.floor(rpm / 10) & 0xff,
    pH & 0xff,
    turb & 0xff,
  ]);
  const compressedHex = buf.toString("hex");

  const payloadObj = {
    did: "did:hedera:topic:REPLACE_WITH_DID_TOPIC_ID", // e.g. did:hedera:topic:0.0.7462776
    timestamp: now,
    compressed: compressedHex,
    kWh: kWh,
    nonce: Math.floor(Math.random() * 1e12).toString(),
    gatewayLabel: "HydroGateway-1",
  };

  const payloadString = JSON.stringify(payloadObj);
  const sigBytes = gatewayPriv.sign(payloadString);
  const signatureBase64 = Buffer.from(sigBytes).toString("base64");

  console.log("=== MASTER READING PACKET ===");
  console.log("payloadString:", payloadString);
  console.log("signatureBase64:", signatureBase64);
  console.log("==============================");
})();
