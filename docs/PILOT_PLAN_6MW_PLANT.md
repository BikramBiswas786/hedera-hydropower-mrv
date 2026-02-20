# Pilot Deployment Plan: 6 MW Run-of-River Hydropower Plant

## Context

**Target:** Small hydropower operator in Himachal Pradesh or Uttarakhand  
**Plant Capacity:** 5–8 MW run-of-river  
**Current MRV Cost:** ₹5–8 lakh/year (₹1.25–2 lakh per quarter) paid to consultants  
**Goal:** Test automated Hedera MRV system in shadow mode for 90 days before full commitment

---

## Phase 1: Baseline Assessment & Minimal Hardware (Week 1)

**Goal:** Understand existing instrumentation and connectivity.

### Step 1.1: Inventory Existing Sensors

Most small hydro plants already have basic SCADA/PLC systems monitoring:

- **Flow rate:** Ultrasonic or electromagnetic flowmeter on penstock
- **Head pressure:** Differential pressure transmitter
- **Active power:** CT/PT meters on generator output
- **Water quality:** pH/turbidity sensors (less common, may need to add)

**Action:**
- Walk plant with electrician
- Document each sensor:
  - Make/model
  - Output type (4–20mA analog, Modbus RTU/TCP, Profibus, etc.)
  - Current wiring/connectivity (local PLC, HMI, or isolated)

**Cost:** ₹0 (use own staff)

### Step 1.2: Assess Connectivity

Check if plant has:
- Internet connection (fiber/4G/VSAT)
- Local Ethernet LAN
- Wi-Fi coverage near control room

**If no internet:**  
Budget for 4G industrial router (₹8,000–15,000) + data plan (₹500–1,000/month)

**Cost:** ₹10,000 one-time + ₹1,000/month (if upgrade needed)

---

## Phase 2: Edge Gateway Deployment (Week 2)

**Goal:** Aggregate sensor data into one system that can submit to Hedera MRV API.

### Option A: Industrial Edge Gateway (Recommended)

**Hardware:**
- Maple Edge-II/III (₹25,000–40,000) or Advantech UNO-2272G (₹30,000–50,000)
- Supports Modbus RTU/TCP, 4–20mA analog inputs, digital I/O
- Linux-based, runs Node.js or Docker
- Industrial temp range (‑40°C to +75°C), DIN rail mount

**Installation:**
1. Mount gateway in control cabinet
2. Wire sensor outputs to gateway inputs
3. Connect to plant LAN via Ethernet
4. Configure to poll sensors every 5 minutes

**Cost:** ₹30,000–50,000 one-time

### Option B: Raspberry Pi 4 (Budget Option)

**Hardware:**
- Raspberry Pi 4 Model B (4GB): ₹6,500
- Waveshare RS485/CAN HAT: ₹2,000
- 4–20mA to 0–3.3V converters (4 channels): ₹2,000
- Industrial 24V→5V power supply: ₹1,500
- Weatherproof IP65 enclosure: ₹2,000
- **Total:** ₹14,500

**Trade-off:**  
- Not industrial-rated (0–50°C vs ‑40 to +75°C)
- Acceptable for 3-month pilot in temperature-controlled room
- Many small hydro operators already use RPi for data logging

**Installation:**
1. Mount Pi in enclosure near sensors
2. Connect Modbus sensors via RS485 HAT
3. Connect analog sensors via ADC to GPIO
4. Connect to LAN via Ethernet (more reliable than Wi-Fi)
5. Install Raspberry Pi OS Lite (headless)

**Cost:** ₹15,000 one-time

---

## Phase 3: Software Integration (Weeks 2–3)

**Goal:** Run Hedera MRV code on gateway and connect to sensors.

### Step 3.1: Install MRV System

SSH into gateway:

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Clone MRV repo
cd /opt
sudo git clone https://github.com/BikramBiswas786/hedera-hydropower-mrv.git
cd hedera-hydropower-mrv

# Install dependencies
sudo npm install

# Run tests (optional)
npm test
```

**Cost:** ₹0 (open source, MIT license)

### Step 3.2: Configure Environment

Create `/opt/hedera-hydropower-mrv/.env`:

```bash
# Hedera testnet credentials (free)
HEDERA_OPERATOR_ID=0.0.6255927
HEDERA_OPERATOR_KEY=<get from repo maintainer or create own at portal.hedera.com>
AUDIT_TOPIC_ID=0.0.7462776
REC_TOKEN_ID=0.0.7964264

# Plant configuration
EF_GRID=0.82  # India grid emission factor (tCO2/MWh)
PLANT_ID=PLANT-HP-001
DEVICE_ID=TURBINE-001

# API authentication (for production)
VALID_API_KEYS=<your-api-key>
```

**Cost:** ₹0 (testnet ℏ free from faucet)

---

## Phase 4: Shadow-Mode Validation (Months 1–3)

**Goal:** Run automated MRV parallel to manual MRV, compare results.

### Step 4.1: Run for 90 Days (Testnet Only)

- System writes to Hedera testnet HCS topic 0.0.7462776
- Does NOT mint real carbon credits (testnet tokens = no value)
- Telemetry verified and logged on-chain every 5 minutes

### Step 4.2: Collect Comparison Data

Every month (or quarterly):

| Metric | Manual MRV | Automated MRV | Delta |
|--------|------------|---------------|-------|
| Total generation (MWh) | 4,250 | 4,180 | ‑1.6% |
| Rejected readings | N/A | 12 of 8,640 | 0.14% |
| Carbon credits (tCO₂e) | 3,400 | 3,344 | ‑1.6% |

**Success criteria:**
- Delta < 5% → System working well
- Delta > 10% → Investigate sensor calibration, AI weights, or temporal anomalies

---

## Phase 5: Cost Summary (3-Month Pilot)

| Item | One-Time | Recurring/Month |
|------|----------|-----------------|
| Hardware (Option A: Industrial) | ₹40,000 | ₹0 |
| Hardware (Option B: Raspberry Pi) | ₹15,000 | ₹0 |
| Connectivity (4G router + data) | ₹10,000 | ₹1,000 |
| MRV software | ₹0 (open source) | ₹0 |
| Hedera testnet fees | ₹0 (free ℏ) | ₹0 |
| Developer integration | ₹10,000 | ₹0 |
| Tuning & consultation (optional) | ₹15,000 | ₹0 |
| **Total (Option A)** | **₹75,000** | **₹1,000** |
| **Total (Option B)** | **₹50,000** | **₹1,000** |

**3-Month Pilot Total:**
- **Option A (quality-first):** ₹75,000 + (₹1,000 × 3) = **₹78,000**
- **Option B (budget):** ₹50,000 + (₹1,000 × 3) = **₹53,000**

**vs Manual MRV:**
- Current quarterly cost: ₹1.25–2 lakh
- **Savings if successful:** 60–70% reduction

---

**This plan gets you from "interesting GitHub repo" to "live MRV running on my plant" in under a month, for ₹50,000–80,000, with high confidence in quality and regulatory alignment.**