import express from "express";
import { z } from "zod";
import { CONFIG } from "./config";
import { computeAcm0002 } from "./acm0002";
import { anchorTelemetry } from "./hederaClient";

interface DeviceState {
  totalMWh: number;
}

const devices = new Map<string, DeviceState>();
const lastNonce = new Map<string, number>();

const TelemetrySchema = z.object({
  deviceId: z.string(),
  mwh: z.number().nonnegative(),
  timestamp: z.string(),
  nonce: z.number().int().nonnegative()
});

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, network: CONFIG.network });
});

app.post("/telemetry", async (req, res) => {
  try {
    const data = TelemetrySchema.parse(req.body);

    const prev = lastNonce.get(data.deviceId) ?? -1;
    if (data.nonce <= prev) {
      return res.status(400).json({ error: "nonce_replay_or_stale" });
    }
    lastNonce.set(data.deviceId, data.nonce);

    const state = devices.get(data.deviceId) ?? { totalMWh: 0 };
    state.totalMWh += data.mwh;
    devices.set(data.deviceId, state);

    const anchor = await anchorTelemetry({
      deviceId: data.deviceId,
      mwh: data.mwh,
      timestamp: data.timestamp,
      nonce: data.nonce
    });

    res.json({
      status: "ok",
      deviceId: data.deviceId,
      totalMWh: state.totalMWh,
      anchor
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.message || "bad_request" });
  }
});

app.get("/mrv-snapshot/:deviceId", (req, res) => {
  const deviceId = req.params.deviceId;
  const state = devices.get(deviceId);
  if (!state) {
    return res.status(404).json({ error: "device_not_found" });
  }

  const result = computeAcm0002({
    electricityMWh: state.totalMWh,
    gridEmissionFactor: CONFIG.gridEmissionFactor,
    projectEmissions: 0,
    leakageEmissions: 0
  });

  res.json({
    deviceId,
    electricityMWh: state.totalMWh,
    gridEmissionFactor: CONFIG.gridEmissionFactor,
    baselineEmissions_tCO2: result.baselineEmissions,
    emissionReductions_tCO2: result.emissionReductions
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MRV service listening on ${PORT}`);
});
