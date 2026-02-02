# SIMPLE LICENSE & ROYALTY NOTE (POC)


**Provider:** Bikram Biswas  
**Purpose:** Demo‑only license for Hedera Testnet evaluation[attached_file:1]

## License Grant

Provider grants Receiver a **non‑exclusive right** to:

- Run this POC on Hedera Testnet  
- Evaluate the hydropower MRV methodology  
- Test verification and REC issuance flows[attached_file:1]

Scope: Testnet only (not for commercial production).[attached_file:1]

## Royalty Proposal (Example)

### Primary Sale

- 70% → Seller (REC owner)  
- 25% → License holder  
- 5% → Provider (Bikram Biswas)[attached_file:1]

### Secondary Sales

- 3% → License holder  
- 3% → Provider (Bikram Biswas)  
- 1% → Coder(s) (optional, per agreement)[attached_file:1]

## Implementation (HTS Example)

```javascript
const royalties = [
  { account: "0.0.LICENSE_HOLDER", percentage: 0.25 },
  { account: "0.0.PROVIDER", percentage: 0.05 },
];

await new TokenCreateTransaction()
  .setTokenName("Hydropower REC")
  .setCustomFees([
    new CustomRoyaltyFee()
      .setFeeCollectorAccountId("0.0.LICENSE_HOLDER")
      .setNumerator(25)
      .setDenominator(100),
  ])
  .execute(client);
