# Edge Gateway Setup Guide

## Hardware Requirements

### Option 1: Industrial Gateway (Recommended for Production)

- **Maple Edge-II/III** or **Advantech UNO-2272G**
- **Specs:**
  - ARM Cortex-A9 or Intel Atom CPU
  - 2GB+ RAM
  - 8GB+ storage
  - Industrial temp range (-40°C to +75°C)
  - Modbus RTU/TCP, 4–20mA analog inputs
  - Ethernet, Wi-Fi, 4G LTE
- **Cost:** ₹30,000–50,000

### Option 2: Raspberry Pi (Budget/Pilot)

- **Raspberry Pi 4 Model B (4GB)**
- **Accessories:**
  - Waveshare RS485/CAN HAT (₹2,000)
  - 4–20mA to 0–3.3V converters (₹2,000)
  - Industrial 24V→5V power supply (₹1,500)
  - Weatherproof IP65 enclosure (₹2,000)
- **Cost:** ₹14,500 total

---

## Software Installation

### Automated (One-Liner)

```bash
curl -fsSL https://raw.githubusercontent.com/BikramBiswas786/hedera-hydropower-mrv/main/edge/install.sh | sudo bash
```

### Manual Installation

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs

# Create directory
sudo mkdir -p /opt/hedera-mrv
cd /opt/hedera-mrv

# Download agent
sudo curl -o edge-agent.js https://raw.githubusercontent.com/BikramBiswas786/hedera-hydropower-mrv/main/edge/edge-agent.js
sudo chmod +x edge-agent.js

# Install dependencies
echo '{"dependencies": {"axios": "^1.6.0"}}' | sudo tee package.json
sudo npm install --production
```

---

## Configuration

### 1. Create Config File

```bash
sudo mkdir -p /etc/hedera-mrv
sudo nano /etc/hedera-mrv/config.json
```

### 2. Edit Configuration

```json
{
  "api_url": "https://yourdomain.com",
  "api_key": "your-api-key-from-admin",
  "plant_id": "PLANT-HP-001",
  "device_id": "TURBINE-001",
  "polling_interval": 300000,
  "sensor_adapters": {
    "flow_meter": {
      "type": "modbus-tcp",
      "host": "192.168.1.100",
      "port": 502,
      "register": 40001
    },
    "head_sensor": {
      "type": "analog-4-20ma",
      "gpio_pin": 17,
      "scale": { "min": 0, "max": 100 }
    },
    "power_meter": {
      "type": "snmp",
      "host": "192.168.1.101",
      "oid": "1.3.6.1.4.1.2021.10.1.3.1"
    }
  }
}
```

---

## Systemd Service Setup

### 1. Create Service File

```bash
sudo nano /etc/systemd/system/hedera-mrv.service
```

### 2. Service Configuration

```ini
[Unit]
Description=Hedera Hydropower MRV Edge Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/hedera-mrv
ExecStart=/usr/bin/node /opt/hedera-mrv/edge-agent.js
Restart=always
RestartSec=10
Environment=CONFIG_PATH=/etc/hedera-mrv/config.json

[Install]
WantedBy=multi-user.target
```

### 3. Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable hedera-mrv
sudo systemctl start hedera-mrv
sudo systemctl status hedera-mrv
```

### 4. View Logs

```bash
journalctl -u hedera-mrv -f
```

---

## Sensor Integration

### Modbus TCP/RTU

**Waveshare RS485 HAT wiring:**
- Connect RS485-A to sensor A
- Connect RS485-B to sensor B
- Connect GND to sensor GND

**Code example:** (requires `modbus-serial` npm package)

```javascript
const ModbusRTU = require('modbus-serial');
const client = new ModbusRTU();

await client.connectRTU('/dev/ttyUSB0', { baudRate: 9600 });
client.setID(1); // Modbus slave ID

const registers = await client.readHoldingRegisters(40001, 1);
const flowRate = registers.data[0] / 100; // scale factor
```

### 4–20mA Analog

**Wiring:**
- Sensor 4–20mA output → ADC converter → GPIO 17
- Use ADS1115 or similar ADC module

**Code example:** (requires `ads1x15` npm package)

```javascript
const { Ads1x15 } = require('ads1x15');
const adc = new Ads1x15(1); // I2C bus 1

const value = adc.readADC(0); // channel 0
const voltage = (value / 32767) * 3.3; // 16-bit ADC
const current_mA = (voltage / 150) * 1000; // 150Ω shunt resistor
const head = ((current_mA - 4) / 16) * 100; // 4-20mA scaled to 0-100m
```

### SNMP (Power Meters)

**Code example:** (requires `snmp-native` npm package)

```javascript
const snmp = require('snmp-native');
const session = new snmp.Session({ host: '192.168.1.101' });

session.get({ oid: '1.3.6.1.4.1.2021.10.1.3.1' }, (err, varbinds) => {
  const power_kw = varbinds[0].value / 1000;
});
```

---

## Troubleshooting

### Agent Not Starting

```bash
# Check logs
journalctl -u hedera-mrv -n 50

# Test manually
node /opt/hedera-mrv/edge-agent.js
```

### API Connection Failed

```bash
# Test network
ping yourdomain.com

# Test API
curl -H "x-api-key: your-key" https://yourdomain.com/health
```

### Sensor Read Errors

```bash
# Check I2C devices
i2cdetect -y 1

# Check serial ports
ls -l /dev/ttyUSB*

# Test Modbus connection
mbpoll -a 1 -r 40001 -c 1 -t 3 /dev/ttyUSB0
```

---

## Production Checklist

- [ ] Gateway has static IP or reserved DHCP
- [ ] Firewall allows outbound HTTPS (443)
- [ ] Config file has correct API credentials
- [ ] Sensors calibrated and tested
- [ ] Backup gateway available (hot standby)
- [ ] UPS or battery backup installed
- [ ] Remote access configured (SSH, VPN)
- [ ] Monitoring alerts set up
- [ ] Log rotation configured
- [ ] Auto-update mechanism (optional)