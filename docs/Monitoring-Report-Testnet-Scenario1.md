# Hydropower dMRV – Testnet Monitoring Report (Scenario 1 – January 2026)

This report summarizes a synthetic, ACM0002-style monitoring scenario for a single hydropower unit on Hedera Testnet using the hydropower dMRV mini-tool (Testnet only, PoC).

---

## 1. Scenario overview

- Device: TURBINE-1
- Period: 2026-01 (synthetic month on Testnet)
- Number of telemetry readings ingested: 91
- Network: Hedera Testnet
- Tool: Hydropower dMRV mini-tool (`POST /telemetry`, `GET /mrv-snapshot`)  

Telemetry is synthetic but follows a realistic daily net export pattern. Each reading is signed by a gateway key, verified against a DID on an HCS topic, and wrapped into an `AUDITv1` envelope anchored on-chain.

---

## 2. MRV snapshot (from mini-tool)

The canonical MRV snapshot for Scenario 1 is obtained from the live Testnet mini-tool:

```text
GET /mrv-snapshot/TURBINE-1?period=2026-01
