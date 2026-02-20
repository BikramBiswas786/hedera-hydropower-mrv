-- Hedera Hydropower MRV Database Schema
-- PostgreSQL 14+

-- Organizations (multi-tenancy)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  api_key_hash VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_orgs_api_key ON organizations(api_key_hash);

-- Plants
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plant_id VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity_mw DECIMAL(10, 2) NOT NULL,
  plant_type VARCHAR(32) NOT NULL DEFAULT 'run-of-river',
  operator VARCHAR(255),
  grid_emission_factor DECIMAL(5, 4) DEFAULT 0.82, -- tCO2/MWh
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plants_org ON plants(org_id);
CREATE INDEX idx_plants_plant_id ON plants(plant_id);

-- Devices (sensors/edge gateways)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  device_id VARCHAR(64) NOT NULL UNIQUE,
  device_type VARCHAR(32) NOT NULL, -- flowmeter, turbine, gateway
  sensor_config JSONB,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_plant ON devices(plant_id);
CREATE INDEX idx_devices_device_id ON devices(device_id);

-- Telemetry readings
CREATE TABLE telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  telemetry_id VARCHAR(64) NOT NULL UNIQUE,
  flow_rate DECIMAL(10, 4) NOT NULL, -- m³/s
  head DECIMAL(10, 4) NOT NULL, -- meters
  generated_kwh DECIMAL(12, 4) NOT NULL,
  ph DECIMAL(4, 2),
  turbidity DECIMAL(10, 2),
  temperature DECIMAL(5, 2),
  reading_timestamp TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hedera_tx_id VARCHAR(128),
  hedera_topic_id VARCHAR(32),
  verdict VARCHAR(16) NOT NULL, -- APPROVED, FLAGGED, REJECTED
  trust_score DECIMAL(5, 4),
  ai_analysis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_telemetry_device ON telemetry(device_id);
CREATE INDEX idx_telemetry_timestamp ON telemetry(reading_timestamp DESC);
CREATE INDEX idx_telemetry_verdict ON telemetry(verdict);
CREATE INDEX idx_telemetry_hedera_tx ON telemetry(hedera_tx_id);

-- Carbon credits
CREATE TABLE carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  total_generation_mwh DECIMAL(12, 4) NOT NULL,
  carbon_credits_tco2e DECIMAL(12, 4) NOT NULL,
  hedera_token_id VARCHAR(32),
  hedera_mint_tx VARCHAR(128),
  minted_at TIMESTAMPTZ,
  status VARCHAR(16) NOT NULL DEFAULT 'pending', -- pending, minted, retired
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credits_plant ON carbon_credits(plant_id);
CREATE INDEX idx_credits_period ON carbon_credits(period_start, period_end);

-- Device trust history
CREATE TABLE trust_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  trust_score DECIMAL(5, 4) NOT NULL,
  factors JSONB NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trust_device ON trust_history(device_id);
CREATE INDEX idx_trust_recorded ON trust_history(recorded_at DESC);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();