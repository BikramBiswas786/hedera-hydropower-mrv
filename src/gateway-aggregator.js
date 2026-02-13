const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const cron = require("node-cron");
const { MerkleTree } = require("merkletreejs");
const { Client, TopicMessageSubmitTransaction, Hbar } = require("@hashgraph/sdk");
const projectProfile = require("../config/project-profile.json");
class GatewayAggregator {
  constructor() {
    this.mode = projectProfile.anchoring.mode;           // "direct" | "merkle_aggregated"
    this.frequency = projectProfile.anchoring.frequency;
    this.batchMode = projectProfile.anchoring.batch_mode;
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_KEY;
    if (!operatorId || !operatorKey) {
      throw new Error("Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY env vars");
    }
    this.client = Client.forTestnet().setOperator(operatorId, operatorKey);
    // Direct mode uses audit topic, merkle mode also uses audit topic for batch anchor
    this.topicId = process.env.HEDERA_AUDIT_TOPIC || projectProfile.anchoring.topicId;
    this.db = new sqlite3.Database(path.join(__dirname, "..", "gateway-telemetry.db"));
    this.db.run(`
      CREATE TABLE IF NOT EXISTS telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        turbine_did TEXT NOT NULL,
        period_start TEXT NOT NULL,
        period_end TEXT NOT NULL,
        payload TEXT NOT NULL,
        hash TEXT NOT NULL
      )
    `);
    if (this.mode === "merkle_aggregated") {
      this.scheduleAnchoring();
    }
  }
  async handlePeriodRecord(periodRecord) {
    if (this.mode === "direct") {
      if (this.batchMode === "single_turbine") {
        return this.submitDirectToHCS(periodRecord);
      } else {
        return this.submitDirectToHCS(periodRecord);
      }
    } else {
      return this.storeLocally(periodRecord);
    }
  }
  async submitDirectBatchToHCS(periodRecords) {
    const tx = new TopicMessageSubmitTransaction()
      .setTopicId(this.topicId)
      .setMessage(JSON.stringify(periodRecords))
      .setMaxTransactionFee(new Hbar(2));
    const res = await tx.execute(this.client);
    const receipt = await res.getReceipt(this.client);
    console.log("[GatewayAggregator] Direct batch HCS status:", receipt.status.toString());
    return receipt;
  }
  async submitDirectToHCS(periodRecord) {
    const tx = new TopicMessageSubmitTransaction()
      .setTopicId(this.topicId)
      .setMessage(JSON.stringify(periodRecord))
      .setMaxTransactionFee(new Hbar(2));
    const res = await tx.execute(this.client);
    const receipt = await res.getReceipt(this.client);
    console.log("[GatewayAggregator] Direct HCS status:", receipt.status.toString());
    return receipt;
  }
  async storeLocally(periodRecord) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(periodRecord);
      const hash = crypto.createHash("sha256").update(payload).digest("hex");
      const stmt = this.db.prepare(
        "INSERT INTO telemetry (turbine_did, period_start, period_end, payload, hash) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(
        periodRecord.turbineId || periodRecord.projectId || "unknown",
        periodRecord.periodStart,
        periodRecord.periodEnd,
        payload,
        hash,
        err => {
          if (err) return reject(err);
          stmt.finalize();
          resolve(true);
        }
      );
    });
  }
  scheduleAnchoring() {
    const cronExpr = this.cronForFrequency(this.frequency);
    cron.schedule(cronExpr, () => {
      this.anchorBatch().catch(console.error);
    });
  }
  cronForFrequency(f) {
    switch (f) {
      case "hourly": return "0 * * * *";
      case "daily": return "0 0 * * *";
      case "weekly": return "0 0 * * 0";
      case "monthly": return "0 0 1 * *";
      default: return "0 * * * *";
    }
  }
  async anchorBatch() {
    const rows = await this.getAllTelemetry();
    if (!rows.length) {
      console.log("[GatewayAggregator] No telemetry to anchor.");
      return;
    }
    const leaves = rows.map(r => Buffer.from(r.hash, "hex"));
    const tree = new MerkleTree(
      leaves,
      data => crypto.createHash("sha256").update(data).digest(),
      { sortPairs: true }
    );
    const merkleRoot = tree.getRoot().toString("hex");
    const parsed = rows.map(r => JSON.parse(r.payload));
    const totalKwh = parsed.reduce((s, t) => s + (t.generatedKwh || 0), 0);
    const anomalyCount = parsed.filter(t => t.anomalyFlag === true).length;
    const batchInfo = {
      merkleRoot,
      count: rows.length,
      totalKwh,
      anomalies: anomalyCount,
      from: rows[0].period_start || rows[0].periodStart,
      to: rows[rows.length - 1].period_end || rows[rows.length - 1].periodEnd
    };
    const anchorPayload = {
      mode: "merkle_aggregated",
      frequency: this.frequency,
      merkleRoot,
      totalKwh,
      anomalies: anomalyCount,
      ipfsCid: null,
      from: batchInfo.from,
      to: batchInfo.to
    };
    const tx = new TopicMessageSubmitTransaction()
      .setTopicId(this.topicId)
      .setMessage(JSON.stringify(anchorPayload))
      .setMaxTransactionFee(new Hbar(2));
    const res = await tx.execute(this.client);
    const receipt = await res.getReceipt(this.client);
    console.log("[GatewayAggregator] Anchored batch to HCS:", receipt.status.toString(), "root:", merkleRoot);
    await this.clearTelemetry(rows.map(r => r.id));
  }
  getAllTelemetry() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM telemetry ORDER BY period_start ASC", (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  clearTelemetry(ids) {
    return new Promise((resolve, reject) => {
      const placeholders = ids.map(() => "?").join(",");
      const stmt = this.db.prepare(`DELETE FROM telemetry WHERE id IN (${placeholders})`);
      stmt.run(ids, err => {
        if (err) return reject(err);
        stmt.finalize();
        resolve(true);
      });
    });
  }
}
module.exports = GatewayAggregator;
