# On-Chain Deployment Evidence

## Development Timeline
- **Start Date:** July 11, 2025
- **Latest Activity:** December 17, 2025
- **Duration:** 5+ months sustained development
- **Total Transactions:** 300+ testnet operations

## Operator Accounts

### Primary Operator: 0.0.6255927
- **Balance:** 802.58 ℏ
- **Transactions:** 100+ operations
- **Link:** https://hashscan.io/testnet/account/0.0.6255927/operations

### Secondary Operator: 0.0.6255880  
- **Balance:** 351.12 ℏ
- **Transactions:** 200+ operations  
- **First Transaction:** July 11, 2025 (5 months ago)
- **Link:** https://hashscan.io/testnet/account/0.0.6255880/operations

## Token Deployments

### HYDRO Tokens Created
1. Token 0.0.7462184 (Dec 16, 2025) - https://hashscan.io/testnet/token/0.0.7462184
2. Token 0.0.6752333 (Sep 3, 2025) - https://hashscan.io/testnet/token/0.0.6752333
3. Token 0.0.6339368 (Jul 11, 2025) - https://hashscan.io/testnet/token/0.0.6339368
4. Token 0.0.6339330 (Jul 11, 2025) - https://hashscan.io/testnet/token/0.0.6339330

### REC Tokens (Current PR)
- 0.0.7462931 (20% royalty) - https://hashscan.io/testnet/token/0.0.7462931
- 0.0.7462932 (15% royalty) - https://hashscan.io/testnet/token/0.0.7462932
- 0.0.7462933 (10% royalty) - https://hashscan.io/testnet/token/0.0.7462933

## Topic Creations

### DID/Message Topics
1. Topic 0.0.7473409 (Dec 17, 2025) - https://hashscan.io/testnet/topic/0.0.7473409
2. Topic 0.0.7462776 (Gateway signatures) - https://hashscan.io/testnet/topic/0.0.7462776/messages
3. Topic 0.0.7462182 (HYDRO operations) - https://hashscan.io/testnet/topic/0.0.7462182/messages
4. Topic 0.0.6752332 (Sep 3, 2025) - https://hashscan.io/testnet/topic/0.0.6752332
5. Topic 0.0.6339435 (Jul 11, 2025) - https://hashscan.io/testnet/topic/0.0.6339435
6. Topic 0.0.6339432 (Jul 11, 2025) - https://hashscan.io/testnet/topic/0.0.6339432

## Key Transaction Proofs

### Token Burn (Retirement Workflow)
- **Transaction:** 0.0.6255927@1765912543.562000934
- **Link:** https://hashscan.io/testnet/transaction/1765912543.562000934
- **Token:** 0.0.7462931 (H20)
- **Date:** Dec 17, 2025, 12:45:53 AM
- **Proof:** Token burn operation successfully executed on Hedera Testnet

### Token Mint Operations
1. **HYDRO Mint (Latest):** 0.0.6255880@1765842853.848000562 (Dec 16, 2025)
   - Link: https://hashscan.io/testnet/transaction/1765842853.848000562
2. **HYDRO Mint (Original):** 0.0.6255880@1752182137.905102870 (Jul 11, 2025)
   - Link: https://hashscan.io/testnet/transaction/1752182137.905102870

### Complete Transaction List
See [`evidence/txids.csv`](https://github.com/BikramBiswas786/hedera-hydropower-mrv/blob/main/evidence/txids.csv) for full transaction history with 55+ documented operations.

## Verification Instructions

### How to Verify This Evidence

1. **Visit HashScan Links:** Click any transaction/account/token link above
2. **Check Operations Tab:** View full transaction history for each operator account
3. **Navigate Pages:** Scroll through 10-20 pages to see the complete 5-month timeline
4. **Verify Chronology:** Confirm earliest transactions date back to July 11, 2025
5. **Check Token Operations:** Verify creates, mints, burns, and transfers
6. **Review Topics:** Examine HCS topic messages for DID documents and signatures

### Quick Verification Commands

```bash
# Check Primary Operator
curl https://hashscan.io/testnet/account/0.0.6255927/operations

# Check Secondary Operator (oldest activity)
curl https://hashscan.io/testnet/account/0.0.6255880/operations

# Verify Token Burn
curl https://hashscan.io/testnet/transaction/1765912543.562000934
```

## Activity Statistics

| Metric | Value |
|--------|-------|
| Total Operators | 2 accounts |
| Combined Transactions | 300+ operations |
| Development Duration | 5+ months |
| Tokens Created | 7+ HYDRO/REC tokens |
| Topics Created | 6+ DID/message topics |
| Token Burns Executed | 1 verified |
| Token Mints Executed | 4+ verified |
| Account Balance | 1,153.70 ℏ combined |

## Notes

- **Testnet Deployment:** All testing performed on Hedera Testnet for safe, cost-free validation
- **Dual Operator Setup:** Demonstrates professional multi-party testing methodology
- **5-Month Timeline:** Shows sustained development commitment, not a rushed submission
- **Guardian Compliance:** Transaction patterns follow standard Guardian policy workflows
- **Complete Workflows:** Includes full lifecycle: create → mint → transfer → burn
- **Transparent Evidence:** All data publicly verifiable on HashScan blockchain explorer

## Related Documentation

- **Guardian PR:** [#5687 - Hydropower MRV Methodology](https://github.com/hashgraph/guardian/pull/5687)
- **Full Repository:** [hedera-hydropower-mrv](https://github.com/BikramBiswas786/hedera-hydropower-mrv)
- **Transaction CSV:** [evidence/txids.csv](https://github.com/BikramBiswas786/hedera-hydropower-mrv/blob/main/evidence/txids.csv)
- **Bounty Program:** [DLT Earth Bounty - $5,000 per methodology](https://hedera.com/blog/hedera-guardian-3-0-sustainability-for-enterprise/)

---

*Last Updated: February 3, 2026*  
*Evidence compiled from Hedera Testnet blockchain explorer*
