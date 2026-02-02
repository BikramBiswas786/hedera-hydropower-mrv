# Demo Runbook (Playground)

1. Open Hedera Playground → set **Testnet** and set your Operator account (Account ID & Private Key) in the Playground UI.
2. Run `code/deploy_playground.js`.
   - Copy DID printed (did:hedera:topic:0.0.xxxxxx).
3. Run `code/gateway_playground.js`.
   - Copy `publicKeyBase64`, `payloadString`, `signatureBase64`.
4. Edit `code/deploy_playground.js` DID Document or submit a second DID message that contains `publicKeyBase64`.
   - (Or paste publicKeyBase64 into DID message in a separate TopicMessageSubmitTransaction.)
5. Edit `code/orchestrator_playground.js` — replace placeholders with DID, payload, signature and pubBase64.
6. Run `code/orchestrator_playground.js`.
   - It verifies signature, writes audit message, and mints NFT. Copy the tokenId + serial.
7. Open HashScan:
   - Topic: `https://hashscan.io/testnet/topic/<topicId>`
   - NFT: `https://hashscan.io/testnet/token/<tokenId>?serial=<serial>`
8. Capture screenshots of console outputs and HashScan pages for bounty submission.
