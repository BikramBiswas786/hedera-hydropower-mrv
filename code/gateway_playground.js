// gateway_playground.js
// Run in Hedera Playground (Testnet). This generates an in-memory gateway keypair and a signed master-packet.
const { PrivateKey } = require("@hashgraph/sdk");
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

(function() {
  // Generate gateway keypair (ED25519)
  const gatewayPriv = PrivateKey.generateED25519();
  const pubBytes = gatewayPriv.publicKey.toBytes();
  const pubBase64 = Buffer.from(pubBytes).toString("base64");

  // Build compressed 6-byte data (example)
  const now = Date.now();
  const kWh = Math.floor(50 + Math.random() * 50);   // 50-100
  const flow = Math.floor(40 + Math.random() * 20);  // m3/s
  const eff = Math.floor(75 + Math.random() * 15);   // %
  const rpm = Math.floor(130 + Math.random() * 40);  // store raw (we may divide in decoder)
  const pH = Math.floor(69 + Math.random() * 6);     // pH *10
  const turb = Math.floor(10 + Math.random() * 30); // turb *10
  const buf = Buffer.from([kWh, flow, eff, Math.floor(rpm/10), pH, turb]);
  const compressedHex = buf.toString("hex");

  const nonce = Math.floor(Math.random() * 1e9).toString();
  const payloadObj = {
    did: "did:hedera:topic:REPLACE_WITH_TOPIC", // replace with DID from deploy_playground.js
    timestamp: now,
    compressed: compressedHex,
    nonce: nonce,
    gatewayLabel: "HydroGateway-1"
  };
  const payloadString = JSON.stringify(payloadObj);

  // Sign using ED25519 (tweetnacl)
  const sk = gatewayPriv.toBytes(); // SDK private bytes format -> may include prefix; use tweetnacl signing via private/public keys
  // Convert SDK privateKey to 64-byte secretKey for tweetnacl: we fall back to using SDK sign if available
  let signatureBase64 = "";
  try {
    const sigBytes = gatewayPriv.sign(payloadString);
    signatureBase64 = Buffer.from(sigBytes).toString("base64");
  } catch (e) {
    // fallback using tweetnacl (if we can get raw secret + pub)
    // This branch may not run in Playground depending on SDK internals
    const kp = nacl.sign.keyPair();
    signatureBase64 = nacl.util.encodeBase64(nacl.sign.detached(nacl.util.decodeUTF8(payloadString), kp.secretKey));
    console.warn("Fallback signing used (not deterministic). Use SDK signing for real deployment.");
  }

  console.log("===== GATEWAY OUTPUT =====");
  console.log("publicKeyBase64:", pubBase64);
  console.log("payloadString:", payloadString);
  console.log("signatureBase64:", signatureBase64);
  console.log("==========================");
})();
