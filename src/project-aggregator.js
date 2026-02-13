const crypto = require("crypto");
function buildProjectPeriodRecord(devicePeriodRecords, projectInfo) {
  if (!devicePeriodRecords.length) {
    throw new Error("No device records provided");
  }
  const periodStart = devicePeriodRecords[0].periodStart;
  const periodEnd = devicePeriodRecords[0].periodEnd;
  let totalKwh = 0;
  let anomalyCount = 0;
  const anomalousTurbines = [];
  let flowMin = Infinity;
  let flowMax = -Infinity;
  let headMin = Infinity;
  let headMax = -Infinity;
  for (const r of devicePeriodRecords) {
    const kwh = r.generatedKwh || 0;
    totalKwh += kwh;
    if (r.anomalyFlag) {
      anomalyCount++;
      if (r.turbineId) anomalousTurbines.push(r.turbineId);
    }
    if (typeof r.flowRate === "number") {
      flowMin = Math.min(flowMin, r.flowRate);
      flowMax = Math.max(flowMax, r.flowRate);
    }
    if (typeof r.headHeight === "number") {
      headMin = Math.min(headMin, r.headHeight);
      headMax = Math.max(headMax, r.headHeight);
    }
  }
  const projectPeriodRecord = {
    projectId: projectInfo.name,
    periodStart,
    periodEnd,
    totalKwh,
    turbineCount: devicePeriodRecords.length,
    anomalyCount,
    anomalousTurbines,
    aggregateFlowMin: isFinite(flowMin) ? flowMin : null,
    aggregateFlowMax: isFinite(flowMax) ? flowMax : null,
    aggregateHeadMin: isFinite(headMin) ? headMin : null,
    aggregateHeadMax: isFinite(headMax) ? headMax : null
  };
  const payload = JSON.stringify(projectPeriodRecord);
  projectPeriodRecord.signature = crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex");
  return projectPeriodRecord;
}
module.exports = { buildProjectPeriodRecord };
