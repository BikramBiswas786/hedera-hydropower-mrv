require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const MIRROR_NODE = "https://testnet.mirrornode.hedera.com";
const ACCOUNT_ID = process.env.OPERATOR_ID || "0.0.6255927";
const DID_TOPIC = process.env.DID_TOPIC_ID || "0.0.7462776";
const AUDIT_TOPIC = process.env.AUDIT_TOPIC_ID || "0.0.7462600";
const REC_TOKEN = process.env.REC_TOKEN_ID || "0.0.7462931";
async function fetchAllAccountTransactions() {
  console.log(`Fetching ALL transactions for account ${ACCOUNT_ID}...`);
  let allTxns = [];
  let nextLink = `${MIRROR_NODE}/api/v1/transactions?account.id=${ACCOUNT_ID}&limit=100&order=desc`;
  while (nextLink) {
    try {
      const res = await axios.get(nextLink);
      const txns = res.data.transactions || [];
      allTxns = allTxns.concat(txns);
      console.log(`  Collected ${allTxns.length} transactions so far...`);
      nextLink = res.data.links?.next ? `${MIRROR_NODE}${res.data.links.next}` : null;
      if (allTxns.length > 500) break;
    } catch (err) {
      console.error("Error:", err.message);
      break;
    }
  }
  return allTxns;
}
async function fetchAllTopicMessages(topicId, topicName) {
  console.log(`Fetching ALL messages for ${topicName} topic ${topicId}...`);
  let allMsgs = [];
  let nextLink = `${MIRROR_NODE}/api/v1/topics/${topicId}/messages?limit=100&order=desc`;
  while (nextLink) {
    try {
      const res = await axios.get(nextLink);
      const msgs = res.data.messages || [];
      allMsgs = allMsgs.concat(msgs);
      console.log(`  Collected ${allMsgs.length} messages so far...`);
      nextLink = res.data.links?.next ? `${MIRROR_NODE}${res.data.links.next}` : null;
      if (allMsgs.length > 500) break;
    } catch (err) {
      console.error(`Error:`, err.message);
      break;
    }
  }
  return allMsgs;
}
async function fetchTokenInfo() {
  console.log(`Fetching REC token info ${REC_TOKEN}...`);
  try {
    const res = await axios.get(`${MIRROR_NODE}/api/v1/tokens/${REC_TOKEN}`);
    return res.data;
  } catch (err) {
    console.error("Error:", err.message);
    return {};
  }
}
async function fetchAllNFTs() {
  console.log(`Fetching ALL NFTs for token ${REC_TOKEN}...`);
  let allNFTs = [];
  let nextLink = `${MIRROR_NODE}/api/v1/tokens/${REC_TOKEN}/nfts?limit=100`;
  while (nextLink) {
    try {
      const res = await axios.get(nextLink);
      const nfts = res.data.nfts || [];
      allNFTs = allNFTs.concat(nfts);
      console.log(`  Collected ${allNFTs.length} NFTs so far...`);
      nextLink = res.data.links?.next ? `${MIRROR_NODE}${res.data.links.next}` : null;
    } catch (err) {
      console.error("Error:", err.message);
      break;
    }
  }
  return allNFTs;
}
function categorizeTransactions(txns) {
  const cat = {CONSENSUSSUBMITMESSAGE:[],TOKENCREATION:[],TOKENMINT:[],CRYPTOTRANSFER:[],OTHER:[]};
  txns.forEach(tx => {
    const n = tx.name || "UNKNOWN";
    if (cat[n]) cat[n].push(tx); else cat.OTHER.push(tx);
  });
  return cat;
}
function generateCompleteTheoryDoc(data) {
  const s = [];
  const c = categorizeTransactions(data.accountTxns);
  s.push("# Hedera Hydropower MRV - Complete Evidence & Theory\n","**Date**: "+new Date().toISOString(),"**Network**: Hedera Testnet","**Methodology**: ACM0002\n","---\n","## 1. System Architecture\n","**MRV engine** aligned with Verra ACM0002, separating methodology from execution.\n","**Principles**:","- Immutable audit trail on HCS","- Decentralized identity (DIDs)","- Physics validation (ρgQH)","- Cryptographic attestations","- Configurable execution\n","**ENGINE V1**:","- Physics: ρgQH (0.80–0.90 efficiency)","- Temporal: Monotonic timestamps","- Environmental: pH(6.5–8.5), turbidity(<50), flow(0.1–100)","- Statistical: 3-sigma Z-score\n","**AI Guardian**: Trust=1.0, deduct 0.5(physics), 0.3(temporal), 0.3(env)\n","---\n","## 2. Infrastructure\n",`| Asset | ID | Purpose |`,`|---|---|---|`,`| Operator | \`${ACCOUNT_ID}\` | Signer |`,`| DID | \`${DID_TOPIC}\` | Registry |`,`| Audit | \`${AUDIT_TOPIC}\` | Log |`,`| REC | \`${REC_TOKEN}\` | NFTs |\n`,"---\n","## 3. Transactions\n",`**Total**: ${data.accountTxns.length}\n`,`| Type | Count |`,`|---|---|`,`| HCS | ${c.CONSENSUSSUBMITMESSAGE.length} |`,`| Create | ${c.TOKENCREATION.length} |`,`| Mint | ${c.TOKENMINT.length} |`,`| Transfer | ${c.CRYPTOTRANSFER.length} |\n`,"**HCS Messages** (top 20):\n","| Time | TX | Status |","|---|---|---|");
  c.CONSENSUSSUBMITMESSAGE.slice(0,20).forEach(tx=>{const t=new Date(parseFloat(tx.consensus_timestamp)*1000).toISOString();s.push(`| ${t} | \`${tx.transaction_id}\` | ${tx.result} |`);});
  s.push("\n","---\n","## 4. DIDs\n",`**Total**: ${data.didMessages.length}\n`,"| Time | Seq | Preview |","|---|---|---|");
  data.didMessages.slice(0,10).forEach(m=>{const t=new Date(parseFloat(m.consensus_timestamp)*1000).toISOString();const d=Buffer.from(m.message,"base64").toString("utf8").substring(0,30).replace(/\n/g," ");s.push(`| ${t} | ${m.sequence_number} | \`${d}...\` |`);});
  s.push("\n","---\n","## 5. Audit Trail\n",`**Total**: ${data.auditMessages.length}\n`,"| Time | Seq | Preview |","|---|---|---|");
  data.auditMessages.slice(0,10).forEach(m=>{const t=new Date(parseFloat(m.consensus_timestamp)*1000).toISOString();const d=Buffer.from(m.message,"base64").toString("utf8").substring(0,30).replace(/\n/g," ");s.push(`| ${t} | ${m.sequence_number} | \`${d}...\` |`);});
  const tk=data.tokenInfo;
  s.push("\n","---\n","## 6. REC Token\n",`- **Name**: ${tk.name||"N/A"}`,`- **Symbol**: ${tk.symbol||"N/A"}`,`- **Type**: ${tk.type||"N/A"}`,`- **Supply**: ${tk.total_supply||0}/${tk.max_supply||"∞"}`,`- **Treasury**: ${tk.treasury_account_id||"N/A"}\n`,`**NFTs**: ${data.nfts.length}\n`,"| Serial | Owner | Created |","|---|---|---|");
  data.nfts.slice(0,10).forEach(n=>{const t=new Date(parseFloat(n.created_timestamp)*1000).toISOString();s.push(`| ${n.serial_number} | ${n.account_id||"Treasury"} | ${t} |`);});
  s.push("\n","---\n","## 7. Verification\n",`- [Account](https://hashscan.io/testnet/account/${ACCOUNT_ID})`,`- [DID Topic](https://hashscan.io/testnet/topic/${DID_TOPIC})`,`- [Audit Topic](https://hashscan.io/testnet/topic/${AUDIT_TOPIC})`,`- [REC Token](https://hashscan.io/testnet/token/${REC_TOKEN})\n`,"---\n","## 8. Status\n","✅ **ENGINE V1**: Physics, temporal, environmental, anomaly","✅ **Execution**: Config-driven, direct+Merkle","✅ **Hedera**: "+data.accountTxns.length+" txns, "+data.didMessages.length+" DIDs, "+data.auditMessages.length+" audit msgs","✅ **AI**: Trust scoring + attestations","✅ **RECs**: "+data.nfts.length+" minted","✅ **Docs**: ENGINE-V1, ANCHORING-MODES, COST-ANALYSIS\n","---\n","**Generated**: "+new Date().toISOString());
  return s.join("\n");
}
async function main() {
  console.log("=== Collecting Complete Testnet Evidence ===\n");
  const data = {
    accountTxns: await fetchAllAccountTransactions(),
    didMessages: await fetchAllTopicMessages(DID_TOPIC, "DID"),
    auditMessages: await fetchAllTopicMessages(AUDIT_TOPIC, "Audit"),
    tokenInfo: await fetchTokenInfo(),
    nfts: await fetchAllNFTs()
  };
  console.log("\n=== Generating Theory Document ===\n");
  const markdown = generateCompleteTheoryDoc(data);
  const evidenceDir = "evidence";
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir);
  fs.writeFileSync(`${evidenceDir}/COMPLETE-EVIDENCE.md`, markdown);
  console.log(`✅ Complete evidence: evidence/COMPLETE-EVIDENCE.md`);
  fs.writeFileSync(`${evidenceDir}/testnet-complete-data.json`, JSON.stringify(data,null,2));
  console.log(`✅ Raw data: evidence/testnet-complete-data.json`);
  console.log("\n=== Summary ===");
  console.log(`Transactions: ${data.accountTxns.length}`);
  console.log(`DIDs: ${data.didMessages.length}`);
  console.log(`Audit messages: ${data.auditMessages.length}`);
  console.log(`NFTs: ${data.nfts.length}`);
}
main().catch(console.error);
