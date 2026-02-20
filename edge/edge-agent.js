#!/usr/bin/env node
/**
 * Edge Gateway Agent for Hedera Hydropower MRV
 * Runs on Raspberry Pi or industrial edge gateway
 * Polls sensors and submits telemetry to MRV API
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = process.env.CONFIG_PATH || '/etc/hedera-mrv/config.json';
let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error(`[Edge Agent] Failed to load config from ${configPath}:`, error.message);
  process.exit(1);
}

const {
  api_url,
  api_key,
  plant_id,
  device_id,
  polling_interval = 300000, // 5 minutes default
  sensor_adapters
} = config;

if (!api_url || !api_key || !plant_id || !device_id) {
  console.error('[Edge Agent] Missing required config: api_url, api_key, plant_id, device_id');
  process.exit(1);
}

/**
 * Read sensors using configured adapters
 * Adapters are plugins that interface with specific hardware
 */
async function readSensors() {
  const reading = {
    timestamp: new Date().toISOString()
  };

  // TODO: Load sensor adapter modules dynamically
  // For now, simulate sensor readings
  reading.flowRate = 12.5 + Math.random() * 2; // 12.5-14.5 m³/s
  reading.head = 45.0 + Math.random(); // 45-46 m
  reading.generatedKwh = reading.flowRate * reading.head * 9.81 * 0.85 * (polling_interval / 3600000);
  reading.pH = 7.2 + Math.random() * 0.4; // 7.2-7.6
  reading.turbidity = 5 + Math.random() * 2; // 5-7 NTU
  reading.temperature = 15 + Math.random() * 3; // 15-18°C

  return reading;
}

/**
 * Submit telemetry to MRV API
 */
async function submitTelemetry(reading) {
  try {
    const response = await axios.post(
      `${api_url}/api/telemetry`,
      {
        plantId: plant_id,
        deviceId: device_id,
        reading
      },
      {
        headers: {
          'x-api-key': api_key,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30s timeout
      }
    );

    console.log('[Edge Agent] Telemetry submitted:', {
      telemetry_id: response.data.telemetry_id,
      verdict: response.data.verdict,
      trust_score: response.data.trust_score,
      transaction_id: response.data.transaction_id
    });

    return response.data;
  } catch (error) {
    console.error('[Edge Agent] Submission failed:', error.message);
    if (error.response) {
      console.error('[Edge Agent] API error:', error.response.data);
    }
    throw error;
  }
}

/**
 * Main polling loop
 */
async function pollAndSubmit() {
  console.log('[Edge Agent] Reading sensors...');
  
  try {
    const reading = await readSensors();
    console.log('[Edge Agent] Sensor readings:', reading);
    
    await submitTelemetry(reading);
  } catch (error) {
    console.error('[Edge Agent] Poll cycle failed:', error.message);
  }
}

// Initial submission
pollAndSubmit();

// Schedule periodic submissions
setInterval(pollAndSubmit, polling_interval);

console.log(`[Edge Agent] Started for plant ${plant_id}, device ${device_id}`);
console.log(`[Edge Agent] Polling interval: ${polling_interval / 1000}s`);
console.log(`[Edge Agent] API endpoint: ${api_url}`);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Edge Agent] SIGTERM received, shutting down...');
  process.exit(0);
});