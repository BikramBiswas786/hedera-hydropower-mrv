const express = require("express");
const app = express();
app.use(express.json());
// In-memory store: { deviceId: [ { mwh, timestamp } ] }
const readings = {};
app.post("/telemetry", (req, res) => {
  const { deviceId, mwh, timestamp, nonce } = req.body || {};
  if (!deviceId || typeof mwh !== "number" || !timestamp || typeof nonce !== "number") {
    return res.status(400).json({ error: "deviceId, mwh (number), timestamp, nonce are required" });
  }
  if (!readings[deviceId]) {
    readings[deviceId] = [];
  }
  readings[deviceId].push({ mwh, timestamp, nonce });
  return res.status(200).json({
    ok: true,
    deviceId,
    storedCount: readings[deviceId].length
  });
});
// GET /mrv-snapshot/:deviceId?period=2026-01
app.get("/mrv-snapshot/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const { period } = req.query; // e.g. "2026-01"
  const deviceReadings = readings[deviceId] || [];
  if (deviceReadings.length === 0) {
    return res.status(404).json({ error: "No readings for this device" });
  }
  // Filter by period prefix if provided
  const filtered = period
    ? deviceReadings.filter(r => String(r.timestamp).startsWith(period))
    : deviceReadings;
  if (filtered.length === 0) {
    return res.status(404).json({ error: "No readings for this device and period" });
  }
  const EG_month = filtered.reduce((sum, r) => sum + r.mwh, 0); // MWh
  const EF_grid = 0.8; // tCO2/MWh, illustrative
  const BE_month = EG_month * EF_grid;
  const PE_month = 0;
  const LE_month = 0;
  const ER_month = BE_month - PE_month - LE_month;
  return res.status(200).json({
    deviceId,
    period: period || "ALL",
    EG_MWh: EG_month,
    EF_grid_tCO2_per_MWh: EF_grid,
    BE_tCO2: BE_month,
    PE_tCO2: PE_month,
    LE_tCO2: LE_month,
    ER_tCO2: ER_month,
    count: filtered.length
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Testnet mini-tool listening on http://localhost:${PORT}`);
});
