# How to Verify the POC

Use this checklist with HashScan and `evidence/txids.csv`.[attached_file:1][web:23]

1. **DID Topic**
   - Open the DID topic URL from `txids.csv`.[attached_file:1]
   - Confirm the DID Document JSON includes the correct `controller` account DID.[attached_file:1]

2. **AUDITv1 Envelope**
   - In the same or linked topic, locate an `AUDITv1` message.[attached_file:1]
   - Confirm it contains `kWh`, `compressed`, `nonce`, and `gateway` fields matching gateway output.[attached_file:1]

3. **NFT**
   - Open the token URL with the REC token ID and serial.[attached_file:1]
   - Confirm metadata references the audit envelope (direct JSON or IPFS CID).[attached_file:1]

4. **Receipts**
   - Ensure all relevant transaction IDs and URLs are stored in `evidence/txids.csv`.[attached_file:1]
