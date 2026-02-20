-- Sample data for testing

-- Insert test organization
INSERT INTO organizations (name, api_key_hash, is_active) VALUES
('Test Hydropower Co', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', TRUE);

-- Insert test plant
INSERT INTO plants (org_id, plant_id, name, location, capacity_mw, plant_type, operator)
SELECT 
  id,
  'PLANT-HP-001',
  'Bhakra Dam Test Plant',
  'Himachal Pradesh, India',
  6.5,
  'run-of-river',
  'Test Operator'
FROM organizations WHERE name = 'Test Hydropower Co';

-- Insert test device
INSERT INTO devices (plant_id, device_id, device_type, sensor_config)
SELECT
  id,
  'TURBINE-001',
  'gateway',
  '{"sensors": ["flow", "head", "power"], "polling_interval": 300}'
FROM plants WHERE plant_id = 'PLANT-HP-001';