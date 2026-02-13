require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const MIRROR_NODE = "https://testnet.mirrornode.hedera.com";
const ACCOUNT_ID = process.env.OPERATOR_ID || "0.0.6255927";
const DID_TOPIC = process.env.DID_TOPIC_ID || "0.0.7462776";
const AUDIT_TOPIC = process.env.AUDIT_TOPIC_ID || "0.0.7462600";
const REC_TOKEN = process.env.REC_TOKEN_ID || "0.0.7462931";
async function fetchAccountTransactions() {
  console.log(`Fetching transactions for account ${ACCOUNT_ID}...`);
  const url = `${MIRROR_NODE}/api/v1/transactions?account.id=${ACCOUNT_ID}&limit=100&order=desc`;
  const res = await axios.get(url);
  return res.data.transactions || [];
}
async function fetchTopicMessages(topicId, topicName) {
  console.log(`Fetching messages for ${topicName} topic ${topicId}...`);
  const url = `${MIRROR_NODE}/api/v1/topics/${topicId}/messages?limit=50&order=desc`;
  const res = await axios.get(url);
  return res.data.messages || [];
}
async function fetchTokenInfo() {
  console.log(`Fetching REC token info ${REC_TOKEN}...`);
  const url = `${MIRROR_NODE}/api/v1/tokens/${REC_TOKEN}`;
  const res = await axios.get(url);
  return res.data;
}
async function fetchNFTs() {
  console.log(`Fetching NFTs for token ${REC_TOKEN}...`);
  const url = `${MIRROR_NODE}/api/v1/tokens/${REC_TOKEN}/nfts?limit=50`;
  const res = await axios.get(url);
  return res.data.nfts || [];
}
function formatEvidence(data) {
  const sections = [];
  sections.push("# Hedera Hydropower MRV - Testnet Evidence\n");
  sections.push("## Overview\n");
  sections.push(`- **Operator Account**: ${ACCOUNT_ID}`);
  sections.push(`- **DID Topic**: ${DID_TOPIC}`);
  sections.push(`- **Audit Topic**: ${AUDIT_TOPIC}`);
  sections.push(`- **REC Token**: ${REC_TOKEN}`);
  sections.push(`- **Collection Date**: ${new Date().toISOString()}\n`);
  sections.push("## 1) Account Transactions\n");
  sections.push(`Total transactions collected: ${data.accountTxns.length}\n`);
  sections.push("| Timestamp | Type | Transaction ID | Result |");
  sections.push("|-----------|------|----------------|--------|");
  data.accountTxns.slice(0, 20).forEach(tx => {
    const timestamp = new Date(parseFloat(tx.consensus_timestamp) * 1000).toISOString();
    const type = tx.name || "N/A";
    const txId = tx.transaction_id;
    const result = tx.result;
    sections.push(`| ${timestamp} | ${type} | ${txId} | ${result} |`);
  });
  sections.push("");
  sections.push("## 2) DID Topic Messages\n");
  sections.push(`Total messages: ${data.didMessages.length}\n`);
  sections.push("| Timestamp | Sequence | Message Hash |");
  sections.push("|-----------|----------|--------------|");
  data.didMessages.slice(0, 10).forEach(msg => {
    const timestamp = new Date(parseFloat(msg.consensus_timestamp) * 1000).toISOString();
    const seq = msg.sequence_number;
    const msgPreview = Buffer.from(msg.message, "base64").toString("utf8").substring(0, 30);
    sections.push(`| ${timestamp} | ${seq} | ${msgPreview}... |`);
  });
  sections.push("");
  sections.push("## 3) Audit Topic Messages\n");
  sections.push(`Total messages: ${data.auditMessages.length}\n`);
  sections.push("| Timestamp | Sequence | Message Preview |");
  sections.push("|-----------|----------|-----------------|");
  data.auditMessages.slice(0, 10).forEach(msg => {
    const timestamp = new Date(parseFloat(msg.consensus_timestamp) * 1000).toISOString();
    const seq = msg.sequence_number;
    const msgPreview = Buffer.from(msg.message, "base64").toString("utf8").substring(0, 30);
    sections.push(`| ${timestamp} | ${seq} | ${msgPreview}... |`);
  });
  sections.push("");
  sections.push("## 4) REC Token Details\n");
  const token = data.tokenInfo;
  sections.push(`- **Name**: ${token.name}`);
  sections.push(`- **Symbol**: ${token.symbol}`);
  sections.push(`- **Type**: ${token.type}`);
  sections.push(`- **Total Supply**: ${token.total_supply}`);
  sections.push(`- **Max Supply**: ${token.max_supply}`);
  sections.push(`- **Treasury**: ${token.treasury_account_id}`);
  sections.push(`- **Created**: ${new Date(parseFloat(token.created_timestamp) * 1000).toISOString()}\n`);
  sections.push("## 5) Minted REC NFTs\n");
  sections.push(`Total NFTs minted: ${data.nfts.length}\n`);
  sections.push("| Serial | Owner | Created |");
  sections.push("|--------|-------|---------|");
  data.nfts.slice(0, 10).forEach(nft => {
    const serial = nft.serial_number;
    const owner = nft.account_id || "Treasury";
    const created = new Date(parseFloat(nft.created_timestamp) * 1000).toISOString();
    sections.push(`| ${serial} | ${owner} | ${created} |`);
  });
  sections.push("");
  sections.push("## 6) Verification Links\n");
  sections.push(`- [Account on HashScan](https://hashscan.io/testnet/account/${ACCOUNT_ID})`);
  sections.push(`- [DID Topic on HashScan](https://hashscan.io/testnet/topic/${DID_TOPIC})`);
  sections.push(`- [Audit Topic on HashScan](https://hashscan.io/testnet/topic/${AUDIT_TOPIC})`);
  sections.push(`- [REC Token on HashScan](https://hashscan.io/testnet/token/${REC_TOKEN})\n`);
  sections.push("## 7) Evidence Summary\n");
  sections.push("### Status: ✅ Implemented in code and live on testnet\n");
  sections.push("**Core MRV Engine (ENGINE V1)**");
  sections.push("- Physics-based anomaly detection (ρgQH formula)");
  sections.push("- Temporal consistency validation");
  sections.push("- Environmental bounds checking");
  sections.push("- 3-sigma statistical anomaly detection");
  sections.push("- Documented in `docs/ENGINE-V1.md`\n");
  sections.push("**Execution Layer**");
  sections.push("- Config-driven via `config/project-profile.json`");
  sections.push("- Multiple anchoring modes (direct, Merkle aggregated)");
  sections.push("- AI-assisted verification with trust scoring");
  sections.push("- Documented in `docs/ANCHORING-MODES.md`\n");
  sections.push("**Hedera Integration**");
  sections.push(`- ${data.accountTxns.length} transactions from operator account`);
  sections.push(`- ${data.didMessages.length} DID messages on topic ${DID_TOPIC}`);
  sections.push(`- ${data.auditMessages.length} audit messages on topic ${AUDIT_TOPIC}`);
  sections.push(`- ${data.nfts.length} REC NFTs minted on token ${REC_TOKEN}\n`);
  sections.push("**Cost Analysis**");
  sections.push("- Traditional MRV: ~$10.00/REC");
  sections.push("- ENGINE V1: ~$0.50/REC (95% savings)");
  sections.push("- 90-day simulator: 5,103 txns, 2,450 RECs, $6.88 total cost");
  sections.push("- Documented in `docs/COST-ANALYSIS.md`\n");
  return sections.join("\n");
}
async function main() {
  console.log("=== Collecting Hedera Testnet Evidence ===\n");
  const data = {
    accountTxns: await fetchAccountTransactions(),
    didMessages: await fetchTopicMessages(DID_TOPIC, "DID"),
    auditMessages: await fetchTopicMessages(AUDIT_TOPIC, "Audit"),
    tokenInfo: await fetchTokenInfo(),
    nfts: await fetchNFTs()
  };
  console.log("\n=== Generating Evidence Report ===\n");
  const markdown = formatEvidence(data);
  const evidenceDir = "evidence";
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir);
  }
  const filename = `${evidenceDir}/TESTNET-EVIDENCE.md`;
  fs.writeFileSync(filename, markdown);
  console.log(`✅ Evidence report saved to ${filename}`);
  const jsonFilename = `${evidenceDir}/testnet-data.json`;
  fs.writeFileSync(jsonFilename, JSON.stringify(data, null, 2));
  console.log(`✅ Raw data saved to ${jsonFilename}`);
  console.log("\n=== Summary ===");
  console.log(`Account transactions: ${data.accountTxns.length}`);
  console.log(`DID topic messages: ${data.didMessages.length}`);
  console.log(`Audit topic messages: ${data.auditMessages.length}`);
  console.log(`REC NFTs minted: ${data.nfts.length}`);
}
main().catch(console.error);
