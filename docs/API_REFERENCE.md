# API Reference

## Base URL

**Production:** `https://hedera-hydropower-mrv.vercel.app`  
**Local:** `http://localhost:3000`

## Authentication

All API endpoints (except `/health` and `/metrics`) require an API key.

**Header:**
```
x-api-key: your-api-key-here
```

**Get API Key:**
Contact system administrator or generate via provisioning endpoint (coming soon).

---

## Endpoints

### Health & Monitoring

#### `GET /health`
Basic health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-21T00:14:00.000Z",
  "uptime": 3600
}
```

#### `GET /metrics`
Prometheus metrics in text format.

**Response:** (plain text)
```
# HELP mrv_telemetry_submissions_total Total telemetry submissions by status
# TYPE mrv_telemetry_submissions_total counter
mrv_telemetry_submissions_total{plant_id="PLANT-HP-001",device_id="TURBINE-001",status="APPROVED"} 1234
...
```

---

### Telemetry

#### `POST /api/telemetry`
Submit telemetry reading from edge gateway.

**Request:**
```json
{
  "plantId": "PLANT-HP-001",
  "deviceId": "TURBINE-001",
  "reading": {
    "flowRate": 12.5,
    "head": 45.0,
    "generatedKwh": 520.3,
    "timestamp": "2026-02-21T00:10:00.000Z",
    "pH": 7.2,
    "turbidity": 5.0,
    "temperature": 15.5
  }
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "telemetry_id": "TEL-1708473000-abc123",
  "transaction_id": "0.0.6255927@1708473000.123456789",
  "verdict": "APPROVED",
  "trust_score": 0.9234,
  "warnings": [],
  "submission_time": "2026-02-21T00:14:00.000Z"
}
```

**Error:** (400 Bad Request)
```json
{
  "error": "Invalid telemetry data",
  "validation_errors": [
    "flowRate out of range: 150 m³/s (expected 0-100)"
  ],
  "warnings": []
}
```

---

### Plants

#### `POST /api/plants`
Register new hydropower plant.

**Request:**
```json
{
  "name": "Bhakra Dam Plant",
  "location": "Himachal Pradesh, India",
  "capacity_mw": 6.5,
  "plant_type": "run-of-river",
  "operator": "Himachal Pradesh Power Corp"
}
```

**Response:** (201 Created)
```json
{
  "plant_id": "PLANT-1708473000",
  "name": "Bhakra Dam Plant",
  "location": "Himachal Pradesh, India",
  "capacity_mw": 6.5,
  "plant_type": "run-of-river",
  "operator": "Himachal Pradesh Power Corp",
  "created_at": "2026-02-21T00:14:00.000Z"
}
```

#### `GET /api/plants`
List all plants for authenticated organization.

**Response:**
```json
{
  "org_id": "ORG-DEFAULT",
  "plants": [
    {
      "plant_id": "PLANT-HP-001",
      "name": "Bhakra Dam Plant",
      "capacity_mw": 6.5,
      "location": "Himachal Pradesh, India"
    }
  ]
}
```

#### `POST /api/plants/:id/devices`
Add telemetry device to plant.

**Request:**
```json
{
  "device_id": "TURBINE-002",
  "device_type": "gateway",
  "sensor_config": {
    "sensors": ["flow", "head", "power"],
    "polling_interval": 300
  }
}
```

**Response:** (201 Created)
```json
{
  "plant_id": "PLANT-HP-001",
  "device_id": "TURBINE-002",
  "device_type": "gateway",
  "sensor_config": {...},
  "registered_at": "2026-02-21T00:14:00.000Z"
}
```

---

### Verification

#### `GET /api/verification/:transactionId`
Get verification status from Hedera.

**Response:**
```json
{
  "transaction_id": "0.0.6255927@1708473000.123456789",
  "status": "VERIFIED",
  "topic_id": "0.0.7462776",
  "explorer_url": "https://hashscan.io/testnet/transaction/0.0.6255927@1708473000.123456789"
}
```

---

## Rate Limits

- **Default:** 100 requests per 15 minutes per IP
- **Telemetry submissions:** Additional limit of 1 request per 5 minutes per device (recommended)

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing API key)
- `403` - Forbidden (invalid API key)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (dependency failure)

## OpenAPI Spec

Full OpenAPI 3.0 specification available at `/api/docs`.