# Hedera Hydropower MRV

**Automated Monitoring, Reporting, and Verification (MRV) for hydropower plants using Hedera Hashgraph blockchain.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-blue.svg)](https://hedera.com)
[![Tests](https://img.shields.io/badge/tests-224%20passing-brightgreen.svg)](#)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green.svg)](#)

---

## 🎯 Overview

This system automates carbon credit generation for hydropower plants by:

1. **Collecting** real-time telemetry from edge gateways (flow, head, power)
2. **Verifying** data using AI Guardian with 5-layer trust scoring
3. **Recording** immutable audit trails on Hedera HCS (testnet topic [0.0.7462776](https://hashscan.io/testnet/topic/0.0.7462776))
4. **Calculating** ACM0002-compliant carbon credits
5. **Minting** REC tokens on Hedera HTS (testnet token [0.0.7964264](https://hashscan.io/testnet/token/0.0.7964264))

**Result:** 60–70% cost reduction vs manual MRV consultants (₹5–8 lakh/year → ₹1–2 lakh/year).

---

## ✨ Features

### Production-Ready

✅ **REST API** with Express.js (authentication, rate limiting, CORS)  
✅ **PostgreSQL schema** for multi-tenancy and time-series data  
✅ **Docker Compose** for one-command deployment  
✅ **Edge gateway agent** with Modbus/SNMP/analog sensor support  
✅ **Prometheus metrics** + Grafana dashboards  
✅ **OpenAPI 3.0 docs** at `/api/docs`  
✅ **Systemd service** for Raspberry Pi/Linux gateways  
✅ **224 automated tests** (85% coverage)  

### Blockchain & Verification

✅ **AI Guardian** with 5-layer trust scoring (physics, anomaly, consistency, history, calibration)  
✅ **ML fraud detection** (Isolation Forest, 79.5% accuracy)  
✅ **Hedera HCS** immutable audit trail  
✅ **Hedera HTS** fungible REC tokens  
✅ **ACM0002 methodology** compliance  
✅ **Transaction retry logic** (fixes TRANSACTION_EXPIRED errors)  

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/BikramBiswas786/hedera-hydropower-mrv.git
cd hedera-hydropower-mrv

# Configure environment
cp .env.example .env
nano .env  # Add Hedera credentials, API keys

# Start all services (API, PostgreSQL, Prometheus, Grafana)
docker-compose up -d

# Check health
curl http://localhost:3000/health
```

**Services:**
- API: http://localhost:3000
- Grafana: http://localhost:3001 (admin / your-password)
- Prometheus: http://localhost:9090

### Option 2: Manual Installation

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs postgresql-14

# Clone and install
git clone https://github.com/BikramBiswas786/hedera-hydropower-mrv.git
cd hedera-hydropower-mrv
npm install

# Setup database
npm run db:migrate
npm run db:seed

# Start API
npm start
```

---

## 📊 API Usage

### Submit Telemetry

```bash
curl -X POST https://yourdomain.com/api/telemetry \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "plantId": "PLANT-HP-001",
    "deviceId": "TURBINE-001",
    "reading": {
      "flowRate": 12.5,
      "head": 45.0,
      "generatedKwh": 520.3,
      "timestamp": "2026-02-21T00:00:00Z"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "telemetry_id": "TEL-1708473000-abc123",
  "transaction_id": "0.0.6255927@1708473000.123456789",
  "verdict": "APPROVED",
  "trust_score": 0.9234
}
```

### Verify on Hedera

View transaction on [HashScan](https://hashscan.io/testnet/transaction/0.0.6255927@1708473000.123456789).

---

## 🏗️ Edge Gateway Deployment

### Automated (Raspberry Pi / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/BikramBiswas786/hedera-hydropower-mrv/main/edge/install.sh | sudo bash

# Edit config
sudo nano /etc/hedera-mrv/config.json

# Start service
sudo systemctl enable hedera-mrv
sudo systemctl start hedera-mrv

# Check logs
journalctl -u hedera-mrv -f
```

**Hardware:** Raspberry Pi 4 + RS485 HAT + ADC converter (₹14,500)  
**Sensors:** Modbus flowmeter, 4–20mA pressure, SNMP power meter

---

## 📚 Documentation

- **[API Reference](docs/API_REFERENCE.md)** - REST endpoints, authentication, error codes
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Docker, Vercel, manual setup
- **[Edge Gateway Setup](docs/EDGE_GATEWAY_SETUP.md)** - Hardware, sensors, Modbus integration
- **[Pilot Plan](docs/PILOT_PLAN_6MW_PLANT.md)** - 6 MW plant, 90-day shadow mode, ₹50K budget
- **[Production Roadmap](PRODUCTION_READINESS_ROADMAP.md)** - 8-week timeline to enterprise SLA

---

## 🧪 Architecture

```
┌─────────────────────┐
│ Edge Gateway (Pi)   │
│ Modbus/Analog       │
│ Sensors → Agent    │
└────────┬────────────┘
         │ HTTPS
         ↓
┌────────┴────────────┐
│ REST API (Express)  │
│ Auth + Validation   │
└─────┬──────┬──────┬──┘
      │      │      │
      ↓      ↓      ↓
  ┌─────┴──┐ ┌─┴──┐ ┌─┴──┐
  │ AI Guard │ │ DB │ │ HCS │
  │ Verifier│ │ PG │ │ HTS │
  └─────────┘ └────┘ └─────┘
       │
       ↓
  ┌─────┴───────┐
  │ Prometheus  │
  │ + Grafana   │
  └─────────────┘
```

---

## 💰 Cost Comparison

| Item | Manual MRV | Automated MRV |
|------|------------|---------------|
| **Quarterly audit** | ₹1.25–2 lakh | ₹0 |
| **Annual cost** | ₹5–8 lakh | ₹1–2 lakh |
| **Hardware (one-time)** | N/A | ₹50–75K |
| **Edge gateway** | N/A | ₹15–50K |
| **Hedera fees** | N/A | ₹1,000/month |
| **Net savings** | - | **60–70%** |

---

## 🧰 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

**Test Results:**
- 224 tests passing
- 85% code coverage
- Unit, integration, and E2E tests

---

## 🛠️ Tech Stack

- **Backend:** Node.js 18, Express.js
- **Database:** PostgreSQL 14
- **Blockchain:** Hedera Hashgraph (HCS, HTS)
- **Monitoring:** Prometheus, Grafana
- **Edge:** Raspberry Pi, Modbus, SNMP
- **Testing:** Jest, Supertest
- **Deployment:** Docker, Docker Compose

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

---

## 📧 Contact

- **GitHub:** [@BikramBiswas786](https://github.com/BikramBiswas786)
- **Repository:** [hedera-hydropower-mrv](https://github.com/BikramBiswas786/hedera-hydropower-mrv)
- **Issues:** [GitHub Issues](https://github.com/BikramBiswas786/hedera-hydropower-mrv/issues)

---

**Built with ❤️ for renewable energy and blockchain transparency.**