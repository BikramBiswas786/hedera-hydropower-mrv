#!/bin/bash
# One-liner edge agent installation script for Raspberry Pi / Linux gateways

set -e

echo "[Hedera MRV] Installing edge agent..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root: sudo bash install.sh"
  exit 1
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
  echo "[Hedera MRV] Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi

# Create installation directory
MRV_HOME="/opt/hedera-mrv"
mkdir -p $MRV_HOME
cd $MRV_HOME

# Download edge agent
echo "[Hedera MRV] Downloading edge agent..."
curl -o edge-agent.js https://raw.githubusercontent.com/BikramBiswas786/hedera-hydropower-mrv/main/edge/edge-agent.js
chmod +x edge-agent.js

# Install dependencies
echo '{"dependencies": {"axios": "^1.6.0"}}' > package.json
npm install --production

# Create config directory
mkdir -p /etc/hedera-mrv

# Copy example config if doesn't exist
if [ ! -f /etc/hedera-mrv/config.json ]; then
  curl -o /etc/hedera-mrv/config.json https://raw.githubusercontent.com/BikramBiswas786/hedera-hydropower-mrv/main/edge/config.example.json
  echo "[Hedera MRV] Created example config at /etc/hedera-mrv/config.json"
  echo "[Hedera MRV] Please edit this file with your API credentials"
fi

# Create systemd service
cat > /etc/systemd/system/hedera-mrv.service <<EOF
[Unit]
Description=Hedera Hydropower MRV Edge Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$MRV_HOME
ExecStart=/usr/bin/node $MRV_HOME/edge-agent.js
Restart=always
RestartSec=10
Environment=CONFIG_PATH=/etc/hedera-mrv/config.json

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
systemctl daemon-reload

echo ""
echo "[Hedera MRV] Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit config: nano /etc/hedera-mrv/config.json"
echo "2. Enable service: systemctl enable hedera-mrv"
echo "3. Start service: systemctl start hedera-mrv"
echo "4. Check status: systemctl status hedera-mrv"
echo "5. View logs: journalctl -u hedera-mrv -f"
echo ""